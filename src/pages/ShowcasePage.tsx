import React, { useState, useMemo } from 'react';
import { Play, Image as ImageIcon, MapPin, Eye } from 'lucide-react';
import { ShowcaseItem } from '../types';

interface ShowcasePageProps {
  showcase: ShowcaseItem[];
  onOpenLightbox: (index: number) => void;
}

export const ShowcasePage: React.FC<ShowcasePageProps> = ({
  showcase,
  onOpenLightbox
}) => {
  const [activeFilter, setActiveFilter] = useState<string>('All');

  const filters = [
    'All',
    'Properties',
    'Projects',
    'Interiors',
    'Exteriors',
    'Construction',
    'Videos'
  ];

  const filteredItems = useMemo(() => {
    if (activeFilter === 'All') return showcase;
    if (activeFilter === 'Videos') return showcase.filter((item) => item.mediaType === 'video');
    return showcase.filter((item) => item.category === activeFilter);
  }, [showcase, activeFilter]);

  return (
    <div className="bg-slate-50 min-h-screen py-10 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="max-w-3xl mb-10">
          <div className="text-xs font-bold text-blue-700 tracking-wider uppercase mb-1">
            Visual Media Gallery
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 font-serif">
            Property & Architectural Showcase
          </h1>
          <p className="mt-3 text-slate-600 text-sm sm:text-base leading-relaxed">
            Experience the architectural precision, construction milestones, and luxury interior design that define Ascent Properties developments.
          </p>
        </div>

        {/* Filter Controls (Segmented Tabs) */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8">
          {filters.map((f) => {
            const isActive = activeFilter === f;
            return (
              <button
                key={f}
                onClick={() => setActiveFilter(f)}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 ${
                  isActive
                    ? 'bg-blue-700 text-white shadow-sm'
                    : 'bg-white text-slate-700 border border-slate-200 hover:border-slate-300'
                }`}
              >
                {f}
              </button>
            );
          })}
        </div>

        {/* Media Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item, index) => {
            // Find global index in showcase array for lightbox
            const globalIndex = showcase.findIndex((s) => s.id === item.id);
            const isVideo = item.mediaType === 'video';

            return (
              <div
                key={item.id}
                onClick={() => onOpenLightbox(globalIndex !== -1 ? globalIndex : index)}
                className="group relative aspect-4/3 rounded-2xl overflow-hidden bg-slate-950 shadow-xs hover:shadow-xl transition-all duration-300 cursor-pointer border border-slate-200/80"
              >
                {/* Media Image / Video Thumbnail */}
                <img
                  src={isVideo ? (item.thumbnail || item.url) : item.url}
                  alt={item.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-108"
                  loading="lazy"
                />

                {/* Video Play badge or category badge */}
                <div className="absolute top-3 left-3 flex items-center gap-1.5 z-10">
                  <span className="px-2.5 py-1 rounded bg-slate-900/80 backdrop-blur-xs text-white text-[11px] font-medium flex items-center gap-1">
                    {isVideo ? <Play className="w-3 h-3 text-blue-400 fill-current" /> : <ImageIcon className="w-3 h-3 text-blue-400" />}
                    <span>{item.category}</span>
                  </span>
                </div>

                {/* Hover overlay with caption */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent opacity-80 group-hover:opacity-95 transition-opacity flex flex-col justify-end p-5 text-white">
                  {item.location && (
                    <div className="flex items-center gap-1 text-[11px] text-blue-400 mb-1">
                      <MapPin className="w-3 h-3" />
                      <span>{item.location}</span>
                    </div>
                  )}
                  <h3 className="text-base font-bold line-clamp-1 group-hover:text-blue-300 transition-colors">
                    {item.title}
                  </h3>
                  {item.description && (
                    <p className="text-xs text-slate-300 mt-1 line-clamp-2 leading-relaxed">
                      {item.description}
                    </p>
                  )}
                  <div className="mt-3 flex items-center gap-1.5 text-xs text-blue-400 font-medium">
                    <Eye className="w-3.5 h-3.5" />
                    <span>Click to view in high resolution</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
