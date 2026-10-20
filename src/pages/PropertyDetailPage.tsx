import React, { useState } from 'react';
import {
  MapPin,
  Bed,
  Bath,
  Maximize,
  Check,
  ShieldCheck,
  Calendar,
  Phone,
  MessageCircle,
  Share2,
  ArrowLeft,
  FileText
} from 'lucide-react';
import { Property, SiteSettings } from '../types';
import { launchEmailClient } from '../utils/email';

interface PropertyDetailPageProps {
  property: Property;
  allProperties: Property[];
  settings: SiteSettings;
  onBack: () => void;
  onNavigateProperty: (slug: string) => void;
  onOpenInspection: (propertyTitle: string) => void;
  onOpenEnquiry: (propertyTitle: string) => void;
  onOpenLightbox: (imageUrl: string) => void;
}

export const PropertyDetailPage: React.FC<PropertyDetailPageProps> = ({
  property,
  allProperties,
  settings,
  onBack,
  onNavigateProperty,
  onOpenInspection,
  onOpenEnquiry,
  onOpenLightbox
}) => {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const images = property.images && property.images.length > 0 ? property.images : [property.coverImage];

  const currentImage = images[activeImageIndex] || property.coverImage;

  const whatsappMessage = encodeURIComponent(
    `Hello Ascent Properties, I am interested in inspecting or acquiring "${property.title}" (${property.formattedPrice}) located at ${property.location}. Please provide full documentation.`
  );
  const whatsappUrl = `https://wa.me/2348033402265?text=${whatsappMessage}`;

  const related = allProperties
    .filter((p) => p.id !== property.id && (p.type === property.type || p.city === property.city))
    .slice(0, 3);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: property.title,
        text: `${property.title} - ${property.formattedPrice} in ${property.location}`,
        url: window.location.href
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Property link copied to clipboard!');
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Navigation back */}
        <div className="mb-6 flex items-center justify-between">
          <button
            onClick={onBack}
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-600 hover:text-blue-700 transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Property Portfolio</span>
          </button>

          <button
            onClick={handleShare}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs font-medium transition"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>Share Listing</span>
          </button>
        </div>

        {/* Title & Price Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-blue-700 uppercase tracking-wider mb-1.5">
              <span>{property.type}</span>
              <span>·</span>
              <span className="text-slate-600">{property.purpose === 'Buy' ? 'For Sale' : property.purpose}</span>
              <span>·</span>
              <span
                className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                  property.availability === 'Available'
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-amber-100 text-amber-800'
                }`}
              >
                {property.availability}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 font-serif">
              {property.title}
            </h1>
            <div className="flex items-center gap-1.5 text-xs sm:text-sm text-slate-600 mt-2">
              <MapPin className="w-4 h-4 text-blue-600 shrink-0" />
              <span>{property.location}, {property.city}, {property.state}</span>
            </div>
          </div>

          <div className="lg:text-right">
            <span className="text-xs uppercase tracking-wider text-slate-500 font-semibold block">
              Investment Value / Price
            </span>
            <div className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-blue-700 font-serif">
              {property.formattedPrice}
            </div>
          </div>
        </div>

        {/* Gallery Section */}
        <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-6 shadow-xs mb-10">
          {/* Main Visual */}
          <div
            onClick={() => onOpenLightbox(currentImage)}
            className="relative aspect-16/9 md:aspect-21/9 rounded-xl overflow-hidden bg-slate-950 cursor-pointer group shadow-sm"
          >
            <img
              src={currentImage}
              alt={property.title}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-103"
            />
            <div className="absolute inset-0 bg-slate-950/10 group-hover:bg-slate-950/20 transition-colors" />
            <div className="absolute bottom-4 right-4 bg-slate-900/80 backdrop-blur-xs text-white text-xs px-3 py-1.5 rounded-lg flex items-center gap-1.5">
              <span>Click to view full screen</span>
            </div>
          </div>

          {/* Thumbnails Row */}
          {images.length > 1 && (
            <div className="mt-4 flex items-center gap-3 overflow-x-auto pb-2">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIndex(idx)}
                  className={`relative w-20 sm:w-28 aspect-4/3 rounded-lg overflow-hidden shrink-0 border-2 transition-all ${
                    activeImageIndex === idx
                      ? 'border-blue-600 ring-2 ring-blue-600/30'
                      : 'border-transparent opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Content & Action Sidebar Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-16">
          {/* Main Specs & Narrative */}
          <div className="lg:col-span-8 space-y-8">
            {/* Quick Specs Strip */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs grid grid-cols-2 sm:grid-cols-4 gap-4">
              {property.bedrooms && (
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center shrink-0">
                    <Bed className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs text-slate-500 font-medium">Bedrooms</div>
                    <div className="text-sm font-bold text-slate-900">{property.bedrooms} En-Suite</div>
                  </div>
                </div>
              )}

              {property.bathrooms && (
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center shrink-0">
                    <Bath className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs text-slate-500 font-medium">Bathrooms</div>
                    <div className="text-sm font-bold text-slate-900">{property.bathrooms} Baths</div>
                  </div>
                </div>
              )}

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center shrink-0">
                  <Maximize className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs text-slate-500 font-medium">Total Size</div>
                  <div className="text-sm font-bold text-slate-900">{property.size}</div>
                </div>
              </div>

              {property.titleDeed && (
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center shrink-0">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs text-slate-500 font-medium">Title Deed</div>
                    <div className="text-xs font-bold text-slate-900 truncate" title={property.titleDeed}>
                      {property.titleDeed}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Description */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs">
              <h2 className="text-xl font-bold text-slate-900 font-serif mb-4">
                Property Overview
              </h2>
              <div className="text-slate-600 leading-relaxed text-sm sm:text-base space-y-4">
                <p>{property.description}</p>
              </div>

              {/* Architectural Features */}
              {property.features && property.features.length > 0 && (
                <div className="mt-8 pt-6 border-t border-slate-100">
                  <h3 className="text-base font-bold text-slate-900 mb-4">
                    Key Features & Infrastructure
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {property.features.map((feat, i) => (
                      <div key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700">
                        <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Legal Title Assurance */}
              <div className="mt-8 p-4 rounded-xl bg-slate-50 border border-slate-200/80 flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-blue-700 shrink-0 mt-0.5" />
                <div className="text-xs text-slate-600">
                  <span className="font-semibold text-slate-900 block mb-0.5">
                    Ascent Title & Due Diligence Guarantee:
                  </span>
                  This property has been vetted by our in-house conveyancing legal team with confirmed registry charting at the state lands bureau.
                </div>
              </div>
            </div>
          </div>

          {/* Action Sidebar */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs sticky top-28">
              <h3 className="text-base font-bold text-slate-900 mb-1">
                Take Next Action
              </h3>
              <p className="text-xs text-slate-500 mb-5">
                Our property consultants are on standby to arrange inspections or process acquisitions.
              </p>

              {/* 4 Required Action Buttons */}
              <div className="space-y-3">
                {/* 1. Schedule Inspection */}
                <button
                  onClick={() => onOpenInspection(property.title)}
                  className="w-full py-3.5 px-4 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-semibold text-xs tracking-wide flex items-center justify-center gap-2 shadow-sm transition"
                >
                  <Calendar className="w-4 h-4" />
                  <span>SCHEDULE INSPECTION</span>
                </button>

                {/* 2. I'm Interested */}
                <button
                  onClick={() => onOpenEnquiry(property.title)}
                  className="w-full py-3 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs tracking-wide flex items-center justify-center gap-2 shadow-xs transition"
                >
                  <span>I'M INTERESTED</span>
                </button>

                {/* 3. WhatsApp Direct */}
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs tracking-wide flex items-center justify-center gap-2 shadow-xs transition"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>WHATSAPP CHAT</span>
                </a>

                {/* 4. Call Us Direct */}
                <a
                  href={`tel:${settings.phone}`}
                  className="w-full py-3 px-4 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold text-xs tracking-wide flex items-center justify-center gap-2 transition"
                >
                  <Phone className="w-4 h-4 text-blue-700" />
                  <span>CALL US DIRECTLY</span>
                </a>
              </div>

              {/* Direct email option */}
              <div className="mt-5 pt-4 border-t border-slate-100 text-center">
                <a
                  href="mailto:info.ascentproperties@gmail.com"
                  target="_top"
                  rel="noopener noreferrer"
                  onClick={(e) => launchEmailClient(e)}
                  className="text-xs text-blue-700 hover:underline cursor-pointer"
                >
                  Email: info.ascentproperties@gmail.com
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Related Properties */}
        {related.length > 0 && (
          <div className="border-t border-slate-200 pt-12">
            <h2 className="text-2xl font-bold font-serif text-slate-900 mb-6">
              Similar Properties You May Like
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {related.map((rel) => (
                <div
                  key={rel.id}
                  onClick={() => onNavigateProperty(rel.slug)}
                  className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition cursor-pointer group"
                >
                  <div className="aspect-16/10 overflow-hidden bg-slate-900">
                    <img
                      src={rel.coverImage}
                      alt={rel.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-4">
                    <div className="text-xs text-slate-500 mb-1">{rel.location}</div>
                    <h3 className="text-sm font-bold text-slate-900 line-clamp-1 group-hover:text-blue-700 transition">
                      {rel.title}
                    </h3>
                    <div className="mt-2 text-sm font-bold text-blue-700">{rel.formattedPrice}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
