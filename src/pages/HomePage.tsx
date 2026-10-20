import React, { useState } from 'react';
import {
  Search,
  ArrowRight,
  ShieldCheck,
  TrendingUp,
  Award,
  Compass,
  CheckCircle,
  Building2,
  Calendar,
  Bed,
  Bath,
  Maximize,
  MapPin,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import { Property, Project, InvestmentOpportunity, CompanyService, ShowcaseItem, SiteSettings } from '../types';
import { AnimatedCounter } from '../components/AnimatedCounter';
import { launchEmailClient } from '../utils/email';

interface HomePageProps {
  settings: SiteSettings;
  properties: Property[];
  projects: Project[];
  investments: InvestmentOpportunity[];
  services: CompanyService[];
  showcase: ShowcaseItem[];
  onNavigate: (page: string, params?: any) => void;
  onOpenInspection: (propertyTitle: string) => void;
  onOpenEnquiry: (propertyTitle: string) => void;
  onOpenLightbox: (index: number) => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  settings,
  properties,
  projects,
  investments,
  services,
  showcase,
  onNavigate,
  onOpenInspection,
  onOpenEnquiry,
  onOpenLightbox
}) => {
  // Search form state
  const [searchLocation, setSearchLocation] = useState('All');
  const [searchType, setSearchType] = useState('All');
  const [searchPurpose, setSearchPurpose] = useState<'All' | 'Buy' | 'Rent' | 'Investment'>('All');
  const [searchMaxPrice, setSearchMaxPrice] = useState<string>('All');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNavigate('properties', {
      location: searchLocation,
      type: searchType,
      purpose: searchPurpose,
      maxPrice: searchMaxPrice
    });
  };

  const featuredProps = properties.filter((p) => p.featured || p.availability === 'Available').slice(0, 3);
  const activeProjects = projects.slice(0, 3);
  const teaserShowcase = showcase.slice(0, 6);

  return (
    <div className="flex flex-col min-h-screen">
      {/* 1. HERO SECTION WITH EXACT BACKGROUND IMAGE & IPHONE-INSPIRED FLUID ANIMATIONS */}
      <section className="relative min-h-[92vh] sm:min-h-[88vh] flex items-center justify-center overflow-hidden bg-slate-950">
        {/* Background Image Container */}
        <div className="absolute inset-0 z-0">
          <img
            src={settings.heroBackground}
            alt="Luxury architectural property background"
            className="w-full h-full object-cover object-center scale-105 animate-in fade-in zoom-in-105 duration-1000 transform transition-transform duration-1000 ease-out"
            loading="eager"
          />
          {/* Subtle dark gradient overlay to ensure WCAG legibility while preserving architectural beauty */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/65 to-slate-950/40" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28 text-center flex flex-col items-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-900/60 border border-blue-400/30 text-blue-200 text-xs font-semibold tracking-wider uppercase mb-6 backdrop-blur-sm animate-in fade-in slide-in-from-bottom-3 duration-500">
            <span>Ascent Properties & Investment Company</span>
          </div>

          <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-white tracking-tight font-serif leading-[1.1] max-w-4xl text-balance animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100">
            {settings.heroHeadline}
          </h1>

          <p className="mt-6 text-base sm:text-lg md:text-xl text-slate-200 max-w-2xl font-normal leading-relaxed text-balance animate-in fade-in slide-in-from-bottom-5 duration-700 delay-200">
            {settings.heroSupportingText}
          </p>

          {/* CTA Buttons */}
          <div className="mt-9 flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto animate-in fade-in slide-in-from-bottom-6 duration-700 delay-300">
            <button
              onClick={() => onNavigate('properties')}
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm tracking-wide shadow-lg hover:shadow-blue-500/25 transition-all duration-200 transform hover:-translate-y-0.5 active:translate-y-0"
            >
              EXPLORE PROPERTIES
            </button>
            <button
              onClick={() => onNavigate('services')}
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/25 backdrop-blur-sm font-semibold text-sm tracking-wide transition-all duration-200 transform hover:-translate-y-0.5 active:translate-y-0"
            >
              OUR SERVICES
            </button>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-10 hidden sm:flex flex-col items-center text-slate-400 text-xs">
          <span className="uppercase tracking-widest text-[10px] mb-1">Scroll to explore</span>
          <div className="w-5 h-8 rounded-full border-2 border-slate-500/60 flex items-start justify-center p-1">
            <div className="w-1 h-2 bg-blue-400 rounded-full animate-bounce" />
          </div>
        </div>
      </section>

      {/* 2. REAL-TIME FUNCTIONAL PROPERTY SEARCH PANEL */}
      <section className="relative z-20 -mt-10 sm:-mt-12 max-w-6xl mx-auto px-4 sm:px-6 w-full">
        <div className="bg-white rounded-2xl shadow-xl border border-slate-200/90 p-5 sm:p-7 backdrop-blur-md">
          <form onSubmit={handleSearchSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Location Filter */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Location
                </label>
                <select
                  value={searchLocation}
                  onChange={(e) => setSearchLocation(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent bg-slate-50/50"
                >
                  <option value="All">All Locations</option>
                  <option value="Ikoyi">Ikoyi, Lagos</option>
                  <option value="Lekki Phase 1">Lekki Phase 1, Lagos</option>
                  <option value="Victoria Island">Victoria Island, Lagos</option>
                  <option value="Epe">Epe Growth Corridor</option>
                  <option value="Abuja">Abuja FCT (Maitama/Guzape)</option>
                </select>
              </div>

              {/* Property Type */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Property Type
                </label>
                <select
                  value={searchType}
                  onChange={(e) => setSearchType(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent bg-slate-50/50"
                >
                  <option value="All">All Property Types</option>
                  <option value="Duplexes">Duplexes</option>
                  <option value="Residential">Residential Homes</option>
                  <option value="Apartments">Luxury Apartments</option>
                  <option value="Land">Commercial & Residential Land</option>
                  <option value="Commercial">Commercial Offices</option>
                  <option value="Estates">Gated Estates</option>
                </select>
              </div>

              {/* Purpose */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Purpose
                </label>
                <select
                  value={searchPurpose}
                  onChange={(e) => setSearchPurpose(e.target.value as any)}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent bg-slate-50/50"
                >
                  <option value="All">Buy, Rent or Investment</option>
                  <option value="Buy">For Sale / Buy</option>
                  <option value="Rent">For Rent</option>
                  <option value="Investment">Investment Yield</option>
                </select>
              </div>

              {/* Maximum Price Range */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Max Budget
                </label>
                <select
                  value={searchMaxPrice}
                  onChange={(e) => setSearchMaxPrice(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent bg-slate-50/50"
                >
                  <option value="All">Any Price</option>
                  <option value="50000000">Up to ₦50 Million</option>
                  <option value="150000000">Up to ₦150 Million</option>
                  <option value="300000000">Up to ₦300 Million</option>
                  <option value="500000000">Up to ₦500 Million</option>
                  <option value="1000000000">Up to ₦1 Billion</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end pt-1">
              <button
                type="submit"
                className="w-full sm:w-auto px-7 py-3 bg-blue-700 hover:bg-blue-800 text-white rounded-xl text-sm font-semibold tracking-wide shadow-md transition-all flex items-center justify-center gap-2"
              >
                <Search className="w-4 h-4" />
                <span>SEARCH PROPERTIES</span>
              </button>
            </div>
          </form>
        </div>
      </section>

      {/* 3. ABOUT INTRODUCTION & CORE VALUE PILLARS */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-5 space-y-6">
              <div className="text-xs font-bold text-blue-700 tracking-wider uppercase">
                About Ascent Properties
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-serif leading-tight text-balance">
                Pioneering Value in African Real Estate & Structured Investments
              </h2>
              <p className="text-slate-600 leading-relaxed text-sm sm:text-base">
                Ascent Properties and Investment Company is a premier real estate development and investment advisory firm operating across prime commercial and residential corridors in Nigeria. We bridge the gap between capital, land, and architectural execution.
              </p>
              <p className="text-slate-600 leading-relaxed text-sm sm:text-base">
                Our approach is rooted in uncompromising title documentation, institutional governance, and an eye for high-growth urban corridors. Whether acquiring prime acreage or developing luxury residential enclaves, our clients count on unassailable value.
              </p>

              <div className="pt-2">
                <button
                  onClick={() => onNavigate('about')}
                  className="inline-flex items-center gap-2 text-blue-700 hover:text-blue-800 font-semibold text-sm group"
                >
                  <span>Learn more about our philosophy & leadership</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </button>
              </div>
            </div>

            {/* Core Values Bento Grid */}
            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-6 bg-white rounded-xl border border-slate-200 shadow-xs hover:shadow-md transition-all">
                <ShieldCheck className="w-7 h-7 text-blue-700 mb-3" />
                <h3 className="text-base font-bold text-slate-900 mb-1.5">Integrity & Title Rigor</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Every property undergoes exhaustive cadastral vetting, legal searches, and Governor's Consent verification before entering our catalog.
                </p>
              </div>

              <div className="p-6 bg-white rounded-xl border border-slate-200 shadow-xs hover:shadow-md transition-all">
                <TrendingUp className="w-7 h-7 text-blue-700 mb-3" />
                <h3 className="text-base font-bold text-slate-900 mb-1.5">Investment Intelligence</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  We pinpoint high-growth infrastructure corridors—such as the Lekki-Epe expressway and Abuja Guzape basin—ahead of mainstream appreciation.
                </p>
              </div>

              <div className="p-6 bg-white rounded-xl border border-slate-200 shadow-xs hover:shadow-md transition-all">
                <Award className="w-7 h-7 text-blue-700 mb-3" />
                <h3 className="text-base font-bold text-slate-900 mb-1.5">Architectural Excellence</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Contemporary design, high-grade materials, and sustainable energy microgrids that deliver enduring functionality and aesthetic pride.
                </p>
              </div>

              <div className="p-6 bg-white rounded-xl border border-slate-200 shadow-xs hover:shadow-md transition-all">
                <Compass className="w-7 h-7 text-blue-700 mb-3" />
                <h3 className="text-base font-bold text-slate-900 mb-1.5">Long-Term Thinking</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  We build intergenerational wealth through structured off-plan entries, strategic land-banking, and institutional facility management.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. FEATURED PROPERTIES (WITH SUPPLIED ASSETS) */}
      <section className="py-20 bg-white border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
            <div>
              <div className="text-xs font-bold text-blue-700 tracking-wider uppercase mb-1">
                Curated Portfolio
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-serif">
                Featured Properties
              </h2>
            </div>
            <button
              onClick={() => onNavigate('properties')}
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-blue-700 hover:text-blue-800 transition"
            >
              <span>View all available listings</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProps.map((property) => (
              <div
                key={property.id}
                className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col group"
              >
                {/* Image Container with smooth hover zoom */}
                <div className="relative aspect-4/3 overflow-hidden bg-slate-900">
                  <img
                    src={property.coverImage}
                    alt={property.title}
                    className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-108"
                    loading="lazy"
                  />
                  <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                    <span className="px-2.5 py-1 rounded bg-slate-900/80 backdrop-blur-xs text-white text-xs font-medium">
                      {property.type}
                    </span>
                    <span className="px-2.5 py-1 rounded bg-blue-700 text-white text-xs font-semibold">
                      {property.availability}
                    </span>
                  </div>
                  <div className="absolute bottom-3 left-3 text-white text-lg font-bold drop-shadow-md">
                    {property.formattedPrice}
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-1.5">
                      <MapPin className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                      <span className="truncate">{property.location}</span>
                    </div>

                    <h3
                      onClick={() => onNavigate('property-detail', { id: property.slug })}
                      className="text-base font-bold text-slate-900 hover:text-blue-700 transition cursor-pointer line-clamp-1"
                    >
                      {property.title}
                    </h3>

                    <p className="mt-2 text-xs text-slate-600 line-clamp-2 leading-relaxed">
                      {property.description}
                    </p>

                    {/* Quick Specs */}
                    <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
                      {property.bedrooms && (
                        <div className="flex items-center gap-1">
                          <Bed className="w-3.5 h-3.5 text-slate-400" />
                          <span>{property.bedrooms} Beds</span>
                        </div>
                      )}
                      {property.bathrooms && (
                        <div className="flex items-center gap-1">
                          <Bath className="w-3.5 h-3.5 text-slate-400" />
                          <span>{property.bathrooms} Baths</span>
                        </div>
                      )}
                      <div className="flex items-center gap-1">
                        <Maximize className="w-3.5 h-3.5 text-slate-400" />
                        <span>{property.size}</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="mt-5 pt-3 grid grid-cols-2 gap-2">
                    <button
                      onClick={() => onNavigate('property-detail', { id: property.slug })}
                      className="py-2 px-3 rounded-lg border border-slate-300 hover:border-slate-400 text-slate-700 text-xs font-semibold text-center transition"
                    >
                      View Details
                    </button>
                    <button
                      onClick={() => onOpenInspection(property.title)}
                      className="py-2 px-3 rounded-lg bg-blue-700 hover:bg-blue-800 text-white text-xs font-semibold text-center transition shadow-xs"
                    >
                      Inspect
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. SERVICES SECTION WITH THE 6 EXACT SUPPLIED IMAGES */}
      <section className="py-20 bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="text-xs font-bold text-blue-400 tracking-wider uppercase mb-2">
              End-to-End Capabilities
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold font-serif text-white text-balance">
              Specialized Real Estate & Investment Services
            </h2>
            <p className="mt-4 text-slate-300 text-sm sm:text-base leading-relaxed">
              Ascent Properties and Investment Company delivers comprehensive real estate solutions backed by verified legal title vetting, development precision, and asset advisory.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service) => (
              <div
                key={service.id}
                className="bg-slate-800/90 rounded-2xl border border-slate-700 overflow-hidden shadow-lg hover:shadow-2xl hover:border-blue-500/50 transition-all duration-300 flex flex-col group"
              >
                {/* Service Image with hover zoom */}
                <div className="relative aspect-16/10 overflow-hidden bg-slate-950">
                  <img
                    src={service.image}
                    alt={service.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-108"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent opacity-60" />
                </div>

                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-white group-hover:text-blue-400 transition-colors">
                      {service.title}
                    </h3>
                    <p className="mt-2.5 text-xs sm:text-sm text-slate-300 leading-relaxed">
                      {service.shortDescription}
                    </p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-slate-700/60 flex items-center justify-between">
                    <button
                      onClick={() => onNavigate('services')}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-400 hover:text-blue-300 transition"
                    >
                      <span>Explore service details</span>
                      <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. ONGOING & SIGNATURE PROJECTS */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
            <div>
              <div className="text-xs font-bold text-blue-700 tracking-wider uppercase mb-1">
                Development Pipeline
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-serif">
                Featured Developments
              </h2>
            </div>
            <button
              onClick={() => onNavigate('projects')}
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-blue-700 hover:text-blue-800 transition"
            >
              <span>Explore all projects</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {activeProjects.map((project) => (
              <div
                key={project.id}
                className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col"
              >
                <div className="relative aspect-16/10 overflow-hidden bg-slate-900">
                  <img
                    src={project.coverImage}
                    alt={project.name}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                  <div className="absolute top-3 left-3">
                    <span className="px-2.5 py-1 rounded bg-slate-900/80 backdrop-blur-xs text-white text-xs font-medium">
                      {project.status}
                    </span>
                  </div>
                </div>

                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="text-xs text-blue-700 font-semibold mb-1">
                      {project.type} · {project.location}
                    </div>
                    <h3 className="text-lg font-bold text-slate-900">{project.name}</h3>
                    <p className="mt-2 text-xs text-slate-600 leading-relaxed line-clamp-3">
                      {project.description}
                    </p>

                    {/* Progress Bar where applicable */}
                    {project.progress !== undefined && (
                      <div className="mt-4 pt-3 border-t border-slate-100">
                        <div className="flex justify-between text-xs font-medium text-slate-600 mb-1">
                          <span>Construction Progress</span>
                          <span className="tabular-nums font-semibold text-blue-700">{project.progress}%</span>
                        </div>
                        <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                          <div
                            className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                            style={{ width: `${project.progress}%` }}
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="mt-6 pt-3 flex items-center justify-between">
                    <span className="text-xs text-slate-500 font-medium">
                      {project.availableUnits || 'Inquire for units'}
                    </span>
                    <button
                      onClick={() => onOpenEnquiry(project.name)}
                      className="px-4 py-2 rounded-lg bg-blue-700 hover:bg-blue-800 text-white text-xs font-semibold transition"
                    >
                      Enquire
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. REAL NUMBERS & ANIMATED COUNTERS */}
      <section className="py-16 bg-slate-950 border-y border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <AnimatedCounter end={6} label="Core Real Estate Capabilities" />
            <AnimatedCounter end={100} suffix="%" label="Verified Land Title Deeds" />
            <AnimatedCounter end={4} label="Strategic Master Developments" />
            <AnimatedCounter end={24} suffix="/7" label="Dedicated Client Advisory" />
          </div>
        </div>
      </section>

      {/* 8. PROPERTY SHOWCASE TEASER WITH LIGHTBOX */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
            <div>
              <div className="text-xs font-bold text-blue-700 tracking-wider uppercase mb-1">
                Visual Experience
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-serif">
                Property Showcase
              </h2>
            </div>
            <button
              onClick={() => onNavigate('showcase')}
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-blue-700 hover:text-blue-800 transition"
            >
              <span>View full media gallery</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {teaserShowcase.map((item, idx) => (
              <div
                key={item.id}
                onClick={() => onOpenLightbox(idx)}
                className="group relative aspect-4/3 rounded-xl overflow-hidden bg-slate-900 cursor-pointer shadow-xs hover:shadow-xl transition-all"
              >
                <img
                  src={item.url}
                  alt={item.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-108"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4 text-white">
                  <span className="text-xs text-blue-400 font-medium">{item.category}</span>
                  <h4 className="text-sm font-semibold line-clamp-1">{item.title}</h4>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 9. WHY CHOOSE ASCENT PROPERTIES */}
      <section className="py-20 bg-slate-100/70 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <div className="text-xs font-bold text-blue-700 tracking-wider uppercase mb-1">
              The Ascent Advantage
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-serif">
              Why Discerning Investors Choose Us
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 bg-white rounded-2xl border border-slate-200 shadow-xs">
              <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center mb-5 font-serif font-bold text-xl">
                01
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Uncompromised Title Diligence</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                We eliminate the ambiguity of Nigerian property acquisitions. Every title deed, Certificate of Occupancy, Gazette, and Governor's Consent is independently verified through formal state registry searches.
              </p>
            </div>

            <div className="p-8 bg-white rounded-2xl border border-slate-200 shadow-xs">
              <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center mb-5 font-serif font-bold text-xl">
                02
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Institutional Construction Standards</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                From deep soil boring and driven piling to British Standard concrete testing, our property developments are engineered for intergenerational structural durability and low lifecycle maintenance.
              </p>
            </div>

            <div className="p-8 bg-white rounded-2xl border border-slate-200 shadow-xs">
              <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center mb-5 font-serif font-bold text-xl">
                03
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Strategic Corridor Selection</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                We only invest in master-planned and arterial corridors experiencing profound public and private infrastructure deployment, guaranteeing capital preservation and superior yield potential.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 10. INTERACTIVE CONTACT CTA BANNER */}
      <section className="py-20 bg-blue-900 text-white relative overflow-hidden">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold font-serif leading-tight text-balance">
            Ready to Build Value With Ascent Properties?
          </h2>
          <p className="mt-4 text-base sm:text-lg text-blue-100 max-w-2xl mx-auto leading-relaxed">
            Schedule a private property inspection, discuss structured investment options, or consult our senior property advisory team today.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => onNavigate('contact')}
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-white text-blue-900 font-semibold text-sm shadow-lg hover:bg-blue-50 transition transform hover:-translate-y-0.5 active:translate-y-0"
            >
              CONTACT OUR ADVISORY TEAM
            </button>
            <a
              href="mailto:info.ascentproperties@gmail.com"
              target="_top"
              rel="noopener noreferrer"
              onClick={(e) => launchEmailClient(e)}
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-blue-800 hover:bg-blue-700 text-white font-semibold text-sm border border-blue-400/30 transition transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
            >
              EMAIL: info.ascentproperties@gmail.com
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};
