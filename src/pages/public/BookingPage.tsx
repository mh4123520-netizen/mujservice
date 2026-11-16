import { CheckCircle2, Clock, MapPin, MessageCircle, Phone, ShieldCheck } from 'lucide-react';
import { BookingForm } from '../../components/BookingModal.tsx';
import { FadeUp } from '../../components/MotionReveal.tsx';
import type { PublicPageProps } from './HomePage.tsx';

export function BookingPage({ data }: PublicPageProps) {
  const { settings, services } = data;
  const whatsappUrl = `https://wa.me/92${settings.whatsapp.replace(/^0/, '')}`;

  return (
    <div className="px-3 sm:px-6 py-8 space-y-10 bg-[#fbfbfd]">
      <FadeUp>
        <section className="max-w-6xl mx-auto bg-black text-white rounded-[32px] p-8 sm:p-12">
          <div className="text-xs font-medium text-sky-400 mb-2">
            Real-Time Dispatch Queue · Khanewal &amp; Multan
          </div>
          <h1 className="text-3xl sm:text-5xl font-semibold tracking-tight">
            Advanced HVACR Service &amp; Technician Booking
          </h1>
          <p className="text-white/70 mt-3 max-w-2xl text-sm leading-relaxed">
            Configure your equipment type, choose your locality from all famous areas of Khanewal and Multan, and receive an instant dispatch tracking code.
          </p>
        </section>
      </FadeUp>

      <section className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <FadeUp delay={0.05} className="lg:col-span-8">
          <div className="bg-[#f5f5f7] rounded-[32px] p-6 sm:p-9 border border-black/[0.04]">
            <BookingForm services={services} settings={settings} />
          </div>
        </FadeUp>

        <FadeUp delay={0.1} className="lg:col-span-4 space-y-5">
          <div className="bg-black text-white rounded-[28px] p-7 space-y-4">
            <h2 className="text-base font-semibold">Dispatch Commitments</h2>
            <ul className="space-y-3 text-xs text-white/75">
              <li className="flex items-start gap-2.5">
                <Clock className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
                <span>Under 90-minute express dispatch inside Multan &amp; Khanewal city limits.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <ShieldCheck className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
                <span>90-day written workmanship guarantee with 500-micron digital vacuum test.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
                <span>40+ famous sectors, colonies &amp; tehsils covered with zero hidden surcharges.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
                <span>Direct coordinator notification and live appointment tracking ID.</span>
              </li>
            </ul>
          </div>

          <div className="bg-[#f5f5f7] rounded-[28px] p-7 space-y-4">
            <h3 className="text-sm font-semibold text-[#1d1d1f]">Need Immediate Emergency Assistance?</h3>
            <p className="text-xs text-[#6e6e73] leading-relaxed">
              For commercial cold storage breakdowns, hospital chillers, or urgent inverter repairs, call or WhatsApp our 24/7 dispatch desk directly.
            </p>
            <div className="space-y-2.5 pt-1">
              <a
                href={`tel:${settings.phone}`}
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-medium text-white bg-[#0071e3] rounded-full hover:bg-[#0077ed] transition-colors tabular-nums"
              >
                <Phone className="w-4 h-4" />
                <span>Call {settings.phone}</span>
              </a>
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-medium text-emerald-900 bg-emerald-50 border border-emerald-200 rounded-full hover:bg-emerald-100 transition-colors"
              >
                <MessageCircle className="w-4 h-4" />
                <span>WhatsApp Dispatch</span>
              </a>
            </div>
          </div>
        </FadeUp>
      </section>
    </div>
  );
}
