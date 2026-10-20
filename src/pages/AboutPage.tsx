import React from 'react';
import {
  ShieldCheck,
  Award,
  TrendingUp,
  Compass,
  CheckCircle2,
  Building,
  Target,
  Users
} from 'lucide-react';
import { SiteSettings } from '../types';

interface AboutPageProps {
  settings: SiteSettings;
  onNavigate: (page: string) => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ settings, onNavigate }) => {
  return (
    <div className="bg-slate-50 min-h-screen py-10 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="max-w-3xl mb-14">
          <div className="text-xs font-bold text-blue-700 tracking-wider uppercase mb-1">
            Corporate Profile
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 font-serif">
            Ascent Properties and Investment Company
          </h1>
          <p className="mt-3 text-slate-600 text-sm sm:text-base leading-relaxed">
            Building value. Creating opportunities. We are an integrated Nigerian real estate development and private investment partnership committed to institutional excellence and intergenerational wealth preservation.
          </p>
        </div>

        {/* Narrative & Vision Split */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center mb-16">
          <div className="lg:col-span-6 space-y-5 text-slate-700 text-sm sm:text-base leading-relaxed">
            <h2 className="text-2xl sm:text-3xl font-bold font-serif text-slate-900">
              Our Vision & Corporate Mandate
            </h2>
            <p>
              Founded on the belief that real estate in emerging economic hubs should offer transparency, security, and sustained appreciation, Ascent Properties has emerged as a beacon of reliability in the Nigerian property sector.
            </p>
            <p>
              We operate across prime residential and commercial corridors—including Ikoyi, Lekki Phase 1, Victoria Island, the emerging Epe Growth Corridor, and the Federal Capital Territory, Abuja.
            </p>
            <p>
              Our multidisciplinary team comprises real estate investment analysts, registered surveyors, structural engineers, and conveyancing legal counsel, ensuring that every asset we bring to market is free from encumbrances and primed for capital growth.
            </p>
          </div>

          <div className="lg:col-span-6 relative aspect-4/3 rounded-3xl overflow-hidden shadow-xl bg-slate-900">
            <img
              src="https://i.ibb.co/3mRmTZ31/photo-2026-10-15-21-26-38.jpg"
              alt="Ascent Properties Architectural Vision"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />
            <div className="absolute bottom-6 left-6 right-6 text-white">
              <div className="text-xs font-semibold text-blue-400 uppercase tracking-wider mb-1">
                Institutional Assurance
              </div>
              <div className="text-base sm:text-lg font-bold font-serif">
                Uncompromising Due Diligence in African Property Markets
              </div>
            </div>
          </div>
        </div>

        {/* 6 Core Pillars */}
        <div className="mb-16">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <div className="text-xs font-bold text-blue-700 tracking-wider uppercase mb-1">
              Guiding Principles
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold font-serif text-slate-900">
              Our Six Corporate Commitments
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-xs">
              <ShieldCheck className="w-8 h-8 text-blue-700 mb-4" />
              <h3 className="text-base font-bold text-slate-900 mb-2">1. Integrity & Transparency</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                We believe trust is our most valuable asset. We provide prospective buyers and investors with verified title documentation, cadastral surveys, and honest market projections.
              </p>
            </div>

            <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-xs">
              <TrendingUp className="w-8 h-8 text-blue-700 mb-4" />
              <h3 className="text-base font-bold text-slate-900 mb-2">2. Investment Intelligence</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                We identify strategic macroeconomic growth drivers, government infrastructure corridors, and demographic shifts before deploying client capital.
              </p>
            </div>

            <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-xs">
              <Users className="w-8 h-8 text-blue-700 mb-4" />
              <h3 className="text-base font-bold text-slate-900 mb-2">3. Client Success</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Whether purchasing a family residence in Lekki or syndicating a commercial office floor in Victoria Island, our client outcomes remain the singular metric of our success.
              </p>
            </div>

            <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-xs">
              <Award className="w-8 h-8 text-blue-700 mb-4" />
              <h3 className="text-base font-bold text-slate-900 mb-2">4. Architectural Excellence</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Our property developments combine timeless architectural aesthetics, high structural safety coefficients, and sustainable energy provisions.
              </p>
            </div>

            <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-xs">
              <Target className="w-8 h-8 text-blue-700 mb-4" />
              <h3 className="text-base font-bold text-slate-900 mb-2">5. Value Creation</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                We transform raw land through perimeter fencing, gazette ratification, and road construction, unlocking immediate capital appreciation for land-bankers.
              </p>
            </div>

            <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-xs">
              <Compass className="w-8 h-8 text-blue-700 mb-4" />
              <h3 className="text-base font-bold text-slate-900 mb-2">6. Long-Term Thinking</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                We build durable, multi-generational wealth vehicles that protect our clients against inflationary headwinds and currency shifts.
              </p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="bg-blue-900 text-white rounded-3xl p-8 sm:p-12 text-center">
          <h3 className="text-2xl sm:text-3xl font-bold font-serif mb-3">
            Explore Partnership Opportunities
          </h3>
          <p className="text-blue-100 text-xs sm:text-sm max-w-xl mx-auto mb-6">
            Join hundreds of private clients and institutions who trust Ascent Properties for land acquisition, development, and high-yield real estate syndication.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => onNavigate('properties')}
              className="px-6 py-3 bg-white text-blue-900 rounded-xl text-xs font-semibold hover:bg-blue-50 transition"
            >
              EXPLORE OUR PROPERTIES
            </button>
            <button
              onClick={() => onNavigate('contact')}
              className="px-6 py-3 bg-blue-800 text-white rounded-xl text-xs font-semibold hover:bg-blue-700 border border-blue-400/30 transition"
            >
              SCHEDULE A MEETING
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
