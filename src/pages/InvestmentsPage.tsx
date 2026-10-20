import React from 'react';
import {
  TrendingUp,
  ShieldAlert,
  Clock,
  Coins,
  FileCheck,
  CheckCircle,
  ArrowRight,
  Download,
  AlertTriangle
} from 'lucide-react';
import { InvestmentOpportunity } from '../types';

interface InvestmentsPageProps {
  investments: InvestmentOpportunity[];
  onOpenEnquiry: (opportunityTitle: string) => void;
  onOpenLightbox: (imageUrl: string) => void;
}

export const InvestmentsPage: React.FC<InvestmentsPageProps> = ({
  investments,
  onOpenEnquiry,
  onOpenLightbox
}) => {
  return (
    <div className="bg-slate-50 min-h-screen py-10 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="max-w-3xl mb-12">
          <div className="text-xs font-bold text-blue-700 tracking-wider uppercase mb-1">
            Capital Growth & Asset Syndication
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 font-serif">
            Real Estate Investment Opportunities
          </h1>
          <p className="mt-3 text-slate-600 text-sm sm:text-base leading-relaxed">
            Co-invest in high-yield off-plan developments, infrastructure land-banking corridors, and commercial assets structured for institutional security and verified title backing.
          </p>
        </div>

        {/* Investment Opportunities Grid */}
        <div className="space-y-10 mb-16">
          {investments.map((inv) => (
            <div
              key={inv.id}
              className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-lg transition-all duration-300 grid grid-cols-1 lg:grid-cols-12"
            >
              {/* Visual column */}
              <div className="lg:col-span-5 relative aspect-16/10 lg:aspect-auto overflow-hidden bg-slate-950">
                <img
                  src={inv.supportingImages[0]}
                  alt={inv.title}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
                <div className="absolute top-4 left-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-md ${
                      inv.status === 'Active'
                        ? 'bg-emerald-600 text-white'
                        : 'bg-amber-600 text-white'
                    }`}
                  >
                    {inv.status}
                  </span>
                </div>
              </div>

              {/* Data & Content Column */}
              <div className="lg:col-span-7 p-6 sm:p-8 flex flex-col justify-between">
                <div>
                  <div className="text-xs text-blue-700 font-semibold tracking-wider uppercase mb-1.5">
                    {inv.location}
                  </div>
                  <h2 className="text-2xl font-bold text-slate-900 font-serif mb-3">
                    {inv.title}
                  </h2>
                  <p className="text-slate-600 text-xs sm:text-sm leading-relaxed mb-6">
                    {inv.description}
                  </p>

                  {/* Key Metrics Strip */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5 p-4 rounded-2xl bg-slate-50 border border-slate-100 mb-6">
                    <div>
                      <div className="text-[11px] text-slate-500 font-medium flex items-center gap-1">
                        <Coins className="w-3.5 h-3.5 text-blue-600" />
                        <span>Min. Entry</span>
                      </div>
                      <div className="text-sm font-bold text-slate-900 mt-0.5">
                        {inv.minInvestment}
                      </div>
                    </div>

                    <div>
                      <div className="text-[11px] text-slate-500 font-medium flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-blue-600" />
                        <span>Investment Tenure</span>
                      </div>
                      <div className="text-sm font-bold text-slate-900 mt-0.5">
                        {inv.investmentPeriod}
                      </div>
                    </div>

                    <div>
                      <div className="text-[11px] text-slate-500 font-medium flex items-center gap-1">
                        <TrendingUp className="w-3.5 h-3.5 text-blue-600" />
                        <span>Projected ROI (Est.)</span>
                      </div>
                      <div className="text-sm font-bold text-blue-700 mt-0.5">
                        {inv.projectedReturn || 'Market Dependent'}
                      </div>
                    </div>
                  </div>

                  {/* Project Info */}
                  <div className="text-xs text-slate-600 mb-6">
                    <span className="font-semibold text-slate-800">Project Blueprint: </span>
                    {inv.projectInfo}
                  </div>

                  {/* Documents */}
                  {inv.documents && inv.documents.length > 0 && (
                    <div className="mb-6 space-y-2">
                      <div className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
                        Available Investment Documents:
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {inv.documents.map((doc, idx) => (
                          <div
                            key={idx}
                            onClick={() => onOpenEnquiry(`Document Request: ${doc.name} (${inv.title})`)}
                            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs cursor-pointer transition"
                          >
                            <FileCheck className="w-3.5 h-3.5 text-blue-600" />
                            <span>{doc.name}</span>
                            <span className="text-slate-400">({doc.size})</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Bottom Action */}
                <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="text-[11px] text-slate-500">
                    Subject to allocation limits and investor verification.
                  </div>
                  <button
                    onClick={() => onOpenEnquiry(`Investment: ${inv.title}`)}
                    className="w-full sm:w-auto px-6 py-2.5 bg-blue-700 hover:bg-blue-800 text-white rounded-xl text-xs font-semibold tracking-wide transition shadow-xs flex items-center justify-center gap-2"
                  >
                    <span>Request Investment Prospectus</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Investment Disclaimer & Due Diligence Advisory */}
        <div className="bg-amber-50/70 border border-amber-200/90 rounded-2xl p-6 sm:p-8">
          <div className="flex items-start gap-3.5">
            <AlertTriangle className="w-6 h-6 text-amber-700 shrink-0 mt-0.5" />
            <div className="space-y-2">
              <h3 className="text-base font-bold text-amber-900 font-serif">
                Regulatory & Investment Risk Disclaimer
              </h3>
              <p className="text-xs sm:text-sm text-amber-900/80 leading-relaxed">
                Past performance is not an indicator or guarantee of future returns. Financial projections and target yields stated herein are estimates calculated based on current market dynamics, historical appreciation in designated infrastructure corridors, and architectural feasibility models.
              </p>
              <p className="text-xs sm:text-sm text-amber-900/80 leading-relaxed">
                Ascent Properties and Investment Company strongly encourages all prospective investors and syndicates to perform independent legal, financial, and cadastral due diligence prior to committing capital. Formal contract notes and deed allocations are issued upon fund receipt.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
