import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { storage } from './storage';
import {
  Property,
  Project,
  InvestmentOpportunity,
  CompanyService,
  ShowcaseItem,
  MediaItem,
  SiteSettings,
  Enquiry,
  InspectionRequest
} from '../types';

export interface SupabaseConfig {
  url: string;
  anonKey: string;
  serviceRoleKey?: string;
  autoSync: boolean;
  status: 'unconfigured' | 'connected' | 'error';
  lastTested?: string;
  lastSynced?: string;
  errorMessage?: string;
}

const SUPABASE_CONFIG_KEY = 'ascent_v3_supabase_config';

class SupabaseService {
  private client: SupabaseClient | null = null;
  private config: SupabaseConfig;
  private listeners: Set<() => void> = new Set();

  constructor() {
    this.config = this.loadConfig();
    this.initClient();
  }

  private loadConfig(): SupabaseConfig {
    if (typeof window === 'undefined') {
      return {
        url: '',
        anonKey: '',
        serviceRoleKey: '',
        autoSync: false,
        status: 'unconfigured'
      };
    }
    try {
      const raw = localStorage.getItem(SUPABASE_CONFIG_KEY);
      if (raw) {
        return JSON.parse(raw);
      }
    } catch (e) {
      console.error('Error loading Supabase config:', e);
    }
    return {
      url: '',
      anonKey: '',
      serviceRoleKey: '',
      autoSync: false,
      status: 'unconfigured'
    };
  }

