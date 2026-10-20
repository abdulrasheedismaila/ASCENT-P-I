import React, { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  Building,
  Briefcase,
  TrendingUp,
  Wrench,
  Image as ImageIcon,
  FolderOpen,
  Mail,
  CalendarCheck,
  Settings,
  Lock,
  LogOut,
  Plus,
  Trash2,
  Edit,
  Eye,
  EyeOff,
  Upload,
  CheckCircle2,
  AlertCircle,
  AlertTriangle,
  RefreshCw,
  Search,
  ExternalLink,
  X,
  Sparkles,
  Globe,
  Check,
  ChevronDown,
  Database,
  Copy,
  UploadCloud,
  DownloadCloud,
  Key,
  FileCode,
  ShieldCheck,
  Info
} from 'lucide-react';
import { optimizeImageFile } from '../utils/imageOptimizer';
import { supabaseService, SupabaseConfig } from '../services/supabase';
import { COMPLETE_SUPABASE_SQL, SUPABASE_QUICK_FIX_SQL, SUPABASE_VERIFY_TABLES_SQL, SUPABASE_SINGLE_TABLE_SQL } from '../services/supabaseSchema';
import {
  Property,
  Project,
  InvestmentOpportunity,
  CompanyService,
  ShowcaseItem,
  MediaItem,
  Enquiry,
  InspectionRequest,
  SiteSettings,
  AdminActivity
} from '../types';
import { storage } from '../services/storage';

