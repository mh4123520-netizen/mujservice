import { useState } from 'react';
import { MapPin, Search, ArrowRight } from 'lucide-react';
import { FAMOUS_AREAS_DIRECTORY } from '../data/famousAreas.ts';

interface FamousAreasSectionProps {
  onBookInArea: (area: string, city: string) => void;
}

export function FamousAreasSection({ onBookInArea }: FamousAreasSectionProps) {
  const [activeCity, setActiveCity] = useState<'All' | 'Multan' | 'Khanewal' | 'Surrounding Towns'>('All');
  const [query, setQuery] = useState('');

  const groups =
    activeCity === 'All'
      ? FAMOUS_AREAS_DIRECTORY
      : FAMOUS_AREAS_DIRECTORY.filter((g) => g.city === activeCity);

  const q = query.trim().toLowerCase();

  return (
    <section className="px-3 sm:px-6">
      <div className="max-w-6xl mx-auto bg-white/80 backdrop-blur-xl border border-black/[0.05] rounded-[32px] p-7 sm:p-11">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-8">
          <div>
            <div className="text-xs font-medium text-[#0071e3] mb-2">
              Southern Punjab Service Coverage
            </div>
            <h2 className="text-2xl sm:text-4xl font-semibold tracking-tight text-[#1d1d1f]">
              All Famous Areas Covered in Khanewal &amp; Multan
            </h2>
            <p className="text-[#6e6e73] mt-2 max-w-2xl text-sm">
              Dedicated service vans stationed in Khanewal and Multan dispatch directly to residential colonies, commercial plazas, and industrial estates.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="relative">
              <Search className="w-4 h-4 text-[#86868b] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Find your colony or sector..."
                className="pl-10 pr-4 py-2 text-xs bg-[#f5f5f7] border border-black/[0.06] rounded-full focus:outline-none focus:ring-2 focus:ring-[#0071e3]/30"
              />
            </div>

            <div className="flex flex-wrap items-center gap-1 p-1 bg-[#f5f5f7] rounded-full border border-black/[0.05]">
              {(['All', 'Multan', 'Khanewal', 'Surrounding Towns'] as const).map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setActiveCity(tab)}
                  className={`px-3.5 py-1.5 text-xs font-medium rounded-full transition-colors cursor-pointer whitespace-nowrap ${
                    activeCity === tab ? 'bg-[#1d1d1f] text-white' : 'text-[#6e6e73] hover:text-[#1d1d1f]'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {groups.map((grp) => {
            const visibleAreas = grp.areas.filter((a) => !q || a.toLowerCase().includes(q));
            return (
              <div
                key={grp.city}
                className="bg-[#f5f5f7] rounded-[24px] p-6 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 pb-4 border-b border-black/[0.06]">
                    <div>
                      <h3 className="text-lg font-semibold text-[#1d1d1f]">{grp.city}</h3>
                      <p className="text-xs text-[#6e6e73] mt-0.5">{grp.dispatchHub}</p>
                    </div>
                    <span className="text-xs font-medium text-[#0071e3]">{grp.eta}</span>
                  </div>

                  {visibleAreas.length === 0 ? (
                    <p className="text-xs text-[#6e6e73] py-6">No localities match "{query}".</p>
                  ) : (
                    <div className="mt-4 grid grid-cols-2 gap-2">
                      {visibleAreas.map((area) => (
                        <button
                          key={area}
                          type="button"
                          onClick={() => onBookInArea(area, grp.city)}
                          className="group flex items-center justify-between gap-1.5 px-3 py-2 bg-white border border-black/[0.05] rounded-xl text-left text-xs font-medium text-[#1d1d1f] hover:border-[#0071e3] transition-all cursor-pointer"
                        >
                          <span className="flex items-center gap-1.5 truncate">
                            <MapPin className="w-3 h-3 text-[#0071e3] shrink-0" />
                            <span className="truncate">{area}</span>
                          </span>
                          <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 text-[#0071e3] shrink-0 transition-opacity" />
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <div className="mt-5 pt-4 border-t border-black/[0.06] flex items-center justify-between text-xs text-[#6e6e73]">
                  <span className="tabular-nums">{grp.areas.length} localities covered</span>
                  <button
                    type="button"
                    onClick={() => onBookInArea(grp.areas[0], grp.city)}
                    className="font-medium text-[#0071e3] hover:underline cursor-pointer"
                  >
                    Book in {grp.city}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
