import { useState, type FormEvent } from 'react';
import {
  CheckCircle2,
  X,
  Calendar,
  PhoneCall,
  MapPin,
  Clock,
  Wrench,
  ChevronRight,
  ChevronLeft,
} from 'lucide-react';
import { FAMOUS_AREAS_DIRECTORY } from '../data/famousAreas.ts';
import { publicApi } from '../lib/api.ts';
import type { ServiceItem, SiteSettings } from '../types/index.ts';

interface BookingFormProps {
  services: ServiceItem[];
  settings: SiteSettings;
  defaultServiceName?: string;
  defaultNote?: string;
  onSuccess?: () => void;
  compact?: boolean;
}

const EQUIPMENT_TYPES = [
  'Inverter Split AC (1.0 – 2.0 Ton)',
  'Floor-Standing / Ceiling Cassette',
  'Commercial VRF / Chiller System',
  'Refrigerator / Deep Freezer',
  'Walk-in Cold Room / Dairy Chiller',
];

const URGENCY_TIERS = [
  { id: 'Standard Same-Day', label: 'Standard Same-Day', hint: 'Normal dispatch queue' },
  { id: 'Priority Express', label: 'Priority Express', hint: 'Target < 90 min arrival' },
  { id: '24/7 Emergency', label: '24/7 Emergency', hint: 'Immediate cold-chain / outage' },
  { id: 'Scheduled Maintenance', label: 'Scheduled Visit', hint: 'Planned inspection / AMC' },
];

const TIME_SLOTS = [
  '09:00 AM – 12:00 PM',
  '12:00 PM – 04:00 PM',
  '04:00 PM – 08:00 PM',
  '24/7 Urgent Dispatch',
];