  /**
   * Sanitizes and normalizes Supabase Project URLs (converts dashboard URLs, trims, adds https)
   */
  public static cleanProjectUrl(url: string): string {
    if (!url) return '';
    let cleaned = url.trim().replace(/^["']|["']$/g, '').replace(/\/+$/, '');

    // Convert dashboard project URLs e.g. https://supabase.com/dashboard/project/xyz
    const dashMatch = cleaned.match(/supabase\.com\/dashboard\/project\/([a-z0-9_-]+)/i) ||
                      cleaned.match(/app\.supabase\.com\/project\/([a-z0-9_-]+)/i);
    if (dashMatch && dashMatch[1]) {
      return `https://${dashMatch[1]}.supabase.co`;
    }

    // Bare project reference ID (e.g. 20 alphanumeric chars)
    if (/^[a-z0-9]{15,30}$/i.test(cleaned)) {
      return `https://${cleaned}.supabase.co`;
    }

    // Ensure protocol
    if (!/^https?:\/\//i.test(cleaned)) {
      cleaned = `https://${cleaned}`;
    }

    // Remove unintended subpaths
    cleaned = cleaned.replace(/\/rest\/v1\/?$/i, '').replace(/\/editor\/?$/i, '').replace(/\/+$/, '');
    return cleaned;
  }

  /**
   * Sanitizes API keys (strips quotes, Bearer prefixes, whitespace)
   */
  public static cleanApiKey(key: string): string {
    if (!key) return '';
    return key.trim().replace(/^["']|["']$/g, '').replace(/^Bearer\s+/i, '').trim();
  }

  private initClient() {
    if (this.config.url && this.config.anonKey) {
      try {
        const cleanUrl = SupabaseService.cleanProjectUrl(this.config.url);
        const cleanKey = SupabaseService.cleanApiKey(this.config.anonKey);
        this.client = createClient(cleanUrl, cleanKey, {
          auth: {
            persistSession: true,
            autoRefreshToken: true
          }
        });
      } catch (err) {
        console.error('Failed to create Supabase client:', err);
        this.client = null;
      }
    } else {
      this.client = null;
    }
  }

  public subscribe(listener: () => void) {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify() {
    this.listeners.forEach((fn) => {
      try {
        fn();
      } catch (e) {
        console.error(e);
      }
    });
  }

  public getConfig(): SupabaseConfig {
    return { ...this.config };
  }

  public getClient(): SupabaseClient | null {
    return this.client;
  }

  public isConfigured(): boolean {
    return !!(this.config.url && this.config.anonKey);
  }

  public isConnected(): boolean {
    return this.config.status === 'connected' && !!this.client;
  }

  public async saveConfig(newConfig: Partial<SupabaseConfig>): Promise<void> {
    const sanitized: Partial<SupabaseConfig> = { ...newConfig };
    if (sanitized.url) {
      sanitized.url = SupabaseService.cleanProjectUrl(sanitized.url);
    }
    if (sanitized.anonKey) {
      sanitized.anonKey = SupabaseService.cleanApiKey(sanitized.anonKey);
    }
    if (sanitized.serviceRoleKey) {
      sanitized.serviceRoleKey = SupabaseService.cleanApiKey(sanitized.serviceRoleKey);
    }

    this.config = {
      ...this.config,
      ...sanitized
    };
    if (typeof window !== 'undefined') {
      localStorage.setItem(SUPABASE_CONFIG_KEY, JSON.stringify(this.config));
    }
    this.initClient();
    this.notify();
  }

  public clearConfig(): void {
    this.config = {
      url: '',
      anonKey: '',
      serviceRoleKey: '',
      autoSync: false,
      status: 'unconfigured',
      lastTested: undefined,
      lastSynced: undefined,
      errorMessage: undefined
    };
    if (typeof window !== 'undefined') {
      localStorage.removeItem(SUPABASE_CONFIG_KEY);
    }
    this.client = null;
    this.notify();
  }

  /**
   * Tests the connection against the configured Supabase endpoint
   */
  public async testConnection(customUrl?: string, customAnonKey?: string): Promise<{
    success: boolean;
    message: string;
    details?: string;
    accessibleTables?: string[];
    rawProbe?: {
      status: number;
      statusText: string;
      body: string;
    };
  }> {
    const targetUrl = SupabaseService.cleanProjectUrl(customUrl || this.config.url || '');
    const targetKey = SupabaseService.cleanApiKey(customAnonKey || this.config.anonKey || '');

    if (!targetUrl) {
      return { success: false, message: 'Please provide a valid Supabase Project URL (e.g. https://xyz.supabase.co).' };
    }
    if (!targetKey) {
      return { success: false, message: 'Please provide your Supabase anon/public API key.' };
    }

    // Direct HTTP REST probe to verify exact network/API response
    let probeStatus = 0;
    let probeStatusText = '';
    let probeBody = '';
    try {
      const probeRes = await fetch(`${targetUrl}/rest/v1/site_settings?select=id&limit=1`, {
        method: 'GET',
        headers: {
          apikey: targetKey,
          Authorization: `Bearer ${targetKey}`,
          'Content-Type': 'application/json'
        }
      });
      probeStatus = probeRes.status;
      probeStatusText = probeRes.statusText;
      probeBody = await probeRes.text();
    } catch (probeErr: any) {
      probeBody = probeErr?.message || 'Network / CORS request failed';
    }

    const rawProbe = {
      status: probeStatus,
      statusText: probeStatusText,
      body: probeBody
    };

    try {
      const testClient = createClient(targetUrl, targetKey);

      // Attempt to query the tables to verify schema readiness
      const checkTables = [
        'site_settings',
        'properties',
        'projects',
        'company_services',
        'showcase_items',
        'enquiries',
        'inspection_requests',
        'investment_opportunities'
      ];
      const accessibleTables: string[] = [];
      const errors: string[] = [];

      for (const table of checkTables) {
        try {
          const { error } = await testClient.from(table).select('id').limit(1);
          if (!error) {
            accessibleTables.push(table);
          } else {
            errors.push(`${table}: ${error.message} (code: ${error.code || 'unknown'})`);
          }
        } catch (tableErr: any) {
          errors.push(`${table}: ${tableErr?.message || 'Error'}`);
        }
      }

      const now = new Date().toLocaleString();

      if (accessibleTables.length > 0) {
        await this.saveConfig({
          url: targetUrl,
          anonKey: targetKey,
          status: 'connected',
          lastTested: now,
          errorMessage: undefined
        });

        storage.logActivity(
          'Supabase Connected',
          `Verified connection to ${targetUrl} (${accessibleTables.length} tables verified)`
        );

        return {
          success: true,
          message: `Successfully connected to Supabase! Verified access to tables: ${accessibleTables.join(', ')}.`,
          accessibleTables,
          rawProbe
        };
      } else {
        const fullErrors = errors.join(' | ');
        let userMessage = 'Connected to Supabase endpoint, but tables could not be verified.';
        let hint = fullErrors || probeBody || 'No response from database tables.';

        if (probeStatus === 401 || fullErrors.toLowerCase().includes('jwt') || fullErrors.toLowerCase().includes('invalid api key')) {
          userMessage = 'Supabase API Key Invalid or Expired (HTTP 401).';
          hint = 'The Anon/Public key entered does not match this Supabase project. Check Project Settings -> API in Supabase.';
        } else if (probeStatus === 404 || fullErrors.includes('PGRST205') || fullErrors.toLowerCase().includes('does not exist')) {
          userMessage = 'Tables Missing from Supabase (HTTP 404 / PGRST205).';
          hint = `PostgREST on ${targetUrl} cannot find table "site_settings". Quick solutions: 1) In Supabase, go to Project Settings -> General -> "Restart project" (clears frozen PostgREST schema cache); 2) Create the table directly in Table Editor via "+ New table"; 3) Check that your Project URL matches the project where you ran the SQL.`;
        } else if (probeStatus === 403 || fullErrors.includes('42501') || fullErrors.toLowerCase().includes('permission denied')) {
          userMessage = 'Permission Denied for anon key (HTTP 403).';
          hint = 'The public anon role lacks table permissions. Execute the GRANT permissions SQL script.';
        } else if (probeStatus === 0) {
          userMessage = 'Network or CORS connection failed.';
          hint = `Could not reach ${targetUrl}. Please verify the Project URL and check browser extensions / ad-blockers.`;
        }

        await this.saveConfig({
          url: targetUrl,
          anonKey: targetKey,
          status: 'error',
          lastTested: now,
          errorMessage: hint
        });

        return {
          success: false,
          message: userMessage,
          details: `${hint} [Raw HTTP ${probeStatus}: ${probeBody.slice(0, 300)}]`,
          rawProbe
        };
      }
    } catch (err: any) {
      const errMsg = err?.message || 'Unknown network or CORS error connecting to Supabase.';
      await this.saveConfig({
        status: 'error',
        lastTested: new Date().toLocaleString(),
        errorMessage: errMsg
      });
      return {
        success: false,
        message: 'Connection failed',
        details: errMsg,
        rawProbe
      };
    }
  }

  /**
   * Pushes all current local properties, projects, services, showcase, settings to Supabase
   */
  public async syncLocalToSupabase(): Promise<{
    success: boolean;
    message: string;
    counts: Record<string, number>;
  }> {
    if (!this.client) {
      return {
        success: false,
        message: 'Supabase client is not connected. Please verify your credentials first.',
        counts: {}
      };
    }

    const counts: Record<string, number> = {
      properties: 0,
      projects: 0,
      investments: 0,
      services: 0,
      showcase: 0,
      settings: 0
    };

    try {
      // 1. Site Settings
      const settings = storage.getSettings();
      const { error: settingsErr } = await this.client.from('site_settings').upsert({
        id: 'default',
        company_name: settings.companyName,
        logo_url: settings.logoUrl,
        hero_headline: settings.heroHeadline,
        hero_supporting_text: settings.heroSupportingText,
        hero_background: settings.heroBackground,
        email: settings.email,
        phone: settings.phone,
        whatsapp: settings.whatsapp,
        office_address: settings.officeAddress,
        business_hours: settings.businessHours,
        socials: settings.socials,
        updated_at: new Date().toISOString()
      });
      if (!settingsErr) counts.settings = 1;

      // 2. Properties
      const properties = storage.getProperties();
      if (properties.length > 0) {
        const payload = properties.map((p) => ({
          id: p.id,
          title: p.title,
          slug: p.slug,
          price: p.price,
          formatted_price: p.formattedPrice,
          location: p.location,
          city: p.city,
          state: p.state,
          type: p.type,
          purpose: p.purpose,
          size: p.size,
          bedrooms: p.bedrooms,
          bathrooms: p.bathrooms,
          featured: p.featured,
          availability: p.availability,
          cover_image: p.coverImage,
          images: p.images || [],
          description: p.description,
          features: p.features || [],
          title_deed: p.titleDeed,
          year_built: p.yearBuilt,
          created_at: p.createdAt || new Date().toISOString()
        }));
        const { error: propErr } = await this.client.from('properties').upsert(payload);
        if (!propErr) counts.properties = payload.length;
      }

      // 3. Projects
      const projects = storage.getProjects();
      if (projects.length > 0) {
        const payload = projects.map((prj) => ({
          id: prj.id,
          name: prj.name,
          slug: prj.slug,
          cover_image: prj.coverImage,
          images: prj.images || [],
          videos: prj.videos || [],
          location: prj.location,
          description: prj.description,
          type: prj.type,
          status: prj.status,
          progress: prj.progress || 0,
          features: prj.features || [],
          available_units: prj.availableUnits,
          delivery_date: prj.deliveryDate,
          created_at: prj.createdAt || new Date().toISOString()
        }));
        const { error: prjErr } = await this.client.from('projects').upsert(payload);
        if (!prjErr) counts.projects = payload.length;
      }

      // 4. Investment Opportunities
      const investments = storage.getInvestments();
      if (investments.length > 0) {
        const payload = investments.map((inv) => ({
          id: inv.id,
          title: inv.title,
          description: inv.description,
          location: inv.location,
          min_investment: inv.minInvestment,
          investment_period: inv.investmentPeriod,
          projected_return: inv.projectedReturn,
          payout_frequency: inv.payoutFrequency,
          project_info: inv.projectInfo,
          supporting_images: inv.supportingImages || [],
          documents: inv.documents || [],
          status: inv.status,
          created_at: inv.createdAt || new Date().toISOString()
        }));
        const { error: invErr } = await this.client.from('investment_opportunities').upsert(payload);
        if (!invErr) counts.investments = payload.length;
      }

      // 5. Company Services
      const services = storage.getServices();
      if (services.length > 0) {
        const payload = services.map((s) => ({
          id: s.id,
          title: s.title,
          short_description: s.shortDescription,
          full_description: s.fullDescription,
          image: s.image,
          features: s.features || [],
          scope: s.scope
        }));
        const { error: srvErr } = await this.client.from('company_services').upsert(payload);
        if (!srvErr) counts.services = payload.length;
      }

      // 6. Showcase Items
      const showcase = storage.getShowcase();
      if (showcase.length > 0) {
        const payload = showcase.map((sc) => ({
          id: sc.id,
          title: sc.title,
          category: sc.category,
          media_type: sc.mediaType,
          url: sc.url,
          thumbnail: sc.thumbnail,
          description: sc.description,
          location: sc.location,
          created_at: new Date().toISOString()
        }));
        const { error: scErr } = await this.client.from('showcase_items').upsert(payload);
        if (!scErr) counts.showcase = payload.length;
      }

      const now = new Date().toLocaleString();
      await this.saveConfig({ lastSynced: now });

      storage.logActivity(
        'Cloud Sync Completed',
        `Pushed local data to Supabase: ${counts.properties} properties, ${counts.projects} projects, ${counts.showcase} showcase items`
      );

      return {
        success: true,
        message: 'Local data successfully migrated & synced to Supabase Cloud!',
        counts
      };
    } catch (err: any) {
      return {
        success: false,
        message: `Sync failed: ${err?.message || 'Unknown error during Supabase upload'}`,
        counts
      };
    }
  }

  /**
   * Pulls data from Supabase down into local cache
   */
  public async syncSupabaseToLocal(): Promise<{
    success: boolean;
    message: string;
    counts: Record<string, number>;
  }> {
    if (!this.client) {
      return {
        success: false,
        message: 'Supabase client is not connected.',
        counts: {}
      };
    }

    const counts: Record<string, number> = {};

    try {
      // 1. Fetch properties
      const { data: propData, error: propErr } = await this.client
        .from('properties')
        .select('*');

      if (!propErr && propData && propData.length > 0) {
        const mappedProps: Property[] = propData.map((row: any) => ({
          id: row.id,
          title: row.title,
          slug: row.slug,
          price: Number(row.price),
          formattedPrice: row.formatted_price,
          location: row.location,
          city: row.city,
          state: row.state,
          type: row.type,
          purpose: row.purpose,
          size: row.size,
          bedrooms: row.bedrooms,
          bathrooms: row.bathrooms,
          featured: !!row.featured,
          availability: row.availability,
          coverImage: row.cover_image,
          images: row.images || [],
          description: row.description,
          features: row.features || [],
          titleDeed: row.title_deed,
          yearBuilt: row.year_built,
          createdAt: row.created_at
        }));
        localStorage.setItem('ascent_v3_properties', JSON.stringify(mappedProps));
        counts.properties = mappedProps.length;
      }

      // 2. Fetch projects
      const { data: prjData, error: prjErr } = await this.client
        .from('projects')
        .select('*');

      if (!prjErr && prjData && prjData.length > 0) {
        const mappedPrjs: Project[] = prjData.map((row: any) => ({
          id: row.id,
          name: row.name,
          slug: row.slug,
          coverImage: row.cover_image,
          images: row.images || [],
          videos: row.videos || [],
          location: row.location,
          description: row.description,
          type: row.type,
          status: row.status,
          progress: row.progress,
          features: row.features || [],
          availableUnits: row.available_units,
          deliveryDate: row.delivery_date,
          createdAt: row.created_at
        }));
        localStorage.setItem('ascent_v3_projects', JSON.stringify(mappedPrjs));
        counts.projects = mappedPrjs.length;
      }

      // 3. Fetch showcase
      const { data: scData, error: scErr } = await this.client
        .from('showcase_items')
        .select('*');

      if (!scErr && scData && scData.length > 0) {
        const mappedSc: ShowcaseItem[] = scData.map((row: any) => ({
          id: row.id,
          title: row.title,
          category: row.category,
          mediaType: row.media_type,
          url: row.url,
          thumbnail: row.thumbnail,
          description: row.description,
          location: row.location
        }));
        localStorage.setItem('ascent_v3_showcase', JSON.stringify(mappedSc));
        counts.showcase = mappedSc.length;
      }

      // 4. Fetch site settings
      const { data: settingsData, error: settingsErr } = await this.client
        .from('site_settings')
        .select('*')
        .eq('id', 'default')
        .maybeSingle();

      if (!settingsErr && settingsData) {
        const mappedSettings: SiteSettings = {
          companyName: settingsData.company_name,
          logoUrl: settingsData.logo_url,
          heroHeadline: settingsData.hero_headline,
          heroSupportingText: settingsData.hero_supporting_text,
          heroBackground: settingsData.hero_background,
          email: settingsData.email,
          phone: settingsData.phone,
          whatsapp: settingsData.whatsapp,
          officeAddress: settingsData.office_address,
          businessHours: settingsData.business_hours,
          socials: settingsData.socials
        };
        localStorage.setItem('ascent_v3_settings', JSON.stringify(mappedSettings));
        counts.settings = 1;
      }

      // Trigger re-render across listening components
      storage.logActivity('Supabase Pull Complete', 'Refreshed local records from Supabase cloud database');

      return {
        success: true,
        message: 'Successfully pulled cloud data into local website storage!',
        counts
      };
    } catch (err: any) {
      return {
        success: false,
        message: `Pull failed: ${err?.message || 'Error pulling data from Supabase'}`,
        counts
      };
    }
  }

  /**
   * Pushes a new client enquiry to Supabase in real-time
   */
  public async pushEnquiry(enquiry: Enquiry): Promise<boolean> {
    if (!this.client) return false;
    try {
      const { error } = await this.client.from('enquiries').insert([
        {
          id: enquiry.id,
          full_name: enquiry.fullName,
          email: enquiry.email,
          phone: enquiry.phone,
          subject: enquiry.subject,
          message: enquiry.message,
          property_title: enquiry.propertyTitle,
          status: enquiry.status,
          created_at: enquiry.createdAt
        }
      ]);
      return !error;
    } catch {
      return false;
    }
  }

  /**
   * Pushes a new inspection request to Supabase in real-time
   */
  public async pushInspection(inspection: InspectionRequest): Promise<boolean> {
    if (!this.client) return false;
    try {
      const { error } = await this.client.from('inspection_requests').insert([
        {
          id: inspection.id,
          full_name: inspection.fullName,
          phone: inspection.phone,
          email: inspection.email,
          property_title: inspection.propertyTitle,
          preferred_date: inspection.preferredDate,
          preferred_time: inspection.preferredTime,
          number_of_visitors: inspection.numberOfVisitors,
          message: inspection.message,
          status: inspection.status,
          created_at: inspection.createdAt
        }
      ]);
      return !error;
    } catch {
      return false;
    }
  }
  /**
   * Real-time sync for single project
   */
  public async upsertProject(project: Project): Promise<boolean> {
    if (!this.client) return false;
    try {
      const payload = {
        id: project.id,
        name: project.name,
        slug: project.slug,
        cover_image: project.coverImage,
        images: project.images || [],
        videos: project.videos || [],
        location: project.location,
        description: project.description,
        type: project.type,
        status: project.status,
        progress: project.progress || 0,
        features: project.features || [],
        available_units: project.availableUnits,
        delivery_date: project.deliveryDate,
        created_at: project.createdAt || new Date().toISOString()
      };
      const { error } = await this.client.from('projects').upsert(payload);
      return !error;
    } catch {
      return false;
    }
  }

  public async deleteProject(id: string): Promise<boolean> {
    if (!this.client) return false;
    try {
      const { error } = await this.client.from('projects').delete().eq('id', id);
      return !error;
    } catch {
      return false;
    }
  }

  /**
   * Real-time sync for single property
   */
  public async upsertProperty(property: Property): Promise<boolean> {
    if (!this.client) return false;
    try {
      const payload = {
        id: property.id,
        title: property.title,
        slug: property.slug,
        price: property.price,
        formatted_price: property.formattedPrice,
        location: property.location,
        city: property.city,
        state: property.state,
        type: property.type,
        purpose: property.purpose,
        size: property.size,
        bedrooms: property.bedrooms,
        bathrooms: property.bathrooms,
        featured: property.featured,
        availability: property.availability,
        cover_image: property.coverImage,
        images: property.images || [],
        description: property.description,
        features: property.features || [],
        title_deed: property.titleDeed,
        year_built: property.yearBuilt,
        created_at: property.createdAt || new Date().toISOString()
      };
      const { error } = await this.client.from('properties').upsert(payload);
      return !error;
    } catch {
      return false;
    }
  }

  public async deleteProperty(id: string): Promise<boolean> {
    if (!this.client) return false;
    try {
      const { error } = await this.client.from('properties').delete().eq('id', id);
      return !error;
    } catch {
      return false;
    }
  }

  /**
   * Real-time sync for site settings
   */
  public async upsertSiteSettings(settings: SiteSettings): Promise<boolean> {
    if (!this.client) return false;
    try {
      const payload = {
        id: 'default',
        company_name: settings.companyName,
        logo_url: settings.logoUrl,
        hero_headline: settings.heroHeadline,
        hero_supporting_text: settings.heroSupportingText,
        hero_background: settings.heroBackground,
        email: settings.email,
        phone: settings.phone,
        whatsapp: settings.whatsapp,
        office_address: settings.officeAddress,
        business_hours: settings.businessHours,
        socials: settings.socials,
        updated_at: new Date().toISOString()
      };
      const { error } = await this.client.from('site_settings').upsert(payload);
      return !error;
    } catch {
      return false;
    }
  }

  /**
   * Real-time sync for showcase items
   */
  public async upsertShowcase(item: ShowcaseItem): Promise<boolean> {
    if (!this.client) return false;
    try {
      const payload = {
        id: item.id,
        title: item.title,
        category: item.category,
        media_type: item.mediaType,
        url: item.url,
        thumbnail: item.thumbnail,
        description: item.description,
        location: item.location
      };
      const { error } = await this.client.from('showcase_items').upsert(payload);
      return !error;
    } catch {
      return false;
    }
  }

  public async deleteShowcase(id: string): Promise<boolean> {
    if (!this.client) return false;
    try {
      const { error } = await this.client.from('showcase_items').delete().eq('id', id);
      return !error;
    } catch {
      return false;
    }
  }
}

export const supabaseService = new SupabaseService();

// Real-time listener for automated cloud sync
if (typeof window !== 'undefined') {
  window.addEventListener('ascent:new_enquiry', (e: any) => {
    if (e.detail) {
      supabaseService.pushEnquiry(e.detail).catch(() => {});
    }
  });

  window.addEventListener('ascent:new_inspection', (e: any) => {
    if (e.detail) {
      supabaseService.pushInspection(e.detail).catch(() => {});
    }
  });

  window.addEventListener('ascent:project_saved', (e: any) => {
    if (e.detail) {
      supabaseService.upsertProject(e.detail).catch(() => {});
    }
  });

  window.addEventListener('ascent:project_deleted', (e: any) => {
    if (e.detail) {
      supabaseService.deleteProject(e.detail).catch(() => {});
    }
  });

  window.addEventListener('ascent:property_saved', (e: any) => {
    if (e.detail) {
      supabaseService.upsertProperty(e.detail).catch(() => {});
    }
  });

  window.addEventListener('ascent:property_deleted', (e: any) => {
    if (e.detail) {
      supabaseService.deleteProperty(e.detail).catch(() => {});
    }
  });

  window.addEventListener('ascent:settings_saved', (e: any) => {
    if (e.detail) {
      supabaseService.upsertSiteSettings(e.detail).catch(() => {});
    }
  });

  window.addEventListener('ascent:showcase_saved', (e: any) => {
    if (e.detail) {
      supabaseService.upsertShowcase(e.detail).catch(() => {});
    }
  });

  window.addEventListener('ascent:showcase_deleted', (e: any) => {
    if (e.detail) {
      supabaseService.deleteShowcase(e.detail).catch(() => {});
    }
  });
}
