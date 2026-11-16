import { useEffect, useState } from 'react';
import { Camera, ChevronLeft, ChevronRight, MapPin, X, ZoomIn } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { FadeUp, ScaleIn } from '../../components/MotionReveal.tsx';
import { ResilientImage } from '../../components/ResilientImage.tsx';
import type { GalleryItem } from '../../types/index.ts';
import type { PublicPageProps } from './HomePage.tsx';

export function GalleryPage({ data, onOpenBooking }: PublicPageProps) {
  const items = data.galleryItems || [];
  const categories = ['All', ...Array.from(new Set(items.map((g) => g.category)))];
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const filtered: GalleryItem[] =
    selectedCategory === 'All'
      ? items
      : items.filter((item) => item.category === selectedCategory);

  useEffect(() => {
    if (lightboxIndex === null) return;
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        setLightboxIndex(null);
      } else if (e.key === 'ArrowRight') {
        setLightboxIndex((prev) => (prev === null ? null : (prev + 1) % filtered.length));
      } else if (e.key === 'ArrowLeft') {
        setLightboxIndex((prev) => (prev === null ? null : (prev - 1 + filtered.length) % filtered.length));
      }
    }
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [lightboxIndex, filtered.length]);

  const activeItem = lightboxIndex !== null ? filtered[lightboxIndex] : null;

  return (
    <div className="px-3 sm:px-6 py-8 space-y-10 bg-[#fbfbfd]">
      <FadeUp>
        <section className="max-w-6xl mx-auto bg-black text-white rounded-[32px] p-8 sm:p-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="max-w-2xl">
            <div className="text-xs font-medium text-sky-400 mb-2">
              Visual Field Documentation
            </div>
            <h1 className="text-3xl sm:text-5xl font-semibold tracking-tight">
              HVACR Installation &amp; Workshop Gallery
            </h1>
            <p className="text-white/70 mt-3 leading-relaxed">
              Verified copper brazing, VRF manifold commissioning, walk-in cold rooms, and residential split installations across Multan and Khanewal.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => {
                  setSelectedCategory(cat);
                  setLightboxIndex(null);
                }}
                className={`px-4 py-2 text-xs font-medium rounded-full transition-all cursor-pointer whitespace-nowrap ${
                  selectedCategory === cat
                    ? 'bg-white text-black'
                    : 'bg-white/10 text-white/80 hover:bg-white/20 hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </section>
      </FadeUp>

      <section className="max-w-6xl mx-auto">
        {filtered.length === 0 ? (
          <div className="bg-[#f5f5f7] rounded-[32px] p-12 text-center">
            <Camera className="w-8 h-8 text-[#86868b] mx-auto mb-3" />
            <h2 className="text-lg font-semibold text-[#1d1d1f]">No Gallery Photos Available</h2>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((item, idx) => (
              <ScaleIn key={item.id} delay={(idx % 6) * 0.05} className={idx === 0 ? 'sm:col-span-2 lg:col-span-2' : ''}>
                <article className="bg-[#f5f5f7] rounded-[28px] overflow-hidden flex flex-col justify-between h-full group">
                  <div className="p-3 pb-0">
                    <button
                      type="button"
                      onClick={() => setLightboxIndex(idx)}
                      className={`relative w-full overflow-hidden rounded-[22px] bg-slate-200 cursor-pointer text-left block ${
                        idx === 0 ? 'h-72 sm:h-80' : 'h-60'
                      }`}
                    >
                      <ResilientImage
                        src={item.imageUrl}
                        alt={item.title}
                        fallbackTitle={item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/15 to-transparent flex items-end justify-between p-5">
                        <div>
                          <div className="text-[11px] font-medium text-sky-400">{item.category}</div>
                          <h2 className="text-base font-semibold text-white mt-0.5">{item.title}</h2>
                        </div>
                        <span className="p-2.5 bg-white/15 backdrop-blur-md rounded-full text-white">
                          <ZoomIn className="w-4 h-4" />
                        </span>
                      </div>
                    </button>
                  </div>

                  <div className="p-5 flex items-center justify-between gap-3">
                    <div>
                      <p className="text-xs text-[#6e6e73] line-clamp-2">{item.caption}</p>
                      <div className="mt-2 inline-flex items-center gap-1.5 text-[11px] font-medium text-[#86868b]">
                        <MapPin className="w-3.5 h-3.5 text-[#0071e3]" />
                        <span>{item.location}</span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        onOpenBooking(undefined, `Inquiry inspired by gallery work: ${item.title} (${item.location})`)
                      }
                      className="px-4 py-2 text-xs font-medium text-[#1d1d1f] bg-white border border-black/[0.08] rounded-full hover:bg-black hover:text-white transition-colors cursor-pointer whitespace-nowrap shrink-0"
                    >
                      Book Similar
                    </button>
                  </div>
                </article>
              </ScaleIn>
            ))}
          </div>
        )}
      </section>

      <AnimatePresence>
        {activeItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4"
            role="dialog"
            aria-modal="true"
            aria-label={activeItem.title}
          >
            <button
              type="button"
              onClick={() => setLightboxIndex(null)}
              aria-label="Close gallery preview"
              className="absolute top-5 right-5 p-2.5 text-white bg-white/10 hover:bg-white/20 rounded-full transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {filtered.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={() =>
                    setLightboxIndex((prev) =>
                      prev === null ? 0 : (prev - 1 + filtered.length) % filtered.length
                    )
                  }
                  aria-label="Previous photo"
                  className="absolute left-4 sm:left-8 p-3 text-white bg-white/10 hover:bg-white/20 rounded-full transition-colors cursor-pointer"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setLightboxIndex((prev) => (prev === null ? 0 : (prev + 1) % filtered.length))
                  }
                  aria-label="Next photo"
                  className="absolute right-4 sm:right-8 p-3 text-white bg-white/10 hover:bg-white/20 rounded-full transition-colors cursor-pointer"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </>
            )}

            <motion.div
              initial={{ scale: 0.96, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.96, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="max-w-4xl w-full bg-[#1d1d1f] rounded-[28px] overflow-hidden border border-white/10"
            >
              <div className="h-[58vh] bg-black flex items-center justify-center">
                <ResilientImage
                  src={activeItem.imageUrl}
                  alt={activeItem.title}
                  fallbackTitle={activeItem.title}
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-white">
                <div>
                  <div className="text-xs font-medium text-sky-400">
                    {activeItem.category} · {activeItem.location}
                  </div>
                  <h2 className="text-lg font-semibold mt-1">{activeItem.title}</h2>
                  <p className="text-xs text-white/70 mt-1">{activeItem.caption}</p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const title = activeItem.title;
                    setLightboxIndex(null);
                    onOpenBooking(undefined, `Booking inquiry regarding: ${title}`);
                  }}
                  className="px-5 py-2.5 text-xs font-medium text-white bg-[#0071e3] rounded-full hover:bg-[#0077ed] transition-colors cursor-pointer whitespace-nowrap shrink-0"
                >
                  Request Similar Setup
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