export function BookingForm({
  services,
  settings,
  defaultServiceName,
  defaultNote = '',
  onSuccess,
  compact = false,
}: BookingFormProps) {
  const initialService =
    services.find((s) => s.title === defaultServiceName) || services[0] || null;

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [serviceName, setServiceName] = useState(initialService?.title || defaultServiceName || 'AC Repair');
  const [equipmentType, setEquipmentType] = useState(EQUIPMENT_TYPES[0]);
  const [urgency, setUrgency] = useState(URGENCY_TIERS[0].id);

  const [selectedCityGroup, setSelectedCityGroup] = useState<'Multan' | 'Khanewal' | 'Surrounding Towns'>('Multan');
  const [selectedArea, setSelectedArea] = useState('DHA Multan');
  const [preferredDate, setPreferredDate] = useState(() => {
    const tomorrow = new Date(Date.now() + 86400000);
    return tomorrow.toISOString().slice(0, 10);
  });
  const [timeSlot, setTimeSlot] = useState(TIME_SLOTS[0]);

  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [message, setMessage] = useState(defaultNote);

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirmation, setConfirmation] = useState<{
    bookingCode: string;
    serviceName: string;
    preferredDate: string;
    city: string;
    timeSlot: string;
  } | null>(null);

  const currentGroup =
    FAMOUS_AREAS_DIRECTORY.find((g) => g.city === selectedCityGroup) || FAMOUS_AREAS_DIRECTORY[0];

  function handleCityChange(cityName: 'Multan' | 'Khanewal' | 'Surrounding Towns') {
    setSelectedCityGroup(cityName);
    const grp = FAMOUS_AREAS_DIRECTORY.find((g) => g.city === cityName);
    if (grp && grp.areas.length > 0) {
      setSelectedArea(grp.areas[0]);
    }
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const matched = services.find((s) => s.title === serviceName);
      const cityLabel =
        selectedCityGroup === 'Surrounding Towns' ? selectedArea : `${selectedArea}, ${selectedCityGroup}`;
      const structuredNotes = [
        `Equipment: ${equipmentType}`,
        `Priority: ${urgency}`,
        `Time Slot: ${timeSlot}`,
        message.trim() ? `Details: ${message.trim()}` : '',
      ]
        .filter(Boolean)
        .join(' | ');

      const res = await publicApi.submitBooking({
        customerName,
        phone,
        email,
        serviceId: matched?.id ?? null,
        serviceName,
        city: cityLabel,
        address,
        preferredDate,
        message: structuredNotes,
      });
      setConfirmation({
        bookingCode: res.bookingCode,
        serviceName: res.serviceName,
        preferredDate: res.preferredDate,
        city: cityLabel,
        timeSlot,
      });
      if (onSuccess) onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to submit booking.');
    } finally {
      setSubmitting(false);
    }
  }

  if (confirmation) {
    return (
      <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 text-slate-900">
        <div className="flex items-start gap-3">
          <CheckCircle2 className="w-6 h-6 text-emerald-700 shrink-0 mt-0.5" />
          <div className="flex-1">
            <h3 className="text-lg font-bold text-slate-900">Appointment Confirmed in Dispatch Queue</h3>
            <p className="text-sm text-slate-700 mt-1">
              Your technician request has been logged in our system and sent to the regional coordinator.
            </p>
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 bg-white border border-emerald-200 rounded-xl p-4 text-xs">
              <div>
                <span className="text-slate-500 block">Tracking Code</span>
                <span className="font-mono font-bold text-emerald-800 tabular-nums">{confirmation.bookingCode}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Service</span>
                <span className="font-semibold text-slate-900">{confirmation.serviceName}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Area</span>
                <span className="font-semibold text-slate-900">{confirmation.city}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Date &amp; Window</span>
                <span className="font-mono font-medium text-slate-900 tabular-nums">
                  {confirmation.preferredDate} · {confirmation.timeSlot}
                </span>
              </div>
            </div>
            <div className="mt-5 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => {
                  setConfirmation(null);
                  setStep(1);
                  setCustomerName('');
                  setPhone('');
                  setAddress('');
                  setMessage('');
                }}
                className="px-4 py-2 text-xs font-semibold text-slate-800 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer"
              >
                Book Another Service
              </button>
              <a
                href={`https://wa.me/92${settings.whatsapp.replace(/^0/, '')}?text=${encodeURIComponent(
                  `Assalam-o-Alaikum Mujahid Services, I submitted booking ${confirmation.bookingCode} (${confirmation.serviceName}) in ${confirmation.city} for ${confirmation.preferredDate} (${confirmation.timeSlot}).`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 text-xs font-semibold text-white bg-emerald-700 rounded-lg hover:bg-emerald-800 transition-colors"
              >
                Send Tracking Code on WhatsApp
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Stepper Header */}
      <div className="grid grid-cols-3 gap-2 p-1.5 bg-white border border-black/[0.06] rounded-full">
        {[
          { num: 1 as const, label: '01. Service & Unit' },
          { num: 2 as const, label: '02. Area & Slot' },
          { num: 3 as const, label: '03. Contact & Book' },
        ].map((item) => (
          <button
            key={item.num}
            type="button"
            onClick={() => setStep(item.num)}
            className={`py-2 px-3 text-xs font-medium rounded-full transition-colors cursor-pointer whitespace-nowrap truncate ${
              step === item.num
                ? 'bg-[#1d1d1f] text-white'
                : step > item.num
                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                  : 'text-[#6e6e73] hover:text-[#1d1d1f]'
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      {error && (
        <div role="alert" className="p-3 bg-red-50 border border-red-200 text-red-800 text-sm rounded-lg">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        {step === 1 && (
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-2">
                Select Required HVACR Service
              </label>
              <div className={`grid grid-cols-1 ${compact ? 'sm:grid-cols-2' : 'sm:grid-cols-3'} gap-2.5`}>
                {services.map((svc) => {
                  const selected = serviceName === svc.title;
                  return (
                    <button
                      key={svc.id}
                      type="button"
                      onClick={() => setServiceName(svc.title)}
                      className={`text-left p-3.5 rounded-2xl border transition-all cursor-pointer ${
                        selected
                          ? 'bg-sky-50 border-[#0071e3] ring-2 ring-[#0071e3]/20'
                          : 'bg-white border-black/[0.08] hover:border-black/20'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs font-semibold text-[#1d1d1f]">{svc.title}</span>
                        <Wrench className={`w-3.5 h-3.5 ${selected ? 'text-[#0071e3]' : 'text-[#86868b]'}`} />
                      </div>
                      <div className="text-[11px] font-medium text-[#0071e3] mt-1 tabular-nums">{svc.priceRange}</div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-[#424245] mb-1.5">Equipment Type</label>
                <select
                  value={equipmentType}
                  onChange={(e) => setEquipmentType(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm bg-white border border-black/[0.08] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0071e3]/20 focus:border-[#0071e3]"
                >
                  {EQUIPMENT_TYPES.map((eq) => (
                    <option key={eq} value={eq}>
                      {eq}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-[#424245] mb-1.5">Dispatch Priority</label>
                <select
                  value={urgency}
                  onChange={(e) => setUrgency(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm bg-white border border-black/[0.08] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0071e3]/20 focus:border-[#0071e3]"
                >
                  {URGENCY_TIERS.map((u) => (
                    <option key={u.id} value={u.id}>
                      {u.label} — {u.hint}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="inline-flex items-center gap-1.5 px-6 py-2.5 text-sm font-medium text-white bg-[#0071e3] rounded-full hover:bg-[#0077ed] transition-colors cursor-pointer"
              >
                <span>Next: Select Area &amp; Time</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-2">
                Select City / Hub (Khanewal &amp; Multan Coverage)
              </label>
              <div className="grid grid-cols-3 gap-2">
                {FAMOUS_AREAS_DIRECTORY.map((grp) => (
                  <button
                    key={grp.city}
                    type="button"
                    onClick={() => handleCityChange(grp.city)}
                    className={`p-3 rounded-xl border text-left transition-colors cursor-pointer ${
                      selectedCityGroup === grp.city
                        ? 'bg-slate-900 text-white border-slate-900'
                        : 'bg-white text-slate-800 border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="text-xs font-bold">{grp.city}</div>
                    <div
                      className={`text-[11px] mt-0.5 ${
                        selectedCityGroup === grp.city ? 'text-sky-300' : 'text-slate-500'
                      }`}
                    >
                      {grp.eta}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-2">
                Choose Famous Area in {selectedCityGroup}
              </label>
              <div className="flex flex-wrap gap-1.5 max-h-36 overflow-y-auto p-2.5 bg-slate-50 border border-slate-200 rounded-xl">
                {currentGroup.areas.map((area) => {
                  const active = selectedArea === area;
                  return (
                    <button
                      key={area}
                      type="button"
                      onClick={() => setSelectedArea(area)}
                      className={`px-3 py-1.5 text-xs font-medium rounded-full border transition-colors cursor-pointer ${
                        active
                          ? 'bg-[#0071e3] text-white border-[#0071e3]'
                          : 'bg-white text-[#424245] border-black/[0.08] hover:border-[#0071e3]'
                      }`}
                    >
                      {area}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-[#424245] mb-1.5">Preferred Date *</label>
                <div className="relative">
                  <Calendar className="w-4 h-4 text-[#86868b] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="date"
                    required
                    min={new Date().toISOString().slice(0, 10)}
                    value={preferredDate}
                    onChange={(e) => setPreferredDate(e.target.value)}
                    className="w-full pl-9 pr-3.5 py-2.5 text-sm bg-white border border-black/[0.08] rounded-xl tabular-nums"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-[#424245] mb-1.5">Preferred Arrival Window</label>
                <div className="relative">
                  <Clock className="w-4 h-4 text-[#86868b] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <select
                    value={timeSlot}
                    onChange={(e) => setTimeSlot(e.target.value)}
                    className="w-full pl-9 pr-3.5 py-2.5 text-sm bg-white border border-black/[0.08] rounded-xl"
                  >
                    {TIME_SLOTS.map((slot) => (
                      <option key={slot} value={slot}>
                        {slot}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-medium text-[#1d1d1f] bg-white border border-black/[0.08] rounded-full hover:bg-black/[0.03] cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
              <button
                type="button"
                onClick={() => setStep(3)}
                className="inline-flex items-center gap-1.5 px-6 py-2.5 text-sm font-medium text-white bg-[#0071e3] rounded-full hover:bg-[#0077ed] cursor-pointer"
              >
                <span>Next: Contact Details</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <div className="p-4 bg-sky-50/80 border border-sky-200 rounded-2xl text-xs text-[#1d1d1f] flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#0071e3] shrink-0" />
                <span>
                  <strong>{serviceName}</strong> ({equipmentType}) ·{' '}
                  <strong>
                    {selectedArea}, {selectedCityGroup}
                  </strong>
                </span>
              </div>
              <span className="text-[#0071e3] font-semibold tabular-nums">
                {preferredDate} · {timeSlot}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-[#424245] mb-1.5">Full Name *</label>
                <input
                  type="text"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="e.g. Muhammad Tariq"
                  className="w-full px-3.5 py-2.5 text-sm bg-white border border-black/[0.08] rounded-xl"
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
                  className="w-full px-3.5 py-2.5 text-sm bg-white border border-black/[0.08] rounded-xl tabular-nums"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-[#424245] mb-1.5">Street / House / Plot No. *</label>
                <input
                  type="text"
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="House 14, Block C, near Main Market"
                  className="w-full px-3.5 py-2.5 text-sm bg-white border border-black/[0.08] rounded-xl"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-[#424245] mb-1.5">Email (Optional)</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full px-3.5 py-2.5 text-sm bg-white border border-black/[0.08] rounded-xl"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-[#424245] mb-1.5">
                Fault Description / Unit Brand &amp; Tonnage
              </label>
              <textarea
                rows={2}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="e.g. Gree 1.5 Ton Inverter displaying E6 error, outdoor fan stops after 2 mins..."
                className="w-full px-3.5 py-2.5 text-sm bg-white border border-black/[0.08] rounded-xl"
              />
            </div>

            <div className="flex flex-wrap items-center justify-between gap-4 pt-1">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="inline-flex items-center gap-1 px-4 py-2 text-xs font-medium text-[#1d1d1f] bg-white border border-black/[0.08] rounded-full hover:bg-black/[0.03] cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Back</span>
                </button>
                <a
                  href={`tel:${settings.phone}`}
                  className="inline-flex items-center gap-1.5 text-xs font-medium text-[#6e6e73] hover:text-[#1d1d1f]"
                >
                  <PhoneCall className="w-3.5 h-3.5 text-[#0071e3]" />
                  <span className="tabular-nums">{settings.phone}</span>
                </a>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="px-6 py-2.5 text-sm font-medium text-white bg-[#0071e3] rounded-full hover:bg-[#0077ed] disabled:opacity-60 transition-colors cursor-pointer whitespace-nowrap shrink-0"
              >
                {submitting ? 'Confirming Booking...' : 'Submit Appointment Booking'}
              </button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
}

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  services: ServiceItem[];
  settings: SiteSettings;
  defaultServiceName?: string;
  defaultNote?: string;
}

export function BookingModal({
  isOpen,
  onClose,
  services,
  settings,
  defaultServiceName,
  defaultNote,
}: BookingModalProps) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="booking-modal-title"
    >
      <div className="w-full max-w-2xl bg-[#f5f5f7] rounded-[32px] shadow-2xl overflow-hidden my-auto border border-white/60">
        <div className="flex items-center justify-between px-7 py-5 bg-black text-white">
          <div>
            <h2 id="booking-modal-title" className="text-lg font-semibold">
              Advanced HVACR Dispatch Booking
            </h2>
            <p className="text-xs text-sky-400 mt-0.5">
              All Famous Areas of Khanewal &amp; Multan · Instant Reference Tracking
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close booking dialog"
            className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-full transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-6 sm:p-7">
          <BookingForm
            services={services}
            settings={settings}
            defaultServiceName={defaultServiceName}
            defaultNote={defaultNote}
            compact
          />
        </div>
      </div>
    </div>
  );
}
