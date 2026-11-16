import { useEffect, useState } from 'react';
import {
  ArrowRight,
  BookOpen,
  Camera,
  Check,
  ChevronRight,
  Package,
  Phone,
  ShieldCheck,
  Star,
} from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { BookingForm } from '../../components/BookingModal.tsx';
import { FamousAreasSection } from '../../components/FamousAreasSection.tsx';
import { FadeUp, ScaleIn } from '../../components/MotionReveal.tsx';
import { ResilientImage } from '../../components/ResilientImage.tsx';
import type { PublicBootstrapData } from '../../types/index.ts';

export interface PublicPageProps {
  data: PublicBootstrapData;
  onNavigate: (path: string) => void;
  onOpenBooking: (serviceName?: string, note?: string) => void;
}

interface HeroSlide {
  id: string;
  eyebrow: string;
  heading: string;
  subtitle: string;
  serviceTarget: string;
  imageUrl: string;
}

const APPLE_EASE = [0.22, 1, 0.36, 1] as const;

const HERO_SLIDES: HeroSlide[] = [
  {
    id: 'ac-repair',
    eyebrow: 'AC Repair & PCB Diagnostics',
    heading: 'Precision Inverter AC Repair.',
    subtitle: 'Same-day E-code fault tracing, nitrogen leak testing, and exact R-32 calibration across Khanewal & Multan.',
    serviceTarget: 'AC Repair',
    imageUrl: '/src/assets/images/hero_ac_repair_diagnostics_1794825552795.jpg',
  },
  {
    id: 'ac-install',
    eyebrow: 'AC & VRF Commissioning',
    heading: 'Engineered AC Installation.',
    subtitle: '22-gauge pure copper piping and 500-micron deep vacuum pulls built for extreme 48°C+ Southern Punjab summers.',
    serviceTarget: 'AC Installation',
    imageUrl: '/src/assets/images/hero_hvacr_engineering_1794822109469.jpg',
  },
  {
    id: 'fridge-repair',
    eyebrow: 'Domestic & Pharmacy Cooling',
    heading: 'Rapid Fridge & Chiller Care.',
    subtitle: 'Urgent 2-hour compressor replacements, digital thermostat alignment, and R-600a charging with genuine spares.',
    serviceTarget: 'Fridge Repair',
    imageUrl: '/src/assets/images/hero_fridge_freezer_repair_1794825552702.jpg',
  },
  {
    id: 'hvac-maintenance',
    eyebrow: 'Preventative Care Plans',
    heading: 'Smarter HVAC Maintenance.',
    subtitle: 'High-pressure coil descaling and amp-draw balancing that lower clinic, office, and home power bills by 30%.',
    serviceTarget: 'HVAC Maintenance',
    imageUrl: '/src/assets/images/project_multan_commercial_1794822111869.jpg',
  },
  {
    id: 'cold-chain',
    eyebrow: '24/7 Commercial Cold Chain',
    heading: 'Industrial Cold Room Power.',
    subtitle: 'Bitzer & Copeland condensing racks and -20°C blast freezers protected around the clock by certified technicians.',
    serviceTarget: 'Commercial Refrigeration',
    imageUrl: '/src/assets/images/service_refrigeration_coldroom_1794822111312.jpg',
  },
];

const METHODOLOGY_STEPS = [
  {
    step: '01',
    title: 'Digital Load & Fault Audit',
    summary: 'Thermal delta measurement, clamp-amp diagnostics, and PCB error inspection before any valve is opened.',
    spec: 'Precision Clamp Meter & Thermal Probe',
  },
  {
    step: '02',
    title: '400 PSI Dry Nitrogen Test',
    summary: 'Pressurizing every brazed joint and flare connection with oxygen-free nitrogen to eliminate micro-leaks.',
    spec: '400 PSI Zero-Drop Hold Verification',
  },
  {
    step: '03',
    title: '500-Micron Deep Vacuum',
    summary: 'Two-stage rotary vacuum evacuation removing trapped air and moisture so compressor oil stays pure.',
    spec: 'Digital Micron Gauge Verified',
  },
  {
    step: '04',
    title: 'Gram-Scale Gas Charging',
    summary: 'Factory-spec refrigerant charging for R-32, R-410A, R-600a, and R-404A using calibrated digital scales.',
    spec: '±5g Weight Accuracy',
  },
  {
    step: '05',
    title: 'Signed Warranty Handover',
    summary: 'Official 90-day workmanship slip documenting running amperes and supply air temperature readings.',
    spec: '90-Day Written Service Guarantee',
  },
];

