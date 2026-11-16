import { useState, type ChangeEvent, type FormEvent } from 'react';
import { Download, Upload, Plus, Trash2, Pencil, CheckCircle2, AlertTriangle, LogOut } from 'lucide-react';
import { adminApi, authApi, exportRowsToCsv, resolveApiUrl } from '../../lib/api.ts';
import type {
  AdminUser,
  BookingRecord,
  ContactInquiry,
  FaqItem,
  ReportsPayload,
  SiteSettings,
} from '../../types/index.ts';

// ============================================================================
// 9. WEBSITE CONTENT MANAGEMENT (Homepage, About, Contact, Banners, Areas, FAQs)
// ============================================================================
export function WebsiteContentView({
  settings,
  faqs,
  onReload,
}: {
  settings: SiteSettings;
  faqs: FaqItem[];
  onReload: () => Promise<void>;
}) {
  const [form, setForm] = useState<SiteSettings>(settings);
  const [areasText, setAreasText] = useState(settings.serviceAreas.join(', '));
  const [saving, setSaving] = useState(false);
  const [savedMsg, setSavedMsg] = useState<string | null>(null);
  const [uploadingField, setUploadingField] = useState<string | null>(null);

  const [editingFaq, setEditingFaq] = useState<Partial<FaqItem> | null>(null);

  async function handleBannerUpload(
    field: 'heroBannerImage' | 'aboutBannerImage' | 'servicesBannerImage' | 'projectsBannerImage',
    e: ChangeEvent<HTMLInputElement>
  ) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingField(field);
    try {
      const { url } = await adminApi.uploadImage(file);
      setForm((prev) => ({ ...prev, [field]: url }));
    } finally {
      setUploadingField(null);
    }
  }

  async function handleSaveSettings(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    setSavedMsg(null);
    try {
      const serviceAreas = areasText
        .split(',')
        .map((a) => a.trim())
        .filter(Boolean);
      await adminApi.updateSettings({ ...form, serviceAreas });
      await onReload();
      setSavedMsg('Website content updated and published live.');
    } finally {
      setSaving(false);
    }
  }

  async function handleSaveFaq(e: FormEvent) {
    e.preventDefault();
    if (!editingFaq) return;
    if (editingFaq.id) {
      await adminApi.updateFaq(editingFaq.id, editingFaq);
    } else {
      await adminApi.createFaq(editingFaq);
    }
    setEditingFaq(null);
    await onReload();
  }

  return (
    <div className="space-y-8">
      <form onSubmit={handleSaveSettings} className="bg-[#f5f5f7] border border-black/[0.04] rounded-[28px] p-6 sm:p-8 space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-black/[0.06] pb-4">
          <div>
            <h2 className="text-base font-semibold text-[#1d1d1f]">Homepage, About Us &amp; Contact Content</h2>
            <p className="text-xs text-[#6e6e73] mt-0.5">Changes automatically reflect on the public website.</p>
          </div>
          <button
            type="submit"
            disabled={saving}
            className="px-5 py-2.5 text-xs font-medium text-white bg-[#0071e3] rounded-full hover:bg-[#0077ed] transition-colors cursor-pointer"
          >
            {saving ? 'Publishing...' : 'Save & Publish Content'}
          </button>
        </div>

        {savedMsg && (
          <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-2xl flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{savedMsg}</span>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-[#424245] mb-1">Company Name</label>
            <input
              type="text"
              value={form.companyName}
              onChange={(e) => setForm({ ...form, companyName: e.target.value })}
              className="w-full px-3.5 py-2.5 text-xs bg-white border border-black/[0.08] rounded-xl"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-[#424245] mb-1">Tagline</label>
            <input
              type="text"
              value={form.tagline}
              onChange={(e) => setForm({ ...form, tagline: e.target.value })}
              className="w-full px-3.5 py-2.5 text-xs bg-white border border-black/[0.08] rounded-xl"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-xs font-medium text-[#424245] mb-1">Homepage Hero Headline</label>
            <input
              type="text"
              value={form.heroTitle}
              onChange={(e) => setForm({ ...form, heroTitle: e.target.value })}
              className="w-full px-3.5 py-2.5 text-xs bg-white border border-black/[0.08] rounded-xl"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-xs font-medium text-[#424245] mb-1">Homepage Hero Subtitle</label>
            <textarea
              rows={2}
              value={form.heroSubtitle}
              onChange={(e) => setForm({ ...form, heroSubtitle: e.target.value })}
              className="w-full px-3.5 py-2.5 text-xs bg-white border border-black/[0.08] rounded-xl"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-[#424245] mb-1">Phone Number</label>
            <input
              type="text"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              className="w-full px-3.5 py-2.5 text-xs bg-white border border-black/[0.08] rounded-xl tabular-nums"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-[#424245] mb-1">WhatsApp Number</label>
            <input
              type="text"
              value={form.whatsapp}
              onChange={(e) => setForm({ ...form, whatsapp: e.target.value })}
              className="w-full px-3.5 py-2.5 text-xs bg-white border border-black/[0.08] rounded-xl tabular-nums"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-[#424245] mb-1">Contact Email</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full px-3.5 py-2.5 text-xs bg-white border border-black/[0.08] rounded-xl"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-[#424245] mb-1">Working Hours</label>
            <input
              type="text"
              value={form.workingHours}
              onChange={(e) => setForm({ ...form, workingHours: e.target.value })}
              className="w-full px-3.5 py-2.5 text-xs bg-white border border-black/[0.08] rounded-xl"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-xs font-medium text-[#424245] mb-1">Workshop &amp; Office Address</label>
            <input
              type="text"
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
              className="w-full px-3.5 py-2.5 text-xs bg-white border border-black/[0.08] rounded-xl"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-xs font-medium text-[#424245] mb-1">
              Service Areas (Comma-separated cities)
            </label>
            <input
              type="text"
              value={areasText}
              onChange={(e) => setAreasText(e.target.value)}
              className="w-full px-3.5 py-2.5 text-xs bg-white border border-black/[0.08] rounded-xl"
            />
          </div>
        </div>

        <div className="pt-4 border-t border-black/[0.06] grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className="block text-xs font-medium text-[#424245] mb-1">About Us Heading</label>
            <input
              type="text"
              value={form.aboutTitle}
              onChange={(e) => setForm({ ...form, aboutTitle: e.target.value })}
              className="w-full px-3.5 py-2.5 text-xs bg-white border border-black/[0.08] rounded-xl"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-[#424245] mb-1">About Us Description</label>
            <textarea
              rows={3}
              value={form.aboutDescription}
              onChange={(e) => setForm({ ...form, aboutDescription: e.target.value })}
              className="w-full px-3.5 py-2.5 text-xs bg-white border border-black/[0.08] rounded-xl"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-[#424245] mb-1">Mission Statement</label>
            <textarea
              rows={3}
              value={form.aboutMission}
              onChange={(e) => setForm({ ...form, aboutMission: e.target.value })}
              className="w-full px-3.5 py-2.5 text-xs bg-white border border-black/[0.08] rounded-xl"
            />
          </div>
        </div>

        <div className="pt-4 border-t border-black/[0.06] grid grid-cols-1 md:grid-cols-2 gap-4">
          {(
            [
              ['heroBannerImage', 'Homepage Hero Banner Image'],
              ['aboutBannerImage', 'About Workshop Banner Image'],
            ] as const
          ).map(([field, label]) => (
            <div key={field}>
              <label className="block text-xs font-medium text-[#424245] mb-1">{label}</label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={form[field]}
                  onChange={(e) => setForm({ ...form, [field]: e.target.value })}
                  className="flex-1 px-3.5 py-2.5 text-xs bg-white border border-black/[0.08] rounded-xl"
                />
                <label className="inline-flex items-center gap-1.5 px-3.5 py-2.5 text-xs font-medium bg-white border border-black/[0.08] hover:bg-black hover:text-white rounded-full transition-colors cursor-pointer shrink-0">
                  <Upload className="w-3.5 h-3.5" />
                  <span>{uploadingField === field ? '...' : 'Upload'}</span>
                  <input
                    type="file"
                    accept="image/png,image/jpeg,image/webp"
                    className="hidden"
                    onChange={(e) => handleBannerUpload(field, e)}
                  />
                </label>
              </div>
            </div>
          ))}
        </div>
      </form>

      {/* FAQs Management */}
      <div className="bg-[#f5f5f7] border border-black/[0.04] rounded-[28px] p-6 sm:p-8 space-y-5">
        <div className="flex items-center justify-between border-b border-black/[0.06] pb-4">
          <div>
            <h2 className="text-base font-semibold text-[#1d1d1f]">FAQs Management ({faqs.length})</h2>
            <p className="text-xs text-[#6e6e73]">Add, edit, or unpublish customer FAQs.</p>
          </div>
          <button
            type="button"
            onClick={() =>
              setEditingFaq({ question: '', answer: '', category: 'General', sortOrder: faqs.length + 1, isPublished: true })
            }
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-medium text-white bg-[#0071e3] rounded-full hover:bg-[#0077ed] cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add FAQ</span>
          </button>
        </div>

        {editingFaq && (
          <form onSubmit={handleSaveFaq} className="p-5 bg-white border border-black/[0.06] rounded-[22px] space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="md:col-span-2">
                <label className="block text-xs font-medium text-[#424245] mb-1">Question *</label>
                <input
                  type="text"
                  required
                  value={editingFaq.question || ''}
                  onChange={(e) => setEditingFaq({ ...editingFaq, question: e.target.value })}
                  className="w-full px-3.5 py-2 text-xs bg-[#f5f5f7] border border-black/[0.08] rounded-xl"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-[#424245] mb-1">Category</label>
                <input
                  type="text"
                  value={editingFaq.category || 'General'}
                  onChange={(e) => setEditingFaq({ ...editingFaq, category: e.target.value })}
                  className="w-full px-3.5 py-2 text-xs bg-[#f5f5f7] border border-black/[0.08] rounded-xl"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-[#424245] mb-1">Answer *</label>
              <textarea
                rows={3}
                required
                value={editingFaq.answer || ''}
                onChange={(e) => setEditingFaq({ ...editingFaq, answer: e.target.value })}
                className="w-full px-3.5 py-2 text-xs bg-[#f5f5f7] border border-black/[0.08] rounded-xl"
              />
            </div>
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-xs text-[#424245]">
                <input
                  type="checkbox"
                  checked={editingFaq.isPublished !== false}
                  onChange={(e) => setEditingFaq({ ...editingFaq, isPublished: e.target.checked })}
                />
                <span>Published</span>
              </label>
              <div className="flex gap-2">
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs font-medium text-white bg-[#0071e3] rounded-full cursor-pointer"
                >
                  Save FAQ
                </button>
                <button
                  type="button"
                  onClick={() => setEditingFaq(null)}
                  className="px-4 py-1.5 text-xs font-medium text-[#1d1d1f] bg-[#f5f5f7] rounded-full cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </div>
          </form>
        )}

        <div className="bg-white rounded-[22px] border border-black/[0.05] divide-y divide-black/[0.05]">
          {faqs.map((f) => (
            <div key={f.id} className="p-4 flex items-start justify-between gap-4">
              <div>
                <div className="text-xs font-semibold text-[#1d1d1f]">
                  {f.question}{' '}
                  <span className="text-[#86868b] font-normal">· {f.category}</span>
                </div>
                <p className="text-xs text-[#6e6e73] mt-1">{f.answer}</p>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <button
                  type="button"
                  onClick={() => setEditingFaq({ ...f })}
                  className="p-1.5 text-[#6e6e73] hover:bg-black/5 rounded-full cursor-pointer"
                >
                  <Pencil className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => adminApi.deleteFaq(f.id).then(onReload)}
                  className="p-1.5 text-[#86868b] hover:text-red-600 hover:bg-red-50 rounded-full cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// 10. REPORTS & ANALYTICS (Daily, Weekly, Monthly, Service-wise, Inquiry, CSV/Excel)
// ============================================================================
export function ReportsView({
  reports,
  bookings,
  inquiries,
}: {
  reports: ReportsPayload | null;
  bookings: BookingRecord[];
  inquiries: ContactInquiry[];
}) {
  if (!reports) {
    return <div className="p-6 bg-[#f5f5f7] rounded-[24px] text-sm text-[#6e6e73]">Loading reports...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="bg-[#f5f5f7] border border-black/[0.04] rounded-[28px] p-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-semibold text-[#1d1d1f]">Operational Reports &amp; CSV/Excel Export</h2>
          <p className="text-xs text-[#6e6e73] mt-0.5">
            All breakdowns are queried live from the SQLite database. Exports include UTF-8 BOM for Microsoft Excel.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() =>
              exportRowsToCsv(
                `mujahid-service-report-${new Date().toISOString().slice(0, 10)}.csv`,
                ['Service', 'Total Bookings', 'Completed', 'Pending'],
                reports.serviceBreakdown.map((s) => [s.serviceName, s.total, s.completed, s.pending])
              )
            }
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-medium text-white bg-[#0071e3] rounded-full hover:bg-[#0077ed] cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Service Report</span>
          </button>
          <button
            type="button"
            onClick={() =>
              exportRowsToCsv(
                `mujahid-all-bookings-${new Date().toISOString().slice(0, 10)}.csv`,
                ['Code', 'Customer', 'Phone', 'Service', 'City', 'Address', 'Preferred Date', 'Status', 'Created'],
                bookings.map((b) => [
                  b.bookingCode,
                  b.customerName,
                  b.phone,
                  b.serviceName,
                  b.city,
                  b.address,
                  b.preferredDate,
                  b.status,
                  b.createdAt,
                ])
              )
            }
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-medium text-[#1d1d1f] bg-white border border-black/[0.08] hover:bg-black hover:text-white rounded-full transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export All Bookings</span>
          </button>
          <button
            type="button"
            onClick={() =>
              exportRowsToCsv(
                `mujahid-inquiries-report-${new Date().toISOString().slice(0, 10)}.csv`,
                ['ID', 'Customer', 'Phone', 'City', 'Subject', 'Status', 'Replied At', 'Created At'],
                inquiries.map((i) => [
                  i.id,
                  i.customerName,
                  i.phone,
                  i.city,
                  i.subject,
                  i.isRead ? 'Read' : 'Unread',
                  i.repliedAt || '',
                  i.createdAt,
                ])
              )
            }
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-medium text-[#1d1d1f] bg-white border border-black/[0.08] hover:bg-black hover:text-white rounded-full transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Inquiries Report</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Service-Wise Report */}
        <div className="bg-white border border-black/[0.06] rounded-[28px] overflow-hidden">
          <div className="px-6 py-4 border-b border-black/[0.06] font-semibold text-sm text-[#1d1d1f]">
            Service-Wise Booking Report
          </div>
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[#f5f5f7] border-b border-black/[0.06] text-[#86868b]">
                <th className="py-3 px-4">Service</th>
                <th className="py-3 px-4 text-right">Total</th>
                <th className="py-3 px-4 text-right">Completed</th>
                <th className="py-3 px-4 text-right">Pending</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/[0.05]">
              {reports.serviceBreakdown.map((row) => (
                <tr key={row.serviceName}>
                  <td className="py-3 px-4 font-medium text-[#1d1d1f]">{row.serviceName}</td>
                  <td className="py-3 px-4 text-right tabular-nums">{row.total}</td>
                  <td className="py-3 px-4 text-right text-emerald-700 tabular-nums">{row.completed}</td>
                  <td className="py-3 px-4 text-right text-amber-700 tabular-nums">{row.pending}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Customer Inquiry Report */}
        <div className="bg-[#f5f5f7] border border-black/[0.04] rounded-[28px] p-6 space-y-4">
          <div className="font-semibold text-sm text-[#1d1d1f]">Customer Inquiry Summary</div>
          <div className="grid grid-cols-3 gap-3">
            <div className="p-4 bg-white rounded-2xl border border-black/[0.04]">
              <div className="text-[11px] text-[#86868b]">Total Inquiries</div>
              <div className="text-xl font-semibold text-[#1d1d1f] tabular-nums mt-1">
                {reports.inquirySummary.total}
              </div>
            </div>
            <div className="p-4 bg-white rounded-2xl border border-black/[0.04]">
              <div className="text-[11px] text-[#86868b]">Unread</div>
              <div className="text-xl font-semibold text-amber-700 tabular-nums mt-1">
                {reports.inquirySummary.unread}
              </div>
            </div>
            <div className="p-4 bg-white rounded-2xl border border-black/[0.04]">
              <div className="text-[11px] text-[#86868b]">Replied</div>
              <div className="text-xl font-semibold text-emerald-700 tabular-nums mt-1">
                {reports.inquirySummary.replied}
              </div>
            </div>
          </div>
          <div className="pt-2 border-t border-black/[0.06]">
            <div className="text-xs font-medium text-[#424245] mb-2">Inquiries by City</div>
            <div className="space-y-1.5 text-xs">
              {reports.inquirySummary.byCity.map((c) => (
                <div key={c.city} className="flex items-center justify-between">
                  <span className="text-[#424245]">{c.city}</span>
                  <span className="font-semibold text-[#1d1d1f] tabular-nums">{c.count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Daily, Weekly, Monthly Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white border border-black/[0.06] rounded-[28px] overflow-hidden">
          <div className="px-5 py-3.5 border-b border-black/[0.06] flex items-center justify-between">
            <span className="text-xs font-semibold text-[#1d1d1f]">Daily Bookings</span>
            <button
              type="button"
              onClick={() =>
                exportRowsToCsv(
                  'mujahid-daily-bookings.csv',
                  ['Date', 'Total', 'Completed'],
                  reports.daily.map((d) => [d.date, d.count, d.completed])
                )
              }
              className="text-[11px] font-medium text-[#0071e3] hover:underline cursor-pointer"
            >
              CSV
            </button>
          </div>
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-[#f5f5f7] border-b border-black/[0.06] text-[#86868b]">
                <th className="py-2.5 px-4">Date</th>
                <th className="py-2.5 px-4 text-right">Bookings</th>
                <th className="py-2.5 px-4 text-right">Done</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/[0.05]">
              {reports.daily.map((d) => (
                <tr key={d.date}>
                  <td className="py-2.5 px-4 tabular-nums">{d.date}</td>
                  <td className="py-2.5 px-4 text-right tabular-nums">{d.count}</td>
                  <td className="py-2.5 px-4 text-right text-emerald-700 tabular-nums">{d.completed}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="bg-white border border-black/[0.06] rounded-[28px] overflow-hidden">
          <div className="px-5 py-3.5 border-b border-black/[0.06] flex items-center justify-between">
            <span className="text-xs font-semibold text-[#1d1d1f]">Weekly Bookings</span>
            <button
              type="button"
              onClick={() =>
                exportRowsToCsv(
                  'mujahid-weekly-bookings.csv',
                  ['Week', 'Total', 'Completed'],
                  reports.weekly.map((w) => [w.week, w.count, w.completed])
                )
              }
              className="text-[11px] font-medium text-[#0071e3] hover:underline cursor-pointer"
            >
              CSV
            </button>
          </div>
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-[#f5f5f7] border-b border-black/[0.06] text-[#86868b]">
                <th className="py-2.5 px-4">Week</th>
                <th className="py-2.5 px-4 text-right">Bookings</th>
                <th className="py-2.5 px-4 text-right">Done</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/[0.05]">
              {reports.weekly.map((w) => (
                <tr key={w.week}>
                  <td className="py-2.5 px-4 tabular-nums">{w.week}</td>
                  <td className="py-2.5 px-4 text-right tabular-nums">{w.count}</td>
                  <td className="py-2.5 px-4 text-right text-emerald-700 tabular-nums">{w.completed}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="bg-white border border-black/[0.06] rounded-[28px] overflow-hidden">
          <div className="px-5 py-3.5 border-b border-black/[0.06] flex items-center justify-between">
            <span className="text-xs font-semibold text-[#1d1d1f]">Monthly Bookings</span>
            <button
              type="button"
              onClick={() =>
                exportRowsToCsv(
                  'mujahid-monthly-bookings.csv',
                  ['Month', 'Total', 'Completed', 'Cancelled'],
                  reports.monthly.map((m) => [m.month, m.count, m.completed, m.cancelled])
                )
              }
              className="text-[11px] font-medium text-[#0071e3] hover:underline cursor-pointer"
            >
              CSV
            </button>
          </div>
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-[#f5f5f7] border-b border-black/[0.06] text-[#86868b]">
                <th className="py-2.5 px-4">Month</th>
                <th className="py-2.5 px-4 text-right">Bookings</th>
                <th className="py-2.5 px-4 text-right">Done</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/[0.05]">
              {reports.monthly.map((m) => (
                <tr key={m.month}>
                  <td className="py-2.5 px-4 tabular-nums">{m.month}</td>
                  <td className="py-2.5 px-4 text-right tabular-nums">{m.count}</td>
                  <td className="py-2.5 px-4 text-right text-emerald-700 tabular-nums">{m.completed}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// 11. ADMIN SETTINGS, PASSWORD CHANGE, & DATABASE BACKUP / RECOVERY
// ============================================================================
export function AdminSettingsView({
  adminUser,
  onUserUpdated,
  onReloadAll,
  onLogout,
}: {
  adminUser: AdminUser;
  onUserUpdated: (u: AdminUser) => void;
  onReloadAll: () => Promise<void>;
  onLogout: () => Promise<void>;
}) {
  const [profile, setProfile] = useState({
    fullName: adminUser.fullName,
    username: adminUser.username,
    email: adminUser.email,
    role: adminUser.role,
  });
  const [profileMsg, setProfileMsg] = useState<string | null>(null);
  const [profileErr, setProfileErr] = useState<string | null>(null);

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [pwMsg, setPwMsg] = useState<string | null>(null);
  const [pwErr, setPwErr] = useState<string | null>(null);

  const [restoreMsg, setRestoreMsg] = useState<string | null>(null);
  const [restoreErr, setRestoreErr] = useState<string | null>(null);
  const [restoring, setRestoring] = useState(false);

  async function handleSaveProfile(e: FormEvent) {
    e.preventDefault();
    setProfileMsg(null);
    setProfileErr(null);
    try {
      const { user } = await authApi.updateProfile(profile);
      onUserUpdated(user);
      setProfileMsg('Administrator profile updated.');
    } catch (err) {
      setProfileErr(err instanceof Error ? err.message : 'Unable to update profile.');
    }
  }

  async function handleChangePassword(e: FormEvent) {
    e.preventDefault();
    setPwMsg(null);
    setPwErr(null);
    if (newPassword !== confirmPassword) {
      setPwErr('New passwords do not match.');
      return;
    }
    try {
      const res = await authApi.changePassword(currentPassword, newPassword);
      setPwMsg(res.message);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      setPwErr(err instanceof Error ? err.message : 'Failed to change password.');
    }
  }

  async function handleRestoreJsonFile(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setRestoreMsg(null);
    setRestoreErr(null);
    setRestoring(true);
    try {
      const text = await file.text();
      const parsed = JSON.parse(text);
      const res = await adminApi.restoreJsonBackup(parsed);
      await onReloadAll();
      setRestoreMsg(
        `Database restored successfully (${res.restoredCounts.bookings} bookings, ${res.restoredCounts.customers} customers, ${res.restoredCounts.services} services).`
      );
    } catch (err) {
      setRestoreErr(err instanceof Error ? err.message : 'Invalid backup file.');
    } finally {
      setRestoring(false);
      e.target.value = '';
    }
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Admin Profile */}
        <form onSubmit={handleSaveProfile} className="bg-[#f5f5f7] border border-black/[0.04] rounded-[28px] p-6 sm:p-7 space-y-4">
          <div className="border-b border-black/[0.06] pb-3.5">
            <h2 className="text-base font-semibold text-[#1d1d1f]">Administrator Profile</h2>
            <p className="text-xs text-[#6e6e73]">Manage operator credentials and display name.</p>
          </div>
          {profileMsg && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-2xl">
              {profileMsg}
            </div>
          )}
          {profileErr && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-800 text-xs rounded-2xl">
              {profileErr}
            </div>
          )}
          <div>
            <label className="block text-xs font-medium text-[#424245] mb-1">Full Name</label>
            <input
              type="text"
              required
              value={profile.fullName}
              onChange={(e) => setProfile({ ...profile, fullName: e.target.value })}
              className="w-full px-3.5 py-2.5 text-xs bg-white border border-black/[0.08] rounded-xl"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-[#424245] mb-1">Username</label>
              <input
                type="text"
                required
                value={profile.username}
                onChange={(e) => setProfile({ ...profile, username: e.target.value })}
                className="w-full px-3.5 py-2.5 text-xs bg-white border border-black/[0.08] rounded-xl"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-[#424245] mb-1">Role Title</label>
              <input
                type="text"
                value={profile.role}
                onChange={(e) => setProfile({ ...profile, role: e.target.value })}
                className="w-full px-3.5 py-2.5 text-xs bg-white border border-black/[0.08] rounded-xl"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-[#424245] mb-1">Admin Email</label>
            <input
              type="email"
              required
              value={profile.email}
              onChange={(e) => setProfile({ ...profile, email: e.target.value })}
              className="w-full px-3.5 py-2.5 text-xs bg-white border border-black/[0.08] rounded-xl"
            />
          </div>
          <button
            type="submit"
            className="px-5 py-2 text-xs font-medium text-white bg-[#0071e3] rounded-full hover:bg-[#0077ed] cursor-pointer"
          >
            Update Profile
          </button>
        </form>

        {/* Change Password */}
        <form onSubmit={handleChangePassword} className="bg-[#f5f5f7] border border-black/[0.04] rounded-[28px] p-6 sm:p-7 space-y-4">
          <div className="border-b border-black/[0.06] pb-3.5">
            <h2 className="text-base font-semibold text-[#1d1d1f]">Change Admin Password</h2>
            <p className="text-xs text-[#6e6e73]">Salted scrypt hashing with instant other-session revocation.</p>
          </div>
          {pwMsg && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-2xl">
              {pwMsg}
            </div>
          )}
          {pwErr && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-800 text-xs rounded-2xl">
              {pwErr}
            </div>
          )}
          <div>
            <label className="block text-xs font-medium text-[#424245] mb-1">Current Password</label>
            <input
              type="password"
              required
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full px-3.5 py-2.5 text-xs bg-white border border-black/[0.08] rounded-xl"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-[#424245] mb-1">New Password (min 8 chars)</label>
            <input
              type="password"
              required
              minLength={8}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full px-3.5 py-2.5 text-xs bg-white border border-black/[0.08] rounded-xl"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-[#424245] mb-1">Confirm New Password</label>
            <input
              type="password"
              required
              minLength={8}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-3.5 py-2.5 text-xs bg-white border border-black/[0.08] rounded-xl"
            />
          </div>
          <div className="flex items-center justify-between pt-1">
            <button
              type="submit"
              className="px-5 py-2 text-xs font-medium text-white bg-[#1d1d1f] rounded-full hover:bg-black cursor-pointer"
            >
              Update Password
            </button>
            <button
              type="button"
              onClick={onLogout}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-medium text-red-600 bg-white border border-red-200 hover:bg-red-50 rounded-full cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </form>
      </div>

      {/* Database Backup & Recovery */}
      <div className="bg-[#f5f5f7] border border-black/[0.04] rounded-[28px] p-6 sm:p-7 space-y-5">
        <div className="border-b border-black/[0.06] pb-3.5">
          <h2 className="text-base font-semibold text-[#1d1d1f]">Database Backup &amp; Recovery</h2>
          <p className="text-xs text-[#6e6e73] mt-0.5">
            Download a consistent binary SQLite snapshot (.db) or full JSON archive, and restore from any saved JSON backup.
          </p>
        </div>

        {restoreMsg && (
          <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-2xl flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{restoreMsg}</span>
          </div>
        )}
        {restoreErr && (
          <div className="p-3.5 bg-red-50 border border-red-200 text-red-800 text-xs rounded-2xl flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>{restoreErr}</span>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <a
            href={resolveApiUrl('/api/admin/backup/json')}
            download
            className="p-5 bg-white border border-black/[0.05] rounded-[22px] hover:border-black/15 transition-colors flex flex-col justify-between"
          >
            <div>
              <div className="text-xs font-semibold text-[#1d1d1f]">Full JSON Database Backup</div>
              <p className="text-xs text-[#6e6e73] mt-1">
                Portable snapshot of all bookings, customers, services, projects, plans, FAQs, inquiries, and settings.
              </p>
            </div>
            <div className="mt-4 inline-flex items-center gap-1.5 text-xs font-medium text-[#0071e3]">
              <Download className="w-3.5 h-3.5" />
              <span>Download .json Backup</span>
            </div>
          </a>

          <a
            href={resolveApiUrl('/api/admin/backup/sqlite')}
            download
            className="p-5 bg-white border border-black/[0.05] rounded-[22px] hover:border-black/15 transition-colors flex flex-col justify-between"
          >
            <div>
              <div className="text-xs font-semibold text-[#1d1d1f]">SQLite Binary Snapshot (.db)</div>
              <p className="text-xs text-[#6e6e73] mt-1">
                Consistent point-in-time SQLite database file created using online backup API.
              </p>
            </div>
            <div className="mt-4 inline-flex items-center gap-1.5 text-xs font-medium text-[#0071e3]">
              <Download className="w-3.5 h-3.5" />
              <span>Download .db File</span>
            </div>
          </a>

          <div className="p-5 bg-white border border-black/[0.05] rounded-[22px] flex flex-col justify-between">
            <div>
              <div className="text-xs font-semibold text-[#1d1d1f]">Restore from JSON Backup</div>
              <p className="text-xs text-[#6e6e73] mt-1">
                Atomically replaces website &amp; operational tables from a verified .json backup file.
              </p>
            </div>
            <label className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 text-xs font-medium text-white bg-[#1d1d1f] hover:bg-black rounded-full cursor-pointer w-fit transition-colors">
              <Upload className="w-3.5 h-3.5" />
              <span>{restoring ? 'Restoring...' : 'Upload & Restore .json'}</span>
              <input
                type="file"
                accept="application/json,.json"
                disabled={restoring}
                className="hidden"
                onChange={handleRestoreJsonFile}
              />
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}
