import { Check } from 'lucide-react';
import { FadeUp, ScaleIn } from '../../components/MotionReveal.tsx';
import type { PublicPageProps } from './HomePage.tsx';

export function MaintenancePlansPage({ data, onOpenBooking }: PublicPageProps) {
  return (
    <div className="px-3 sm:px-6 py-8 space-y-10 bg-[#fbfbfd]">
      <FadeUp>
        <section className="max-w-6xl mx-auto bg-black text-white rounded-[32px] p-8 sm:p-12">
          <div className="max-w-2xl">
            <div className="text-xs font-medium text-[#2997ff] mb-2">Annual &amp; Commercial Contracts</div>
            <h1 className="text-3xl sm:text-5xl font-semibold tracking-tight">
              HVACR Maintenance Plans.
            </h1>
            <p className="text-white/70 mt-3 leading-relaxed">
              Scheduled chemical descaling, amp-draw diagnostics, and priority breakdown dispatch tailored for homes, clinics, and industrial cold-storage facilities in Khanewal and Multan.
            </p>
          </div>
        </section>
      </FadeUp>

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
        {data.plans.map((plan, idx) => (
          <ScaleIn key={plan.id} delay={idx * 0.08}>
            <article
              className={`rounded-[28px] p-8 flex flex-col justify-between h-full transition-transform duration-300 hover:-translate-y-1 ${
                idx === 1 ? 'bg-[#1d1d1f] text-white shadow-xl' : 'bg-[#f5f5f7] text-[#1d1d1f]'
              }`}
            >
              <div>
                <div className={`text-xs flex items-center justify-between gap-2 ${idx === 1 ? 'text-[#2997ff]' : 'text-[#0071e3]'}`}>
                  <span>{plan.billingCycle} Billing</span>
                  <span>SLA Covered</span>
                </div>
                <h2 className="text-2xl font-semibold mt-2">{plan.name}</h2>
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
                <p className={`text-sm mt-4 leading-relaxed ${idx === 1 ? 'text-white/75' : 'text-[#6e6e73]'}`}>
                  {plan.description}
                </p>
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
                    `Interested in Maintenance Plan: ${plan.name} (PKR ${plan.pricePkr.toLocaleString()} / ${plan.billingCycle})`
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
  );
}
