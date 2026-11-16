import { useState, type FormEvent } from 'react';
import { CheckCircle2, Star } from 'lucide-react';
import { FadeUp, ScaleIn } from '../../components/MotionReveal.tsx';
import { ALL_SERVICE_AREAS } from '../../data/famousAreas.ts';
import { publicApi } from '../../lib/api.ts';
import type { PublicPageProps } from './HomePage.tsx';

export function ReviewsPage({ data }: PublicPageProps) {
  const areaOptions = data.settings.serviceAreas.length > 0 ? data.settings.serviceAreas : ALL_SERVICE_AREAS;
  const [customerName, setCustomerName] = useState('');
  const [roleOrCompany, setRoleOrCompany] = useState('');
  const [city, setCity] = useState(areaOptions[0] || 'DHA Multan');
  const [serviceName, setServiceName] = useState(data.services[0]?.title || 'AC Repair');
  const [rating, setRating] = useState(5);
  const [reviewText, setReviewText] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await publicApi.submitReview({
        customerName,
        roleOrCompany,
        city,
        serviceName,
        rating,
        reviewText,
      });
      setSubmitted(true);
      setCustomerName('');
      setRoleOrCompany('');
      setReviewText('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to submit review.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="px-3 sm:px-6 py-8 bg-[#fbfbfd]">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-7 space-y-6">
          <FadeUp>
            <div className="bg-black text-white rounded-[32px] p-8 sm:p-10">
              <div className="text-xs font-medium text-sky-400 mb-2">Verified Testimonials</div>
              <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight">Customer Reviews</h1>
              <p className="text-white/70 mt-2">
                Feedback from residential homeowners, clinics, and commercial cold-storage facilities across Khanewal and Multan.
              </p>
            </div>
          </FadeUp>

          <div className="space-y-4">
            {data.testimonials.map((rev, idx) => (
              <ScaleIn key={rev.id} delay={idx * 0.05}>
                <article className="p-7 bg-[#f5f5f7] rounded-[28px]">
                  <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-[#6e6e73]">
                    <span>
                      {rev.serviceName} · {rev.city}
                    </span>
                    <span className="inline-flex items-center gap-1 font-medium text-amber-600 tabular-nums">
                      <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                      {rev.rating}.0 / 5.0
                    </span>
                  </div>
                  <p className="text-[#1d1d1f] mt-3 leading-relaxed">“{rev.reviewText}”</p>
                  <div className="mt-4 text-sm font-semibold text-[#1d1d1f]">
                    {rev.customerName}{' '}
                    <span className="font-normal text-[#6e6e73]">— {rev.roleOrCompany}</span>
                  </div>
                </article>
              </ScaleIn>
            ))}
          </div>
        </div>

        <FadeUp delay={0.08} className="lg:col-span-5">
          <div className="p-7 sm:p-8 bg-[#f5f5f7] rounded-[32px] sticky top-24 border border-black/[0.04]">
            <h2 className="text-xl font-semibold text-[#1d1d1f]">Share Your Experience</h2>
            <p className="text-xs text-[#6e6e73] mt-1 mb-5">
              Submitted reviews appear on our website once approved by our coordinator.
            </p>

            {submitted ? (
              <div className="p-5 bg-emerald-50 border border-emerald-200 rounded-[22px] text-sm text-emerald-900 flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
                <div>
                  <div className="font-semibold">Thank you for your review!</div>
                  <p className="mt-1 text-xs">Your feedback has been queued for approval.</p>
                  <button
                    type="button"
                    onClick={() => setSubmitted(false)}
                    className="mt-3 text-xs font-medium text-emerald-800 underline cursor-pointer"
                  >
                    Submit another review
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <div className="p-3 bg-red-50 border border-red-200 text-red-800 text-xs rounded-2xl">
                    {error}
                  </div>
                )}
                <div>
                  <label className="block text-xs font-medium text-[#424245] mb-1">Your Name *</label>
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-sm bg-white border border-black/[0.08] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0071e3]/30"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#424245] mb-1">Company / Residence</label>
                  <input
                    type="text"
                    value={roleOrCompany}
                    onChange={(e) => setRoleOrCompany(e.target.value)}
                    placeholder="e.g. Homeowner, Gulgasht Colony"
                    className="w-full px-3.5 py-2.5 text-sm bg-white border border-black/[0.08] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0071e3]/30"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-[#424245] mb-1">Area / City</label>
                    <select
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full px-3 py-2.5 text-sm bg-white border border-black/[0.08] rounded-xl"
                    >
                      {areaOptions.map((a) => (
                        <option key={a} value={a}>
                          {a}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-[#424245] mb-1">Rating</label>
                    <select
                      value={rating}
                      onChange={(e) => setRating(Number(e.target.value))}
                      className="w-full px-3 py-2.5 text-sm bg-white border border-black/[0.08] rounded-xl"
                    >
                      {[5, 4, 3, 2, 1].map((n) => (
                        <option key={n} value={n}>
                          {n} Stars
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#424245] mb-1">Service Used</label>
                  <select
                    value={serviceName}
                    onChange={(e) => setServiceName(e.target.value)}
                    className="w-full px-3 py-2.5 text-sm bg-white border border-black/[0.08] rounded-xl"
                  >
                    {data.services.map((s) => (
                      <option key={s.id} value={s.title}>
                        {s.title}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#424245] mb-1">Your Review *</label>
                  <textarea
                    rows={3}
                    required
                    value={reviewText}
                    onChange={(e) => setReviewText(e.target.value)}
                    placeholder="Share how our technician handled your installation or repair..."
                    className="w-full px-3.5 py-2.5 text-sm bg-white border border-black/[0.08] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0071e3]/30"
                  />
                </div>
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-3 text-sm font-medium text-white bg-[#0071e3] rounded-full hover:bg-[#0077ed] disabled:opacity-60 transition-colors cursor-pointer"
                >
                  {submitting ? 'Submitting...' : 'Submit Review'}
                </button>
              </form>
            )}
          </div>
        </FadeUp>
      </div>
    </div>
  );
}
