import { useState, type FormEvent } from 'react';
import { CheckCircle2, MessageCircle, Phone } from 'lucide-react';
import { BookingForm } from '../../components/BookingModal.tsx';
import { FamousAreasSection } from '../../components/FamousAreasSection.tsx';
import { FadeUp } from '../../components/MotionReveal.tsx';
import { ALL_SERVICE_AREAS } from '../../data/famousAreas.ts';
import { publicApi } from '../../lib/api.ts';
import type { PublicPageProps } from './HomePage.tsx';

export function ContactPage({ data, onOpenBooking }: PublicPageProps) {
  const { settings, services } = data;
  const areaOptions = settings.serviceAreas.length > 0 ? settings.serviceAreas : ALL_SERVICE_AREAS;

  const [activeTab, setActiveTab] = useState<'inquiry' | 'booking'>('inquiry');
  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [city, setCity] = useState(areaOptions[0] || 'DHA Multan');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const whatsappUrl = `https://wa.me/92${settings.whatsapp.replace(/^0/, '')}`;

  async function handleInquirySubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await publicApi.submitInquiry({
        customerName,
        phone,
        email,
        city,
        subject,
        message,
      });
      setSent(true);
      setCustomerName('');
      setPhone('');
      setEmail('');
      setSubject('');
      setMessage('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to send inquiry.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="bg-[#fbfbfd] pb-12">
      <div className="px-3 sm:px-6 pt-8 pb-10">
        <section className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
          <FadeUp className="lg:col-span-5 space-y-6">
            <div className="bg-black text-white rounded-[32px] p-8">
              <div className="text-xs font-medium text-sky-400 mb-2">Contact &amp; Dispatch</div>
              <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight">
                Get in Touch with {settings.companyName}
              </h1>
              <p className="text-white/70 mt-3 leading-relaxed text-sm">
                Reach our Khanewal and Multan engineering desks for commercial tenders, maintenance contracts, or urgent breakdown dispatch.
              </p>
            </div>

            <div className="bg-[#f5f5f7] rounded-[28px] p-7 space-y-5">
              <div>
                <div className="text-xs text-[#86868b]">Direct Helpline</div>
                <a
                  href={`tel:${settings.phone}`}
                  className="mt-1 inline-flex items-center gap-2 text-lg font-semibold text-[#1d1d1f] hover:text-[#0071e3] transition-colors tabular-nums"
                >
                  <Phone className="w-4 h-4 text-[#0071e3]" />
                  {settings.phone}
                </a>
              </div>
              <div className="pt-4 border-t border-black/[0.06]">
                <div className="text-xs text-[#86868b]">WhatsApp Engineering Desk</div>
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-1 inline-flex items-center gap-2 text-base font-semibold text-[#0071e3] hover:underline tabular-nums"
                >
                  <MessageCircle className="w-4 h-4" />
                  {settings.whatsapp}
                </a>
              </div>
              <div className="pt-4 border-t border-black/[0.06]">
                <div className="text-xs text-[#86868b]">Workshops &amp; Service Address</div>
                <p className="text-sm text-[#1d1d1f] mt-1">{settings.address}</p>
              </div>
              <div className="pt-4 border-t border-black/[0.06]">
                <div className="text-xs text-[#86868b]">Operating Hours</div>
                <p className="text-sm text-[#1d1d1f] mt-1">{settings.workingHours}</p>
              </div>
              <div className="pt-4 border-t border-black/[0.06]">
                <div className="text-xs text-[#86868b]">Covered Regions</div>
                <p className="text-xs text-[#6e6e73] mt-1 leading-relaxed">
                  {areaOptions.slice(0, 14).join(' · ')} &amp; {Math.max(0, areaOptions.length - 14)}+ more colonies
                </p>
              </div>
            </div>
          </FadeUp>

          <FadeUp delay={0.08} className="lg:col-span-7">
            <div className="bg-[#f5f5f7] rounded-[32px] p-6 sm:p-9 border border-black/[0.04]">
              <div className="flex items-center gap-1 p-1 bg-white rounded-full w-fit mb-6 border border-black/[0.06]">
                <button
                  type="button"
                  onClick={() => setActiveTab('inquiry')}
                  className={`px-4 py-2 text-xs font-medium rounded-full transition-all cursor-pointer ${
                    activeTab === 'inquiry' ? 'bg-[#1d1d1f] text-white' : 'text-[#6e6e73] hover:text-[#1d1d1f]'
                  }`}
                >
                  Send General Inquiry
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('booking')}
                  className={`px-4 py-2 text-xs font-medium rounded-full transition-all cursor-pointer ${
                    activeTab === 'booking' ? 'bg-[#1d1d1f] text-white' : 'text-[#6e6e73] hover:text-[#1d1d1f]'
                  }`}
                >
                  3-Step Booking Wizard
                </button>
              </div>

              {activeTab === 'booking' ? (
                <BookingForm services={services} settings={settings} />
              ) : sent ? (
                <div className="p-6 bg-emerald-50 border border-emerald-200 rounded-[24px] text-emerald-950">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-6 h-6 text-emerald-700 shrink-0 mt-0.5" />
                    <div>
                      <h2 className="text-lg font-semibold">Inquiry Sent Successfully</h2>
                      <p className="text-sm text-emerald-800 mt-1">
                        Our coordinator has received your inquiry and will reply via phone or WhatsApp shortly.
                      </p>
                      <button
                        type="button"
                        onClick={() => setSent(false)}
                        className="mt-4 px-4 py-2 text-xs font-medium bg-white border border-emerald-300 rounded-full cursor-pointer"
                      >
                        Send Another Message
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleInquirySubmit} className="space-y-4">
                  {error && (
                    <div className="p-3 bg-red-50 border border-red-200 text-red-800 text-sm rounded-2xl">
                      {error}
                    </div>
                  )}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-[#424245] mb-1.5">Your Name *</label>
                      <input
                        type="text"
                        required
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        className="w-full px-3.5 py-2.5 text-sm bg-white border border-black/[0.08] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0071e3]/30"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-[#424245] mb-1.5">Phone / WhatsApp *</label>
                      <input
                        type="tel"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="03041241947"
                        className="w-full px-3.5 py-2.5 text-sm bg-white border border-black/[0.08] rounded-xl tabular-nums focus:outline-none focus:ring-2 focus:ring-[#0071e3]/30"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-[#424245] mb-1.5">Email (Optional)</label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-3.5 py-2.5 text-sm bg-white border border-black/[0.08] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0071e3]/30"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-[#424245] mb-1.5">Area / Colony</label>
                      <select
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        className="w-full px-3.5 py-2.5 text-sm bg-white border border-black/[0.08] rounded-xl"
                      >
                        {areaOptions.map((area) => (
                          <option key={area} value={area}>
                            {area}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-[#424245] mb-1.5">Subject *</label>
                    <input
                      type="text"
                      required
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      placeholder="e.g. Commercial Cold Room AMC Quotation"
                      className="w-full px-3.5 py-2.5 text-sm bg-white border border-black/[0.08] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0071e3]/30"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-[#424245] mb-1.5">Message *</label>
                    <textarea
                      rows={4}
                      required
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Tell us about your HVACR project, equipment, or question..."
                      className="w-full px-3.5 py-2.5 text-sm bg-white border border-black/[0.08] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0071e3]/30"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-6 py-3 text-sm font-medium text-white bg-[#0071e3] rounded-full hover:bg-[#0077ed] disabled:opacity-60 transition-colors cursor-pointer"
                  >
                    {submitting ? 'Sending...' : 'Send Inquiry'}
                  </button>
                </form>
              )}
            </div>
          </FadeUp>
        </section>
      </div>

      <FadeUp delay={0.05}>
        <FamousAreasSection
          onBookInArea={(area, areaCity) =>
            onOpenBooking(undefined, `Dispatch request from Contact directory: ${area} (${areaCity})`)
          }
        />
      </FadeUp>
    </div>
  );
}
