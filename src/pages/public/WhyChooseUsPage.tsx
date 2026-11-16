import { FadeUp, ScaleIn } from '../../components/MotionReveal.tsx';
import type { PublicPageProps } from './HomePage.tsx';

export function WhyChooseUsPage({ data, onNavigate, onOpenBooking }: PublicPageProps) {
  const { settings } = data;
  return (
    <div className="px-3 sm:px-6 py-8 space-y-10 bg-[#fbfbfd]">
      <FadeUp>
        <section className="max-w-6xl mx-auto bg-black text-white rounded-[32px] p-8 sm:p-12">
          <div className="max-w-3xl">
            <div className="text-xs font-medium text-sky-400 mb-2">Quality &amp; Calibration Standards</div>
            <h1 className="text-3xl sm:text-5xl font-semibold tracking-tight">
              {settings.whyChooseUsTitle}
            </h1>
            <p className="text-white/70 mt-3 text-base leading-relaxed">{settings.whyChooseUsSubtitle}</p>
          </div>
        </section>
      </FadeUp>

      <div className="max-w-6xl mx-auto space-y-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {settings.whyChooseUsItems.map((item, idx) => (
            <ScaleIn key={item.id} delay={idx * 0.05}>
              <div className="p-8 bg-[#f5f5f7] rounded-[28px] h-full">
                <div className="flex items-center justify-between gap-4">
                  <span className="text-xs font-medium text-[#86868b] tabular-nums">{String(idx + 1).padStart(2, '0')}</span>
                  <span className="text-sm font-semibold text-[#0071e3] tabular-nums">{item.metric}</span>
                </div>
                <h2 className="text-xl font-semibold text-[#1d1d1f] mt-3">{item.title}</h2>
                <p className="text-sm text-[#6e6e73] mt-2 leading-relaxed">{item.description}</p>
              </div>
            </ScaleIn>
          ))}
        </div>

        <FadeUp>
          <div className="p-8 sm:p-10 bg-black text-white rounded-[32px] flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div>
              <h2 className="text-2xl font-semibold">Need a reliable HVACR inspection today?</h2>
              <p className="text-white/70 text-sm mt-1">
                Speak directly with our Khanewal &amp; Multan engineering desk on {settings.phone}.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => onNavigate('/book')}
                className="px-6 py-3 text-sm font-medium text-white bg-[#0071e3] rounded-full hover:bg-[#0077ed] transition-colors cursor-pointer whitespace-nowrap shrink-0"
              >
                Launch Booking Wizard
              </button>
              <button
                type="button"
                onClick={() => onOpenBooking()}
                className="px-5 py-3 text-sm font-medium text-white bg-white/15 rounded-full hover:bg-white/25 transition-colors cursor-pointer whitespace-nowrap shrink-0"
              >
                Quick Modal
              </button>
            </div>
          </div>
        </FadeUp>
      </div>
    </div>
  );
}
