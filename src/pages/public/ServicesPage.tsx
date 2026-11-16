import { Check, ShieldCheck } from 'lucide-react';
import { BookingForm } from '../../components/BookingModal.tsx';
import { FadeUp, ScaleIn } from '../../components/MotionReveal.tsx';
import { ResilientImage } from '../../components/ResilientImage.tsx';
import type { ServiceItem } from '../../types/index.ts';
import type { PublicPageProps } from './HomePage.tsx';

export function ServicesPage({ data, onNavigate, onOpenBooking }: PublicPageProps) {
  const { services } = data;
  return (
    <div className="px-3 sm:px-6 py-8 space-y-10 bg-[#fbfbfd]">
      <FadeUp>
        <section className="max-w-6xl mx-auto bg-black text-white rounded-[32px] p-8 sm:p-12">
          <div className="max-w-2xl">
            <div className="text-xs font-medium text-sky-400 mb-2">Engineering Capabilities</div>
            <h1 className="text-3xl sm:text-5xl font-semibold tracking-tight">
              Complete HVACR &amp; Refrigeration Services
            </h1>
            <p className="text-white/70 mt-3 leading-relaxed">
              From residential split inverter diagnostics to industrial cold-room engineering across Khanewal and Multan.
            </p>
          </div>
        </section>
      </FadeUp>

      <div className="max-w-6xl mx-auto space-y-6">
        {services.map((svc, idx) => (
          <ScaleIn key={svc.id} delay={idx * 0.05}>
            <article className="bg-[#f5f5f7] rounded-[32px] overflow-hidden grid grid-cols-1 lg:grid-cols-12 items-stretch group">
              <div className="lg:col-span-5 p-3 pb-0 lg:p-4 lg:pr-0">
                <div className="h-60 lg:h-full min-h-[250px] rounded-[24px] overflow-hidden bg-slate-200">
                  <ResilientImage
                    src={svc.imageUrl}
                    alt={svc.title}
                    fallbackTitle={svc.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                  />
                </div>
              </div>
              <div className="lg:col-span-7 p-7 sm:p-9 flex flex-col justify-between">
                <div>
                  <div className="flex flex-wrap items-center gap-2 text-xs text-[#6e6e73]">
                    <span className="font-semibold text-[#0071e3]">{svc.responseWindow}</span>
                    <span aria-hidden="true">·</span>
                    <span className="font-medium text-[#1d1d1f] tabular-nums">{svc.priceRange}</span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-semibold text-[#1d1d1f] mt-2">{svc.title}</h2>
                  <p className="text-[#6e6e73] mt-2.5 leading-relaxed">{svc.shortDescription}</p>
                  <ul className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-[#424245]">
                    {svc.features.slice(0, 4).map((feat) => (
                      <li key={feat} className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-[#0071e3] shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="mt-6 pt-5 border-t border-black/[0.07] flex flex-wrap items-center gap-3">
                  <button
                    type="button"
                    onClick={() => onOpenBooking(svc.title)}
                    className="px-6 py-2.5 text-sm font-medium text-white bg-[#0071e3] rounded-full hover:bg-[#0077ed] transition-colors cursor-pointer"
                  >
                    Book {svc.title}
                  </button>
                  <button
                    type="button"
                    onClick={() => onNavigate(`/services/${svc.slug}`)}
                    className="px-5 py-2.5 text-sm font-medium text-[#1d1d1f] bg-white border border-black/[0.08] rounded-full hover:bg-white/80 transition-colors cursor-pointer"
                  >
                    View Specifications
                  </button>
                </div>
              </div>
            </article>
          </ScaleIn>
        ))}
      </div>
    </div>
  );
}

export function ServiceDetailPage({
  data,
  slug,
  onNavigate,
  onOpenBooking,
}: PublicPageProps & { slug: string }) {
  const service: ServiceItem | undefined =
    data.services.find((s) => s.slug === slug) || data.services[0];

  if (!service) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-16 text-center bg-[#fbfbfd]">
        <div className="bg-[#f5f5f7] rounded-[32px] p-10">
          <h1 className="text-2xl font-semibold text-[#1d1d1f]">Service Not Found</h1>
          <button
            type="button"
            onClick={() => onNavigate('/services')}
            className="mt-4 px-6 py-2.5 text-sm font-medium text-white bg-[#0071e3] rounded-full hover:bg-[#0077ed] cursor-pointer"
          >
            Back to Services
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="px-3 sm:px-6 py-8 bg-[#fbfbfd]">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6 flex items-center gap-2 text-xs text-[#6e6e73]">
          <button
            type="button"
            onClick={() => onNavigate('/services')}
            className="hover:text-[#1d1d1f] cursor-pointer transition-colors"
          >
            Our Services
          </button>
          <span aria-hidden="true">/</span>
          <span className="text-[#1d1d1f] font-medium">{service.title}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-7 space-y-6">
            <ScaleIn>
              <div className="bg-[#f5f5f7] rounded-[32px] p-3">
                <div className="h-72 sm:h-96 rounded-[24px] overflow-hidden bg-slate-200">
                  <ResilientImage
                    src={service.imageUrl}
                    alt={service.title}
                    fallbackTitle={service.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </ScaleIn>

            <FadeUp delay={0.06}>
              <div className="bg-[#f5f5f7] rounded-[32px] p-7 sm:p-9">
                <div className="flex flex-wrap items-center gap-2 text-xs text-[#6e6e73]">
                  <span className="font-semibold text-[#0071e3]">{service.responseWindow}</span>
                  <span aria-hidden="true">·</span>
                  <span className="font-medium text-[#1d1d1f] tabular-nums">{service.priceRange}</span>
                </div>
                <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-[#1d1d1f] mt-2">
                  {service.title}
                </h1>
                <p className="text-base text-[#424245] mt-4 leading-relaxed">{service.fullDescription}</p>
              </div>
            </FadeUp>

            <FadeUp delay={0.1}>
              <div className="p-7 sm:p-9 bg-[#f5f5f7] rounded-[32px]">
                <h2 className="text-xl font-semibold text-[#1d1d1f] mb-4">Technical Checklist &amp; Deliverables</h2>
                <ul className="space-y-3">
                  {service.features.map((item) => (
                    <li key={item} className="flex items-start gap-3 text-sm text-[#424245]">
                      <ShieldCheck className="w-4 h-4 text-[#0071e3] shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </FadeUp>

            <FadeUp delay={0.14}>
              <div className="pt-2">
                <h3 className="text-sm font-semibold text-[#1d1d1f] mb-3">Other HVACR Services</h3>
                <div className="flex flex-wrap gap-2">
                  {data.services
                    .filter((s) => s.id !== service.id)
                    .map((other) => (
                      <button
                        key={other.id}
                        type="button"
                        onClick={() => onNavigate(`/services/${other.slug}`)}
                        className="px-4 py-2 text-xs font-medium text-[#1d1d1f] bg-[#f5f5f7] hover:bg-[#ebebf0] rounded-full transition-colors cursor-pointer"
                      >
                        {other.title}
                      </button>
                    ))}
                </div>
              </div>
            </FadeUp>
          </div>

          <FadeUp delay={0.08} className="lg:col-span-5 sticky top-24">
            <div className="bg-[#f5f5f7] rounded-[32px] p-6 sm:p-8 border border-black/[0.04]">
              <h2 className="text-xl font-semibold text-[#1d1d1f]">Book {service.title}</h2>
              <p className="text-xs text-[#6e6e73] mt-1 mb-5">
                Fast technician dispatch across Khanewal and Multan localities.
              </p>
              <BookingForm
                services={data.services}
                settings={data.settings}
                defaultServiceName={service.title}
                compact
              />
              <div className="mt-4 pt-4 border-t border-black/[0.06] text-center">
                <button
                  type="button"
                  onClick={() => onOpenBooking(service.title)}
                  className="text-xs font-medium text-[#0071e3] hover:underline cursor-pointer"
                >
                  Or open full-screen booking modal
                </button>
              </div>
            </div>
          </FadeUp>
        </div>
      </div>
    </div>
  );
}
