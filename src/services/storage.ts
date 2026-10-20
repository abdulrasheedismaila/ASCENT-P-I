import {
  Property,
  Project,
  InvestmentOpportunity,
  CompanyService,
  ShowcaseItem,
  MediaItem,
  SiteSettings,
  Enquiry,
  InspectionRequest,
  AdminActivity
} from '../types';
import {
  INITIAL_SETTINGS,
  INITIAL_SERVICES,
  INITIAL_PROPERTIES,
  INITIAL_PROJECTS,
  INITIAL_INVESTMENTS,
  INITIAL_SHOWCASE,
  INITIAL_MEDIA,
  INITIAL_ENQUIRIES,
  INITIAL_INSPECTIONS,
  INITIAL_ACTIVITIES
} from '../data/initialData';

const KEYS = {
  PROPERTIES: 'ascent_v3_properties',
  PROJECTS: 'ascent_v3_projects',
  INVESTMENTS: 'ascent_v3_investments',
  SERVICES: 'ascent_v3_services',
  SHOWCASE: 'ascent_v3_showcase',
  MEDIA: 'ascent_v3_media',
  SETTINGS: 'ascent_v3_settings',
  ENQUIRIES: 'ascent_v3_enquiries',
  INSPECTIONS: 'ascent_v3_inspections',
  ACTIVITIES: 'ascent_v3_activities',
  ADMIN_AUTH: 'ascent_v3_admin_auth',
  ADMIN_SESSION: 'ascent_v3_admin_session'
};

// Initial admin credentials as per master prompt
const DEFAULT_ADMIN = {
  username: 'ascent',
  // Stored password hash/text for initial setup
  password: 'TerraNova2026!Secure',
  mustChangePassword: true,
  lastLogin: ''
};

class StorageService {
  private listeners: Set<() => void> = new Set();

  constructor() {
    this.init();
  }

  private init() {
    if (typeof window === 'undefined') return;

    if (!localStorage.getItem(KEYS.SETTINGS)) {
      localStorage.setItem(KEYS.SETTINGS, JSON.stringify(INITIAL_SETTINGS));
    } else {
      try {
        const storedSettings = JSON.parse(localStorage.getItem(KEYS.SETTINGS) || '{}');
        storedSettings.phone = '+2348033402265';
        storedSettings.whatsapp = '+2348033402265';
        localStorage.setItem(KEYS.SETTINGS, JSON.stringify(storedSettings));
      } catch (e) {
        localStorage.setItem(KEYS.SETTINGS, JSON.stringify(INITIAL_SETTINGS));
      }
    }
    if (!localStorage.getItem(KEYS.SERVICES)) {
      localStorage.setItem(KEYS.SERVICES, JSON.stringify(INITIAL_SERVICES));
    }
    if (!localStorage.getItem(KEYS.PROPERTIES)) {
      localStorage.setItem(KEYS.PROPERTIES, JSON.stringify(INITIAL_PROPERTIES));
    }
    if (!localStorage.getItem(KEYS.PROJECTS)) {
      localStorage.setItem(KEYS.PROJECTS, JSON.stringify(INITIAL_PROJECTS));
    }
    if (!localStorage.getItem(KEYS.INVESTMENTS)) {
      localStorage.setItem(KEYS.INVESTMENTS, JSON.stringify(INITIAL_INVESTMENTS));
    }
    if (!localStorage.getItem(KEYS.SHOWCASE)) {
      localStorage.setItem(KEYS.SHOWCASE, JSON.stringify(INITIAL_SHOWCASE));
    } else {
      // Force update of the specific 3 showcase images requested by the user
      try {
        const storedShowcase = JSON.parse(localStorage.getItem(KEYS.SHOWCASE) || '[]');
        let modified = false;
        storedShowcase.forEach((item: any) => {
          if (item.title && item.title.toLowerCase().includes('urban master planning')) {
            item.url = 'https://i.ibb.co/212PyYPQ/Gemini-Generated-Image-fq3ktgfq3ktgfq3k.jpg';
            modified = true;
          }
          if (item.title && item.title.toLowerCase().includes('corporate executive suite')) {
            item.url = 'https://i.ibb.co/vx2Kdvck/Gemini-Generated-Image-kjzs7xkjzs7xkjzs.jpg';
            modified = true;
          }
          if (item.title && item.title.toLowerCase().includes('prime gated estate')) {
            item.url = 'https://i.ibb.co/0jMMHYsD/Gemini-Generated-Image-9a20df9a20df9a20.jpg';
            modified = true;
          }
        });
        if (modified) {
          localStorage.setItem(KEYS.SHOWCASE, JSON.stringify(storedShowcase));
        }
      } catch (e) {
        localStorage.setItem(KEYS.SHOWCASE, JSON.stringify(INITIAL_SHOWCASE));
      }
    }
    if (!localStorage.getItem(KEYS.MEDIA)) {
      localStorage.setItem(KEYS.MEDIA, JSON.stringify(INITIAL_MEDIA));
    }
    if (!localStorage.getItem(KEYS.ENQUIRIES)) {
      localStorage.setItem(KEYS.ENQUIRIES, JSON.stringify(INITIAL_ENQUIRIES));
    }
    if (!localStorage.getItem(KEYS.INSPECTIONS)) {
      localStorage.setItem(KEYS.INSPECTIONS, JSON.stringify(INITIAL_INSPECTIONS));
    }
    if (!localStorage.getItem(KEYS.ACTIVITIES)) {
      localStorage.setItem(KEYS.ACTIVITIES, JSON.stringify(INITIAL_ACTIVITIES));
    }
    if (!localStorage.getItem(KEYS.ADMIN_AUTH)) {
      localStorage.setItem(KEYS.ADMIN_AUTH, JSON.stringify(DEFAULT_ADMIN));
    }
  }

