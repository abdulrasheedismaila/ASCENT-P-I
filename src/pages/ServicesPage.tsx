import React from 'react';
import { CheckCircle2, ArrowRight, ShieldCheck, Phone, Mail } from 'lucide-react';
import { CompanyService, SiteSettings } from '../types';
import { launchEmailClient } from '../utils/email';

interface ServicesPageProps {
  services: CompanyService[];
  settings: SiteSettings;
  onOpenEnquiry: (serviceTitle: string) => void;
}

export const ServicesPage: React.FC<ServicesPageProps> = ({
  services,
  settings,
  onOpenEnquiry
}) => {
  return (
    <div className="bg-slate-50 min-h-screen py-10 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="max-w-3xl mb-14">
          <div className="text-xs font-bold text-blue-700 tracking-wider uppercase mb-1">
            Institutional Expertise
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 font-serif">
            Our Core Real Estate Services
          </h1>
          <p className="mt-3 text-slate-600 text-sm sm:text-base leading-relaxed">
            From strategic property sales and land titling to greenfield architectural development and portfolio management, Ascent Properties delivers rigorous, high-yield solutions.
          </p>
        </div>

        {/* Services In-Depth Cards */}
        <div className="space-y-12 mb-16">
          {services.map((service, index) => {
            const isReversed = index % 2 !== 0;
            return (
              <div
                key={service.id}
                className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 grid grid-cols-1 lg:grid-cols-12"
              >
                {/* Media Image Column */}
                <div
                  className={`lg:col-span-5 relative aspect-16/10 lg:aspect-auto overflow-hidden bg-slate-950 ${
                    isReversed ? 'lg:order-2' : ''
                  }`}
                >
                  <img
                    src={service.image}
                    alt={service.title}
                    className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-slate-900/80 text-white backdrop-blur-md">
                      0{index + 1}
                    </span>
                  </div>
                </div>

                {/* Content Column */}
                <div
                  className={`lg:col-span-7 p-6 sm:p-10 flex flex-col justify-between ${
                    isReversed ? 'lg:order-1' : ''
                  }`}
                >
                  <div>
                    <div className="text-xs font-semibold text-blue-700 uppercase tracking-wider mb-2">
                      {service.scope}
                    </div>

                    <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 font-serif mb-4">
                      {service.title}
                    </h2>

                    <p className="text-slate-600 text-sm sm:text-base leading-relaxed mb-6">
                      {service.fullDescription}
                    </p>

                    {/* Features breakdown */}
                    <div className="space-y-3 mb-8">
                      <div className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                        Core Service Scope:
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        {service.features.map((feat, i) => (
                          <div key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700">
                            <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                            <span>{feat}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Consultation Action */}
                  <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="text-xs text-slate-500">
                      Tailored terms available for corporate & private clients.
                    </div>
                    <button
                      onClick={() => onOpenEnquiry(`Service Consultation: ${service.title}`)}
                      className="w-full sm:w-auto px-6 py-2.5 bg-blue-700 hover:bg-blue-800 text-white rounded-xl text-xs font-semibold tracking-wide transition shadow-xs flex items-center justify-center gap-2"
                    >
                      <span>Book Consultation</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Advisory Banner */}
        <div className="bg-slate-900 rounded-3xl p-8 sm:p-12 text-white flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="space-y-2 max-w-xl">
            <h3 className="text-2xl font-bold font-serif">Need Bespoke Corporate Advisory?</h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Our partners consult on high-value land mergers, joint-venture developments, and commercial lease structuring across West Africa.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
            <button
              onClick={() => onOpenEnquiry('Bespoke Corporate Advisory')}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold transition"
            >
              ENGAGE ADVISORY TEAM
            </button>
            <a
              href="mailto:info.ascentproperties@gmail.com"
              target="_top"
              rel="noopener noreferrer"
              onClick={(e) => launchEmailClient(e)}
              className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-semibold border border-slate-700 text-center transition cursor-pointer"
            >
              EMAIL US DIRECTLY
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
