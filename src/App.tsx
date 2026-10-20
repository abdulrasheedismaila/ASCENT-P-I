import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { HomePage } from './pages/HomePage';
import { PropertiesPage } from './pages/PropertiesPage';
import { PropertyDetailPage } from './pages/PropertyDetailPage';
import { ProjectsPage } from './pages/ProjectsPage';
import { InvestmentsPage } from './pages/InvestmentsPage';
import { ServicesPage } from './pages/ServicesPage';
import { ShowcasePage } from './pages/ShowcasePage';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';
import { AdminDashboard } from './pages/AdminDashboard';
import { InspectionModal } from './components/InspectionModal';
import { EnquiryModal } from './components/EnquiryModal';
import { LightboxModal, LightboxMedia } from './components/LightboxModal';
import { storage } from './services/storage';
import {
  Property,
  Project,
  InvestmentOpportunity,
  CompanyService,
  ShowcaseItem,
  SiteSettings
} from './types';
import { MessageCircle } from 'lucide-react';

export default function App() {
  // Navigation & Route states
  const [currentPage, setCurrentPage] = useState<string>('home');
  const [selectedPropertySlug, setSelectedPropertySlug] = useState<string | null>(null);
  const [propertiesFilterState, setPropertiesFilterState] = useState<any>(null);
  const [isAdminView, setIsAdminView] = useState<boolean>(false);

  // Live data subscriptions from persistent storage
  const [settings, setSettings] = useState<SiteSettings>(storage.getSettings());
  const [properties, setProperties] = useState<Property[]>(storage.getProperties());
  const [projects, setProjects] = useState<Project[]>(storage.getProjects());
  const [investments, setInvestments] = useState<InvestmentOpportunity[]>(storage.getInvestments());
  const [services, setServices] = useState<CompanyService[]>(storage.getServices());
  const [showcase, setShowcase] = useState<ShowcaseItem[]>(storage.getShowcase());

  // Global modals
  const [inspectionModalOpen, setInspectionModalOpen] = useState(false);
  const [inspectionPropertyTitle, setInspectionPropertyTitle] = useState('Ascent Luxury Property');

  const [enquiryModalOpen, setEnquiryModalOpen] = useState(false);
  const [enquiryPropertyTitle, setEnquiryPropertyTitle] = useState('Ascent Properties & Investment');

  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxItems, setLightboxItems] = useState<LightboxMedia[]>([]);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  // Listen for storage changes
  useEffect(() => {
    const unsubscribe = storage.subscribe(() => {
      setSettings(storage.getSettings());
      setProperties(storage.getProperties());
      setProjects(storage.getProjects());
      setInvestments(storage.getInvestments());
      setServices(storage.getServices());
      setShowcase(storage.getShowcase());
    });
    return unsubscribe;
  }, []);

  // Listen for hash changes to support /#admin requirement
  useEffect(() => {
    const checkHash = () => {
      const hash = window.location.hash.toLowerCase();
      const path = window.location.pathname.toLowerCase();
      if (hash === '#admin' || hash === '#/admin' || path === '/admin') {
        setIsAdminView(true);
      } else {
        setIsAdminView(false);
      }
    };

    checkHash();
    window.addEventListener('hashchange', checkHash);
    window.addEventListener('popstate', checkHash);
    return () => {
      window.removeEventListener('hashchange', checkHash);
      window.removeEventListener('popstate', checkHash);
    };
  }, []);

  // Navigation controller
  const handleNavigate = (page: string, params?: any) => {
    if (page === 'admin') {
      window.location.hash = '#admin';
      setIsAdminView(true);
      return;
    }

    if (page === 'property-detail' && params?.id) {
      setSelectedPropertySlug(params.id);
      setCurrentPage('property-detail');
    } else if (page === 'properties') {
      if (params) {
        setPropertiesFilterState(params);
      }
      setCurrentPage('properties');
    } else {
      setCurrentPage(page);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCloseAdmin = () => {
    if (window.location.hash) {
      history.replaceState(null, '', window.location.pathname + window.location.search);
    }
    setIsAdminView(false);
    setCurrentPage('home');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Open Inspection Modal
  const openInspection = (propertyTitle: string) => {
    setInspectionPropertyTitle(propertyTitle);
    setInspectionModalOpen(true);
  };

  // Open Enquiry Modal
  const openEnquiry = (title: string) => {
    setEnquiryPropertyTitle(title);
    setEnquiryModalOpen(true);
  };

  // Open Lightbox from Showcase items or direct image URL
  const openShowcaseLightbox = (index: number) => {
    const items: LightboxMedia[] = showcase.map((item) => ({
      url: item.url,
      mediaType: item.mediaType,
      title: item.title,
      description: item.description,
      location: item.location
    }));
    setLightboxItems(items);
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  const openSingleImageLightbox = (imageUrl: string) => {
    setLightboxItems([{ url: imageUrl, mediaType: 'image' }]);
    setLightboxIndex(0);
    setLightboxOpen(true);
  };

  // If in admin view, render AdminDashboard
  if (isAdminView) {
    return (
      <AdminDashboard
        onCloseAdmin={handleCloseAdmin}
        onNavigateHome={handleCloseAdmin}
      />
    );
  }

  // Selected property for detail view
  const currentProperty = selectedPropertySlug
    ? storage.getPropertyBySlug(selectedPropertySlug) || properties[0]
    : properties[0];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800">
      {/* Navbar with official logo and 3-zone contract */}
      <Navbar
        currentPage={currentPage}
        onNavigate={handleNavigate}
        settings={settings}
      />

      {/* Public Pages Viewport */}
      <main className="flex-1">
        {currentPage === 'home' && (
          <HomePage
            settings={settings}
            properties={properties}
            projects={projects}
            investments={investments}
            services={services}
            showcase={showcase}
            onNavigate={handleNavigate}
            onOpenInspection={openInspection}
            onOpenEnquiry={openEnquiry}
            onOpenLightbox={openShowcaseLightbox}
          />
        )}

        {currentPage === 'properties' && (
          <PropertiesPage
            properties={properties}
            onNavigate={handleNavigate}
            onOpenInspection={openInspection}
            onOpenEnquiry={openEnquiry}
            initialFilters={propertiesFilterState}
          />
        )}

        {currentPage === 'property-detail' && currentProperty && (
          <PropertyDetailPage
            property={currentProperty}
            allProperties={properties}
            settings={settings}
            onBack={() => handleNavigate('properties')}
            onNavigateProperty={(slug) => handleNavigate('property-detail', { id: slug })}
            onOpenInspection={openInspection}
            onOpenEnquiry={openEnquiry}
            onOpenLightbox={openSingleImageLightbox}
          />
        )}

        {currentPage === 'projects' && (
          <ProjectsPage
            projects={projects}
            onOpenEnquiry={openEnquiry}
            onOpenLightbox={openSingleImageLightbox}
          />
        )}

        {currentPage === 'investments' && (
          <InvestmentsPage
            investments={investments}
            onOpenEnquiry={openEnquiry}
            onOpenLightbox={openSingleImageLightbox}
          />
        )}

        {currentPage === 'services' && (
          <ServicesPage
            services={services}
            settings={settings}
            onOpenEnquiry={openEnquiry}
          />
        )}

        {currentPage === 'showcase' && (
          <ShowcasePage
            showcase={showcase}
            onOpenLightbox={openShowcaseLightbox}
          />
        )}

        {currentPage === 'about' && (
          <AboutPage
            settings={settings}
            onNavigate={handleNavigate}
          />
        )}

        {currentPage === 'contact' && (
          <ContactPage
            settings={settings}
          />
        )}
      </main>

      {/* Global Modals */}
      <InspectionModal
        isOpen={inspectionModalOpen}
        onClose={() => setInspectionModalOpen(false)}
        propertyTitle={inspectionPropertyTitle}
      />

      <EnquiryModal
        isOpen={enquiryModalOpen}
        onClose={() => setEnquiryModalOpen(false)}
        propertyTitle={enquiryPropertyTitle}
      />

      <LightboxModal
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        items={lightboxItems}
        currentIndex={lightboxIndex}
        onIndexChange={setLightboxIndex}
      />

      {/* Footer with official logo and 5 working social/email destinations */}
      <Footer
        settings={settings}
        onNavigate={handleNavigate}
      />

      {/* Floating Action Buttons: WhatsApp Hotline & Admin Access */}
      <div className="fixed bottom-5 left-5 z-40">
        <a
          href="https://wa.me/2348033402265?text=Hello%20Ascent%20Properties%20and%20Investment%20Company,%20I%20am%20inquiring%20about%20your%20properties%20and%20investment%20offerings."
          target="_blank"
          rel="noopener noreferrer"
          className="group flex items-center gap-2.5 px-4 py-3 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white shadow-xl hover:shadow-emerald-500/30 transition-all duration-300 transform hover:scale-105 active:scale-95 cursor-pointer font-sans"
          title="Chat directly on WhatsApp (+2348033402265)"
          aria-label="Chat directly on WhatsApp"
        >
          <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center shrink-0">
            <MessageCircle className="w-4 h-4 text-white fill-current" />
          </div>
          <span className="text-xs font-bold tracking-wide hidden sm:inline">WhatsApp Us</span>
        </a>
      </div>
    </div>
  );
}
