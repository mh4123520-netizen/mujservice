import { useState } from 'react';
import { FadeUp, ScaleIn } from '../../components/MotionReveal.tsx';
import { ResilientImage } from '../../components/ResilientImage.tsx';
import type { ProjectItem } from '../../types/index.ts';
import type { PublicPageProps } from './HomePage.tsx';

export function ProjectsPage({ data, onOpenBooking }: PublicPageProps) {
  const categories = ['All', ...Array.from(new Set(data.projects.map((p) => p.category)))];
  const [selectedCategory, setSelectedCategory] = useState('All');

  const filtered: ProjectItem[] =
    selectedCategory === 'All'
      ? data.projects
      : data.projects.filter((p) => p.category === selectedCategory);

  return (
    <div className="px-3 sm:px-6 py-8 space-y-10 bg-[#fbfbfd]">
      <FadeUp>
        <section className="max-w-6xl mx-auto bg-black text-white rounded-[32px] p-8 sm:p-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <div className="text-xs font-medium text-[#2997ff] mb-2">Engineering Portfolio</div>
              <h1 className="text-3xl sm:text-5xl font-semibold tracking-tight">
                Completed HVACR Projects.
              </h1>
              <p className="text-white/70 mt-3 max-w-2xl">
                Commercial VRF plants, medical facility ducting, and industrial cold storage installations across Khanewal and Multan.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-1.5">
              {categories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 text-xs font-medium rounded-full transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                    selectedCategory === cat
                      ? 'bg-[#0071e3] text-white'
                      : 'bg-white/10 text-white/80 hover:bg-white/20'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </section>
      </FadeUp>

      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
        {filtered.map((project, idx) => (
          <ScaleIn key={project.id} delay={idx * 0.06}>
            <article className="bg-[#f5f5f7] rounded-[28px] overflow-hidden flex flex-col justify-between h-full group hover:shadow-xl transition-all duration-300">
              <div>
                <div className="p-3 pb-0">
                  <div className="h-64 rounded-[20px] overflow-hidden bg-slate-200">
                    <ResilientImage
                      src={project.imageUrl}
                      alt={project.title}
                      fallbackTitle={project.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                    />
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex flex-wrap items-center gap-2 text-xs text-[#6e6e73]">
                    <span className="font-medium text-[#0071e3]">{project.category}</span>
                    <span aria-hidden="true">·</span>
                    <span>{project.location}</span>
                    <span aria-hidden="true">·</span>
                    <span className="tabular-nums">{project.completionDate}</span>
                  </div>
                  <h2 className="text-xl font-semibold text-[#1d1d1f] mt-2">{project.title}</h2>
                  <div className="text-xs font-medium text-[#6e6e73] mt-1">Client: {project.clientName}</div>
                  <p className="text-sm text-[#6e6e73] mt-3 leading-relaxed">{project.summary}</p>
                </div>
              </div>
              <div className="px-6 py-4 bg-white/75 border-t border-black/[0.06] flex items-center justify-between gap-4">
                <span className="text-xs font-medium text-[#1d1d1f]">{project.metrics}</span>
                <button
                  type="button"
                  onClick={() => onOpenBooking(undefined, `Inquiry regarding project similar to: ${project.title}`)}
                  className="px-4 py-2 text-xs font-medium text-white bg-[#1d1d1f] hover:bg-black rounded-full cursor-pointer whitespace-nowrap shrink-0"
                >
                  Request Similar Quote
                </button>
              </div>
            </article>
          </ScaleIn>
        ))}
      </div>
    </div>
  );
}