const SLIDE_DURATION_MS = 5000;

export function HomePage({ data, onNavigate, onOpenBooking }: PublicPageProps) {
  const { settings, services, products, projects, plans, testimonials, blogPosts, galleryItems } = data;

  const [activeSlideIndex, setActiveSlideIndex] = useState(0);
  const [typedHeading, setTypedHeading] = useState(HERO_SLIDES[0].heading);
  const [cycleKey, setCycleKey] = useState(0);
  const [activeProtocolStep, setActiveProtocolStep] = useState(0);

  const currentSlide = HERO_SLIDES[activeSlideIndex];

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveSlideIndex((prev) => (prev + 1) % HERO_SLIDES.length);
    }, SLIDE_DURATION_MS);
    return () => window.clearInterval(timer);
  }, [cycleKey]);

  useEffect(() => {
    const fullText = currentSlide.heading;
    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
      setTypedHeading(fullText);
      return;
    }

    const startTime = performance.now();
    const typePhaseMs = 1500;
    const holdEndMs = 3800;
    const eraseEndMs = 4850;
    let rafId = 0;

    setTypedHeading('');

    const tick = (now: number) => {
      const elapsed = now - startTime;
      if (elapsed <= typePhaseMs) {
        const count = Math.max(1, Math.ceil((elapsed / typePhaseMs) * fullText.length));
        setTypedHeading(fullText.slice(0, count));
      } else if (elapsed <= holdEndMs) {
        setTypedHeading(fullText);
      } else if (elapsed <= eraseEndMs) {
        const eraseProgress = (elapsed - holdEndMs) / (eraseEndMs - holdEndMs);
        const remaining = Math.max(0, Math.floor((1 - eraseProgress) * fullText.length));
        setTypedHeading(fullText.slice(0, remaining));
      } else {
        setTypedHeading('');
        return;
      }
      rafId = window.requestAnimationFrame(tick);
    };

    rafId = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(rafId);
  }, [activeSlideIndex, currentSlide.heading]);

  function selectSlide(idx: number) {
    setActiveSlideIndex(idx);
    setCycleKey((k) => k + 1);
  }

  return (
    <div className="overflow-x-hidden">
      {/* ====================================================================
          CHAPTER 1: PURE APPLE HERO (Full-Bleed Image + Centered Clean Text ONLY)
         ==================================================================== */}
      <section className="px-3 sm:px-6 pt-3 pb-6 bg-[#fbfbfd]">
        <div className="max-w-7xl mx-auto relative rounded-[32px] overflow-hidden bg-black min-h-[74vh] sm:min-h-[82vh] flex items-center justify-center shadow-2xl shadow-black/15">
          {/* 5 Auto-Changing Full-Bleed Photos with Gentle Scale */}
          <AnimatePresence mode="sync">
            <motion.div
              key={currentSlide.id}
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.9, ease: APPLE_EASE }}
              className="absolute inset-0"
            >
              <ResilientImage
                src={currentSlide.imageUrl}
                alt={currentSlide.heading}
                fallbackTitle={currentSlide.serviceTarget}
                className="w-full h-full object-cover"
              />
            </motion.div>
          </AnimatePresence>

          {/* Clean Architectural Scrim for Apple-Grade Legibility */}
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/45 to-black/80"
          />

          {/* Centered Pure Image + Text Focus */}
          <div className="relative z-10 max-w-4xl mx-auto px-6 py-20 text-center text-white">
            <motion.div
              key={currentSlide.eyebrow}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, ease: APPLE_EASE }}
              className="text-xs sm:text-sm font-medium text-sky-300 tracking-wide mb-3"
            >
              {currentSlide.eyebrow}
            </motion.div>

            <h1 className="min-h-[88px] sm:min-h-[128px] text-[clamp(2.25rem,5.2vw,4.25rem)] font-semibold tracking-tight text-white leading-[1.08]">
              <span>{typedHeading}</span>
              <span className="typewriter-caret" aria-hidden="true" />
            </h1>

            <motion.p
              key={currentSlide.subtitle}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.1, ease: APPLE_EASE }}
              className="mt-4 text-base sm:text-xl font-normal text-white/85 max-w-2xl mx-auto leading-relaxed"
            >
              {currentSlide.subtitle}
            </motion.p>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <button
                type="button"
                onClick={() => onOpenBooking(currentSlide.serviceTarget)}
                className="px-7 py-3 text-sm font-medium text-white bg-[#0071e3] rounded-full hover:bg-[#0077ed] transition-all hover:scale-[1.02] cursor-pointer whitespace-nowrap"
              >
                Book {currentSlide.serviceTarget}
              </button>
              <button
                type="button"
                onClick={() => onNavigate('/book')}
                className="inline-flex items-center gap-1 px-6 py-3 text-sm font-medium text-white bg-white/15 backdrop-blur-md border border-white/25 rounded-full hover:bg-white/25 transition-all cursor-pointer whitespace-nowrap"
              >
                <span>Schedule Visit</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Minimal Bottom Slide Dots */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex items-center gap-2">
            {HERO_SLIDES.map((slide, idx) => {
              const active = idx === activeSlideIndex;
              return (
                <button
                  key={slide.id}
                  type="button"
                  onClick={() => selectSlide(idx)}
                  aria-label={`Show ${slide.serviceTarget}`}
                  className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                    active ? 'w-8 bg-white' : 'w-2 bg-white/40 hover:bg-white/75'
                  }`}
                />
              );
            })}
          </div>
        </div>
      </section>

      {/* ====================================================================
          CHAPTER 2: CRISP WHITE EDITORIAL STATEMENT + METRIC STRIP
         ==================================================================== */}
      <section className="bg-white py-20 sm:py-24 border-b border-black/[0.05]">
        <div className="max-w-6xl mx-auto px-6">
          <FadeUp className="max-w-3xl mx-auto text-center">
            <p className="text-xs font-medium text-[#0071e3] mb-3">Khanewal &amp; Multan HVACR Authority</p>
            <h2 className="text-3xl sm:text-5xl font-semibold text-[#1d1d1f] leading-tight">
              Built for extreme summers. Calibrated to the gram.
            </h2>
            <p className="mt-4 text-base sm:text-lg text-[#6e6e73] leading-relaxed">
              Every residential split inverter, VRF chiller, and commercial cold storage plant is commissioned using calibrated digital gauges and documented safety protocols.
            </p>
          </FadeUp>

          <FadeUp delay={0.1} className="mt-14 grid grid-cols-2 lg:grid-cols-4 gap-8 pt-10 border-t border-black/[0.07]">
            <div className="text-center">
              <div className="text-3xl sm:text-4xl font-semibold text-[#1d1d1f] tabular-nums">
                {settings.yearsExperience}
              </div>
              <div className="text-xs text-[#6e6e73] mt-1.5">Regional Field Heritage</div>
            </div>
            <div className="text-center">
              <div className="text-3xl sm:text-4xl font-semibold text-[#0071e3] tabular-nums">
                {settings.projectsCompletedLabel}
              </div>
              <div className="text-xs text-[#6e6e73] mt-1.5">Systems Commissioned</div>
            </div>
            <div className="text-center">
              <div className="text-3xl sm:text-4xl font-semibold text-[#1d1d1f]">
                {settings.responseTimeLabel}
              </div>
              <div className="text-xs text-[#6e6e73] mt-1.5">Local Dispatch Window</div>
            </div>
            <div className="text-center">
              <div className="text-3xl sm:text-4xl font-semibold text-[#1d1d1f] tabular-nums">
                {settings.serviceAreas.length}+
              </div>
              <div className="text-xs text-[#6e6e73] mt-1.5">Colonies Across Twin Cities</div>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* ====================================================================
          CHAPTER 3: APPLE SILVER MIST (#f5f5f7) — BENTO SERVICE SHOWCASE
         ==================================================================== */}
      <section className="bg-[#f5f5f7] py-20 sm:py-24">
        <div className="max-w-6xl mx-auto px-6">
          <FadeUp className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
            <div>
              <div className="text-xs font-medium text-[#6e6e73] mb-2">Core Engineering Divisions</div>
              <h2 className="text-3xl sm:text-4xl font-semibold text-[#1d1d1f]">
                Services that keep everything cool.
              </h2>
            </div>
            <button
              type="button"
              onClick={() => onNavigate('/services')}
              className="inline-flex items-center gap-1 text-sm font-medium text-[#0071e3] hover:underline cursor-pointer whitespace-nowrap shrink-0"
            >
              <span>View all services</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </FadeUp>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {services.map((svc, idx) => (
              <ScaleIn
                key={svc.id}
                delay={idx * 0.06}
                className={idx === 0 ? 'md:col-span-2' : ''}
              >
                <article
                  className={`bg-white rounded-[28px] overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 group h-full ${
                    idx === 0 ? 'grid grid-cols-1 lg:grid-cols-12 items-stretch' : 'flex flex-col justify-between'
                  }`}
                >
                  <div className={idx === 0 ? 'lg:col-span-6 h-72 lg:h-auto overflow-hidden' : 'h-60 overflow-hidden'}>
                    <ResilientImage
                      src={svc.imageUrl}
                      alt={svc.title}
                      fallbackTitle={svc.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                    />
                  </div>
                  <div className={`${idx === 0 ? 'lg:col-span-6 p-8 sm:p-10' : 'p-7'} flex flex-col justify-between`}>
                    <div>
                      <div className="text-xs text-[#6e6e73] flex items-center gap-2">
                        <span className="font-medium text-[#0071e3]">{svc.responseWindow}</span>
                        <span aria-hidden="true">·</span>
                        <span className="tabular-nums">{svc.priceRange}</span>
                      </div>
                      <h3 className="text-2xl font-semibold text-[#1d1d1f] mt-2">{svc.title}</h3>
                      <p className="text-sm text-[#6e6e73] mt-2.5 leading-relaxed">{svc.shortDescription}</p>
                      <ul className="mt-4 space-y-1.5 text-xs text-[#424245]">
                        {svc.features.slice(0, 3).map((feat) => (
                          <li key={feat} className="flex items-start gap-2">
                            <Check className="w-3.5 h-3.5 text-[#0071e3] shrink-0 mt-0.5" />
                            <span>{feat}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="mt-6 pt-4 border-t border-black/[0.06] flex items-center justify-between gap-4">
                      <button
                        type="button"
                        onClick={() => onNavigate(`/services/${svc.slug}`)}
                        className="inline-flex items-center gap-1 text-xs font-medium text-[#0071e3] hover:underline cursor-pointer"
                      >
                        <span>Learn more</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => onOpenBooking(svc.title)}
                        className="px-4 py-2 text-xs font-medium text-white bg-[#1d1d1f] rounded-full hover:bg-black transition-colors cursor-pointer whitespace-nowrap"
                      >
                        Book {svc.title}
                      </button>
                    </div>
                  </div>
                </article>
              </ScaleIn>
            ))}
          </div>
        </div>
      </section>

      {/* ====================================================================
          CHAPTER 4: PURE OBSIDIAN BLACK (#000000) — PRO HARDWARE & PRODUCTS
         ==================================================================== */}
      <section className="bg-black text-white py-20 sm:py-28">
        <div className="max-w-6xl mx-auto px-6">
          <FadeUp className="text-center max-w-2xl mx-auto mb-14">
            <div className="inline-flex items-center gap-1.5 text-xs font-medium text-sky-400 mb-3">
              <Package className="w-3.5 h-3.5" />
              <span>Certified Hardware &amp; Spares</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-semibold text-white">
              Pro-grade cooling hardware.
            </h2>
            <p className="text-sm sm:text-base text-white/70 mt-3 leading-relaxed">
              Factory-sealed T3 inverters, semi-hermetic Bitzer units, 22-gauge copper piping, and digital delay protectors supplied and fitted directly.
            </p>
            <div className="mt-5">
              <button
                type="button"
                onClick={() => onNavigate('/products')}
                className="inline-flex items-center gap-1 text-sm font-medium text-[#2997ff] hover:underline cursor-pointer"
              >
                <span>Explore all products</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </FadeUp>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {(products || []).slice(0, 3).map((item, idx) => (
              <ScaleIn key={item.id} delay={idx * 0.08}>
                <article className="bg-[#161618] border border-white/10 rounded-[28px] overflow-hidden flex flex-col justify-between h-full group hover:border-white/25 transition-colors">
                  <div>
                    <div className="h-52 overflow-hidden bg-zinc-900">
                      <ResilientImage
                        src={item.imageUrl}
                        alt={item.name}
                        fallbackTitle={item.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                      />
                    </div>
                    <div className="p-6">
                      <div className="text-[11px] text-white/60 flex items-center justify-between gap-2">
                        <span className="text-[#2997ff] font-medium">{item.category}</span>
                        <span>{item.stockStatus}</span>
                      </div>
                      <h3 className="text-lg font-semibold text-white mt-2">{item.name}</h3>
                      <div className="text-xs text-white/60 mt-1">{item.capacityOrSpec}</div>
                      <p className="text-xs text-white/70 mt-3 line-clamp-2 leading-relaxed">{item.summary}</p>
                    </div>
                  </div>
                  <div className="px-6 py-4 border-t border-white/10 flex items-center justify-between gap-2">
                    <span className="text-sm font-semibold text-white tabular-nums">{item.pricePkr}</span>
                    <button
                      type="button"
                      onClick={() =>
                        onOpenBooking('AC Installation', `Product Inquiry: ${item.name} (${item.pricePkr})`)
                      }
                      className="px-4 py-1.5 text-xs font-medium text-white bg-[#0071e3] rounded-full hover:bg-[#0077ed] cursor-pointer whitespace-nowrap"
                    >
                      Order &amp; Install
                    </button>
                  </div>
                </article>
              </ScaleIn>
            ))}
          </div>
        </div>
      </section>

      {/* ====================================================================
          CHAPTER 5: INTERACTIVE GLACIAL MIST — 5-STEP CALIBRATION PROTOCOL
         ==================================================================== */}
      <section className="bg-gradient-to-b from-[#e8f1fb] via-[#f2f7fd] to-white py-20 sm:py-24">
        <div className="max-w-5xl mx-auto px-6">
          <FadeUp className="text-center max-w-2xl mx-auto mb-12">
            <div className="text-xs font-medium text-[#0071e3] mb-2">Interactive Quality Protocol</div>
            <h2 className="text-3xl sm:text-4xl font-semibold text-[#1d1d1f]">
              Five precise steps on every visit.
            </h2>
            <p className="text-sm sm:text-base text-[#6e6e73] mt-2">
              Tap any stage below to inspect how our engineers test, evacuate, charge, and warrant your cooling system.
            </p>
          </FadeUp>

          <div className="flex flex-wrap justify-center gap-2 mb-8">
            {METHODOLOGY_STEPS.map((item, idx) => {
              const active = idx === activeProtocolStep;
              return (
                <button
                  key={item.step}
                  type="button"
                  onClick={() => setActiveProtocolStep(idx)}
                  className={`px-4 py-2.5 text-xs font-medium rounded-full transition-all cursor-pointer whitespace-nowrap ${
                    active
                      ? 'bg-[#1d1d1f] text-white shadow-md'
                      : 'bg-white/80 text-[#424245] hover:bg-white border border-black/[0.06]'
                  }`}
                >
                  {item.step}. {item.title}
                </button>
              );
            })}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={METHODOLOGY_STEPS[activeProtocolStep].step}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3, ease: APPLE_EASE }}
              className="foggy-glass rounded-[28px] p-8 sm:p-10 text-center max-w-3xl mx-auto"
            >
              <div className="text-xs font-semibold text-[#0071e3] mb-2">
                Stage {METHODOLOGY_STEPS[activeProtocolStep].step} of 05 · {METHODOLOGY_STEPS[activeProtocolStep].spec}
              </div>
              <h3 className="text-2xl sm:text-3xl font-semibold text-[#1d1d1f]">
                {METHODOLOGY_STEPS[activeProtocolStep].title}
              </h3>
              <p className="text-sm sm:text-base text-[#6e6e73] mt-3 max-w-xl mx-auto leading-relaxed">
                {METHODOLOGY_STEPS[activeProtocolStep].summary}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* ====================================================================
          CHAPTER 6: CRISP WHITE EDITORIAL SPOTLIGHT — COMMERCIAL PROJECTS
         ==================================================================== */}
      <section className="bg-white py-20 sm:py-24 border-t border-black/[0.05]">
        <div className="max-w-6xl mx-auto px-6">
          <FadeUp className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-14">
            <div>
              <div className="text-xs font-medium text-[#6e6e73] mb-2">Verified Field Case Studies</div>
              <h2 className="text-3xl sm:text-4xl font-semibold text-[#1d1d1f]">
                Built across Multan &amp; Khanewal.
              </h2>
            </div>
            <button
              type="button"
              onClick={() => onNavigate('/projects')}
              className="inline-flex items-center gap-1 text-sm font-medium text-[#0071e3] hover:underline cursor-pointer whitespace-nowrap shrink-0"
            >
              <span>All completed projects</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </FadeUp>

          <div className="space-y-12">
            {projects.slice(0, 3).map((project, idx) => (
              <FadeUp key={project.id} delay={idx * 0.05}>
                <article className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-[#f5f5f7] rounded-[32px] p-4 sm:p-6">
                  <div className={`lg:col-span-6 h-64 sm:h-80 rounded-[22px] overflow-hidden bg-slate-200 ${idx % 2 === 1 ? 'lg:order-2' : ''}`}>
                    <ResilientImage
                      src={project.imageUrl}
                      alt={project.title}
                      fallbackTitle={project.title}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-700 ease-out"
                    />
                  </div>
                  <div className={`lg:col-span-6 p-3 sm:p-6 ${idx % 2 === 1 ? 'lg:order-1' : ''}`}>
                    <div className="text-xs font-medium text-[#0071e3]">
                      {project.category} · {project.location}
                    </div>
                    <h3 className="text-2xl sm:text-3xl font-semibold text-[#1d1d1f] mt-2">{project.title}</h3>
                    <p className="text-sm sm:text-base text-[#6e6e73] mt-3 leading-relaxed">{project.summary}</p>
                    {project.metrics && (
                      <div className="mt-5 pt-4 border-t border-black/[0.07] flex flex-wrap items-center justify-between gap-4">
                        <span className="text-xs font-semibold text-[#1d1d1f]">{project.metrics}</span>
                        <button
                          type="button"
                          onClick={() =>
                            onOpenBooking(undefined, `Project inquiry similar to: ${project.title}`)
                          }
                          className="inline-flex items-center gap-1 text-xs font-medium text-[#0071e3] hover:underline cursor-pointer"
                        >
                          <span>Request similar system</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                  </div>
                </article>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ====================================================================
          CHAPTER 7: SOFT SILVER — MAINTENANCE PACKAGES COMPARISON
         ==================================================================== */}
      <section className="bg-[#f5f5f7] py-20 sm:py-24">
        <div className="max-w-6xl mx-auto px-6">
          <FadeUp className="text-center max-w-2xl mx-auto mb-14">
            <div className="inline-flex items-center gap-1.5 text-xs font-medium text-[#0071e3] mb-2">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Annual Care &amp; SLA Plans</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-semibold text-[#1d1d1f]">
              Protection that pays for itself.
            </h2>
            <p className="text-sm sm:text-base text-[#6e6e73] mt-2">
              Scheduled descaling, seasonal checks, and priority breakdown coverage for homes and commercial facilities.
            </p>
          </FadeUp>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {plans.map((plan, idx) => (
              <ScaleIn key={plan.id} delay={idx * 0.08}>
                <article
                  className={`rounded-[28px] p-8 flex flex-col justify-between h-full transition-transform duration-300 hover:-translate-y-1 ${
                    idx === 1 ? 'bg-[#1d1d1f] text-white shadow-xl' : 'bg-white text-[#1d1d1f] shadow-xs'
                  }`}
                >
                  <div>
                    <div className={`text-xs font-medium ${idx === 1 ? 'text-[#2997ff]' : 'text-[#0071e3]'}`}>
                      {plan.billingCycle} Billing · SLA Covered
                    </div>
                    <h3 className="text-2xl font-semibold mt-2">{plan.name}</h3>
                    <p className={`text-xs mt-1 ${idx === 1 ? 'text-white/70' : 'text-[#6e6e73]'}`}>
                      {plan.targetAudience}
                    </p>
                    <div className="mt-5 pb-5 border-b border-current/10 flex items-baseline gap-1.5">
                      <span className="text-3xl font-semibold tabular-nums">
                        PKR {plan.pricePkr.toLocaleString()}
                      </span>
                      <span className={`text-xs ${idx === 1 ? 'text-white/60' : 'text-[#6e6e73]'}`}>
                        / {plan.billingCycle.toLowerCase()}
                      </span>
                    </div>
                    <ul className="mt-5 space-y-2.5 text-sm">
                      {plan.features.map((feat) => (
                        <li key={feat} className="flex items-start gap-2.5">
                          <Check className={`w-4 h-4 shrink-0 mt-0.5 ${idx === 1 ? 'text-[#2997ff]' : 'text-[#0071e3]'}`} />
                          <span className={idx === 1 ? 'text-white/85' : 'text-[#424245]'}>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      onOpenBooking(
                        'HVAC Maintenance',
                        `Package Inquiry: ${plan.name} (PKR ${plan.pricePkr.toLocaleString()} / ${plan.billingCycle})`
                      )
                    }
                    className={`mt-8 w-full py-3 px-4 text-sm font-medium rounded-full transition-colors cursor-pointer ${
                      idx === 1
                        ? 'bg-[#0071e3] text-white hover:bg-[#0077ed]'
                        : 'bg-[#1d1d1f] text-white hover:bg-black'
                    }`}
                  >
                    Enroll in {plan.name}
                  </button>
                </article>
              </ScaleIn>
            ))}
          </div>
        </div>
      </section>

      {/* ====================================================================
          CHAPTER 8: DEEP MIDNIGHT CHARCOAL (#111317) — GALLERY & BLOG JOURNAL
         ==================================================================== */}
      <section className="bg-[#111317] text-white py-20 sm:py-24">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12">
          <FadeUp className="lg:col-span-6 space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Camera className="w-4 h-4 text-[#2997ff]" />
                <h2 className="text-2xl font-semibold text-white">Work Gallery</h2>
              </div>
              <button
                type="button"
                onClick={() => onNavigate('/gallery')}
                className="inline-flex items-center gap-1 text-xs font-medium text-[#2997ff] hover:underline cursor-pointer"
              >
                <span>Open gallery</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {galleryItems.slice(0, 4).map((g) => (
                <button
                  key={g.id}
                  type="button"
                  onClick={() => onNavigate('/gallery')}
                  className="group relative h-44 rounded-2xl overflow-hidden text-left cursor-pointer"
                >
                  <ResilientImage
                    src={g.imageUrl}
                    alt={g.title}
                    fallbackTitle={g.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/15 to-transparent p-3.5 flex flex-col justify-end">
                    <div className="text-xs font-medium text-white">{g.title}</div>
                    <div className="text-[11px] text-white/70">{g.location}</div>
                  </div>
                </button>
              ))}
            </div>
          </FadeUp>

          <FadeUp delay={0.1} className="lg:col-span-6 space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-[#2997ff]" />
                <h2 className="text-2xl font-semibold text-white">Engineering Journal</h2>
              </div>
              <button
                type="button"
                onClick={() => onNavigate('/blog')}
                className="inline-flex items-center gap-1 text-xs font-medium text-[#2997ff] hover:underline cursor-pointer"
              >
                <span>All articles</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
            <div className="space-y-3">
              {blogPosts.slice(0, 3).map((post) => (
                <button
                  key={post.id}
                  type="button"
                  onClick={() => onNavigate(`/blog/${post.slug}`)}
                  className="w-full text-left p-3.5 bg-white/[0.05] border border-white/10 rounded-2xl hover:bg-white/[0.1] transition-colors flex gap-4 items-center cursor-pointer"
                >
                  <div className="w-24 h-20 rounded-xl overflow-hidden shrink-0 bg-zinc-900">
                    <ResilientImage src={post.imageUrl} alt={post.title} className="w-full h-full object-cover" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-[11px] text-white/60 flex items-center gap-2">
                      <span className="text-[#2997ff] font-medium">{post.category}</span>
                      <span>·</span>
                      <span>{post.readTime}</span>
                    </div>
                    <h3 className="text-sm font-semibold text-white mt-1 line-clamp-1">{post.title}</h3>
                    <p className="text-xs text-white/65 mt-1 line-clamp-2">{post.excerpt}</p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-white/40 shrink-0" />
                </button>
              ))}
            </div>
          </FadeUp>
        </div>
      </section>

      {/* ====================================================================
          CHAPTER 9: FROSTED ICE MIST — FAMOUS AREAS DIRECTORY
         ==================================================================== */}
      <section className="bg-[#eef4fa] py-16 sm:py-20">
        <FamousAreasSection
          onBookInArea={(area, city) =>
            onOpenBooking(undefined, `Requested service location: ${area} (${city})`)
          }
        />
      </section>

      {/* ====================================================================
          CHAPTER 10: CRISP WHITE FINISHING STUDIO — REVIEWS & 3-STEP BOOKING
         ==================================================================== */}
      <section className="bg-white py-20 sm:py-24">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          <FadeUp className="lg:col-span-5 space-y-5">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold text-[#1d1d1f]">Customer Stories</h2>
              <button
                type="button"
                onClick={() => onNavigate('/reviews')}
                className="text-xs font-medium text-[#0071e3] hover:underline cursor-pointer"
              >
                All Reviews
              </button>
            </div>
            <div className="space-y-4">
              {testimonials.slice(0, 3).map((rev) => (
                <div key={rev.id} className="p-6 bg-[#f5f5f7] rounded-[24px]">
                  <div className="flex items-center justify-between text-xs text-[#6e6e73]">
                    <span>
                      {rev.serviceName} · {rev.city}
                    </span>
                    <span className="inline-flex items-center gap-0.5 text-amber-600 font-medium tabular-nums">
                      <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                      {rev.rating}.0
                    </span>
                  </div>
                  <p className="text-sm text-[#1d1d1f] mt-2.5 leading-relaxed">“{rev.reviewText}”</p>
                  <div className="mt-3 text-xs font-medium text-[#1d1d1f]">
                    {rev.customerName}{' '}
                    <span className="font-normal text-[#6e6e73]">— {rev.roleOrCompany}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-6 bg-[#1d1d1f] text-white rounded-[24px] flex items-center justify-between gap-4">
              <div>
                <div className="text-xs text-sky-400 font-medium">24/7 Direct Dispatch</div>
                <div className="text-lg font-semibold tabular-nums mt-0.5">{settings.phone}</div>
              </div>
              <a
                href={`tel:${settings.phone}`}
                className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-medium text-white bg-[#0071e3] rounded-full hover:bg-[#0077ed]"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>Call Now</span>
              </a>
            </div>
          </FadeUp>

          <FadeUp delay={0.1} className="lg:col-span-7 bg-[#f5f5f7] rounded-[32px] p-6 sm:p-10">
            <h2 className="text-2xl sm:text-3xl font-semibold text-[#1d1d1f]">
              Book an Engineer Online
            </h2>
            <p className="text-sm text-[#6e6e73] mt-1.5 mb-6">
              Select your equipment, pick your locality in Khanewal or Multan, and choose an arrival slot.
            </p>
            <BookingForm services={services} settings={settings} />
          </FadeUp>
        </div>
      </section>
    </div>
  );
}
