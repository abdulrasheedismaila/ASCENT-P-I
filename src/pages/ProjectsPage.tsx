import React, { useState, useMemo } from 'react';
import { MapPin, Building2, CheckCircle2, Calendar, ArrowRight, Layers } from 'lucide-react';
import { Project } from '../types';

interface ProjectsPageProps {
  projects: Project[];
  onOpenEnquiry: (projectName: string) => void;
  onOpenLightbox: (imageUrl: string) => void;
}

export const ProjectsPage: React.FC<ProjectsPageProps> = ({
  projects,
  onOpenEnquiry,
  onOpenLightbox
}) => {
  const [statusFilter, setStatusFilter] = useState<string>('All');

  const filteredProjects = useMemo(() => {
    if (statusFilter === 'All') return projects;
    return projects.filter((p) => p.status === statusFilter);
  }, [projects, statusFilter]);

  const statuses = ['All', 'Ongoing', 'Planning', 'Completed', 'Coming Soon'];

  return (
    <div className="bg-slate-50 min-h-screen py-10 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="max-w-3xl mb-10">
          <div className="text-xs font-bold text-blue-700 tracking-wider uppercase mb-1">
            Real Estate Developments
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 font-serif">
            Signature Property Projects
          </h1>
          <p className="mt-3 text-slate-600 text-sm sm:text-base leading-relaxed">
            From waterfront master enclaves on Gracefield Island to luxury high-rises in Abuja, explore our active, planned, and completed developments.
          </p>
        </div>

        {/* Status Filter Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8">
          {statuses.map((status) => {
            const isActive = statusFilter === status;
            return (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                  isActive
                    ? 'bg-blue-700 text-white shadow-sm'
                    : 'bg-white text-slate-700 border border-slate-200 hover:border-slate-300'
                }`}
              >
                {status}
              </button>
            );
          })}
        </div>

        {/* Projects List */}
        <div className="space-y-12">
          {filteredProjects.map((project) => (
            <div
              key={project.id}
              className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-lg transition-all duration-300 grid grid-cols-1 lg:grid-cols-12"
            >
              {/* Media Column */}
              <div className="lg:col-span-6 relative aspect-16/10 lg:aspect-auto overflow-hidden bg-slate-950 group">
                <img
                  src={project.coverImage}
                  alt={project.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute top-4 left-4 flex gap-2">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-md shadow-xs ${
                      project.status === 'Completed'
                        ? 'bg-emerald-600 text-white'
                        : project.status === 'Ongoing'
                        ? 'bg-blue-600 text-white'
                        : project.status === 'Planning'
                        ? 'bg-amber-600 text-white'
                        : 'bg-purple-600 text-white'
                    }`}
                  >
                    {project.status}
                  </span>
                </div>

                {/* Sub-gallery previews if any */}
                {project.images && project.images.length > 1 && (
                  <div className="absolute bottom-4 left-4 right-4 flex gap-2 overflow-x-auto p-1 bg-black/40 backdrop-blur-xs rounded-xl">
                    {project.images.slice(0, 4).map((img, i) => (
                      <button
                        key={i}
                        onClick={() => onOpenLightbox(img)}
                        className="w-14 h-10 rounded-md overflow-hidden shrink-0 border border-white/30 hover:border-white transition"
                      >
                        <img src={img} alt="" className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Information Column */}
              <div className="lg:col-span-6 p-6 sm:p-8 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 text-xs font-semibold text-blue-700 uppercase tracking-wider mb-2">
                    <Building2 className="w-4 h-4" />
                    <span>{project.type}</span>
                  </div>

                  <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 font-serif mb-2">
                    {project.name}
                  </h2>

                  <div className="flex items-center gap-1.5 text-xs sm:text-sm text-slate-500 mb-4">
                    <MapPin className="w-4 h-4 text-blue-600 shrink-0" />
                    <span>{project.location}</span>
                  </div>

                  <p className="text-slate-600 text-xs sm:text-sm leading-relaxed mb-6">
                    {project.description}
                  </p>

                  {/* Features List */}
                  {project.features && project.features.length > 0 && (
                    <div className="space-y-2 mb-6">
                      <div className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                        Development Highlights:
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {project.features.map((feat, i) => (
                          <div key={i} className="flex items-start gap-2 text-xs text-slate-600">
                            <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />
                            <span>{feat}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Progress Bar (Only display when entered by administrator) */}
                  {project.progress !== undefined && (
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 mb-6">
                      <div className="flex justify-between items-center text-xs font-medium text-slate-700 mb-1.5">
                        <span className="font-semibold">Development Milestone</span>
                        <span className="tabular-nums font-bold text-blue-700">{project.progress}% Complete</span>
                      </div>
                      <div className="w-full bg-slate-200 rounded-full h-2.5 overflow-hidden">
                        <div
                          className="bg-blue-600 h-2.5 rounded-full transition-all duration-700"
                          style={{ width: `${project.progress}%` }}
                        />
                      </div>
                      {project.deliveryDate && (
                        <div className="mt-2 text-[11px] text-slate-500 flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-slate-400" />
                          <span>Estimated Completion: {project.deliveryDate}</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Bottom action & unit availability */}
                <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  {project.availableUnits && (
                    <div className="text-xs text-slate-600 font-medium">
                      Status: <span className="font-bold text-slate-900">{project.availableUnits}</span>
                    </div>
                  )}

                  <button
                    onClick={() => onOpenEnquiry(`Project: ${project.name}`)}
                    className="w-full sm:w-auto px-6 py-2.5 bg-blue-700 hover:bg-blue-800 text-white rounded-xl text-xs font-semibold tracking-wide transition shadow-xs flex items-center justify-center gap-2"
                  >
                    <span>Enquire About Project</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
