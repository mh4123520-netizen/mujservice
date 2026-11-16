import { FamousAreasSection } from '../../components/FamousAreasSection.tsx';
import { FadeUp, ScaleIn } from '../../components/MotionReveal.tsx';
import { ResilientImage } from '../../components/ResilientImage.tsx';
import type { PublicPageProps } from './HomePage.tsx';

export function AboutPage({ data, onNavigate, onOpenBooking }: PublicPageProps) {
  const { settings } = data;
  return (
    <div className="bg-[#fbfbfd] pb-12">
      <div className="px-3 sm:px-6 pt-8 pb-10">
        <FadeUp>
          <section className="max-w-6xl mx-auto bg-[#f5f5f7] rounded-[32px] p-7 sm:p-11">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-stretch">
              <div className="lg:col-span-6 flex flex-col justify-center">
                <div className="text-xs font-medium text-[#0071e3] mb-2">About {settings.companyName}</div>
                <h1 className="text-3xl sm:text-5xl font-semibold tracking-tight text-[#1d1d1f]">
                  {settings.aboutTitle}
                </h1>
                <p className="mt-4 text-base text-[#424245] leading-relaxed">{settings.aboutDescription}</p>
                <div className="mt-6 p-5 bg-white rounded-[22px] border border-black/[0.04]">
                  <h2 className="text-sm font-semibold text-[#1d1d1f]">Engineering Mission</h2>
                  <p className="text-sm text-[#6e6e73] mt-1.5 leading-relaxed">{settings.aboutMission}</p>
                </div>

                <div className="mt-6 grid grid-cols-3 gap-4 pt-5 border-t border-black/[0.07]">
                  <div>
                    <div className="text-xs text-[#86868b]">Experience</div>
                    <div className="text-base font-semibold text-[#1d1d1f] mt-0.5">{settings.yearsExperience}</div>
                  </div>
                  <div>
                    <div className="text-xs text-[#86868b]">Installations</div>
                    <div className="text-base font-semibold text-[#0071e3] mt-0.5 tabular-nums">
                      {settings.projectsCompletedLabel}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-[#86868b]">Dispatch</div>
                    <div className="text-base font-semibold text-[#1d1d1f] mt-0.5">{settings.responseTimeLabel}</div>
                  </div>
                </div>

                <div className="mt-8 flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={() => onNavigate('/book')}
                    className="px-6 py-2.5 text-sm font-medium text-white bg-[#0071e3] rounded-full hover:bg-[#0077ed] transition-colors cursor-pointer"
                  >
                    Schedule Inspection
                  </button>
                  <a
                    href={`tel:${settings.phone}`}
                    className="px-6 py-2.5 text-sm font-medium text-[#1d1d1f] bg-white border border-black/[0.08] rounded-full hover:bg-black hover:text-white transition-colors tabular-nums"
                  >
                    Call {settings.phone}
                  </a>
                </div>
              </div>

              <ScaleIn delay={0.08} className="lg:col-span-6">
                <div className="h-80 lg:h-full min-h-[360px] rounded-[24px] overflow-hidden bg-slate-200">
                  <ResilientImage
                    src={settings.aboutBannerImage}
                    alt="Mujahid Services HVACR diagnostic workshop"
                    fallbackTitle="Mujahid Services Workshop"
                    className="w-full h-full object-cover"
                  />
                </div>
              </ScaleIn>
            </div>
          </section>
        </FadeUp>
      </div>

      <FadeUp delay={0.05}>
        <FamousAreasSection
          onBookInArea={(area, city) =>
            onOpenBooking(undefined, `Requested service location from About page: ${area} (${city})`)
          }
        />
      </FadeUp>
    </div>
  );
}