  public subscribe(listener: () => void) {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify() {
    this.listeners.forEach((listener) => {
      try {
        listener();
      } catch (err) {
        console.error('Storage listener error:', err);
      }
    });
  }

  // --- SETTINGS ---
  public getSettings(): SiteSettings {
    try {
      const data = localStorage.getItem(KEYS.SETTINGS);
      return data ? JSON.parse(data) : INITIAL_SETTINGS;
    } catch {
      return INITIAL_SETTINGS;
    }
  }

  public updateSettings(settings: Partial<SiteSettings>): SiteSettings {
    const current = this.getSettings();
    const updated = { ...current, ...settings };
    localStorage.setItem(KEYS.SETTINGS, JSON.stringify(updated));
    this.logActivity('Settings Updated', 'Company profile, contacts, or hero settings modified');
    this.notify();
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('ascent:settings_saved', { detail: updated }));
    }
    return updated;
  }

  // --- PROPERTIES ---
  public getProperties(): Property[] {
    try {
      const data = localStorage.getItem(KEYS.PROPERTIES);
      return data ? JSON.parse(data) : INITIAL_PROPERTIES;
    } catch {
      return INITIAL_PROPERTIES;
    }
  }

  public getPropertyBySlug(slug: string): Property | undefined {
    return this.getProperties().find((p) => p.slug === slug || p.id === slug);
  }

  public saveProperty(property: Omit<Property, 'id' | 'createdAt'> & { id?: string }): Property {
    const list = this.getProperties();
    let saved: Property;
    if (property.id) {
      const index = list.findIndex((p) => p.id === property.id);
      if (index !== -1) {
        saved = {
          ...list[index],
          ...property,
          id: property.id
        };
        list[index] = saved;
        this.logActivity('Property Updated', `Updated listing: ${saved.title}`);
      } else {
        saved = {
          ...property,
          id: property.id,
          createdAt: new Date().toISOString()
        } as Property;
        list.unshift(saved);
        this.logActivity('Property Added', `Added listing: ${saved.title}`);
      }
    } else {
      const newId = `prop-${Date.now()}`;
      saved = {
        ...property,
        id: newId,
        slug: property.slug || property.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
        createdAt: new Date().toISOString()
      } as Property;
      list.unshift(saved);
      this.logActivity('Property Added', `Created new property listing: ${saved.title}`);
    }
    localStorage.setItem(KEYS.PROPERTIES, JSON.stringify(list));
    this.notify();
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('ascent:property_saved', { detail: saved }));
    }
    return saved;
  }

  public deleteProperty(id: string): boolean {
    const list = this.getProperties();
    const target = list.find((p) => p.id === id);
    const filtered = list.filter((p) => p.id !== id);
    if (filtered.length !== list.length) {
      localStorage.setItem(KEYS.PROPERTIES, JSON.stringify(filtered));
      this.logActivity('Property Deleted', `Removed listing: ${target?.title || id}`);
      this.notify();
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('ascent:property_deleted', { detail: id }));
      }
      return true;
    }
    return false;
  }

  // --- PROJECTS ---
  public getProjects(): Project[] {
    try {
      const data = localStorage.getItem(KEYS.PROJECTS);
      return data ? JSON.parse(data) : INITIAL_PROJECTS;
    } catch {
      return INITIAL_PROJECTS;
    }
  }

  public saveProject(project: Omit<Project, 'id' | 'createdAt'> & { id?: string }): Project {
    const list = this.getProjects();
    let saved: Project;
    if (project.id) {
      const index = list.findIndex((p) => p.id === project.id);
      if (index !== -1) {
        saved = { ...list[index], ...project, id: project.id };
        list[index] = saved;
        this.logActivity('Project Updated', `Updated project: ${saved.name}`);
      } else {
        saved = { ...project, id: project.id, createdAt: new Date().toISOString() } as Project;
        list.unshift(saved);
        this.logActivity('Project Added', `Added project: ${saved.name}`);
      }
    } else {
      const newId = `proj-${Date.now()}`;
      saved = {
        ...project,
        id: newId,
        slug: project.slug || project.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
        createdAt: new Date().toISOString()
      } as Project;
      list.unshift(saved);
      this.logActivity('Project Created', `Initiated development: ${saved.name}`);
    }
    localStorage.setItem(KEYS.PROJECTS, JSON.stringify(list));
    this.notify();
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('ascent:project_saved', { detail: saved }));
    }
    return saved;
  }

  public deleteProject(id: string): boolean {
    const list = this.getProjects();
    const target = list.find((p) => p.id === id);
    const filtered = list.filter((p) => p.id !== id);
    if (filtered.length !== list.length) {
      localStorage.setItem(KEYS.PROJECTS, JSON.stringify(filtered));
      this.logActivity('Project Deleted', `Removed project: ${target?.name || id}`);
      this.notify();
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('ascent:project_deleted', { detail: id }));
      }
      return true;
    }
    return false;
  }

  // --- INVESTMENTS ---
  public getInvestments(): InvestmentOpportunity[] {
    try {
      const data = localStorage.getItem(KEYS.INVESTMENTS);
      return data ? JSON.parse(data) : INITIAL_INVESTMENTS;
    } catch {
      return INITIAL_INVESTMENTS;
    }
  }

  public saveInvestment(investment: Omit<InvestmentOpportunity, 'id' | 'createdAt'> & { id?: string }): InvestmentOpportunity {
    const list = this.getInvestments();
    let saved: InvestmentOpportunity;
    if (investment.id) {
      const index = list.findIndex((i) => i.id === investment.id);
      if (index !== -1) {
        saved = { ...list[index], ...investment, id: investment.id };
        list[index] = saved;
        this.logActivity('Investment Opportunity Updated', `Updated: ${saved.title}`);
      } else {
        saved = { ...investment, id: investment.id, createdAt: new Date().toISOString() } as InvestmentOpportunity;
        list.unshift(saved);
      }
    } else {
      saved = {
        ...investment,
        id: `inv-${Date.now()}`,
        createdAt: new Date().toISOString()
      } as InvestmentOpportunity;
      list.unshift(saved);
      this.logActivity('Investment Opportunity Added', `Created opportunity: ${saved.title}`);
    }
    localStorage.setItem(KEYS.INVESTMENTS, JSON.stringify(list));
    this.notify();
    return saved;
  }

  public deleteInvestment(id: string): boolean {
    const list = this.getInvestments();
    const target = list.find((i) => i.id === id);
    const filtered = list.filter((i) => i.id !== id);
    if (filtered.length !== list.length) {
      localStorage.setItem(KEYS.INVESTMENTS, JSON.stringify(filtered));
      this.logActivity('Investment Opportunity Deleted', `Deleted opportunity: ${target?.title || id}`);
      this.notify();
      return true;
    }
    return false;
  }

  // --- SERVICES ---
  public getServices(): CompanyService[] {
    try {
      const data = localStorage.getItem(KEYS.SERVICES);
      return data ? JSON.parse(data) : INITIAL_SERVICES;
    } catch {
      return INITIAL_SERVICES;
    }
  }

  public updateService(id: string, updates: Partial<CompanyService>): CompanyService | null {
    const list = this.getServices();
    const index = list.findIndex((s) => s.id === id);
    if (index === -1) return null;
    const updated = { ...list[index], ...updates };
    list[index] = updated;
    localStorage.setItem(KEYS.SERVICES, JSON.stringify(list));
    this.logActivity('Service Updated', `Updated service package: ${updated.title}`);
    this.notify();
    return updated;
  }

  // --- SHOWCASE ---
  public getShowcase(): ShowcaseItem[] {
    try {
      const data = localStorage.getItem(KEYS.SHOWCASE);
      const showcaseList: ShowcaseItem[] = data ? JSON.parse(data) : INITIAL_SHOWCASE;

      // Automatically connect Media Library to Showcase:
      // Any published item uploaded to the Media Library that is designated for Showcase or Properties appears automatically
      const mediaList = this.getMedia();
      const existingUrls = new Set(showcaseList.map((s) => s.url));

      mediaList.forEach((m) => {
        if (m.isPublished && !existingUrls.has(m.url)) {
          if (
            m.category === 'Showcase' ||
            m.category === 'Properties' ||
            m.category === 'Projects' ||
            m.usedIn?.includes('Showcase Gallery') ||
            m.usedIn?.includes('Property Showcase')
          ) {
            let cat: ShowcaseItem['category'] = 'Properties';
            if (m.category === 'Projects') cat = 'Projects';
            else if (m.category === 'Hero') cat = 'Exteriors';

            showcaseList.unshift({
              id: `show-${m.id}`,
              title: m.title,
              category: cat,
              mediaType: m.mediaType,
              url: m.url,
              description: m.description,
              location: 'Ascent Portfolio'
            });
            existingUrls.add(m.url);
          }
        }
      });

      return showcaseList;
    } catch {
      return INITIAL_SHOWCASE;
    }
  }

  public saveShowcaseItem(item: Omit<ShowcaseItem, 'id'> & { id?: string }): ShowcaseItem {
    const list = this.getShowcase();
    let saved: ShowcaseItem;
    if (item.id) {
      const index = list.findIndex((s) => s.id === item.id);
      if (index !== -1) {
        saved = { ...list[index], ...item, id: item.id };
        list[index] = saved;
      } else {
        saved = { ...item, id: item.id } as ShowcaseItem;
        list.unshift(saved);
      }
    } else {
      saved = { ...item, id: `show-${Date.now()}` };
      list.unshift(saved);
      this.logActivity('Showcase Media Added', `Added visual: ${saved.title}`);
    }
    localStorage.setItem(KEYS.SHOWCASE, JSON.stringify(list));

    // Also register in Media Library if not already present
    const mediaList = this.getMedia();
    if (!mediaList.some((m) => m.url === saved.url)) {
      mediaList.unshift({
        id: `media-${Date.now()}`,
        title: saved.title,
        description: saved.description || 'Showcase visual item',
        category: 'Showcase',
        mediaType: saved.mediaType,
        url: saved.url,
        isPublished: true,
        uploadedAt: new Date().toISOString(),
        usedIn: ['Showcase Gallery', 'Property Showcase']
      });
      localStorage.setItem(KEYS.MEDIA, JSON.stringify(mediaList));
    }

    this.notify();
    return saved;
  }

  public deleteShowcaseItem(id: string): boolean {
    const list = this.getShowcase();
    const filtered = list.filter((s) => s.id !== id);
    if (filtered.length !== list.length) {
      localStorage.setItem(KEYS.SHOWCASE, JSON.stringify(filtered));
      this.notify();
      return true;
    }
    return false;
  }

  // --- MEDIA LIBRARY ---
  public getMedia(): MediaItem[] {
    try {
      const data = localStorage.getItem(KEYS.MEDIA);
      return data ? JSON.parse(data) : INITIAL_MEDIA;
    } catch {
      return INITIAL_MEDIA;
    }
  }

  public uploadMedia(
    item: Omit<MediaItem, 'id' | 'uploadedAt'> & { id?: string },
    targetDestination?: {
      type: 'showcase' | 'hero' | 'logo' | 'property' | 'project' | 'service' | 'none';
      targetId?: string;
      category?: ShowcaseItem['category'];
    }
  ): MediaItem {
    const list = this.getMedia();
    const saved: MediaItem = {
      ...item,
      id: item.id || `media-${Date.now()}`,
      uploadedAt: new Date().toISOString()
    };
    list.unshift(saved);
    try {
      localStorage.setItem(KEYS.MEDIA, JSON.stringify(list));
    } catch (e) {
      console.warn('Storage quota warning on media save:', e);
    }

    // Execute direct destination assignment if specified
    if (targetDestination) {
      if (targetDestination.type === 'hero') {
        this.assignMediaToHero(saved.url);
      } else if (targetDestination.type === 'logo') {
        this.assignMediaToLogo(saved.url);
      } else if (targetDestination.type === 'property' && targetDestination.targetId) {
        this.assignMediaToProperty(targetDestination.targetId, saved.url);
      } else if (targetDestination.type === 'project' && targetDestination.targetId) {
        this.assignMediaToProject(targetDestination.targetId, saved.url);
      } else if (targetDestination.type === 'service' && targetDestination.targetId) {
        this.assignMediaToService(targetDestination.targetId, saved.url);
      }
    }

    // Always sync to Showcase if explicitly targeted OR if category is Showcase/Properties/Projects
    const shouldSyncToShowcase =
      targetDestination?.type === 'showcase' ||
      saved.category === 'Showcase' ||
      saved.category === 'Properties' ||
      saved.category === 'Projects';

    if (saved.isPublished && shouldSyncToShowcase) {
      try {
        const showcaseData = localStorage.getItem(KEYS.SHOWCASE);
        const showcaseList: ShowcaseItem[] = showcaseData ? JSON.parse(showcaseData) : [...INITIAL_SHOWCASE];
        const exists = showcaseList.some((s) => s.url === saved.url);
        if (!exists) {
          let cat: ShowcaseItem['category'] = targetDestination?.category || 'Properties';
          if (saved.category === 'Projects') cat = 'Projects';
          else if (saved.category === 'Hero') cat = 'Exteriors';

          showcaseList.unshift({
            id: `show-${saved.id}`,
            title: saved.title,
            category: cat,
            mediaType: saved.mediaType,
            url: saved.url,
            description: saved.description,
            location: 'Ascent Portfolio'
          });
          localStorage.setItem(KEYS.SHOWCASE, JSON.stringify(showcaseList));
        }
      } catch (e) {
        console.warn('Error syncing media to showcase:', e);
      }
    }

    this.logActivity('Media Uploaded', `Asset added: ${saved.title}${targetDestination ? ` -> Assigned to ${targetDestination.type}` : ''}`);
    this.notify();
    return saved;
  }

  public updateMedia(id: string, updates: Partial<MediaItem>): MediaItem | null {
    const list = this.getMedia();
    const index = list.findIndex((m) => m.id === id);
    if (index === -1) return null;
    const updated = { ...list[index], ...updates };
    list[index] = updated;
    localStorage.setItem(KEYS.MEDIA, JSON.stringify(list));
    this.notify();
    return updated;
  }

  // --- DIRECT MEDIA ASSIGNMENT HELPERS ---
  public assignMediaToHero(url: string) {
    const current = this.getSettings();
    this.updateSettings({ ...current, heroBackground: url });
    this.logActivity('Hero Background Updated', 'Set new hero background visual from Media Library');
  }

  public assignMediaToLogo(url: string) {
    const current = this.getSettings();
    this.updateSettings({ ...current, logoUrl: url });
    this.logActivity('Company Logo Updated', 'Set official logo from Media Library');
  }

  public assignMediaToProperty(propertyId: string, url: string): boolean {
    const list = this.getProperties();
    const index = list.findIndex((p) => p.id === propertyId);
    if (index !== -1) {
      list[index].coverImage = url;
      if (!list[index].images.includes(url)) {
        list[index].images.unshift(url);
      }
      localStorage.setItem(KEYS.PROPERTIES, JSON.stringify(list));
      this.logActivity('Property Cover Updated', `Updated visual for listing: ${list[index].title}`);
      this.notify();
      return true;
    }
    return false;
  }

  public assignMediaToProject(projectId: string, url: string): boolean {
    const list = this.getProjects();
    const index = list.findIndex((pr) => pr.id === projectId);
    if (index !== -1) {
      list[index].coverImage = url;
      if (!list[index].images.includes(url)) {
        list[index].images.unshift(url);
      }
      localStorage.setItem(KEYS.PROJECTS, JSON.stringify(list));
      this.logActivity('Project Cover Updated', `Updated visual for project: ${list[index].name}`);
      this.notify();
      return true;
    }
    return false;
  }

  public assignMediaToService(serviceId: string, url: string): boolean {
    const updated = this.updateService(serviceId, { image: url });
    return !!updated;
  }

  public checkMediaUsage(url: string): string[] {
    const usages: string[] = [];
    const settings = this.getSettings();
    if (settings.logoUrl === url) usages.push('Official Logo in Header/Footer');
    if (settings.heroBackground === url) usages.push('Homepage Hero Background');

    this.getProperties().forEach((p) => {
      if (p.coverImage === url || p.images.includes(url)) {
        usages.push(`Property: ${p.title}`);
      }
    });

    this.getProjects().forEach((pr) => {
      if (pr.coverImage === url || pr.images.includes(url)) {
        usages.push(`Project: ${pr.name}`);
      }
    });

    this.getServices().forEach((s) => {
      if (s.image === url) {
        usages.push(`Service: ${s.title}`);
      }
    });

    this.getShowcase().forEach((sh) => {
      if (sh.url === url) {
        usages.push(`Showcase Gallery: ${sh.title}`);
      }
    });

    return usages;
  }

  public deleteMedia(id: string): { success: boolean; affectedUsages: string[] } {
    const list = this.getMedia();
    const target = list.find((m) => m.id === id);
    if (!target) return { success: false, affectedUsages: [] };

    const usages = this.checkMediaUsage(target.url);
    const filtered = list.filter((m) => m.id !== id);
    localStorage.setItem(KEYS.MEDIA, JSON.stringify(filtered));
    this.logActivity('Media Deleted', `Removed media asset: ${target.title}`);
    this.notify();
    return { success: true, affectedUsages: usages };
  }

  // --- ENQUIRIES ---
  public getEnquiries(): Enquiry[] {
    try {
      const data = localStorage.getItem(KEYS.ENQUIRIES);
      return data ? JSON.parse(data) : INITIAL_ENQUIRIES;
    } catch {
      return INITIAL_ENQUIRIES;
    }
  }

  public submitEnquiry(enquiry: Omit<Enquiry, 'id' | 'status' | 'createdAt'>): Enquiry {
    const list = this.getEnquiries();
    const newEnquiry: Enquiry = {
      ...enquiry,
      id: `enq-${Date.now()}`,
      status: 'New',
      createdAt: new Date().toISOString()
    };
    list.unshift(newEnquiry);
    localStorage.setItem(KEYS.ENQUIRIES, JSON.stringify(list));
    this.logActivity('New Client Enquiry', `From ${enquiry.fullName} (${enquiry.subject})`);
    this.notify();
    if (typeof window !== 'undefined') {
      try {
        window.dispatchEvent(new CustomEvent('ascent:new_enquiry', { detail: newEnquiry }));
      } catch (e) {
        console.error(e);
      }
    }
    return newEnquiry;
  }

  public updateEnquiryStatus(id: string, status: Enquiry['status']): boolean {
    const list = this.getEnquiries();
    const index = list.findIndex((e) => e.id === id);
    if (index !== -1) {
      list[index].status = status;
      localStorage.setItem(KEYS.ENQUIRIES, JSON.stringify(list));
      this.notify();
      return true;
    }
    return false;
  }

  public deleteEnquiry(id: string): boolean {
    const list = this.getEnquiries();
    const filtered = list.filter((e) => e.id !== id);
    if (filtered.length !== list.length) {
      localStorage.setItem(KEYS.ENQUIRIES, JSON.stringify(filtered));
      this.notify();
      return true;
    }
    return false;
  }

  // --- INSPECTION REQUESTS ---
  public getInspections(): InspectionRequest[] {
    try {
      const data = localStorage.getItem(KEYS.INSPECTIONS);
      return data ? JSON.parse(data) : INITIAL_INSPECTIONS;
    } catch {
      return INITIAL_INSPECTIONS;
    }
  }

  public submitInspection(inspection: Omit<InspectionRequest, 'id' | 'status' | 'createdAt'>): InspectionRequest {
    const list = this.getInspections();
    const newInspection: InspectionRequest = {
      ...inspection,
      id: `insp-${Date.now()}`,
      status: 'Pending',
      createdAt: new Date().toISOString()
    };
    list.unshift(newInspection);
    localStorage.setItem(KEYS.INSPECTIONS, JSON.stringify(list));
    this.logActivity('New Inspection Request', `From ${inspection.fullName} for ${inspection.propertyTitle}`);
    this.notify();
    if (typeof window !== 'undefined') {
      try {
        window.dispatchEvent(new CustomEvent('ascent:new_inspection', { detail: newInspection }));
      } catch (e) {
        console.error(e);
      }
    }
    return newInspection;
  }

  public updateInspectionStatus(id: string, status: InspectionRequest['status']): boolean {
    const list = this.getInspections();
    const index = list.findIndex((i) => i.id === id);
    if (index !== -1) {
      list[index].status = status;
      localStorage.setItem(KEYS.INSPECTIONS, JSON.stringify(list));
      this.notify();
      return true;
    }
    return false;
  }

  public deleteInspection(id: string): boolean {
    const list = this.getInspections();
    const filtered = list.filter((i) => i.id !== id);
    if (filtered.length !== list.length) {
      localStorage.setItem(KEYS.INSPECTIONS, JSON.stringify(filtered));
      this.notify();
      return true;
    }
    return false;
  }

  // --- ACTIVITIES ---
  public getActivities(): AdminActivity[] {
    try {
      const data = localStorage.getItem(KEYS.ACTIVITIES);
      return data ? JSON.parse(data) : INITIAL_ACTIVITIES;
    } catch {
      return INITIAL_ACTIVITIES;
    }
  }

  public logActivity(action: string, details: string) {
    const list = this.getActivities();
    const newAct: AdminActivity = {
      id: `act-${Date.now()}`,
      action,
      details,
      timestamp: new Date().toLocaleString()
    };
    list.unshift(newAct);
    if (list.length > 50) list.pop();
    localStorage.setItem(KEYS.ACTIVITIES, JSON.stringify(list));
  }

  // --- AUTHENTICATION ---
  public getAdminAuth() {
    try {
      const raw = localStorage.getItem(KEYS.ADMIN_AUTH);
      return raw ? JSON.parse(raw) : DEFAULT_ADMIN;
    } catch {
      return DEFAULT_ADMIN;
    }
  }

  public verifyAdmin(username: string, passwordAttempt: string): { success: boolean; mustChangePassword?: boolean } {
    const current = this.getAdminAuth();
    if (username.trim() === current.username && passwordAttempt === current.password) {
      const sessionToken = `session-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
      sessionStorage.setItem(KEYS.ADMIN_SESSION, JSON.stringify({ token: sessionToken, at: Date.now() }));
      this.logActivity('Admin Login Successful', `User "${username}" signed into admin portal`);
      return { success: true, mustChangePassword: current.mustChangePassword };
    }
    return { success: false };
  }

  public isAuthenticated(): boolean {
    if (typeof window === 'undefined') return false;
    const session = sessionStorage.getItem(KEYS.ADMIN_SESSION);
    return !!session;
  }

  public logoutAdmin() {
    sessionStorage.removeItem(KEYS.ADMIN_SESSION);
    this.logActivity('Admin Logout', 'Session ended');
    this.notify();
  }

  public updateAdminCredentials(newUsername: string, newPassword: string): { success: boolean } {
    const current = this.getAdminAuth();
    const updated = {
      ...current,
      username: newUsername.trim() || current.username,
      password: newPassword,
      mustChangePassword: false
    };
    localStorage.setItem(KEYS.ADMIN_AUTH, JSON.stringify(updated));
    this.logActivity('Security Updated', 'Admin credentials updated successfully');
    this.notify();
    return { success: true };
  }
}

export const storage = new StorageService();
