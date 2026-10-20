import React, { useState, useEffect } from 'react';
import { Menu, X, ArrowUpRight, Phone, Mail } from 'lucide-react';
import { SiteSettings } from '../types';
import { launchEmailClient } from '../utils/email';

interface NavbarProps {
  currentPage: string;
  onNavigate: (page: string, params?: any) => void;
  settings: SiteSettings;
}

export const Navbar: React.FC<NavbarProps> = ({ currentPage, onNavigate, settings }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [mobileMenuOpen]);

  const navLinks = [
    { id: 'home', label: 'Home' },
    { id: 'about', label: 'About Us' },
    { id: 'properties', label: 'Properties' },
    { id: 'projects', label: 'Projects' },
    { id: 'investments', label: 'Investments' },
    { id: 'services', label: 'Services' },
    { id: 'showcase', label: 'Property Showcase' },
    { id: 'contact', label: 'Contact' },
  ];

  const handleNavClick = (pageId: string) => {
    setMobileMenuOpen(false);
    onNavigate(pageId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleEmailDirect = (e: React.MouseEvent) => {
    launchEmailClient(e);
  };

  return (
    <>
      {/* Top micro-bar for quick contact info */}
      <div className="bg-slate-900 text-slate-300 text-xs hidden lg:block border-b border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <a
              href="mailto:info.ascentproperties@gmail.com"
              target="_top"
              rel="noopener noreferrer"
              onClick={handleEmailDirect}
              className="flex items-center gap-1.5 hover:text-white transition-colors cursor-pointer"
              title="Click to compose email to info.ascentproperties@gmail.com"
            >
              <Mail className="w-3.5 h-3.5 text-blue-400" />
              <span>info.ascentproperties@gmail.com</span>
            </a>
            <span className="text-slate-600">|</span>
            <a
              href="https://wa.me/2348033402265?text=Hello%20Ascent%20Properties"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-emerald-400 hover:text-emerald-300 font-medium transition-colors"
            >
              <span>WhatsApp: +2348033402265</span>
            </a>
          </div>

          <div className="flex items-center gap-5 text-xs font-medium">
            <span className="text-slate-400">Office Hours: Mon - Fri 8:30 AM - 5:30 PM</span>
          </div>
        </div>
      </div>

      {/* Main Sticky Navbar */}
      <header
        className={`sticky top-0 z-40 w-full transition-all duration-300 ${
          isScrolled
            ? 'bg-white/95 backdrop-blur-md shadow-md py-3 border-b border-slate-200/80'
            : 'bg-white py-4 border-b border-slate-100'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-6">
            {/* Brand Logo Zone */}
            <button
              onClick={() => handleNavClick('home')}
              className="flex items-center gap-3 text-left focus:outline-none group shrink-0"
              aria-label="Ascent Properties Home"
            >
              <img
                src={settings.logoUrl}
                alt="ASCENT Properties and Investment Company Logo"
                className="h-10 sm:h-12 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
                loading="eager"
              />
            </button>

            {/* Desktop Navigation Links */}
            <nav className="hidden xl:flex items-center gap-6 text-sm font-medium text-slate-700">
              {navLinks.map((link) => {
                const isActive = currentPage === link.id;
                return (
                  <button
                    key={link.id}
                    onClick={() => handleNavClick(link.id)}
                    className={`relative py-1 transition-colors duration-200 whitespace-nowrap ${
                      isActive ? 'text-blue-700 font-semibold' : 'hover:text-blue-600'
                    }`}
                  >
                    {link.label}
                    {isActive && (
                      <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-700 rounded-full animate-fade-in" />
                    )}
                  </button>
                );
              })}
            </nav>

            {/* Desktop CTA Button */}
            <div className="hidden sm:flex items-center gap-3 shrink-0">
              <button
                onClick={() => handleNavClick('properties')}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-blue-700 hover:bg-blue-800 text-white text-xs sm:text-sm font-semibold tracking-wide shadow-sm hover:shadow-md transition-all duration-200 transform hover:-translate-y-0.5 active:translate-y-0"
              >
                <span>EXPLORE PROPERTIES</span>
                <ArrowUpRight className="w-4 h-4" />
              </button>
            </div>

            {/* Mobile Hamburger Button */}
            <div className="flex items-center xl:hidden">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2.5 rounded-lg text-slate-700 hover:bg-slate-100 hover:text-slate-900 focus:outline-none transition-colors"
                aria-label={mobileMenuOpen ? 'Close Menu' : 'Open Menu'}
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Animated Drawer Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 xl:hidden">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm transition-opacity duration-300"
            onClick={() => setMobileMenuOpen(false)}
          />

          {/* Drawer content */}
          <div className="fixed inset-y-0 right-0 w-full max-w-sm bg-white shadow-2xl flex flex-col justify-between p-6 overflow-y-auto animate-in slide-in-from-right duration-300">
            <div>
              {/* Header inside drawer */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <img
                  src={settings.logoUrl}
                  alt="ASCENT Properties"
                  className="h-10 w-auto object-contain"
                />
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 transition-colors"
                  aria-label="Close menu"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Navigation list */}
              <nav className="mt-6 flex flex-col space-y-1">
                {navLinks.map((link) => {
                  const isActive = currentPage === link.id;
                  return (
                    <button
                      key={link.id}
                      onClick={() => handleNavClick(link.id)}
                      className={`flex items-center justify-between px-4 py-3 rounded-lg text-left text-base font-medium transition-all ${
                        isActive
                          ? 'bg-blue-50 text-blue-800 font-semibold'
                          : 'text-slate-700 hover:bg-slate-50 hover:text-blue-700'
                      }`}
                    >
                      <span>{link.label}</span>
                      {isActive && <span className="w-2 h-2 rounded-full bg-blue-700" />}
                    </button>
                  );
                })}
              </nav>

              <div className="mt-6 pt-4 border-t border-slate-100">
                <button
                  onClick={() => handleNavClick('properties')}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-lg bg-blue-700 hover:bg-blue-800 text-white text-sm font-semibold shadow-sm transition-all"
                >
                  <span>EXPLORE PROPERTIES</span>
                  <ArrowUpRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Bottom contact snippet */}
            <div className="mt-8 pt-4 border-t border-slate-100 text-xs text-slate-500 space-y-2.5">
              <a
                href="mailto:info.ascentproperties@gmail.com"
                target="_top"
                rel="noopener noreferrer"
                onClick={handleEmailDirect}
                className="flex items-center gap-2 text-slate-700 hover:text-blue-700 cursor-pointer font-medium"
              >
                <Mail className="w-4 h-4 text-blue-600 shrink-0" />
                <span className="truncate">info.ascentproperties@gmail.com</span>
              </a>
              <div className="flex items-center gap-2 text-slate-700">
                <Phone className="w-4 h-4 text-blue-600 shrink-0" />
                <span>{settings.phone}</span>
              </div>
              <a
                href="https://wa.me/2348033402265?text=Hello%20Ascent%20Properties"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-emerald-600 font-semibold text-xs"
              >
                <span>💬 WhatsApp: +2348033402265</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