interface AdminDashboardProps {
  onCloseAdmin: () => void;
  onNavigateHome: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  onCloseAdmin,
  onNavigateHome
}) => {
  // Authentication state
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(storage.isAuthenticated());
  const [usernameInput, setUsernameInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [loginError, setLoginError] = useState('');
  const [mustChangePassword, setMustChangePassword] = useState(false);

  // Active section
  const [activeTab, setActiveTab] = useState<
    | 'overview'
    | 'properties'
    | 'projects'
    | 'investments'
    | 'services'
    | 'showcase'
    | 'media'
    | 'enquiries'
    | 'inspections'
    | 'settings'
    | 'security'
    | 'supabase'
  >('overview');

  // Live data states from storage
  const [settings, setSettings] = useState<SiteSettings>(storage.getSettings());
  const [properties, setProperties] = useState<Property[]>(storage.getProperties());
  const [projects, setProjects] = useState<Project[]>(storage.getProjects());
  const [investments, setInvestments] = useState<InvestmentOpportunity[]>(storage.getInvestments());
  const [services, setServices] = useState<CompanyService[]>(storage.getServices());
  const [showcase, setShowcase] = useState<ShowcaseItem[]>(storage.getShowcase());
  const [mediaList, setMediaList] = useState<MediaItem[]>(storage.getMedia());
  const [enquiries, setEnquiries] = useState<Enquiry[]>(storage.getEnquiries());
  const [inspections, setInspections] = useState<InspectionRequest[]>(storage.getInspections());
  const [activities, setActivities] = useState<AdminActivity[]>(storage.getActivities());

  // Notification banners
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // --- SUPABASE CLOUD DATABASE STATE ---
  const [supabaseConfig, setSupabaseConfig] = useState<SupabaseConfig>(supabaseService.getConfig());
  const [supabaseUrlInput, setSupabaseUrlInput] = useState(supabaseService.getConfig().url || '');
  const [supabaseAnonKeyInput, setSupabaseAnonKeyInput] = useState(supabaseService.getConfig().anonKey || '');
  const [supabaseServiceRoleInput, setSupabaseServiceRoleInput] = useState(supabaseService.getConfig().serviceRoleKey || '');
  const [supabaseShowAnonKey, setSupabaseShowAnonKey] = useState(false);
  const [supabaseShowServiceKey, setSupabaseShowServiceKey] = useState(false);
  const [supabaseTesting, setSupabaseTesting] = useState(false);
  const [supabaseTestResult, setSupabaseTestResult] = useState<{
    success: boolean;
    message: string;
    details?: string;
    accessibleTables?: string[];
    rawProbe?: {
      status: number;
      statusText: string;
      body: string;
    };
  } | null>(null);
  const [supabaseSyncing, setSupabaseSyncing] = useState(false);
  const [supabaseSyncResult, setSupabaseSyncResult] = useState<{
    success: boolean;
    message: string;
    counts?: Record<string, number>;
  } | null>(null);
  const [sqlCopied, setSqlCopied] = useState(false);
  const [quickFixCopied, setQuickFixCopied] = useState(false);
  const [verifySqlCopied, setVerifySqlCopied] = useState(false);
  const [singleTableSqlCopied, setSingleTableSqlCopied] = useState(false);
  const [activeSupabaseSubTab, setActiveSupabaseSubTab] = useState<'credentials' | 'sql' | 'sync' | 'guide'>('credentials');

  // Subscribe to storage & supabase updates
  useEffect(() => {
    const unsubStorage = storage.subscribe(() => {
      setSettings(storage.getSettings());
      setProperties(storage.getProperties());
      setProjects(storage.getProjects());
      setInvestments(storage.getInvestments());
      setServices(storage.getServices());
      setShowcase(storage.getShowcase());
      setMediaList(storage.getMedia());
      setEnquiries(storage.getEnquiries());
      setInspections(storage.getInspections());
      setActivities(storage.getActivities());
      setIsAuthenticated(storage.isAuthenticated());
    });

    const unsubSupabase = supabaseService.subscribe(() => {
      const cfg = supabaseService.getConfig();
      setSupabaseConfig(cfg);
    });

    return () => {
      unsubStorage();
      unsubSupabase();
    };
  }, []);

  const notify = (message: string, type: 'success' | 'error' = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 4000);
  };

  // --- SUPABASE ACTIONS ---
  const handleTestSupabase = async () => {
    setSupabaseTesting(true);
    setSupabaseTestResult(null);
    try {
      const res = await supabaseService.testConnection(supabaseUrlInput, supabaseAnonKeyInput);
      setSupabaseTestResult(res);
      if (res.success) {
        notify('Supabase connected and tables verified!', 'success');
      } else {
        notify(res.message, 'error');
      }
    } catch (err: any) {
      setSupabaseTestResult({
        success: false,
        message: 'Connection failed',
        details: err?.message || 'Network / CORS error'
      });
      notify('Connection to Supabase failed.', 'error');
    } finally {
      setSupabaseTesting(false);
    }
  };

  const handleSaveSupabaseCredentials = async () => {
    if (!supabaseUrlInput.trim()) {
      notify('Please enter your Supabase Project URL.', 'error');
      return;
    }
    if (!supabaseAnonKeyInput.trim()) {
      notify('Please enter your Supabase Anon Key.', 'error');
      return;
    }

    await supabaseService.saveConfig({
      url: supabaseUrlInput.trim(),
      anonKey: supabaseAnonKeyInput.trim(),
      serviceRoleKey: supabaseServiceRoleInput.trim()
    });
    notify('Supabase credentials saved successfully!');
    // Trigger automated test
    handleTestSupabase();
  };

  const handleClearSupabase = () => {
    if (window.confirm('Are you sure you want to disconnect Supabase credentials?')) {
      supabaseService.clearConfig();
      setSupabaseUrlInput('');
      setSupabaseAnonKeyInput('');
      setSupabaseServiceRoleInput('');
      setSupabaseTestResult(null);
      setSupabaseSyncResult(null);
      notify('Supabase credentials removed.');
    }
  };

  const handleSyncToSupabase = async () => {
    setSupabaseSyncing(true);
    setSupabaseSyncResult(null);
    const res = await supabaseService.syncLocalToSupabase();
    setSupabaseSyncResult(res);
    setSupabaseSyncing(false);
    if (res.success) {
      notify('All local data successfully pushed to Supabase Cloud!');
    } else {
      notify(res.message, 'error');
    }
  };

  const handlePullFromSupabase = async () => {
    setSupabaseSyncing(true);
    setSupabaseSyncResult(null);
    const res = await supabaseService.syncSupabaseToLocal();
    setSupabaseSyncResult(res);
    setSupabaseSyncing(false);
    if (res.success) {
      notify('Website updated with latest records from Supabase!');
    } else {
      notify(res.message, 'error');
    }
  };

  const handleCopySql = () => {
    navigator.clipboard.writeText(COMPLETE_SUPABASE_SQL);
    setSqlCopied(true);
    notify('Complete Supabase SQL copied to clipboard!');
    setTimeout(() => setSqlCopied(false), 3000);
  };

  const handleCopyQuickFix = () => {
    navigator.clipboard.writeText(SUPABASE_QUICK_FIX_SQL);
    setQuickFixCopied(true);
    notify('Quick-fix permissions SQL copied to clipboard!');
    setTimeout(() => setQuickFixCopied(false), 3000);
  };

  const handleCopyVerifySql = () => {
    navigator.clipboard.writeText(SUPABASE_VERIFY_TABLES_SQL);
    setVerifySqlCopied(true);
    notify('Table verification query copied to clipboard!');
    setTimeout(() => setVerifySqlCopied(false), 3000);
  };

  const handleCopySingleTableSql = () => {
    navigator.clipboard.writeText(SUPABASE_SINGLE_TABLE_SQL);
    setSingleTableSqlCopied(true);
    notify('Targeted site_settings SQL copied to clipboard!');
    setTimeout(() => setSingleTableSqlCopied(false), 3000);
  };

  const handleDownloadSql = () => {
    const blob = new Blob([COMPLETE_SUPABASE_SQL], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'ascent_supabase_schema.sql';
    a.click();
    URL.revokeObjectURL(url);
    notify('Downloaded ascent_supabase_schema.sql!');
  };

  const rawSupabaseInput = (supabaseUrlInput || supabaseConfig.url || '').trim();
  const supabaseProjectRef =
    rawSupabaseInput.match(/https?:\/\/([^.]+)\.supabase\.co/i)?.[1] ||
    rawSupabaseInput.match(/supabase\.com\/dashboard\/project\/([a-z0-9_-]+)/i)?.[1] ||
    rawSupabaseInput.match(/app\.supabase\.com\/project\/([a-z0-9_-]+)/i)?.[1] ||
    (/^[a-z0-9]{15,30}$/i.test(rawSupabaseInput) ? rawSupabaseInput : '');
  const supabaseSqlEditorUrl = supabaseProjectRef
    ? `https://supabase.com/dashboard/project/${supabaseProjectRef}/sql/new`
    : 'https://supabase.com/dashboard/project/_/sql/new';
  const supabaseTableEditorUrl = supabaseProjectRef
    ? `https://supabase.com/dashboard/project/${supabaseProjectRef}/editor`
    : 'https://supabase.com/dashboard/project/_/editor';
  const supabaseRestartUrl = supabaseProjectRef
    ? `https://supabase.com/dashboard/project/${supabaseProjectRef}/settings/general`
    : 'https://supabase.com/dashboard/project/_/settings/general';

  // --- LOGIN LOGIC ---
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const res = storage.verifyAdmin(usernameInput, passwordInput);
    if (res.success) {
      setIsAuthenticated(true);
      setLoginError('');
      if (res.mustChangePassword) {
        setMustChangePassword(true);
        setActiveTab('security');
      }
    } else {
      setLoginError('Invalid administrator username or password. Please verify credentials.');
    }
  };

  const handleLogout = () => {
    storage.logoutAdmin();
    setIsAuthenticated(false);
    onCloseAdmin();
  };

  // --- PASSWORD UPDATE LOGIC ---
  const [newUsername, setNewUsername] = useState('ascent');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const handleUpdateCredentials = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword || newPassword.length < 8) {
      setPasswordError('New password must be at least 8 characters long.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError('New passwords do not match.');
      return;
    }
    storage.updateAdminCredentials(newUsername, newPassword);
    setMustChangePassword(false);
    setNewPassword('');
    setConfirmPassword('');
    setPasswordError('');
    notify('Administrator credentials successfully updated!');
  };

  // --- PROPERTY MODAL STATE ---
  const [propertyModalOpen, setPropertyModalOpen] = useState(false);
  const [editingProperty, setEditingProperty] = useState<Partial<Property> | null>(null);

  const handleSaveProperty = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProperty?.title || !editingProperty.price || !editingProperty.coverImage) {
      notify('Please provide title, price, and cover image.', 'error');
      return;
    }

    const priceNum = Number(editingProperty.price);
    const formatted = `₦${priceNum.toLocaleString()}`;

    storage.saveProperty({
      id: editingProperty.id,
      title: editingProperty.title,
      slug: editingProperty.slug || editingProperty.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      price: priceNum,
      formattedPrice: formatted,
      location: editingProperty.location || 'Lekki, Lagos',
      city: editingProperty.city || 'Lagos',
      state: editingProperty.state || 'Lagos State',
      type: editingProperty.type || 'Residential',
      purpose: editingProperty.purpose || 'Buy',
      size: editingProperty.size || '500 sqm',
      bedrooms: editingProperty.bedrooms ? Number(editingProperty.bedrooms) : undefined,
      bathrooms: editingProperty.bathrooms ? Number(editingProperty.bathrooms) : undefined,
      featured: editingProperty.featured ?? true,
      availability: editingProperty.availability || 'Available',
      coverImage: editingProperty.coverImage,
      images: editingProperty.images && editingProperty.images.length > 0 ? editingProperty.images : [editingProperty.coverImage],
      description: editingProperty.description || '',
      features: editingProperty.features || ['24/7 Power', 'Gated Security', 'Paved Access'],
      titleDeed: editingProperty.titleDeed || 'Governor’s Consent'
    });

    setPropertyModalOpen(false);
    setEditingProperty(null);
    const cloudSync = supabaseConfig.status === 'connected' ? ' (and synced to Supabase Cloud!)' : '';
    notify(`Property saved successfully!${cloudSync}`);
  };

  // --- PROJECT MODAL STATE ---
  const [projectModalOpen, setProjectModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Partial<Project> | null>(null);

  const handleSaveProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProject?.name || !editingProject.coverImage) {
      notify('Please enter project name and cover image.', 'error');
      return;
    }

    storage.saveProject({
      id: editingProject.id,
      name: editingProject.name,
      slug: editingProject.slug || editingProject.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      coverImage: editingProject.coverImage,
      images: editingProject.images || [editingProject.coverImage],
      location: editingProject.location || 'Lagos, Nigeria',
      description: editingProject.description || '',
      type: editingProject.type || 'Residential Estate',
      status: editingProject.status || 'Ongoing',
      progress: editingProject.progress !== undefined ? Number(editingProject.progress) : 50,
      features: editingProject.features || ['Master Gated Entrance', 'Solar Microgrid'],
      availableUnits: editingProject.availableUnits || 'Units Available',
      deliveryDate: editingProject.deliveryDate || '2026'
    });

    setProjectModalOpen(false);
    setEditingProject(null);
    const cloudSync = supabaseConfig.status === 'connected' ? ' (and synced to Supabase Cloud!)' : '';
    notify(`Project saved successfully!${cloudSync}`);
  };

  // --- MEDIA UPLOAD MODAL STATE ---
  const [mediaModalOpen, setMediaModalOpen] = useState(false);
  const [mediaTitle, setMediaTitle] = useState('');
  const [mediaDesc, setMediaDesc] = useState('');
  const [mediaCategory, setMediaCategory] = useState<MediaItem['category']>('Showcase');
  const [mediaType, setMediaType] = useState<'image' | 'video'>('image');
  const [mediaUrlInput, setMediaUrlInput] = useState('');
  const [mediaFilePreview, setMediaFilePreview] = useState<string | null>(null);
  const [isOptimizingImage, setIsOptimizingImage] = useState(false);
  const [websitePlacement, setWebsitePlacement] = useState<
    'showcase' | 'hero' | 'logo' | 'property' | 'project' | 'service' | 'none'
  >('showcase');
  const [targetPropertyId, setTargetPropertyId] = useState<string>('');
  const [targetProjectId, setTargetProjectId] = useState<string>('');
  const [targetServiceId, setTargetServiceId] = useState<string>('');
  const [deleteWarningModal, setDeleteWarningModal] = useState<{ id: string; title: string; usages: string[] } | null>(null);

  // Dedicated Showcase Modal State
  const [showcaseModalOpen, setShowcaseModalOpen] = useState(false);
  const [showcaseTitle, setShowcaseTitle] = useState('');
  const [showcaseUrl, setShowcaseUrl] = useState('');
  const [showcaseCategory, setShowcaseCategory] = useState<ShowcaseItem['category']>('Properties');
  const [showcaseDesc, setShowcaseDesc] = useState('High-resolution architectural visual');
  const [showcaseLocation, setShowcaseLocation] = useState('Ascent Portfolio');
  const [isShowcaseOptimizing, setIsShowcaseOptimizing] = useState(false);

  // Dedicated Media Picker Modal State (to select from existing library for Property, Project, Hero, Logo)
  const [mediaPickerOpen, setMediaPickerOpen] = useState(false);
  const [mediaPickerCallback, setMediaPickerCallback] = useState<(url: string) => void>(() => () => {});
  const [mediaPickerTitle, setMediaPickerTitle] = useState('Select Image from Media Library');

  // File to optimized base64 handler
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsOptimizingImage(true);
      const optimized = await optimizeImageFile(file);
      setMediaFilePreview(optimized.dataUrl);
      setMediaUrlInput(optimized.dataUrl);
      if (!mediaTitle) {
        setMediaTitle(file.name.replace(/\.[^/.]+$/, ''));
      }
      setIsOptimizingImage(false);
    } catch (err) {
      console.error('Image optimization failed:', err);
      setIsOptimizingImage(false);
      notify('Could not process image file. Please try another file.', 'error');
    }
  };

  const handleSaveMedia = (e: React.FormEvent) => {
    e.preventDefault();
    const finalUrl = mediaFilePreview || mediaUrlInput.trim();
    if (!finalUrl || !mediaTitle.trim()) {
      notify('Please provide title and an image file or URL.', 'error');
      return;
    }

    const defaultPropId = properties[0]?.id || '';
    const defaultProjId = projects[0]?.id || '';
    const defaultServId = services[0]?.id || '';

    storage.uploadMedia(
      {
        title: mediaTitle.trim(),
        description: mediaDesc.trim(),
        category: mediaCategory,
        mediaType,
        url: finalUrl,
        isPublished: true,
        size: 'Web Optimized',
        usedIn: [
          websitePlacement === 'hero'
            ? 'Homepage Hero'
            : websitePlacement === 'logo'
            ? 'Official Logo'
            : websitePlacement === 'property'
            ? 'Property Listing'
            : websitePlacement === 'project'
            ? 'Project Portfolio'
            : websitePlacement === 'service'
            ? 'Company Service'
            : 'Showcase Gallery'
        ]
      },
      {
        type: websitePlacement,
        targetId:
          websitePlacement === 'property'
            ? targetPropertyId || defaultPropId
            : websitePlacement === 'project'
            ? targetProjectId || defaultProjId
            : websitePlacement === 'service'
            ? targetServiceId || defaultServId
            : undefined,
        category: mediaCategory as any
      }
    );

    setMediaModalOpen(false);
    setMediaTitle('');
    setMediaDesc('');
    setMediaUrlInput('');
    setMediaFilePreview(null);
    setWebsitePlacement('showcase');

    let successMsg = 'Image uploaded and published to website!';
    if (websitePlacement === 'hero') successMsg = 'Hero background updated on homepage!';
    else if (websitePlacement === 'logo') successMsg = 'Official company logo updated across website!';
    else if (websitePlacement === 'property') successMsg = 'Property listing visual updated!';
    else if (websitePlacement === 'project') successMsg = 'Project development visual updated!';
    else if (websitePlacement === 'showcase') successMsg = 'Added to Property Showcase gallery (Homepage & Showcase page)!';

    notify(successMsg);
  };

  const confirmDeleteMedia = (media: MediaItem) => {
    const usages = storage.checkMediaUsage(media.url);
    if (usages.length > 0) {
      setDeleteWarningModal({ id: media.id, title: media.title, usages });
    } else {
      if (confirm(`Are you sure you want to delete "${media.title}"?`)) {
        storage.deleteMedia(media.id);
        notify('Media asset deleted.');
      }
    }
  };

  const executeDeleteWarning = () => {
    if (!deleteWarningModal) return;
    storage.deleteMedia(deleteWarningModal.id);
    setDeleteWarningModal(null);
    notify('Media asset permanently deleted and removed from references.');
  };

  // If not authenticated, render secure Admin Login page
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center p-4">
        <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl">
          <div className="text-center mb-8">
            <div className="bg-white/5 inline-block p-3 rounded-2xl border border-white/10 mb-4">
              <img
                src={settings.logoUrl}
                alt="ASCENT Properties Logo"
                className="h-12 w-auto object-contain mx-auto"
              />
            </div>
            <h2 className="text-2xl font-bold font-serif text-white">Administrator Portal</h2>
            <p className="text-xs text-slate-400 mt-1">
              Authorized personnel only. Enter management credentials.
            </p>
          </div>

          {loginError && (
            <div className="mb-5 p-3.5 rounded-xl bg-red-950/70 border border-red-800 text-red-200 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
              <span>{loginError}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Username
              </label>
              <input
                type="text"
                required
                value={usernameInput}
                onChange={(e) => setUsernameInput(e.target.value)}
                placeholder="ascent"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Password
              </label>
              <input
                type="password"
                required
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                placeholder="••••••••••••"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold tracking-wider uppercase transition shadow-md"
              >
                Sign In to Dashboard
              </button>
            </div>
          </form>

          {/* Quick credentials helper for admin */}
          <div className="mt-5 p-3.5 bg-slate-800/90 rounded-xl border border-slate-700/80 text-[11px] text-slate-300 space-y-1.5">
            <div className="font-semibold text-white flex items-center justify-between">
              <span>Default Administrator Credentials:</span>
              <button
                type="button"
                onClick={() => {
                  setUsernameInput('ascent');
                  setPasswordInput('TerraNova2026!Secure');
                }}
                className="text-[10px] text-blue-400 hover:text-blue-300 underline font-medium"
              >
                Auto-fill
              </button>
            </div>
            <div className="text-slate-400 font-mono text-[11px]">
              Username: <span className="text-blue-300 font-bold">ascent</span>
            </div>
            <div className="text-slate-400 font-mono text-[11px]">
              Password: <span className="text-blue-300 font-bold">TerraNova2026!Secure</span>
            </div>
          </div>

          <div className="mt-5 pt-4 border-t border-slate-800 text-center">
            <button
              onClick={onNavigateHome}
              className="text-xs text-slate-400 hover:text-white transition"
            >
              Return to Public Website
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Calculate Overview Stats
  const availableCount = properties.filter((p) => p.availability === 'Available').length;
  const newEnquiriesCount = enquiries.filter((e) => e.status === 'New').length;
  const pendingInspectionsCount = inspections.filter((i) => i.status === 'Pending').length;

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col">
      {/* Top Admin Header Bar */}
      <header className="bg-slate-900 text-white px-4 sm:px-8 py-3.5 border-b border-slate-800 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-4">
          <img
            src={settings.logoUrl}
            alt="ASCENT Logo"
            className="h-9 w-auto object-contain"
          />
          <div className="hidden sm:block">
            <div className="text-sm font-bold tracking-tight">Ascent Management Dashboard</div>
            <div className="text-[11px] text-slate-400">Content & Operations Portal</div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveTab('supabase')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition flex items-center gap-1.5 border ${
              supabaseConfig.status === 'connected'
                ? 'bg-emerald-950/80 border-emerald-500/50 text-emerald-300 hover:bg-emerald-900'
                : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-750 hover:text-white'
            }`}
            title="Manage Supabase Connection & Cloud Database"
          >
            <Database className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden sm:inline">
              {supabaseConfig.status === 'connected' ? 'Supabase Connected' : 'Connect Supabase'}
            </span>
            <span className="sm:hidden">Supabase</span>
            {supabaseConfig.status === 'connected' && (
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            )}
          </button>
          <button
            onClick={onNavigateHome}
            className="px-3.5 py-1.5 rounded-lg border border-slate-700 text-xs text-slate-300 hover:bg-slate-800 hover:text-white transition flex items-center gap-1.5"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">View Public Site</span>
            <span className="sm:hidden">Site</span>
          </button>
          <button
            onClick={handleLogout}
            className="px-3.5 py-1.5 rounded-lg bg-red-600/90 hover:bg-red-700 text-xs text-white font-semibold transition flex items-center gap-1.5"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Log Out</span>
          </button>
        </div>
      </header>

      {/* Notification Toast */}
      {notification && (
        <div
          className={`fixed top-16 right-4 sm:right-8 z-50 px-4 py-3 rounded-xl shadow-lg border text-xs font-semibold flex items-center gap-2 animate-in slide-in-from-top-2 duration-200 ${
            notification.type === 'success'
              ? 'bg-emerald-900 border-emerald-700 text-emerald-100'
              : 'bg-red-900 border-red-700 text-red-100'
          }`}
        >
          {notification.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          ) : (
            <AlertCircle className="w-4 h-4 text-red-400" />
          )}
          <span>{notification.message}</span>
        </div>
      )}

      {/* Main Admin Workspace with Sidebar Navigation */}
      <div className="flex-1 flex flex-col md:flex-row">
        {/* Navigation Sidebar */}
        <aside className="w-full md:w-64 bg-slate-900 border-r border-slate-800 p-4 space-y-1">
          <div className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold px-3 py-2">
            Navigation Menu
          </div>

          <button
            onClick={() => setActiveTab('overview')}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition ${
              activeTab === 'overview'
                ? 'bg-blue-600 text-white'
                : 'text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            <span>Dashboard Overview</span>
          </button>

          <button
            onClick={() => setActiveTab('properties')}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition ${
              activeTab === 'properties'
                ? 'bg-blue-600 text-white'
                : 'text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <div className="flex items-center gap-3">
              <Building className="w-4 h-4" />
              <span>Properties</span>
            </div>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">
              {properties.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('projects')}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition ${
              activeTab === 'projects'
                ? 'bg-blue-600 text-white'
                : 'text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <div className="flex items-center gap-3">
              <Briefcase className="w-4 h-4" />
              <span>Projects</span>
            </div>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">
              {projects.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('investments')}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition ${
              activeTab === 'investments'
                ? 'bg-blue-600 text-white'
                : 'text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <div className="flex items-center gap-3">
              <TrendingUp className="w-4 h-4" />
              <span>Investments</span>
            </div>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">
              {investments.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('services')}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition ${
              activeTab === 'services'
                ? 'bg-blue-600 text-white'
                : 'text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <Wrench className="w-4 h-4" />
            <span>Company Services</span>
          </button>

          <button
            onClick={() => setActiveTab('showcase')}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition ${
              activeTab === 'showcase'
                ? 'bg-blue-600 text-white'
                : 'text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <ImageIcon className="w-4 h-4" />
            <span>Property Showcase</span>
          </button>

          <button
            onClick={() => setActiveTab('media')}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition ${
              activeTab === 'media'
                ? 'bg-blue-600 text-white'
                : 'text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <div className="flex items-center gap-3">
              <FolderOpen className="w-4 h-4" />
              <span>Media Library</span>
            </div>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">
              {mediaList.length}
            </span>
          </button>

          <div className="pt-3 pb-1">
            <div className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold px-3 py-1">
              Client Operations
            </div>
          </div>

          <button
            onClick={() => setActiveTab('enquiries')}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition ${
              activeTab === 'enquiries'
                ? 'bg-blue-600 text-white'
                : 'text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <div className="flex items-center gap-3">
              <Mail className="w-4 h-4" />
              <span>Enquiries</span>
            </div>
            {newEnquiriesCount > 0 && (
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-500 text-white font-bold">
                {newEnquiriesCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('inspections')}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition ${
              activeTab === 'inspections'
                ? 'bg-blue-600 text-white'
                : 'text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <div className="flex items-center gap-3">
              <CalendarCheck className="w-4 h-4" />
              <span>Inspection Requests</span>
            </div>
            {pendingInspectionsCount > 0 && (
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500 text-slate-900 font-bold">
                {pendingInspectionsCount}
              </span>
            )}
          </button>

          <div className="pt-3 pb-1">
            <div className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold px-3 py-1">
              Configuration
            </div>
          </div>

          <button
            onClick={() => setActiveTab('supabase')}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition ${
              activeTab === 'supabase'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <div className="flex items-center gap-3">
              <Database className="w-4 h-4 text-emerald-400" />
              <span>Supabase Database</span>
            </div>
            <span
              className={`text-[10px] px-1.5 py-0.5 rounded font-mono font-bold ${
                supabaseConfig.status === 'connected'
                  ? 'bg-emerald-500/30 text-emerald-300 border border-emerald-500/40'
                  : 'bg-slate-800 text-slate-400'
              }`}
            >
              {supabaseConfig.status === 'connected' ? 'Live' : 'SQL'}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition ${
              activeTab === 'settings'
                ? 'bg-blue-600 text-white'
                : 'text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <Settings className="w-4 h-4" />
            <span>Website Settings</span>
          </button>

          <button
            onClick={() => setActiveTab('security')}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition ${
              activeTab === 'security'
                ? 'bg-blue-600 text-white'
                : 'text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <Lock className="w-4 h-4" />
            <span>Admin Security</span>
          </button>
        </aside>

        {/* Content Pane */}
        <main className="flex-1 p-4 sm:p-8 overflow-y-auto">
          {mustChangePassword && (
            <div className="mb-6 p-4 rounded-2xl bg-amber-50 border border-amber-300 text-amber-900 text-xs sm:text-sm flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
              <div>
                <strong className="block text-amber-950">Security Notice: First Login Password Change</strong>
                You are currently using the default initial password (<code className="bg-amber-100 px-1 py-0.5 rounded">TerraNova2026!Secure</code>). As mandated by security guidelines, please update your credentials below to protect this portal.
              </div>
            </div>
          )}

          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-8">
              <div>
                <h2 className="text-2xl font-bold font-serif text-slate-900">Dashboard Overview</h2>
                <p className="text-xs text-slate-500 mt-1">Live metrics from persistent storage</p>
              </div>

              {/* 7 Core KPI Cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
                  <div className="text-xs font-semibold text-slate-500 uppercase">Total Properties</div>
                  <div className="text-3xl font-extrabold text-slate-900 font-serif mt-1">{properties.length}</div>
                  <div className="text-[11px] text-blue-600 mt-1">{availableCount} Available</div>
                </div>

                <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
                  <div className="text-xs font-semibold text-slate-500 uppercase">Active Projects</div>
                  <div className="text-3xl font-extrabold text-slate-900 font-serif mt-1">{projects.length}</div>
                  <div className="text-[11px] text-slate-500 mt-1">Ongoing developments</div>
                </div>

                <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
                  <div className="text-xs font-semibold text-slate-500 uppercase">Investments</div>
                  <div className="text-3xl font-extrabold text-slate-900 font-serif mt-1">{investments.length}</div>
                  <div className="text-[11px] text-emerald-600 mt-1">Open schemes</div>
                </div>

                <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
                  <div className="text-xs font-semibold text-slate-500 uppercase">Media Library</div>
                  <div className="text-3xl font-extrabold text-slate-900 font-serif mt-1">{mediaList.length}</div>
                  <div className="text-[11px] text-slate-500 mt-1">Assets cataloged</div>
                </div>

                <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
                  <div className="text-xs font-semibold text-slate-500 uppercase">New Enquiries</div>
                  <div className="text-3xl font-extrabold text-blue-700 font-serif mt-1">{newEnquiriesCount}</div>
                  <div className="text-[11px] text-slate-500 mt-1">Total {enquiries.length} received</div>
                </div>

                <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
                  <div className="text-xs font-semibold text-slate-500 uppercase">Pending Inspections</div>
                  <div className="text-3xl font-extrabold text-amber-600 font-serif mt-1">{pendingInspectionsCount}</div>
                  <div className="text-[11px] text-slate-500 mt-1">Requires confirmation</div>
                </div>

                <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs col-span-2">
                  <div className="text-xs font-semibold text-slate-500 uppercase">Quick Actions</div>
                  <div className="flex flex-wrap gap-2 mt-3">
                    <button
                      onClick={() => {
                        setEditingProperty({ availability: 'Available', type: 'Residential', featured: true });
                        setPropertyModalOpen(true);
                      }}
                      className="px-3.5 py-1.5 rounded-lg bg-blue-700 text-white text-xs font-semibold hover:bg-blue-800 transition"
                    >
                      + Add Property
                    </button>
                    <button
                      onClick={() => {
                        setEditingProject({ status: 'Ongoing', progress: 50 });
                        setProjectModalOpen(true);
                      }}
                      className="px-3.5 py-1.5 rounded-lg bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800 transition"
                    >
                      + Add Project
                    </button>
                    <button
                      onClick={() => setMediaModalOpen(true)}
                      className="px-3.5 py-1.5 rounded-lg border border-slate-300 text-slate-700 text-xs font-semibold hover:bg-slate-50 transition"
                    >
                      Upload Media
                    </button>
                  </div>
                </div>
              </div>

              {/* Recent Administrative Activity Log */}
              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
                <h3 className="text-base font-bold text-slate-900 mb-4">Recent System & Administrative Activity</h3>
                <div className="space-y-3">
                  {activities.slice(0, 8).map((act) => (
                    <div key={act.id} className="flex items-start justify-between py-2 border-b border-slate-100 last:border-0 text-xs">
                      <div>
                        <span className="font-semibold text-slate-900 block">{act.action}</span>
                        <span className="text-slate-500">{act.details}</span>
                      </div>
                      <span className="text-slate-400 shrink-0 ml-4 font-mono">{act.timestamp}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: PROPERTIES MANAGEMENT */}
          {activeTab === 'properties' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold font-serif text-slate-900">Manage Properties</h2>
                  <p className="text-xs text-slate-500 mt-0.5">Add, edit, change images, and toggle availability</p>
                </div>
                <div className="flex items-center gap-2">
                  {supabaseConfig.status === 'connected' && (
                    <button
                      onClick={handleSyncToSupabase}
                      disabled={supabaseSyncing}
                      className="px-3.5 py-2.5 rounded-xl bg-emerald-50 border border-emerald-200 hover:bg-emerald-100 text-emerald-800 text-xs font-semibold flex items-center gap-1.5 transition"
                      title="Sync all properties to Supabase Cloud"
                    >
                      <UploadCloud className={`w-4 h-4 text-emerald-600 ${supabaseSyncing ? 'animate-bounce' : ''}`} />
                      <span>{supabaseSyncing ? 'Pushing...' : 'Push to Supabase'}</span>
                    </button>
                  )}
                  <button
                    onClick={() => {
                      setEditingProperty({ availability: 'Available', type: 'Residential', featured: true });
                      setPropertyModalOpen(true);
                    }}
                    className="px-4 py-2.5 rounded-xl bg-blue-700 hover:bg-blue-800 text-white text-xs font-semibold flex items-center gap-2 shadow-xs transition"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add New Property</span>
                  </button>
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-slate-700">
                    <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-semibold">
                      <tr>
                        <th className="p-4">Property</th>
                        <th className="p-4">Price</th>
                        <th className="p-4">Type</th>
                        <th className="p-4">Location</th>
                        <th className="p-4">Status</th>
                        <th className="p-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {properties.map((p) => (
                        <tr key={p.id} className="hover:bg-slate-50/70 transition">
                          <td className="p-4">
                            <div className="flex items-center gap-3">
                              <img src={p.coverImage} alt="" className="w-12 h-10 object-cover rounded-lg shrink-0 bg-slate-900" />
                              <div className="font-semibold text-slate-900 truncate max-w-xs">{p.title}</div>
                            </div>
                          </td>
                          <td className="p-4 font-bold text-blue-700">{p.formattedPrice}</td>
                          <td className="p-4">{p.type}</td>
                          <td className="p-4 truncate max-w-xs">{p.location}</td>
                          <td className="p-4">
                            <button
                              onClick={() => {
                                const nextStatus = p.availability === 'Available' ? 'Under Offer' : p.availability === 'Under Offer' ? 'Sold Out' : 'Available';
                                storage.saveProperty({ ...p, availability: nextStatus });
                                notify(`Status updated to ${nextStatus}`);
                              }}
                              className={`px-2 py-1 rounded font-semibold text-[11px] ${
                                p.availability === 'Available'
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : p.availability === 'Under Offer'
                                  ? 'bg-amber-100 text-amber-800'
                                  : 'bg-slate-200 text-slate-700'
                              }`}
                            >
                              {p.availability}
                            </button>
                          </td>
                          <td className="p-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => {
                                  setEditingProperty(p);
                                  setPropertyModalOpen(true);
                                }}
                                className="p-1.5 rounded-lg text-slate-600 hover:bg-slate-100 hover:text-blue-700"
                                title="Edit Property"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => {
                                  if (confirm(`Delete property listing "${p.title}"?`)) {
                                    storage.deleteProperty(p.id);
                                    notify('Property removed');
                                  }
                                }}
                                className="p-1.5 rounded-lg text-slate-400 hover:bg-red-50 hover:text-red-600"
                                title="Delete Property"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: PROJECTS MANAGEMENT */}
          {activeTab === 'projects' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold font-serif text-slate-900">Manage Development Projects</h2>
                  <p className="text-xs text-slate-500 mt-0.5">Control project status, progress bars, and unit releases</p>
                </div>
                <div className="flex items-center gap-2">
                  {supabaseConfig.status === 'connected' && (
                    <button
                      onClick={handleSyncToSupabase}
                      disabled={supabaseSyncing}
                      className="px-3.5 py-2.5 rounded-xl bg-emerald-50 border border-emerald-200 hover:bg-emerald-100 text-emerald-800 text-xs font-semibold flex items-center gap-1.5 transition"
                      title="Sync all projects to Supabase Cloud"
                    >
                      <UploadCloud className={`w-4 h-4 text-emerald-600 ${supabaseSyncing ? 'animate-bounce' : ''}`} />
                      <span>{supabaseSyncing ? 'Pushing...' : 'Push to Supabase'}</span>
                    </button>
                  )}
                  <button
                    onClick={() => {
                      setEditingProject({ status: 'Ongoing', progress: 50 });
                      setProjectModalOpen(true);
                    }}
                    className="px-4 py-2.5 rounded-xl bg-blue-700 hover:bg-blue-800 text-white text-xs font-semibold flex items-center gap-2 shadow-xs transition"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add New Project</span>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {projects.map((proj) => (
                  <div key={proj.id} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-3 mb-3">
                        <img src={proj.coverImage} alt="" className="w-14 h-12 object-cover rounded-lg shrink-0 bg-slate-900" />
                        <div>
                          <h3 className="text-sm font-bold text-slate-900">{proj.name}</h3>
                          <div className="text-[11px] text-blue-700 font-medium">{proj.type} · {proj.location}</div>
                        </div>
                      </div>
                      <p className="text-xs text-slate-600 line-clamp-2 mb-3">{proj.description}</p>
                      {proj.progress !== undefined && (
                        <div className="mb-3">
                          <div className="flex justify-between text-[11px] font-semibold text-slate-600 mb-1">
                            <span>Progress</span>
                            <span>{proj.progress}%</span>
                          </div>
                          <div className="w-full bg-slate-100 rounded-full h-2">
                            <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${proj.progress}%` }} />
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                      <span className="text-[11px] font-bold text-slate-700">{proj.status}</span>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            setEditingProject(proj);
                            setProjectModalOpen(true);
                          }}
                          className="px-3 py-1 rounded-lg border border-slate-300 text-xs font-medium hover:bg-slate-50"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => {
                            if (confirm(`Delete project "${proj.name}"?`)) {
                              storage.deleteProject(proj.id);
                              notify('Project removed');
                            }
                          }}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: INVESTMENTS MANAGEMENT */}
          {activeTab === 'investments' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold font-serif text-slate-900">Manage Investment Opportunities</h2>
                  <p className="text-xs text-slate-500 mt-0.5">Real estate syndication and structured capital programs</p>
                </div>
              </div>

              <div className="space-y-4">
                {investments.map((inv) => (
                  <div key={inv.id} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col md:flex-row items-start justify-between gap-4">
                    <div className="space-y-1 max-w-2xl">
                      <div className="text-[11px] font-semibold text-blue-700">{inv.location} · {inv.status}</div>
                      <h3 className="text-base font-bold text-slate-900">{inv.title}</h3>
                      <p className="text-xs text-slate-600 leading-relaxed">{inv.description}</p>
                      <div className="flex gap-4 pt-2 text-xs font-medium text-slate-700">
                        <span>Min Ticket: <strong>{inv.minInvestment}</strong></span>
                        <span>Tenure: <strong>{inv.investmentPeriod}</strong></span>
                        <span>Target Yield: <strong>{inv.projectedReturn}</strong></span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => {
                          const next = inv.status === 'Active' ? 'Closing Soon' : inv.status === 'Closing Soon' ? 'Fully Funded' : 'Active';
                          storage.saveInvestment({ ...inv, status: next });
                          notify(`Status updated to ${next}`);
                        }}
                        className="px-3 py-1.5 rounded-lg border border-slate-300 text-xs font-semibold hover:bg-slate-50"
                      >
                        Toggle Status ({inv.status})
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: SERVICES MANAGEMENT */}
          {activeTab === 'services' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold font-serif text-slate-900">Manage Company Services</h2>
                <p className="text-xs text-slate-500 mt-0.5">Update descriptions, features, and imagery for the 6 core services</p>
              </div>

              <div className="space-y-4">
                {services.map((srv) => (
                  <div key={srv.id} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                    <div className="md:col-span-3">
                      <img src={srv.image} alt={srv.title} className="w-full aspect-16/10 object-cover rounded-xl bg-slate-900" />
                    </div>
                    <div className="md:col-span-7 space-y-1">
                      <div className="text-[11px] font-semibold text-blue-700 uppercase">{srv.scope}</div>
                      <h3 className="text-base font-bold text-slate-900">{srv.title}</h3>
                      <p className="text-xs text-slate-600 leading-relaxed">{srv.shortDescription}</p>
                    </div>
                    <div className="md:col-span-2 text-right">
                      <button
                        onClick={() => {
                          const newDesc = prompt(`Update short description for ${srv.title}:`, srv.shortDescription);
                          if (newDesc !== null) {
                            storage.updateService(srv.id, { shortDescription: newDesc });
                            notify('Service updated!');
                          }
                        }}
                        className="px-3 py-1.5 rounded-lg bg-blue-700 hover:bg-blue-800 text-white text-xs font-semibold"
                      >
                        Edit Copy
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 6: PROPERTY SHOWCASE */}
          {activeTab === 'showcase' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold font-serif text-slate-900">Manage Property Showcase</h2>
                  <p className="text-xs text-slate-500 mt-0.5">Visual gallery items connected to media system</p>
                </div>
                <button
                  onClick={() => {
                    setShowcaseTitle('');
                    setShowcaseUrl('');
                    setShowcaseCategory('Properties');
                    setShowcaseDesc('High-resolution architectural photography');
                    setShowcaseLocation('Ascent Portfolio');
                    setShowcaseModalOpen(true);
                  }}
                  className="px-4 py-2.5 rounded-xl bg-blue-700 hover:bg-blue-800 text-white text-xs font-semibold flex items-center gap-2 shadow-xs cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Upload / Add Showcase Item</span>
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {showcase.map((item) => (
                  <div key={item.id} className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs relative group">
                    <img src={item.url} alt={item.title} className="w-full aspect-4/3 object-cover" />
                    <div className="p-3">
                      <div className="text-[11px] text-blue-700 font-medium">{item.category}</div>
                      <div className="text-xs font-bold text-slate-900 truncate">{item.title}</div>
                    </div>
                    <button
                      onClick={() => {
                        if (confirm(`Remove "${item.title}" from showcase?`)) {
                          storage.deleteShowcaseItem(item.id);
                          notify('Item deleted from showcase');
                        }
                      }}
                      className="absolute top-2 right-2 p-1.5 rounded bg-red-600 text-white opacity-0 group-hover:opacity-100 transition shadow"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 7: CENTRALIZED MEDIA LIBRARY */}
          {activeTab === 'media' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-bold font-serif text-slate-900">Centralized Media Library</h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Upload, replace, and govern images and videos across all public website sections
                  </p>
                </div>
                <button
                  onClick={() => setMediaModalOpen(true)}
                  className="px-4 py-2.5 rounded-xl bg-blue-700 hover:bg-blue-800 text-white text-xs font-semibold flex items-center gap-2 shadow-xs"
                >
                  <Upload className="w-4 h-4" />
                  <span>Upload Image or Video</span>
                </button>
              </div>

              {/* Media Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {mediaList.map((media) => {
                  const usages = storage.checkMediaUsage(media.url);
                  return (
                    <div key={media.id} className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs flex flex-col justify-between">
                      <div>
                        <div className="relative aspect-16/10 bg-slate-950">
                          {media.mediaType === 'video' ? (
                            <div className="w-full h-full flex items-center justify-center text-slate-400">
                              <video src={media.url} className="w-full h-full object-cover" />
                            </div>
                          ) : (
                            <img src={media.url} alt={media.title} className="w-full h-full object-cover" />
                          )}
                          <div className="absolute top-2 left-2 flex gap-1">
                            <span className="px-2 py-0.5 rounded bg-slate-900/80 text-white text-[10px] font-semibold">
                              {media.category}
                            </span>
                            {media.isPublished ? (
                              <span className="px-2 py-0.5 rounded bg-emerald-600 text-white text-[10px]">
                                Published
                              </span>
                            ) : (
                              <span className="px-2 py-0.5 rounded bg-amber-600 text-white text-[10px]">
                                Hidden
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="p-4 space-y-1.5">
                          <h4 className="text-sm font-bold text-slate-900 truncate">{media.title}</h4>
                          <p className="text-xs text-slate-500 line-clamp-2">{media.description}</p>
                          {usages.length > 0 && (
                            <div className="text-[11px] text-blue-700 pt-1">
                              <strong>Active in:</strong> {usages.slice(0, 2).join(', ')}
                              {usages.length > 2 && ` +${usages.length - 2} more`}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* One-click quick assignment to Website */}
                      <div className="px-4 py-2.5 bg-slate-50 border-t border-slate-100 flex flex-wrap items-center gap-1.5 text-[11px]">
                        <span className="text-slate-400 font-semibold mr-1">Apply to:</span>
                        <button
                          onClick={() => {
                            storage.assignMediaToHero(media.url);
                            notify('🌟 Set as Homepage Hero Background!');
                          }}
                          className="px-2 py-1 rounded bg-white border border-slate-200 text-slate-700 hover:text-blue-700 hover:border-blue-300 font-medium cursor-pointer"
                          title="Set as Homepage Hero Background"
                        >
                          Hero
                        </button>
                        <button
                          onClick={() => {
                            storage.assignMediaToLogo(media.url);
                            notify('🏷️ Set as Official Company Logo!');
                          }}
                          className="px-2 py-1 rounded bg-white border border-slate-200 text-slate-700 hover:text-blue-700 hover:border-blue-300 font-medium cursor-pointer"
                          title="Set as Company Logo"
                        >
                          Logo
                        </button>
                        <button
                          onClick={() => {
                            storage.saveShowcaseItem({
                              title: media.title,
                              url: media.url,
                              category: 'Properties',
                              mediaType: media.mediaType,
                              description: media.description || 'Ascent luxury visual'
                            });
                            notify('🖼️ Added to Property Showcase Gallery!');
                          }}
                          className="px-2 py-1 rounded bg-white border border-slate-200 text-slate-700 hover:text-blue-700 hover:border-blue-300 font-medium cursor-pointer"
                          title="Add to Property Showcase"
                        >
                          Showcase
                        </button>
                        <button
                          onClick={() => {
                            const propTitle = prompt(
                              `Assign "${media.title}" to which property?\nAvailable:\n${properties.map((p, i) => `${i + 1}. ${p.title}`).join('\n')}\nEnter property number (1-${properties.length}):`
                            );
                            if (propTitle) {
                              const idx = parseInt(propTitle, 10) - 1;
                              if (properties[idx]) {
                                storage.assignMediaToProperty(properties[idx].id, media.url);
                                notify(`🏠 Updated cover for "${properties[idx].title}"!`);
                              }
                            }
                          }}
                          className="px-2 py-1 rounded bg-white border border-slate-200 text-slate-700 hover:text-blue-700 hover:border-blue-300 font-medium cursor-pointer"
                          title="Assign to Property Listing"
                        >
                          Property
                        </button>
                        <button
                          onClick={() => {
                            const projNum = prompt(
                              `Assign "${media.title}" to which project?\nAvailable:\n${projects.map((p, i) => `${i + 1}. ${p.name}`).join('\n')}\nEnter project number (1-${projects.length}):`
                            );
                            if (projNum) {
                              const idx = parseInt(projNum, 10) - 1;
                              if (projects[idx]) {
                                storage.assignMediaToProject(projects[idx].id, media.url);
                                notify(`🏗️ Updated cover for "${projects[idx].name}"!`);
                              }
                            }
                          }}
                          className="px-2 py-1 rounded bg-white border border-slate-200 text-slate-700 hover:text-blue-700 hover:border-blue-300 font-medium cursor-pointer"
                          title="Assign to Project"
                        >
                          Project
                        </button>
                      </div>

                      <div className="p-4 pt-2 border-t border-slate-100 flex items-center justify-between">
                        <button
                          onClick={() => {
                            const newStatus = !media.isPublished;
                            storage.updateMedia(media.id, { isPublished: newStatus });
                            notify(`Media ${newStatus ? 'published' : 'hidden'}`);
                          }}
                          className="text-xs font-semibold text-slate-600 hover:text-blue-700"
                        >
                          {media.isPublished ? 'Hide from public' : 'Publish'}
                        </button>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => {
                              const newUrl = prompt(`Enter new image/video URL to replace "${media.title}":`, media.url);
                              if (newUrl && newUrl.trim()) {
                                storage.updateMedia(media.id, { url: newUrl.trim() });
                                notify('Media URL replaced!');
                              }
                            }}
                            className="p-1.5 rounded-lg text-slate-600 hover:bg-slate-100 hover:text-blue-700"
                            title="Replace Media"
                          >
                            <RefreshCw className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => confirmDeleteMedia(media)}
                            className="p-1.5 rounded-lg text-slate-400 hover:bg-red-50 hover:text-red-600"
                            title="Delete Media"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 8: ENQUIRIES */}
          {activeTab === 'enquiries' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold font-serif text-slate-900">Client Enquiries</h2>
                <p className="text-xs text-slate-500 mt-0.5">Submitted via public website contact forms</p>
              </div>

              <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
                {enquiries.length === 0 ? (
                  <div className="p-12 text-center text-xs text-slate-500">No enquiries received yet.</div>
                ) : (
                  <div className="divide-y divide-slate-100">
                    {enquiries.map((enq) => (
                      <div key={enq.id} className="p-5 flex flex-col md:flex-row justify-between gap-4">
                        <div className="space-y-1 max-w-2xl">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-slate-900 text-sm">{enq.fullName}</span>
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                enq.status === 'New'
                                  ? 'bg-blue-100 text-blue-800'
                                  : enq.status === 'Replied'
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : 'bg-slate-100 text-slate-600'
                              }`}
                            >
                              {enq.status}
                            </span>
                            <span className="text-[11px] text-slate-400 font-mono">
                              {new Date(enq.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                          <div className="text-xs text-slate-500 font-medium">
                            <a href={`mailto:${enq.email}`} className="text-blue-600 hover:underline">
                              {enq.email}
                            </a>{' '}
                            · <a href={`tel:${enq.phone}`}>{enq.phone}</a>
                          </div>
                          <div className="text-xs font-semibold text-slate-800 mt-2">{enq.subject}</div>
                          <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-lg border border-slate-100 mt-1">
                            {enq.message}
                          </p>
                        </div>

                        <div className="flex md:flex-col items-end justify-between gap-2 shrink-0">
                          <select
                            value={enq.status}
                            onChange={(e) => {
                              storage.updateEnquiryStatus(enq.id, e.target.value as any);
                              notify('Status updated');
                            }}
                            className="text-xs px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white"
                          >
                            <option value="New">Mark New</option>
                            <option value="Replied">Mark Replied</option>
                            <option value="Archived">Archive</option>
                          </select>
                          <button
                            onClick={() => {
                              if (confirm('Delete this enquiry?')) {
                                storage.deleteEnquiry(enq.id);
                                notify('Enquiry removed');
                              }
                            }}
                            className="text-xs text-red-600 hover:underline"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 9: INSPECTIONS */}
          {activeTab === 'inspections' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold font-serif text-slate-900">Inspection Requests</h2>
                <p className="text-xs text-slate-500 mt-0.5">Private physical and structural property viewing bookings</p>
              </div>

              <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
                {inspections.length === 0 ? (
                  <div className="p-12 text-center text-xs text-slate-500">No inspection requests recorded.</div>
                ) : (
                  <div className="divide-y divide-slate-100">
                    {inspections.map((insp) => (
                      <div key={insp.id} className="p-5 flex flex-col md:flex-row justify-between gap-4">
                        <div className="space-y-1.5 max-w-2xl">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-slate-900 text-sm">{insp.fullName}</span>
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                insp.status === 'Pending'
                                  ? 'bg-amber-100 text-amber-800'
                                  : insp.status === 'Confirmed'
                                  ? 'bg-blue-100 text-blue-800'
                                  : insp.status === 'Completed'
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : 'bg-red-100 text-red-800'
                              }`}
                            >
                              {insp.status}
                            </span>
                          </div>
                          <div className="text-xs font-semibold text-blue-700">
                            Property: {insp.propertyTitle}
                          </div>
                          <div className="text-xs text-slate-600">
                            <strong>Requested Schedule:</strong> {insp.preferredDate} at {insp.preferredTime} ({insp.numberOfVisitors} visitors)
                          </div>
                          <div className="text-xs text-slate-500">
                            Contact: <a href={`tel:${insp.phone}`} className="font-semibold text-slate-800">{insp.phone}</a> · {insp.email}
                          </div>
                          {insp.message && (
                            <p className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded-lg border border-slate-100 mt-1">
                              "{insp.message}"
                            </p>
                          )}
                        </div>

                        <div className="flex md:flex-col items-end justify-between gap-2 shrink-0">
                          <select
                            value={insp.status}
                            onChange={(e) => {
                              storage.updateInspectionStatus(insp.id, e.target.value as any);
                              notify('Inspection status updated');
                            }}
                            className="text-xs px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white"
                          >
                            <option value="Pending">Pending</option>
                            <option value="Confirmed">Confirmed</option>
                            <option value="Completed">Completed</option>
                            <option value="Cancelled">Cancelled</option>
                          </select>
                          <button
                            onClick={() => {
                              if (confirm('Delete inspection record?')) {
                                storage.deleteInspection(insp.id);
                                notify('Inspection removed');
                              }
                            }}
                            className="text-xs text-red-600 hover:underline"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 10: WEBSITE SETTINGS */}
          {activeTab === 'settings' && (
            <div className="space-y-6 max-w-4xl">
              <div>
                <h2 className="text-2xl font-bold font-serif text-slate-900">Website & Brand Settings</h2>
                <p className="text-xs text-slate-500 mt-0.5">Control homepage copy, official contacts, and brand URLs</p>
              </div>

              {/* Cloud Database Integration Banner */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-950 via-slate-900 to-slate-900 border border-emerald-900/60 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 shrink-0">
                    <Database className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-bold text-[11px] text-emerald-400 uppercase tracking-wider">Cloud Database Integration</div>
                    <div className="text-sm font-bold text-white">
                      {supabaseConfig.status === 'connected' ? 'Connected to Supabase PostgreSQL' : 'Connect to Supabase Cloud Database'}
                    </div>
                    <div className="text-xs text-slate-300">
                      Sync properties, showcase photos, and client enquiries to your cloud database.
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveTab('supabase')}
                  className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-xl shrink-0 transition shadow-xs"
                >
                  {supabaseConfig.status === 'connected' ? 'Manage Supabase \u2192' : 'Configure Supabase \u2192'}
                </button>
              </div>

              <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Company Legal Name</label>
                  <input
                    type="text"
                    value={settings.companyName}
                    onChange={(e) => setSettings({ ...settings, companyName: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {/* Official Logo */}
                  <div className="space-y-2 p-4 bg-slate-50 rounded-xl border border-slate-200">
                    <label className="block text-xs font-bold text-slate-800">Official Company Logo</label>
                    <div className="flex items-center gap-3">
                      <div className="w-16 h-16 rounded-lg bg-slate-900 border border-slate-300 p-1 flex items-center justify-center shrink-0 overflow-hidden">
                        <img src={settings.logoUrl} alt="Logo Preview" className="w-full h-full object-contain" />
                      </div>
                      <div className="flex-1 space-y-1.5">
                        <input
                          type="text"
                          value={settings.logoUrl}
                          onChange={(e) => setSettings({ ...settings, logoUrl: e.target.value })}
                          className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs font-mono"
                          placeholder="Logo URL"
                        />
                        <div className="flex items-center gap-2">
                          <label className="px-2.5 py-1 bg-white hover:bg-slate-100 border border-slate-300 rounded text-[11px] font-semibold text-slate-700 cursor-pointer flex items-center gap-1 shadow-2xs">
                            <Upload className="w-3 h-3 text-blue-600" />
                            <span>Upload File</span>
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={async (e) => {
                                const file = e.target.files?.[0];
                                if (!file) return;
                                const opt = await optimizeImageFile(file, 600, 600);
                                setSettings({ ...settings, logoUrl: opt.dataUrl });
                                storage.assignMediaToLogo(opt.dataUrl);
                                notify('Logo updated across website!');
                              }}
                            />
                          </label>
                          <button
                            type="button"
                            onClick={() => {
                              setMediaPickerTitle('Select Logo from Media Library');
                              setMediaPickerCallback(() => (url: string) => {
                                setSettings({ ...settings, logoUrl: url });
                                storage.assignMediaToLogo(url);
                                notify('Logo updated from Media Library!');
                              });
                              setMediaPickerOpen(true);
                            }}
                            className="px-2.5 py-1 bg-white hover:bg-slate-100 border border-slate-300 rounded text-[11px] font-semibold text-slate-700 cursor-pointer shadow-2xs"
                          >
                            Pick Media
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Hero Background */}
                  <div className="space-y-2 p-4 bg-slate-50 rounded-xl border border-slate-200">
                    <label className="block text-xs font-bold text-slate-800">Homepage Hero Background Visual</label>
                    <div className="flex items-center gap-3">
                      <div className="w-20 h-16 rounded-lg bg-slate-900 border border-slate-300 overflow-hidden shrink-0">
                        <img src={settings.heroBackground} alt="Hero Preview" className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 space-y-1.5">
                        <input
                          type="text"
                          value={settings.heroBackground}
                          onChange={(e) => setSettings({ ...settings, heroBackground: e.target.value })}
                          className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs font-mono"
                          placeholder="Hero Image URL"
                        />
                        <div className="flex items-center gap-2">
                          <label className="px-2.5 py-1 bg-white hover:bg-slate-100 border border-slate-300 rounded text-[11px] font-semibold text-slate-700 cursor-pointer flex items-center gap-1 shadow-2xs">
                            <Upload className="w-3 h-3 text-blue-600" />
                            <span>Upload File</span>
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={async (e) => {
                                const file = e.target.files?.[0];
                                if (!file) return;
                                const opt = await optimizeImageFile(file, 1920, 1080);
                                setSettings({ ...settings, heroBackground: opt.dataUrl });
                                storage.assignMediaToHero(opt.dataUrl);
                                notify('Hero background visual updated on website!');
                              }}
                            />
                          </label>
                          <button
                            type="button"
                            onClick={() => {
                              setMediaPickerTitle('Select Hero Background from Media Library');
                              setMediaPickerCallback(() => (url: string) => {
                                setSettings({ ...settings, heroBackground: url });
                                storage.assignMediaToHero(url);
                                notify('Hero background updated from Media Library!');
                              });
                              setMediaPickerOpen(true);
                            }}
                            className="px-2.5 py-1 bg-white hover:bg-slate-100 border border-slate-300 rounded text-[11px] font-semibold text-slate-700 cursor-pointer shadow-2xs"
                          >
                            Pick Media
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Hero Main Headline</label>
                  <input
                    type="text"
                    value={settings.heroHeadline}
                    onChange={(e) => setSettings({ ...settings, heroHeadline: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Hero Supporting Text</label>
                  <textarea
                    rows={2}
                    value={settings.heroSupportingText}
                    onChange={(e) => setSettings({ ...settings, heroSupportingText: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Official Email Address</label>
                    <input
                      type="email"
                      value={settings.email}
                      onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Telephone Number</label>
                    <input
                      type="text"
                      value={settings.phone}
                      onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      WhatsApp Hotline Number
                    </label>
                    <input
                      type="text"
                      value={settings.whatsapp || '+2348033402265'}
                      onChange={(e) => setSettings({ ...settings, whatsapp: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm font-semibold text-emerald-700"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Office Address</label>
                    <input
                      type="text"
                      value={settings.officeAddress}
                      onChange={(e) => setSettings({ ...settings, officeAddress: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Business Hours</label>
                    <input
                      type="text"
                      value={settings.businessHours}
                      onChange={(e) => setSettings({ ...settings, businessHours: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm"
                    />
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 flex justify-end">
                  <button
                    onClick={() => {
                      storage.updateSettings(settings);
                      notify('Settings saved to database!');
                    }}
                    className="px-6 py-2.5 bg-blue-700 hover:bg-blue-800 text-white rounded-xl text-xs font-semibold shadow-xs"
                  >
                    Save Website Settings
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 11: ADMIN SECURITY */}
          {activeTab === 'security' && (
            <div className="space-y-6 max-w-xl">
              <div>
                <h2 className="text-2xl font-bold font-serif text-slate-900">Administrator Security</h2>
                <p className="text-xs text-slate-500 mt-0.5">Manage credentials and authentication access</p>
              </div>

              <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs">
                {passwordError && (
                  <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg text-xs flex items-center gap-2 border border-red-200">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{passwordError}</span>
                  </div>
                )}

                <form onSubmit={handleUpdateCredentials} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Username</label>
                    <input
                      type="text"
                      required
                      value={newUsername}
                      onChange={(e) => setNewUsername(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">New Password</label>
                    <input
                      type="password"
                      required
                      placeholder="Minimum 8 characters"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Confirm New Password</label>
                    <input
                      type="password"
                      required
                      placeholder="Repeat new password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm"
                    />
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      className="w-full py-3 bg-blue-700 hover:bg-blue-800 text-white rounded-xl text-xs font-semibold tracking-wide"
                    >
                      UPDATE CREDENTIALS
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* TAB 12: SUPABASE DATABASE INTEGRATION */}
          {activeTab === 'supabase' && (
            <div className="space-y-6 max-w-5xl">
              {/* Header Banner */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
                <div className="flex items-start gap-3.5">
                  <div className="p-2.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-700 shrink-0">
                    <Database className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2.5">
                      <h2 className="text-2xl font-bold font-serif text-slate-900">Supabase Cloud Database</h2>
                      {supabaseConfig.status === 'connected' ? (
                        <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                          Connected & Verified
                        </span>
                      ) : (
                        <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-slate-100 text-slate-700 border border-slate-300">
                          {supabaseConfig.status === 'error' ? 'Connection Attention' : 'Setup Required'}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 mt-1">
                      Connect Ascent Properties to your Supabase PostgreSQL cloud backend for multi-device persistence, real-time sync, and remote management.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCopySql}
                    className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold flex items-center gap-1.5 transition shadow-xs"
                  >
                    {sqlCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{sqlCopied ? 'Copied SQL!' : 'Copy SQL Code'}</span>
                  </button>
                  <a
                    href="https://supabase.com/dashboard"
                    target="_blank"
                    rel="noreferrer"
                    className="px-3.5 py-2 rounded-xl bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition shadow-2xs"
                  >
                    <span>Supabase Dashboard</span>
                    <ExternalLink className="w-3 h-3 text-slate-400" />
                  </a>
                </div>
              </div>

              {/* Sub-Navigation Tabs */}
              <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-2">
                <button
                  onClick={() => setActiveSupabaseSubTab('credentials')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
                    activeSupabaseSubTab === 'credentials'
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                  }`}
                >
                  <Key className="w-3.5 h-3.5" />
                  <span>Credentials & Connection</span>
                </button>

                <button
                  onClick={() => setActiveSupabaseSubTab('sql')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
                    activeSupabaseSubTab === 'sql'
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                  }`}
                >
                  <FileCode className="w-3.5 h-3.5" />
                  <span>Complete SQL Code</span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800 font-mono">10 Tables</span>
                </button>

                <button
                  onClick={() => setActiveSupabaseSubTab('sync')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
                    activeSupabaseSubTab === 'sync'
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                  }`}
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Cloud Sync & Migration</span>
                </button>

                <button
                  onClick={() => setActiveSupabaseSubTab('guide')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
                    activeSupabaseSubTab === 'guide'
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                  }`}
                >
                  <Info className="w-3.5 h-3.5" />
                  <span>Setup Guide (4 Steps)</span>
                </button>
              </div>

              {/* SUB-TAB 1: CREDENTIALS & CONNECTION */}
              {activeSupabaseSubTab === 'credentials' && (
                <div className="space-y-6">
                  {/* Status Banner */}
                  <div
                    className={`p-4 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                      supabaseConfig.status === 'connected'
                        ? 'bg-emerald-50/70 border-emerald-300 text-emerald-950'
                        : supabaseConfig.status === 'error'
                        ? 'bg-red-50/80 border-red-300 text-red-950'
                        : 'bg-slate-50 border-slate-200 text-slate-800'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                          supabaseConfig.status === 'connected'
                            ? 'bg-emerald-600 text-white'
                            : supabaseConfig.status === 'error'
                            ? 'bg-red-600 text-white'
                            : 'bg-slate-300 text-slate-700'
                        }`}
                      >
                        <Database className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="text-xs font-bold uppercase tracking-wider text-slate-500">Database Status</div>
                        <div className="text-sm font-bold">
                          {supabaseConfig.status === 'connected'
                            ? `Active: Connected to ${supabaseConfig.url}`
                            : supabaseConfig.status === 'error'
                            ? 'Connection Error / Tables Need Setup'
                            : 'Supabase Not Yet Configured'}
                        </div>
                        {supabaseConfig.lastTested && (
                          <div className="text-[11px] text-slate-500 mt-0.5">
                            Last verified: {supabaseConfig.lastTested}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={handleTestSupabase}
                        disabled={supabaseTesting || !supabaseUrlInput.trim() || !supabaseAnonKeyInput.trim()}
                        className="px-4 py-2 bg-blue-700 hover:bg-blue-800 disabled:opacity-50 text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 transition shadow-xs"
                      >
                        <RefreshCw className={`w-3.5 h-3.5 ${supabaseTesting ? 'animate-spin' : ''}`} />
                        <span>{supabaseTesting ? 'Testing...' : 'Test Connection'}</span>
                      </button>
                      {supabaseConfig.url && (
                        <button
                          onClick={handleClearSupabase}
                          className="px-3 py-2 bg-white hover:bg-red-50 border border-slate-300 hover:border-red-300 text-slate-600 hover:text-red-700 text-xs font-semibold rounded-xl transition"
                        >
                          Disconnect
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Credentials Form Box */}
                  <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-5">
                    <div>
                      <h3 className="text-base font-bold text-slate-900">Supabase API Keys & Configuration</h3>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Copy these from your{' '}
                        <a
                          href="https://supabase.com/dashboard/project/_/settings/api"
                          target="_blank"
                          rel="noreferrer"
                          className="text-blue-600 font-semibold underline"
                        >
                          Supabase Project Settings &rarr; API
                        </a>{' '}
                        tab.
                      </p>
                    </div>

                    <div className="space-y-4">
                      {/* URL Input */}
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                            <Globe className="w-3.5 h-3.5 text-blue-600" />
                            <span>Supabase Project URL *</span>
                          </label>
                          <span className="text-[11px] text-slate-400 font-mono">e.g. https://xyzcompany.supabase.co</span>
                        </div>
                        <input
                          type="text"
                          value={supabaseUrlInput}
                          onChange={(e) => setSupabaseUrlInput(e.target.value)}
                          placeholder="https://your-project-id.supabase.co"
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-mono focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                        />
                      </div>

                      {/* Anon Key Input */}
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                            <Key className="w-3.5 h-3.5 text-emerald-600" />
                            <span>Supabase Anon / Public Key *</span>
                          </label>
                          <button
                            type="button"
                            onClick={() => setSupabaseShowAnonKey(!supabaseShowAnonKey)}
                            className="text-[11px] text-blue-600 hover:text-blue-700 flex items-center gap-1 font-semibold"
                          >
                            {supabaseShowAnonKey ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                            <span>{supabaseShowAnonKey ? 'Hide Key' : 'Reveal Key'}</span>
                          </button>
                        </div>
                        <input
                          type={supabaseShowAnonKey ? 'text' : 'password'}
                          value={supabaseAnonKeyInput}
                          onChange={(e) => setSupabaseAnonKeyInput(e.target.value)}
                          placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-mono focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                        />
                        <p className="text-[11px] text-slate-500 mt-1">
                          Safe for client use. Governed by Postgres Row Level Security (RLS) policies created by the SQL script.
                        </p>
                      </div>

                      {/* Optional Service Role Key */}
                      <div className="pt-2">
                        <div className="flex items-center justify-between mb-1">
                          <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                            <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />
                            <span>Service Role Key (Optional / Administrative)</span>
                          </label>
                          <button
                            type="button"
                            onClick={() => setSupabaseShowServiceKey(!supabaseShowServiceKey)}
                            className="text-[11px] text-slate-500 hover:text-slate-700 flex items-center gap-1"
                          >
                            {supabaseShowServiceKey ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                            <span>{supabaseShowServiceKey ? 'Hide' : 'Show'}</span>
                          </button>
                        </div>
                        <input
                          type={supabaseShowServiceKey ? 'text' : 'password'}
                          value={supabaseServiceRoleInput}
                          onChange={(e) => setSupabaseServiceRoleInput(e.target.value)}
                          placeholder="Optional service_role secret key"
                          className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs font-mono bg-slate-50"
                        />
                        <p className="text-[11px] text-slate-400 mt-1">
                          Only needed if you require backend administrative bypass. Never expose publicly.
                        </p>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
                      <div className="text-xs text-slate-500">
                        Changes will activate immediately across the entire Ascent web application.
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={handleTestSupabase}
                          disabled={supabaseTesting || !supabaseUrlInput.trim() || !supabaseAnonKeyInput.trim()}
                          className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold rounded-xl flex items-center gap-1.5 transition"
                        >
                          <RefreshCw className={`w-3.5 h-3.5 ${supabaseTesting ? 'animate-spin' : ''}`} />
                          <span>Test Endpoint</span>
                        </button>
                        <button
                          onClick={handleSaveSupabaseCredentials}
                          className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 transition shadow-xs"
                        >
                          <Check className="w-4 h-4" />
                          <span>Save & Connect</span>
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Test Feedback Result */}
                  {supabaseTestResult && (
                    <div
                      className={`p-5 rounded-2xl border text-xs shadow-xs ${
                        supabaseTestResult.success
                          ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
                          : 'bg-amber-50 border-amber-300 text-amber-950'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        {supabaseTestResult.success ? (
                          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                        ) : (
                          <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                        )}
                        <div className="space-y-3 flex-1">
                          <div>
                            <strong className="block font-bold text-sm">
                              {supabaseTestResult.success ? 'Supabase Connection Verified!' : (supabaseTestResult.message || 'Connected to Supabase — Action Required')}
                            </strong>
                            <p className="mt-0.5 text-slate-700">
                              {supabaseTestResult.message}
                            </p>
                            {supabaseTestResult.details && (
                              <div className="mt-2 p-3 bg-slate-900 text-slate-100 rounded-xl border border-slate-800 text-[11px] font-mono space-y-1.5 shadow-sm">
                                <div className="flex items-center justify-between text-slate-400 border-b border-slate-800 pb-1">
                                  <span className="font-bold text-amber-400">Supabase API Response:</span>
                                  {supabaseTestResult.rawProbe && (
                                    <span className={supabaseTestResult.rawProbe.status === 200 ? 'text-emerald-400 font-bold' : 'text-amber-400 font-bold'}>
                                      HTTP {supabaseTestResult.rawProbe.status} {supabaseTestResult.rawProbe.statusText}
                                    </span>
                                  )}
                                </div>
                                <div className="break-all text-slate-200">
                                  {supabaseTestResult.details}
                                </div>
                                {supabaseTestResult.rawProbe?.body && (
                                  <div className="text-[10px] text-slate-400 pt-1 border-t border-slate-800 break-all">
                                    Payload: <code className="text-slate-300">{supabaseTestResult.rawProbe.body.slice(0, 300)}</code>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>

                          {supabaseTestResult.accessibleTables && supabaseTestResult.accessibleTables.length > 0 && (
                            <div className="pt-1">
                              <span className="font-semibold text-emerald-800">Verified Relational Tables:</span>{' '}
                              <span className="font-mono text-[11px] bg-emerald-100 px-1.5 py-0.5 rounded">
                                {supabaseTestResult.accessibleTables.join(', ')}
                              </span>
                            </div>
                          )}

                          {!supabaseTestResult.success && (
                            <div className="p-4 bg-white rounded-xl border border-amber-200/80 shadow-2xs space-y-3.5">
                              {/* OPTION A: Add Table Directly via Supabase Table Editor UI */}
                              <div className="p-3.5 bg-sky-50 border border-sky-300 rounded-xl space-y-2 text-xs">
                                <div className="flex items-center justify-between">
                                  <strong className="text-sky-950 font-bold flex items-center gap-1.5">
                                    <Sparkles className="w-4 h-4 text-sky-600" />
                                    <span>Option 1: Add Table Directly in Supabase UI (No SQL needed!)</span>
                                  </strong>
                                  <span className="text-[10px] font-semibold bg-sky-200/70 text-sky-900 px-2 py-0.5 rounded-full">
                                    100% Reliable
                                  </span>
                                </div>
                                <p className="text-slate-700 text-[11px] leading-relaxed">
                                  Yes, you can easily add the table directly in the Supabase Table Editor UI:
                                </p>
                                <ol className="list-decimal list-inside space-y-1 text-[11px] text-slate-700 bg-white p-2.5 rounded-lg border border-sky-200">
                                  <li>Click <strong>&ldquo;Open Supabase Table Editor&rdquo;</strong> below.</li>
                                  <li>Click <strong>&ldquo;+ New table&rdquo;</strong> and name it: <code className="bg-slate-100 text-sky-800 px-1 py-0.5 rounded font-bold font-mono">site_settings</code>.</li>
                                  <li>Check <strong>&ldquo;Enable Row Level Security (RLS)&rdquo;</strong> and <strong>&ldquo;Realtime&rdquo;</strong>.</li>
                                  <li>Columns needed: <code className="text-slate-800">id</code> (type: <strong>text</strong>, default: <code>'default'</code>, Primary Key), <code className="text-slate-800">company_name</code> (text), <code className="text-slate-800">email</code> (text), <code className="text-slate-800">phone</code> (text), <code className="text-slate-800">whatsapp</code> (text).</li>
                                  <li>Click <strong>Save</strong>, then return here and click <strong>&ldquo;Re-test Connection&rdquo;</strong>!</li>
                                </ol>
                                <div className="flex flex-wrap items-center gap-2 pt-1">
                                  <a
                                    href={supabaseTableEditorUrl}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="px-3.5 py-2 bg-sky-700 hover:bg-sky-800 text-white rounded-lg font-bold text-xs flex items-center gap-1.5 transition shadow-2xs"
                                  >
                                    <span>Open Supabase Table Editor</span>
                                    <ExternalLink className="w-3.5 h-3.5 text-sky-200" />
                                  </a>
                                  <button
                                    type="button"
                                    onClick={handleTestSupabase}
                                    disabled={supabaseTesting}
                                    className="px-3.5 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-lg font-bold text-xs flex items-center gap-1.5 transition shadow-2xs"
                                  >
                                    <RefreshCw className={`w-3.5 h-3.5 ${supabaseTesting ? 'animate-spin' : ''}`} />
                                    <span>Re-test Connection</span>
                                  </button>
                                </div>
                              </div>

                              {/* OPTION B: PostgREST Schema Cache Frozen - Restart Project */}
                              <div className="p-3.5 bg-amber-50/90 border border-amber-300 rounded-xl space-y-2 text-xs">
                                <div className="flex items-center justify-between">
                                  <strong className="text-amber-950 font-bold flex items-center gap-1.5">
                                    <RefreshCw className="w-4 h-4 text-amber-700" />
                                    <span>Option 2: Fix HTTP 404 / PGRST205 (PostgREST Cache Frozen)</span>
                                  </strong>
                                </div>
                                <p className="text-slate-700 text-[11px] leading-relaxed">
                                  Why this happens: When tables are created in the SQL Editor, Supabase&rsquo;s PostgREST API daemon can get out of sync until a fast reboot is triggered.
                                </p>
                                <div className="flex flex-wrap items-center gap-2 pt-1">
                                  <a
                                    href={supabaseRestartUrl}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="px-3.5 py-2 bg-amber-700 hover:bg-amber-800 text-white rounded-lg font-bold text-xs flex items-center gap-1.5 transition shadow-2xs"
                                  >
                                    <span>Open Project Settings &rarr; Restart Project</span>
                                    <ExternalLink className="w-3.5 h-3.5 text-amber-200" />
                                  </a>
                                  <span className="text-[11px] text-slate-500 self-center">
                                    Takes ~15 seconds, and forces Supabase API to index all tables.
                                  </span>
                                </div>
                              </div>

                              {/* OPTION C: QUICK FIX SQL */}
                              <div className="p-3.5 bg-emerald-50/90 border border-emerald-300 rounded-xl space-y-2 text-xs">
                                <div className="flex items-center justify-between">
                                  <strong className="text-emerald-950 font-bold flex items-center gap-1.5">
                                    <Sparkles className="w-4 h-4 text-emerald-600" />
                                    <span>Option 3: Run 5-Sec Permissions SQL (Grants Anon Permissions)</span>
                                  </strong>
                                </div>
                                <p className="text-slate-700 text-[11px] leading-relaxed">
                                  If your tables are in Postgres, running this in the SQL Editor grants explicit SELECT permissions to the public anon role and notifies PostgREST:
                                </p>
                                <div className="flex flex-wrap items-center gap-2 pt-1">
                                  <button
                                    type="button"
                                    onClick={handleCopyQuickFix}
                                    className="px-3.5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg font-bold text-xs flex items-center gap-1.5 transition shadow-2xs"
                                  >
                                    {quickFixCopied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                                    <span>{quickFixCopied ? 'Quick Fix SQL Copied!' : 'Copy 5-Sec Quick Fix SQL'}</span>
                                  </button>
                                  <a
                                    href={supabaseSqlEditorUrl}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="px-3 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg font-bold text-xs flex items-center gap-1.5 transition shadow-2xs"
                                  >
                                    <span>Paste & Run in Supabase SQL</span>
                                    <ExternalLink className="w-3 h-3 text-slate-400" />
                                  </a>
                                </div>
                              </div>

                              {/* DIAGNOSTIC CHECK QUERY */}
                              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-2 text-xs">
                                <div className="font-bold text-slate-800 flex items-center justify-between">
                                  <span>Diagnostic: Verify which tables exist in PostgreSQL</span>
                                </div>
                                <p className="text-[11px] text-slate-600 leading-relaxed">
                                  Run this 1-line query in Supabase SQL Editor. If it returns 5 rows, tables exist in the database!
                                </p>
                                <div className="flex flex-wrap items-center gap-2">
                                  <button
                                    type="button"
                                    onClick={handleCopyVerifySql}
                                    className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg font-bold text-xs flex items-center gap-1.5 transition"
                                  >
                                    {verifySqlCopied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                                    <span>{verifySqlCopied ? 'Check Query Copied!' : 'Copy Table Check Query'}</span>
                                  </button>
                                  <button
                                    type="button"
                                    onClick={handleCopySingleTableSql}
                                    className="px-3 py-1.5 bg-blue-700 hover:bg-blue-800 text-white rounded-lg font-bold text-xs flex items-center gap-1.5 transition"
                                  >
                                    {singleTableSqlCopied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                                    <span>{singleTableSqlCopied ? 'site_settings SQL Copied!' : 'Copy site_settings SQL'}</span>
                                  </button>
                                </div>
                              </div>

                              <div className="font-bold text-xs text-slate-900 flex items-center justify-between border-t border-slate-100 pt-2">
                                <span>Or execute complete migration script (10 tables):</span>
                                {supabaseProjectRef && (
                                  <span className="text-[11px] font-mono text-slate-500">
                                    Project: <span className="font-bold text-slate-800">{supabaseProjectRef}</span>
                                  </span>
                                )}
                              </div>
                              <ol className="list-decimal list-inside space-y-1.5 text-xs text-slate-600">
                                <li>
                                  In Supabase, click <strong className="text-slate-800">&ldquo;+ New query&rdquo;</strong> so your SQL editor tab is completely blank.
                                </li>
                                <li>
                                  Click <strong className="text-slate-800">&ldquo;1. Copy SQL Code&rdquo;</strong> below (or download the .sql file).
                                </li>
                                <li>
                                  Paste into the blank Supabase editor and click the green <strong className="text-emerald-700">&ldquo;Run&rdquo;</strong> button.
                                </li>
                                <li>
                                  Return here and click <strong className="text-blue-700">&ldquo;3. Re-test Connection&rdquo;</strong>!
                                </li>
                              </ol>

                              {/* Error 42601 Troubleshooting Note */}
                              <div className="p-3 bg-amber-100/70 border border-amber-300/80 rounded-xl text-[11px] text-amber-950 space-y-1">
                                <strong className="block font-bold text-amber-900">
                                  Encountered &ldquo;ERROR: 42601 syntax error at or near company_name LINE 415&rdquo;?
                                </strong>
                                <p className="text-slate-700 leading-relaxed">
                                  This happens when the query editor was not empty or chat explanation text was accidentally pasted with the SQL. Make sure to click <strong>&ldquo;+ New query&rdquo;</strong> in Supabase to start on a fresh, completely blank page, then click <strong>&ldquo;1. Copy SQL Code&rdquo;</strong> below which contains 100% pure SQL.
                                </p>
                              </div>

                              <div className="flex flex-wrap items-center gap-2 pt-1">
                                <button
                                  type="button"
                                  onClick={handleCopySql}
                                  className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs flex items-center gap-1.5 transition shadow-2xs"
                                >
                                  {sqlCopied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                                  <span>{sqlCopied ? 'SQL Copied!' : '1. Copy SQL Code'}</span>
                                </button>
                                <button
                                  type="button"
                                  onClick={handleDownloadSql}
                                  className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-bold text-xs flex items-center gap-1.5 transition shadow-2xs"
                                >
                                  <DownloadCloud className="w-3.5 h-3.5" />
                                  <span>Download .sql</span>
                                </button>
                                <a
                                  href={supabaseSqlEditorUrl}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="px-3.5 py-2 bg-blue-900 hover:bg-blue-800 text-white rounded-xl font-bold text-xs flex items-center gap-1.5 transition shadow-2xs"
                                >
                                  <span>2. Open Supabase SQL Editor</span>
                                  <ExternalLink className="w-3.5 h-3.5 text-slate-300" />
                                </a>
                                <button
                                  type="button"
                                  onClick={handleTestSupabase}
                                  disabled={supabaseTesting}
                                  className="px-3.5 py-2 bg-blue-700 hover:bg-blue-800 disabled:opacity-50 text-white rounded-xl font-bold text-xs flex items-center gap-1.5 transition shadow-2xs"
                                >
                                  <RefreshCw className={`w-3.5 h-3.5 ${supabaseTesting ? 'animate-spin' : ''}`} />
                                  <span>3. Re-test Connection</span>
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setActiveSupabaseSubTab('sql')}
                                  className="px-3 py-2 text-slate-600 hover:text-slate-900 text-xs font-semibold underline"
                                >
                                  View SQL code preview &rarr;
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* SUB-TAB 2: COMPLETE SQL CODE */}
              {activeSupabaseSubTab === 'sql' && (
                <div className="space-y-4">
                  <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <h3 className="text-base font-bold text-slate-900">Complete PostgreSQL Database Schema</h3>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Execute this code in your Supabase SQL Editor. It sets up all 10 tables, indexes, RLS policies, and inserts all Ascent initial data.
                      </p>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        onClick={handleCopyQuickFix}
                        className="px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-xs transition"
                      >
                        {quickFixCopied ? <Check className="w-4 h-4 text-emerald-200" /> : <Sparkles className="w-4 h-4" />}
                        <span>{quickFixCopied ? 'Quick Fix Copied!' : 'Copy 5-Sec Quick Fix'}</span>
                      </button>
                      <button
                        onClick={handleCopySql}
                        className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-xs transition"
                      >
                        {sqlCopied ? <Check className="w-4 h-4 text-emerald-200" /> : <Copy className="w-4 h-4" />}
                        <span>{sqlCopied ? 'Copied to Clipboard!' : 'Copy Full SQL Code'}</span>
                      </button>
                      <button
                        onClick={handleDownloadSql}
                        className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-xs transition"
                      >
                        <DownloadCloud className="w-4 h-4" />
                        <span>Download .sql File</span>
                      </button>
                      <a
                        href="https://supabase.com/dashboard/project/_/sql/new"
                        target="_blank"
                        rel="noreferrer"
                        className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl flex items-center gap-1.5 transition"
                      >
                        <span>Open Supabase SQL Editor</span>
                        <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
                      </a>
                    </div>
                  </div>

                  {/* Important Usage Tip to avoid error 42601 */}
                  <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 text-xs text-amber-950 flex items-start gap-3 shadow-2xs">
                    <Info className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
                    <div className="space-y-1">
                      <strong className="block font-bold text-amber-900 text-sm">
                        Important: Ensure your Supabase query editor is completely empty
                      </strong>
                      <p className="text-slate-700 leading-relaxed">
                        If you encountered <em>&ldquo;ERROR: 42601 syntax error at or near company_name LINE 415&rdquo;</em>, your editor had previous text or chat instructions pasted into it.
                        In Supabase, click <strong>&ldquo;+ New query&rdquo;</strong> to start a blank 0-line tab, click <strong>&ldquo;Copy SQL Code&rdquo;</strong> or <strong>&ldquo;Download .sql File&rdquo;</strong> above, paste/upload, and click <strong>&ldquo;Run&rdquo;</strong>.
                      </p>
                    </div>
                  </div>

                  {/* SQL Code Viewer */}
                  <div className="bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden shadow-lg">
                    <div className="bg-slate-900/90 px-4 py-2.5 border-b border-slate-800 flex items-center justify-between text-xs text-slate-400 font-mono">
                      <div className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full bg-red-500/80 inline-block"></span>
                        <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block"></span>
                        <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block"></span>
                        <span className="ml-2 font-bold text-slate-200">ascent_supabase_schema.sql</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span>PostgreSQL 15+</span>
                        <span>10 Tables</span>
                        <button
                          onClick={handleCopySql}
                          className="text-emerald-400 hover:text-emerald-300 font-bold underline text-[11px]"
                        >
                          {sqlCopied ? 'Copied!' : 'Copy Code'}
                        </button>
                      </div>
                    </div>
                    <pre className="p-4 sm:p-6 text-xs text-emerald-400 font-mono overflow-x-auto max-h-[580px] leading-relaxed selection:bg-emerald-900 selection:text-white">
                      <code>{COMPLETE_SUPABASE_SQL}</code>
                    </pre>
                  </div>
                </div>
              )}

              {/* SUB-TAB 3: CLOUD SYNC & MIGRATION */}
              {activeSupabaseSubTab === 'sync' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Push to Supabase */}
                    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col justify-between space-y-4">
                      <div className="space-y-2">
                        <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center justify-center">
                          <UploadCloud className="w-5 h-5" />
                        </div>
                        <h3 className="text-base font-bold text-slate-900">Push Local Data to Supabase</h3>
                        <p className="text-xs text-slate-500 leading-relaxed">
                          Migrate all current properties, projects, investment opportunities, services, showcase photos, and site settings to your Supabase PostgreSQL cloud tables.
                        </p>
                      </div>

                      <div className="pt-2">
                        <button
                          onClick={handleSyncToSupabase}
                          disabled={supabaseSyncing}
                          className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition shadow-xs"
                        >
                          <UploadCloud className={`w-4 h-4 ${supabaseSyncing ? 'animate-bounce' : ''}`} />
                          <span>{supabaseSyncing ? 'Synchronizing Data...' : 'Push Local Data to Supabase'}</span>
                        </button>
                      </div>
                    </div>

                    {/* Pull from Supabase */}
                    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col justify-between space-y-4">
                      <div className="space-y-2">
                        <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-200 text-blue-700 flex items-center justify-center">
                          <DownloadCloud className="w-5 h-5" />
                        </div>
                        <h3 className="text-base font-bold text-slate-900">Pull Data from Supabase</h3>
                        <p className="text-xs text-slate-500 leading-relaxed">
                          Download live property records, projects, and showcase images from Supabase to update your local browser cache.
                        </p>
                      </div>

                      <div className="pt-2">
                        <button
                          onClick={handlePullFromSupabase}
                          disabled={supabaseSyncing}
                          className="w-full py-3 bg-blue-700 hover:bg-blue-800 disabled:opacity-50 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition shadow-xs"
                        >
                          <DownloadCloud className={`w-4 h-4 ${supabaseSyncing ? 'animate-bounce' : ''}`} />
                          <span>{supabaseSyncing ? 'Fetching...' : 'Pull Cloud Data to Website'}</span>
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Sync Feedback */}
                  {supabaseSyncResult && (
                    <div
                      className={`p-4 rounded-2xl border text-xs ${
                        supabaseSyncResult.success
                          ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
                          : 'bg-red-50 border-red-300 text-red-950'
                      }`}
                    >
                      <div className="flex items-center gap-2 font-bold text-sm">
                        {supabaseSyncResult.success ? (
                          <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                        ) : (
                          <AlertCircle className="w-5 h-5 text-red-600" />
                        )}
                        <span>{supabaseSyncResult.message}</span>
                      </div>
                      {supabaseSyncResult.counts && (
                        <div className="mt-2 grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-emerald-200/60 font-mono text-[11px]">
                          {Object.entries(supabaseSyncResult.counts).map(([k, v]) => (
                            <div key={k} className="bg-white/80 p-2 rounded-lg border border-emerald-200">
                              <span className="capitalize text-slate-600">{k}:</span>{' '}
                              <strong className="text-emerald-800">{v} synced</strong>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Current Database Statistics */}
                  <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
                    <h3 className="text-sm font-bold text-slate-900">Current Local Dataset Statistics</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-center">
                        <div className="text-2xl font-bold font-serif text-slate-900">{properties.length}</div>
                        <div className="text-[11px] text-slate-500 font-semibold uppercase">Properties</div>
                      </div>
                      <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-center">
                        <div className="text-2xl font-bold font-serif text-slate-900">{projects.length}</div>
                        <div className="text-[11px] text-slate-500 font-semibold uppercase">Projects</div>
                      </div>
                      <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-center">
                        <div className="text-2xl font-bold font-serif text-slate-900">{showcase.length}</div>
                        <div className="text-[11px] text-slate-500 font-semibold uppercase">Showcase Items</div>
                      </div>
                      <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-center">
                        <div className="text-2xl font-bold font-serif text-slate-900">{mediaList.length}</div>
                        <div className="text-[11px] text-slate-500 font-semibold uppercase">Media Assets</div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* SUB-TAB 4: 4-STEP SETUP GUIDE */}
              {activeSupabaseSubTab === 'guide' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Step 1 */}
                    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-2">
                      <div className="w-8 h-8 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center text-xs">
                        1
                      </div>
                      <h4 className="font-bold text-sm text-slate-900">Create a Free Supabase Project</h4>
                      <p className="text-xs text-slate-500 leading-relaxed">
                        Go to{' '}
                        <a
                          href="https://supabase.com"
                          target="_blank"
                          rel="noreferrer"
                          className="text-blue-600 underline font-semibold"
                        >
                          supabase.com
                        </a>{' '}
                        and sign up or log in. Click <strong>"New Project"</strong>, choose an organization, provide a name (e.g. <code>Ascent-Properties</code>), and set a secure database password.
                      </p>
                    </div>

                    {/* Step 2 */}
                    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-2">
                      <div className="w-8 h-8 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center text-xs">
                        2
                      </div>
                      <h4 className="font-bold text-sm text-slate-900">Execute the SQL Code in SQL Editor</h4>
                      <p className="text-xs text-slate-500 leading-relaxed">
                        In your Supabase project dashboard, click <strong>SQL Editor</strong> in the left sidebar, click <strong>"+ New Query"</strong>, paste the complete SQL script from the <strong>"Complete SQL Code"</strong> tab, and click <strong>"Run"</strong> (or press <code>Ctrl+Enter</code>).
                      </p>
                    </div>

                    {/* Step 3 */}
                    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-2">
                      <div className="w-8 h-8 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center text-xs">
                        3
                      </div>
                      <h4 className="font-bold text-sm text-slate-900">Copy your API URL & Anon Key</h4>
                      <p className="text-xs text-slate-500 leading-relaxed">
                        In your Supabase dashboard, click the gear icon (<strong>Project Settings</strong>) at the bottom left, then click <strong>API</strong>. Copy your <strong>Project URL</strong> and your <strong>anon / public API key</strong>.
                      </p>
                    </div>

                    {/* Step 4 */}
                    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-2">
                      <div className="w-8 h-8 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center text-xs">
                        4
                      </div>
                      <h4 className="font-bold text-sm text-slate-900">Paste & Test Connection</h4>
                      <p className="text-xs text-slate-500 leading-relaxed">
                        Switch back to the <strong>"Credentials & Connection"</strong> tab above, paste your Project URL and Anon Key into the inputs, and click <strong>"Save & Connect"</strong>. The dashboard will verify your connection and report all detected tables!
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </main>
      </div>

      {/* MODAL: ADD / EDIT PROPERTY */}
      {propertyModalOpen && editingProperty && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 my-8">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
              <h3 className="text-lg font-bold font-serif text-slate-900">
                {editingProperty.id ? 'Edit Property Listing' : 'Add New Property Listing'}
              </h3>
              <button onClick={() => setPropertyModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProperty} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Title *</label>
                <input
                  type="text"
                  required
                  value={editingProperty.title || ''}
                  onChange={(e) => setEditingProperty({ ...editingProperty, title: e.target.value })}
                  placeholder="e.g. The Monarch 5-Bedroom Villa"
                  className="w-full px-3.5 py-2 rounded-lg border border-slate-300 text-sm"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Price (₦) *</label>
                  <input
                    type="number"
                    required
                    value={editingProperty.price || ''}
                    onChange={(e) => setEditingProperty({ ...editingProperty, price: Number(e.target.value) })}
                    placeholder="350000000"
                    className="w-full px-3.5 py-2 rounded-lg border border-slate-300 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Property Type</label>
                  <select
                    value={editingProperty.type || 'Residential'}
                    onChange={(e) => setEditingProperty({ ...editingProperty, type: e.target.value as any })}
                    className="w-full px-3.5 py-2 rounded-lg border border-slate-300 text-sm bg-white"
                  >
                    <option value="Residential">Residential</option>
                    <option value="Duplexes">Duplexes</option>
                    <option value="Apartments">Apartments</option>
                    <option value="Land">Land</option>
                    <option value="Commercial">Commercial</option>
                    <option value="Estates">Estates</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Location / Landmark *</label>
                  <input
                    type="text"
                    required
                    value={editingProperty.location || ''}
                    onChange={(e) => setEditingProperty({ ...editingProperty, location: e.target.value })}
                    placeholder="e.g. Banana Island, Ikoyi"
                    className="w-full px-3.5 py-2 rounded-lg border border-slate-300 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Cover Image *</label>
                  <div className="flex items-center gap-3">
                    {editingProperty.coverImage && (
                      <div className="w-16 h-12 rounded-lg bg-slate-900 border border-slate-300 overflow-hidden shrink-0">
                        <img src={editingProperty.coverImage} alt="Cover Preview" className="w-full h-full object-cover" />
                      </div>
                    )}
                    <div className="flex-1 space-y-1.5">
                      <input
                        type="text"
                        required
                        value={editingProperty.coverImage || ''}
                        onChange={(e) => setEditingProperty({ ...editingProperty, coverImage: e.target.value })}
                        placeholder="https://i.ibb.co/..."
                        className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-xs font-mono"
                      />
                      <div className="flex items-center gap-2">
                        <label className="px-2.5 py-1 bg-white hover:bg-slate-100 border border-slate-300 rounded text-[11px] font-semibold text-slate-700 cursor-pointer flex items-center gap-1 shadow-2xs">
                          <Upload className="w-3 h-3 text-blue-600" />
                          <span>Upload File</span>
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={async (e) => {
                              const file = e.target.files?.[0];
                              if (!file) return;
                              const opt = await optimizeImageFile(file, 1600, 1200);
                              setEditingProperty({ ...editingProperty, coverImage: opt.dataUrl });
                              notify('Image optimized and loaded as cover!');
                            }}
                          />
                        </label>
                        <button
                          type="button"
                          onClick={() => {
                            setMediaPickerTitle('Select Cover Image for Property');
                            setMediaPickerCallback(() => (url: string) => {
                              setEditingProperty({ ...editingProperty, coverImage: url });
                            });
                            setMediaPickerOpen(true);
                          }}
                          className="px-2.5 py-1 bg-white hover:bg-slate-100 border border-slate-300 rounded text-[11px] font-semibold text-slate-700 cursor-pointer shadow-2xs"
                        >
                          Pick from Library
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Bedrooms</label>
                  <input
                    type="number"
                    value={editingProperty.bedrooms || ''}
                    onChange={(e) => setEditingProperty({ ...editingProperty, bedrooms: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Bathrooms</label>
                  <input
                    type="number"
                    value={editingProperty.bathrooms || ''}
                    onChange={(e) => setEditingProperty({ ...editingProperty, bathrooms: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Size</label>
                  <input
                    type="text"
                    value={editingProperty.size || '600 sqm'}
                    onChange={(e) => setEditingProperty({ ...editingProperty, size: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Description</label>
                <textarea
                  rows={3}
                  value={editingProperty.description || ''}
                  onChange={(e) => setEditingProperty({ ...editingProperty, description: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-lg border border-slate-300 text-sm"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setPropertyModalOpen(false)}
                  className="px-4 py-2 border border-slate-300 rounded-lg text-xs font-semibold hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-lg text-xs font-semibold shadow-xs"
                >
                  Save Property Listing
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ADD / EDIT PROJECT */}
      {projectModalOpen && editingProject && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
              <h3 className="text-lg font-bold font-serif text-slate-900">
                {editingProject.id ? 'Edit Development Project' : 'Add New Development Project'}
              </h3>
              <button onClick={() => setProjectModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProject} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Project Name *</label>
                <input
                  type="text"
                  required
                  value={editingProject.name || ''}
                  onChange={(e) => setEditingProject({ ...editingProject, name: e.target.value })}
                  placeholder="e.g. Gracefield Marina Towers"
                  className="w-full px-3.5 py-2 rounded-lg border border-slate-300 text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Status</label>
                  <select
                    value={editingProject.status || 'Ongoing'}
                    onChange={(e) => setEditingProject({ ...editingProject, status: e.target.value as any })}
                    className="w-full px-3.5 py-2 rounded-lg border border-slate-300 text-sm bg-white"
                  >
                    <option value="Planning">Planning</option>
                    <option value="Ongoing">Ongoing</option>
                    <option value="Completed">Completed</option>
                    <option value="Coming Soon">Coming Soon</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Progress % ({editingProject.progress || 0}%)</label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={editingProject.progress || 0}
                    onChange={(e) => setEditingProject({ ...editingProject, progress: Number(e.target.value) })}
                    className="w-full mt-2"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Cover Image *</label>
                <div className="flex items-center gap-3">
                  {editingProject.coverImage && (
                    <div className="w-16 h-12 rounded-lg bg-slate-900 border border-slate-300 overflow-hidden shrink-0">
                      <img src={editingProject.coverImage} alt="Project Cover Preview" className="w-full h-full object-cover" />
                    </div>
                  )}
                  <div className="flex-1 space-y-1.5">
                    <input
                      type="text"
                      required
                      value={editingProject.coverImage || ''}
                      onChange={(e) => setEditingProject({ ...editingProject, coverImage: e.target.value })}
                      placeholder="https://..."
                      className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-xs font-mono"
                    />
                    <div className="flex items-center gap-2">
                      <label className="px-2.5 py-1 bg-white hover:bg-slate-100 border border-slate-300 rounded text-[11px] font-semibold text-slate-700 cursor-pointer flex items-center gap-1 shadow-2xs">
                        <Upload className="w-3 h-3 text-blue-600" />
                        <span>Upload File</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={async (e) => {
                            const file = e.target.files?.[0];
                            if (!file) return;
                            const opt = await optimizeImageFile(file, 1600, 1200);
                            setEditingProject({ ...editingProject, coverImage: opt.dataUrl });
                            notify('Project cover image loaded!');
                          }}
                        />
                      </label>
                      <button
                        type="button"
                        onClick={() => {
                          setMediaPickerTitle('Select Cover Image for Project');
                          setMediaPickerCallback(() => (url: string) => {
                            setEditingProject({ ...editingProject, coverImage: url });
                          });
                          setMediaPickerOpen(true);
                        }}
                        className="px-2.5 py-1 bg-white hover:bg-slate-100 border border-slate-300 rounded text-[11px] font-semibold text-slate-700 cursor-pointer shadow-2xs"
                      >
                        Pick from Library
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Description</label>
                <textarea
                  rows={3}
                  value={editingProject.description || ''}
                  onChange={(e) => setEditingProject({ ...editingProject, description: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-lg border border-slate-300 text-sm"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setProjectModalOpen(false)}
                  className="px-4 py-2 border border-slate-300 rounded-lg text-xs font-semibold hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-lg text-xs font-semibold shadow-xs"
                >
                  Save Project
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: UPLOAD MEDIA ASSET */}
      {mediaModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
              <div>
                <h3 className="text-lg font-bold font-serif text-slate-900">Upload Media Asset</h3>
                <p className="text-xs text-slate-500 mt-0.5">Upload photos or videos and immediately apply them to your website</p>
              </div>
              <button onClick={() => setMediaModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveMedia} className="space-y-4">
              {/* Drag and drop / file selector */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Select File from Device (Image / Video)
                </label>
                <input
                  type="file"
                  accept="image/*,video/*"
                  onChange={handleFileUpload}
                  className="w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
                />
              </div>

              {isOptimizingImage && (
                <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-blue-800 text-xs flex items-center gap-2">
                  <RefreshCw className="w-4 h-4 animate-spin text-blue-600" />
                  <span>Compressing & optimizing image for fast web performance...</span>
                </div>
              )}

              {mediaFilePreview && (
                <div className="relative aspect-16/10 rounded-xl overflow-hidden bg-slate-900 border border-slate-200">
                  <img src={mediaFilePreview} alt="Preview" className="w-full h-full object-cover" />
                  <span className="absolute bottom-2 right-2 px-2 py-1 rounded bg-black/70 text-white text-[10px]">
                    Preview Ready
                  </span>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Or Paste Direct Media URL
                </label>
                <input
                  type="text"
                  placeholder="https://..."
                  value={mediaUrlInput}
                  onChange={(e) => setMediaUrlInput(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-lg border border-slate-300 text-sm font-mono text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Media Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Lekki Penthouse Sunset View"
                  value={mediaTitle}
                  onChange={(e) => setMediaTitle(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-lg border border-slate-300 text-sm"
                />
              </div>

              {/* TARGET DESTINATION ON WEBSITE */}
              <div className="p-4 bg-blue-50/70 border border-blue-200 rounded-xl space-y-3">
                <label className="block text-xs font-bold text-blue-900">
                  Where should this image appear on your website? *
                </label>
                <select
                  value={websitePlacement}
                  onChange={(e) => setWebsitePlacement(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-lg border border-blue-300 bg-white text-xs font-semibold text-slate-800"
                >
                  <option value="showcase">🖼️ Property Showcase Gallery (Featured on Homepage & Showcase page)</option>
                  <option value="hero">🌟 Homepage Hero Background (Main header visual)</option>
                  <option value="logo">🏷️ Company Official Logo (Header, Footer, Login)</option>
                  <option value="property">🏠 Specific Property Listing Cover</option>
                  <option value="project">🏗️ Specific Project Development Cover</option>
                  <option value="service">💼 Specific Company Service Visual</option>
                  <option value="none">📁 Media Library Archive Only</option>
                </select>

                {websitePlacement === 'property' && (
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">Select Property:</label>
                    <select
                      value={targetPropertyId}
                      onChange={(e) => setTargetPropertyId(e.target.value)}
                      className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white text-xs"
                    >
                      {properties.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.title} ({p.location})
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {websitePlacement === 'project' && (
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">Select Project:</label>
                    <select
                      value={targetProjectId}
                      onChange={(e) => setTargetProjectId(e.target.value)}
                      className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white text-xs"
                    >
                      {projects.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.name} ({p.status})
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {websitePlacement === 'service' && (
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">Select Service:</label>
                    <select
                      value={targetServiceId}
                      onChange={(e) => setTargetServiceId(e.target.value)}
                      className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white text-xs"
                    >
                      {services.map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.title}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Category</label>
                  <select
                    value={mediaCategory}
                    onChange={(e) => setMediaCategory(e.target.value as any)}
                    className="w-full px-3.5 py-2 rounded-lg border border-slate-300 text-sm bg-white"
                  >
                    <option value="Showcase">Showcase</option>
                    <option value="Properties">Properties</option>
                    <option value="Projects">Projects</option>
                    <option value="Services">Services</option>
                    <option value="Hero">Hero Background</option>
                    <option value="General">General</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Media Type</label>
                  <select
                    value={mediaType}
                    onChange={(e) => setMediaType(e.target.value as any)}
                    className="w-full px-3.5 py-2 rounded-lg border border-slate-300 text-sm bg-white"
                  >
                    <option value="image">Image</option>
                    <option value="video">Video</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setMediaModalOpen(false)}
                  className="px-4 py-2 border border-slate-300 rounded-lg text-xs font-semibold hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-lg text-xs font-semibold shadow-xs"
                >
                  Upload & Apply to Website
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ADD / UPLOAD SHOWCASE ITEM */}
      {showcaseModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
              <div>
                <h3 className="text-lg font-bold font-serif text-slate-900">Upload to Property Showcase</h3>
                <p className="text-xs text-slate-500 mt-0.5">Will immediately appear on Homepage Showcase & Showcase Page</p>
              </div>
              <button onClick={() => setShowcaseModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!showcaseTitle.trim() || !showcaseUrl.trim()) {
                  notify('Please provide a title and image.', 'error');
                  return;
                }
                storage.saveShowcaseItem({
                  title: showcaseTitle.trim(),
                  url: showcaseUrl.trim(),
                  category: showcaseCategory,
                  mediaType: showcaseUrl.endsWith('.mp4') ? 'video' : 'image',
                  description: showcaseDesc.trim(),
                  location: showcaseLocation.trim()
                });
                setShowcaseModalOpen(false);
                notify('Visual published to Property Showcase!');
              }}
              className="space-y-4"
            >
              {/* File upload from device */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Upload Image from Device (Phone / Computer)
                </label>
                <input
                  type="file"
                  accept="image/*,video/*"
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    try {
                      setIsShowcaseOptimizing(true);
                      const opt = await optimizeImageFile(file, 1600, 1200);
                      setShowcaseUrl(opt.dataUrl);
                      if (!showcaseTitle) {
                        setShowcaseTitle(file.name.replace(/\.[^/.]+$/, ''));
                      }
                      setIsShowcaseOptimizing(false);
                    } catch {
                      setIsShowcaseOptimizing(false);
                      notify('Failed to optimize image.', 'error');
                    }
                  }}
                  className="w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
                />
              </div>

              {isShowcaseOptimizing && (
                <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-blue-800 text-xs flex items-center gap-2">
                  <RefreshCw className="w-4 h-4 animate-spin text-blue-600" />
                  <span>Optimizing image for gallery...</span>
                </div>
              )}

              {showcaseUrl && (
                <div className="relative aspect-16/10 rounded-xl overflow-hidden bg-slate-900 border border-slate-200">
                  <img src={showcaseUrl} alt="Showcase Preview" className="w-full h-full object-cover" />
                  <span className="absolute bottom-2 right-2 px-2 py-0.5 rounded bg-black/75 text-white text-[10px]">
                    Preview Ready
                  </span>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Or Paste Direct Image / Video URL</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={showcaseUrl}
                    onChange={(e) => setShowcaseUrl(e.target.value)}
                    placeholder="https://i.ibb.co/..."
                    className="flex-1 px-3 py-2 rounded-lg border border-slate-300 text-xs font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setMediaPickerTitle('Select Showcase Visual from Library');
                      setMediaPickerCallback(() => (url: string) => {
                        setShowcaseUrl(url);
                      });
                      setMediaPickerOpen(true);
                    }}
                    className="px-3 py-2 rounded-lg border border-slate-300 text-xs font-semibold hover:bg-slate-50 cursor-pointer"
                  >
                    From Library
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Title *</label>
                <input
                  type="text"
                  required
                  value={showcaseTitle}
                  onChange={(e) => setShowcaseTitle(e.target.value)}
                  placeholder="e.g. Azure Marina Waterfront View"
                  className="w-full px-3.5 py-2 rounded-lg border border-slate-300 text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Category</label>
                  <select
                    value={showcaseCategory}
                    onChange={(e) => setShowcaseCategory(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs bg-white"
                  >
                    <option value="Properties">Properties</option>
                    <option value="Projects">Projects</option>
                    <option value="Interiors">Interiors</option>
                    <option value="Exteriors">Exteriors</option>
                    <option value="Construction">Construction</option>
                    <option value="Videos">Videos</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Location</label>
                  <input
                    type="text"
                    value={showcaseLocation}
                    onChange={(e) => setShowcaseLocation(e.target.value)}
                    placeholder="e.g. Ikoyi, Lagos"
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Short Description</label>
                <textarea
                  rows={2}
                  value={showcaseDesc}
                  onChange={(e) => setShowcaseDesc(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowcaseModalOpen(false)}
                  className="px-4 py-2 border border-slate-300 rounded-lg text-xs font-semibold hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-lg text-xs font-semibold shadow-xs"
                >
                  Publish to Showcase
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: CHOOSE IMAGE FROM MEDIA LIBRARY */}
      {mediaPickerOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-3xl w-full p-6 shadow-2xl border border-slate-200 max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4 shrink-0">
              <div>
                <h3 className="text-lg font-bold font-serif text-slate-900">{mediaPickerTitle}</h3>
                <p className="text-xs text-slate-500 mt-0.5">Click any image to select and apply</p>
              </div>
              <button onClick={() => setMediaPickerOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="overflow-y-auto flex-1 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 p-1">
              {mediaList.map((m) => (
                <div
                  key={m.id}
                  onClick={() => {
                    mediaPickerCallback(m.url);
                    setMediaPickerOpen(false);
                    notify(`Selected "${m.title}"`);
                  }}
                  className="group cursor-pointer rounded-xl border border-slate-200 overflow-hidden hover:border-blue-500 hover:shadow-md transition-all duration-200 bg-slate-50 flex flex-col"
                >
                  <div className="aspect-16/10 bg-slate-900 overflow-hidden relative">
                    <img src={m.url} alt={m.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                    <span className="absolute top-1.5 left-1.5 px-1.5 py-0.5 rounded bg-black/75 text-[10px] text-white">
                      {m.category}
                    </span>
                  </div>
                  <div className="p-2 flex-1 flex flex-col justify-between">
                    <div className="text-xs font-bold text-slate-800 truncate">{m.title}</div>
                    <button
                      type="button"
                      className="mt-2 w-full py-1 rounded bg-blue-50 group-hover:bg-blue-600 text-blue-700 group-hover:text-white text-[11px] font-semibold transition"
                    >
                      Select
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-4 border-t border-slate-100 flex justify-end shrink-0">
              <button
                type="button"
                onClick={() => setMediaPickerOpen(false)}
                className="px-4 py-2 border border-slate-300 rounded-lg text-xs font-semibold hover:bg-slate-50"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: DELETE MEDIA WARNING (AFFECTED LOCATIONS) */}
      {deleteWarningModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-red-200">
            <div className="w-12 h-12 rounded-xl bg-red-100 text-red-600 flex items-center justify-center mb-4">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 font-serif">
              Warning: Shared Media In Use
            </h3>
            <p className="text-xs text-slate-600 mt-2 leading-relaxed">
              The media asset <strong className="text-slate-900">"{deleteWarningModal.title}"</strong> is actively referenced in the following sections of your website:
            </p>
            <ul className="mt-3 space-y-1 bg-red-50 p-3 rounded-lg border border-red-100 text-xs text-red-800 font-medium">
              {deleteWarningModal.usages.map((u, i) => (
                <li key={i}>• {u}</li>
              ))}
            </ul>
            <p className="text-xs text-slate-500 mt-3">
              Permanently deleting this media will break references in these locations unless replaced. Do you still wish to proceed?
            </p>

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setDeleteWarningModal(null)}
                className="px-4 py-2 rounded-lg border border-slate-300 text-xs font-semibold hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                onClick={executeDeleteWarning}
                className="px-5 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs font-semibold shadow-xs"
              >
                Delete Permanently
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
