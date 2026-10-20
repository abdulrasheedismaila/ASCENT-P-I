import React, { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  MapPin,
  Bed,
  Bath,
  Maximize,
  SlidersHorizontal,
  RotateCcw,
  Building,
  CheckCircle2
} from 'lucide-react';
import { Property } from '../types';

interface PropertiesPageProps {
  properties: Property[];
  onNavigate: (page: string, params?: any) => void;
  onOpenInspection: (propertyTitle: string) => void;
  onOpenEnquiry: (propertyTitle: string) => void;
  initialFilters?: {
    location?: string;
    type?: string;
    purpose?: string;
    maxPrice?: string;
  };
}

export const PropertiesPage: React.FC<PropertiesPageProps> = ({
  properties,
  onNavigate,
  onOpenInspection,
  onOpenEnquiry,
  initialFilters
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>(initialFilters?.type || 'All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [locationFilter, setLocationFilter] = useState<string>(initialFilters?.location || 'All');
  const [purposeFilter, setPurposeFilter] = useState<string>(initialFilters?.purpose || 'All');
  const [availabilityFilter, setAvailabilityFilter] = useState<string>('All');
  const [maxPriceFilter, setMaxPriceFilter] = useState<string>(initialFilters?.maxPrice || 'All');
  const [sortBy, setSortBy] = useState<string>('featured');

  const categories = [
    'All',
    'Residential',
    'Duplexes',
    'Apartments',
    'Land',
    'Commercial',
    'Office spaces',
    'Estates'
  ];

  const filteredProperties = useMemo(() => {
    return properties.filter((item) => {
      // Category filter
      if (selectedCategory !== 'All' && item.type !== selectedCategory) {
        return false;
      }
      // Purpose filter
      if (purposeFilter !== 'All' && item.purpose !== purposeFilter) {
        return false;
      }
      // Location filter
      if (locationFilter !== 'All') {
        const matchesLocation =
          item.location.toLowerCase().includes(locationFilter.toLowerCase()) ||
          item.city.toLowerCase().includes(locationFilter.toLowerCase());
        if (!matchesLocation) return false;
      }
      // Availability filter
      if (availabilityFilter !== 'All' && item.availability !== availabilityFilter) {
        return false;
      }
      // Max price filter
      if (maxPriceFilter !== 'All') {
        const max = parseInt(maxPriceFilter, 10);
        if (!isNaN(max) && item.price > max) {
          return false;
        }
      }
      // Query search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesQuery =
          item.title.toLowerCase().includes(q) ||
          item.location.toLowerCase().includes(q) ||
          item.city.toLowerCase().includes(q) ||
          item.description.toLowerCase().includes(q);
        if (!matchesQuery) return false;
      }
      return true;
    }).sort((a, b) => {
      if (sortBy === 'price-low') return a.price - b.price;
      if (sortBy === 'price-high') return b.price - a.price;
      if (sortBy === 'newest') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
    });
  }, [
    properties,
    selectedCategory,
    purposeFilter,
    locationFilter,
    availabilityFilter,
    maxPriceFilter,
    searchQuery,
    sortBy
  ]);

  const resetFilters = () => {
    setSelectedCategory('All');
    setSearchQuery('');
    setLocationFilter('All');
    setPurposeFilter('All');
    setAvailabilityFilter('All');
    setMaxPriceFilter('All');
    setSortBy('featured');
  };

  return (
    <div className="bg-slate-50 min-h-screen py-10 sm:py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Title & Breadcrumbs */}
        <div className="mb-8">
          <div className="text-xs font-bold text-blue-700 tracking-wider uppercase mb-1">
            Verified Property Listings
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 font-serif">
            Ascent Property Portfolio
          </h1>
          <p className="mt-2 text-slate-600 text-sm sm:text-base max-w-2xl">
            Explore verified luxury duplexes, waterfront villas, serviced apartments, and titled commercial land across Nigeria.
          </p>
        </div>

        {/* Category Tabs (Segmented control button group) */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-6 scrollbar-none">
          {categories.map((cat) => {
            const isActive = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all duration-200 ${
                  isActive
                    ? 'bg-blue-700 text-white shadow-sm'
                    : 'bg-white text-slate-700 border border-slate-200 hover:border-slate-300 hover:bg-slate-100'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Filter Controls Bar */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-xs mb-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
            {/* Search input */}
            <div className="relative lg:col-span-2">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search by title, landmark or feature..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent bg-slate-50/50"
              />
            </div>

            {/* Location selector */}
            <div>
              <select
                value={locationFilter}
                onChange={(e) => setLocationFilter(e.target.value)}
                className="w-full px-3 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent bg-slate-50/50 text-slate-700"
              >
                <option value="All">All Locations</option>
                <option value="Ikoyi">Ikoyi, Lagos</option>
                <option value="Lekki Phase 1">Lekki Phase 1</option>
                <option value="Victoria Island">Victoria Island</option>
                <option value="Epe">Epe Corridor</option>
                <option value="Abuja">Abuja FCT</option>
              </select>
            </div>

            {/* Availability selector */}
            <div>
              <select
                value={availabilityFilter}
                onChange={(e) => setAvailabilityFilter(e.target.value)}
                className="w-full px-3 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent bg-slate-50/50 text-slate-700"
              >
                <option value="All">All Availability</option>
                <option value="Available">Available</option>
                <option value="Under Offer">Under Offer</option>
                <option value="Sold Out">Sold Out</option>
              </select>
            </div>

            {/* Sort selector */}
            <div>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-3 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent bg-slate-50/50 text-slate-700"
              >
                <option value="featured">Featured First</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="newest">Recently Listed</option>
              </select>
            </div>
          </div>

          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>
              Showing <strong className="text-slate-800">{filteredProperties.length}</strong> verified properties
            </span>
            <button
              onClick={resetFilters}
              className="inline-flex items-center gap-1 text-blue-700 hover:text-blue-800 font-medium"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Filters</span>
            </button>
          </div>
        </div>

        {/* Properties Grid */}
        {filteredProperties.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center max-w-md mx-auto my-8">
            <Building className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-slate-900">No properties match your criteria</h3>
            <p className="text-xs text-slate-500 mt-1 mb-5">
              Try adjusting your price range, location, or property category to view available listings.
            </p>
            <button
              onClick={resetFilters}
              className="px-5 py-2.5 bg-blue-700 text-white rounded-lg text-xs font-semibold hover:bg-blue-800 transition"
            >
              Reset All Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProperties.map((property) => (
              <div
                key={property.id}
                className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col group"
              >
                {/* Property Cover Image */}
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
                    <span
                      className={`px-2.5 py-1 rounded text-white text-xs font-semibold ${
                        property.availability === 'Available'
                          ? 'bg-blue-700'
                          : property.availability === 'Under Offer'
                          ? 'bg-amber-600'
                          : 'bg-slate-700'
                      }`}
                    >
                      {property.availability}
                    </span>
                  </div>
                  <div className="absolute bottom-3 left-3 text-white text-lg sm:text-xl font-bold drop-shadow-md">
                    {property.formattedPrice}
                  </div>
                </div>

                {/* Property Card Content */}
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
                      className="py-2.5 px-3 rounded-lg border border-slate-300 hover:border-slate-400 text-slate-700 text-xs font-semibold text-center transition"
                    >
                      View Details
                    </button>
                    <button
                      onClick={() => onOpenEnquiry(property.title)}
                      className="py-2.5 px-3 rounded-lg bg-blue-700 hover:bg-blue-800 text-white text-xs font-semibold text-center transition shadow-xs"
                    >
                      Enquire
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
