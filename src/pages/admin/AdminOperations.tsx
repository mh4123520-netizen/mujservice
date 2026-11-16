import { useState, type FormEvent } from 'react';
import {
  CheckCircle2,
  XCircle,
  Search,
  Trash2,
  Download,
  MailCheck,
  Mail,
  Eye,
  X,
} from 'lucide-react';
import { adminApi, exportRowsToCsv } from '../../lib/api.ts';
import type {
  BookingRecord,
  BookingStatus,
  ContactInquiry,
  CustomerRecord,
  DashboardStats,
} from '../../types/index.ts';

function StatusText({ status }: { status: BookingStatus }) {
  const map: Record<BookingStatus, { label: string; cls: string }> = {
    pending: { label: 'Pending', cls: 'text-amber-700' },
    confirmed: { label: 'Confirmed', cls: 'text-[#0071e3]' },
    completed: { label: 'Completed', cls: 'text-emerald-700' },
    cancelled: { label: 'Cancelled', cls: 'text-red-600' },
  };
  const item = map[status] || map.pending;
  return <span className={`text-xs font-semibold ${item.cls}`}>{item.label}</span>;
}

// ============================================================================
// 1. DASHBOARD OVERVIEW
// ============================================================================
export function DashboardView({
  stats,
  onOpenSection,
}: {
  stats: DashboardStats | null;
  onOpenSection: (section: string) => void;
}) {
  if (!stats) {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <div key={n} className="h-28 bg-[#f5f5f7] rounded-[24px] animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  const maxMonthly = Math.max(1, ...stats.monthlyOverview.map((m) => m.total));

  const kpis = [
    { label: 'Total Website Inquiries', value: stats.totalInquiries, sub: `${stats.unreadInquiries} unread`, target: 'inquiries' },
    { label: 'Total Service Bookings', value: stats.totalBookings, sub: `${stats.totalCustomers} unique customers`, target: 'bookings' },
    { label: 'Pending Bookings', value: stats.pendingBookings, sub: 'Awaiting dispatch review', target: 'bookings' },
    { label: 'Confirmed Bookings', value: stats.confirmedBookings, sub: 'Scheduled field visits', target: 'bookings' },
    { label: 'Completed Jobs', value: stats.completedBookings, sub: 'Finished & closed', target: 'bookings' },
    { label: 'Cancelled Bookings', value: stats.cancelledBookings, sub: 'Rejected or cancelled', target: 'bookings' },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {kpis.map((kpi) => (
          <button
            key={kpi.label}
            type="button"
            onClick={() => onOpenSection(kpi.target)}
            className="text-left bg-[#f5f5f7] hover:bg-white border border-black/[0.04] hover:border-black/[0.1] rounded-[26px] p-6 transition-all cursor-pointer"
          >
            <div className="text-xs font-medium text-[#6e6e73]">{kpi.label}</div>
            <div className="text-3xl font-semibold text-[#1d1d1f] mt-1.5 tabular-nums">{kpi.value}</div>
            <div className="text-xs text-[#86868b] mt-1">{kpi.sub}</div>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Monthly Booking Overview */}
        <div className="lg:col-span-5 bg-[#f5f5f7] border border-black/[0.04] rounded-[28px] p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-base font-semibold text-[#1d1d1f]">Monthly Booking Overview</h2>
              <p className="text-xs text-[#6e6e73] mt-0.5">Live count aggregated from database</p>
            </div>
            <button
              type="button"
              onClick={() => onOpenSection('reports')}
              className="text-xs font-medium text-[#0071e3] hover:underline cursor-pointer"
            >
              Full Reports
            </button>
          </div>

          {stats.monthlyOverview.length === 0 ? (
            <div className="py-12 text-center text-sm text-[#86868b]">No monthly booking records yet.</div>
          ) : (
            <div className="space-y-3.5">
              {stats.monthlyOverview.map((m) => (
                <div key={m.month} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium text-[#1d1d1f] tabular-nums">{m.month}</span>
                    <span className="text-[#6e6e73] tabular-nums">
                      {m.total} total · {m.completed} completed
                    </span>
                  </div>
                  <div className="w-full h-2.5 bg-black/[0.06] rounded-full overflow-hidden flex">
                    <div
                      className="bg-[#0071e3] h-full transition-all rounded-full"
                      style={{ width: `${Math.round((m.total / maxMonthly) * 100)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Customer Requests */}
        <div className="lg:col-span-7 bg-[#f5f5f7] border border-black/[0.04] rounded-[28px] overflow-hidden">
          <div className="px-6 py-5 border-b border-black/[0.06] flex items-center justify-between">
            <div>
              <h2 className="text-base font-semibold text-[#1d1d1f]">Recent Customer Requests</h2>
              <p className="text-xs text-[#6e6e73] mt-0.5">Latest appointments submitted through the website</p>
            </div>
            <button
              type="button"
              onClick={() => onOpenSection('bookings')}
              className="text-xs font-medium text-[#0071e3] hover:underline cursor-pointer"
            >
              Manage All
            </button>
          </div>

          <div className="overflow-x-auto bg-white/70">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-black/[0.06] text-[11px] font-semibold text-[#86868b]">
                  <th className="py-3 px-4">Code</th>
                  <th className="py-3 px-4">Customer</th>
                  <th className="py-3 px-4">Service</th>
                  <th className="py-3 px-4">City</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/[0.05] text-xs">
                {stats.recentRequests.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-[#86868b]">
                      No booking requests found.
                    </td>
                  </tr>
                ) : (
                  stats.recentRequests.map((b) => (
                    <tr key={b.id} className="hover:bg-[#f5f5f7]/70 transition-colors">
                      <td className="py-3 px-4 font-medium text-[#0071e3] tabular-nums whitespace-nowrap">
                        {b.bookingCode}
                      </td>
                      <td className="py-3 px-4 font-medium text-[#1d1d1f]">{b.customerName}</td>
                      <td className="py-3 px-4 text-[#424245]">{b.serviceName}</td>
                      <td className="py-3 px-4 text-[#6e6e73]">{b.city}</td>
                      <td className="py-3 px-4 text-[#6e6e73] tabular-nums whitespace-nowrap">
                        {b.preferredDate}
                      </td>
                      <td className="py-3 px-4 text-right whitespace-nowrap">
                        <StatusText status={b.status} />
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// 2. BOOKING MANAGEMENT
// ============================================================================
export function BookingsView({
  bookings,
  onReload,
}: {
  bookings: BookingRecord[];
  onReload: () => Promise<void>;
}) {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | BookingStatus>('all');
  const [selected, setSelected] = useState<BookingRecord | null>(null);
  const [notesDraft, setNotesDraft] = useState('');
  const [busyId, setBusyId] = useState<number | null>(null);

  const filtered = bookings.filter((b) => {
    const matchesStatus = statusFilter === 'all' || b.status === statusFilter;
    const q = search.trim().toLowerCase();
    const matchesQuery =
      !q ||
      b.customerName.toLowerCase().includes(q) ||
      b.phone.toLowerCase().includes(q) ||
      b.bookingCode.toLowerCase().includes(q) ||
      b.serviceName.toLowerCase().includes(q) ||
      b.city.toLowerCase().includes(q);
    return matchesStatus && matchesQuery;
  });

  async function updateStatus(id: number, status: BookingStatus) {
    setBusyId(id);
    try {
      const { booking } = await adminApi.updateBooking(id, { status, isRead: true });
      if (selected?.id === id) setSelected(booking);
      await onReload();
    } finally {
      setBusyId(null);
    }
  }

  async function saveNotes(e: FormEvent) {
    e.preventDefault();
    if (!selected) return;
    setBusyId(selected.id);
    try {
      const { booking } = await adminApi.updateBooking(selected.id, {
        internalNotes: notesDraft,
        isRead: true,
      });
      setSelected(booking);
      await onReload();
    } finally {
      setBusyId(null);
    }
  }

  async function handleDelete(id: number) {
    setBusyId(id);
    try {
      await adminApi.deleteBooking(id);
      if (selected?.id === id) setSelected(null);
      await onReload();
    } finally {
      setBusyId(null);
    }
  }

  function handleExportCsv() {
    exportRowsToCsv(
      `mujahid-bookings-${new Date().toISOString().slice(0, 10)}.csv`,
      ['Booking Code', 'Customer', 'Phone', 'Service', 'City', 'Address', 'Preferred Date', 'Status', 'Message', 'Internal Notes', 'Created At'],
      filtered.map((b) => [
        b.bookingCode,
        b.customerName,
        b.phone,
        b.serviceName,
        b.city,
        b.address,
        b.preferredDate,
        b.status,
        b.message,
        b.internalNotes,
        b.createdAt,
      ])
    );
  }

  return (
    <div className="space-y-5">
      <div className="bg-[#f5f5f7] border border-black/[0.04] rounded-[24px] p-4 flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3 flex-1">
          <div className="relative flex-1 min-w-[220px] max-w-sm">
            <Search className="w-4 h-4 text-[#86868b] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search code, name, phone, city..."
              className="w-full pl-10 pr-4 py-2 text-xs bg-white border border-black/[0.08] rounded-full focus:outline-none focus:ring-2 focus:ring-[#0071e3]/25"
            />
          </div>
          <div className="flex flex-wrap items-center gap-1 p-1 bg-white rounded-full border border-black/[0.06]">
            {(['all', 'pending', 'confirmed', 'completed', 'cancelled'] as const).map((st) => (
              <button
                key={st}
                type="button"
                onClick={() => setStatusFilter(st)}
                className={`px-3.5 py-1.5 text-xs font-medium rounded-full capitalize cursor-pointer whitespace-nowrap transition-colors ${
                  statusFilter === st ? 'bg-[#1d1d1f] text-white' : 'text-[#6e6e73] hover:text-[#1d1d1f]'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        <button
          type="button"
          onClick={handleExportCsv}
          className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-medium text-[#1d1d1f] bg-white border border-black/[0.08] hover:bg-black hover:text-white rounded-full transition-colors cursor-pointer whitespace-nowrap"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export CSV</span>
        </button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        <div className={`${selected ? 'xl:col-span-7' : 'xl:col-span-12'} bg-white border border-black/[0.06] rounded-[28px] overflow-hidden`}>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-black/[0.06] bg-[#f5f5f7] text-[11px] font-semibold text-[#86868b]">
                  <th className="py-3.5 px-4">Code</th>
                  <th className="py-3.5 px-4">Customer &amp; Phone</th>
                  <th className="py-3.5 px-4">Service</th>
                  <th className="py-3.5 px-4">City / Date</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/[0.05] text-xs">
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-10 text-center text-[#86868b]">
                      No matching bookings found.
                    </td>
                  </tr>
                ) : (
                  filtered.map((b) => (
                    <tr
                      key={b.id}
                      className={`hover:bg-[#f5f5f7]/70 transition-colors ${selected?.id === b.id ? 'bg-sky-50/50' : ''}`}
                    >
                      <td className="py-3.5 px-4 font-medium text-[#0071e3] tabular-nums whitespace-nowrap">
                        {b.bookingCode}
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-[#1d1d1f]">{b.customerName}</div>
                        <div className="text-[#6e6e73] tabular-nums">{b.phone}</div>
                      </td>
                      <td className="py-3.5 px-4 text-[#424245]">{b.serviceName}</td>
                      <td className="py-3.5 px-4">
                        <div className="text-[#1d1d1f]">{b.city}</div>
                        <div className="text-[#86868b] tabular-nums">{b.preferredDate}</div>
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <StatusText status={b.status} />
                      </td>
                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <div className="inline-flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => {
                              setSelected(b);
                              setNotesDraft(b.internalNotes);
                            }}
                            title="Inspect & Edit"
                            className="p-1.5 text-[#6e6e73] hover:text-[#1d1d1f] hover:bg-black/5 rounded-full cursor-pointer"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          {b.status === 'pending' && (
                            <>
                              <button
                                type="button"
                                disabled={busyId === b.id}
                                onClick={() => updateStatus(b.id, 'confirmed')}
                                title="Accept Booking"
                                className="p-1.5 text-emerald-700 hover:bg-emerald-50 rounded-full cursor-pointer"
                              >
                                <CheckCircle2 className="w-4 h-4" />
                              </button>
                              <button
                                type="button"
                                disabled={busyId === b.id}
                                onClick={() => updateStatus(b.id, 'cancelled')}
                                title="Reject Booking"
                                className="p-1.5 text-red-600 hover:bg-red-50 rounded-full cursor-pointer"
                              >
                                <XCircle className="w-4 h-4" />
                              </button>
                            </>
                          )}
                          <button
                            type="button"
                            disabled={busyId === b.id}
                            onClick={() => handleDelete(b.id)}
                            title="Delete Booking"
                            className="p-1.5 text-[#86868b] hover:text-red-600 hover:bg-red-50 rounded-full cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {selected && (
          <div className="xl:col-span-5 bg-[#f5f5f7] border border-black/[0.06] rounded-[28px] p-6 space-y-5">
            <div className="flex items-start justify-between gap-4 border-b border-black/[0.06] pb-4">
              <div>
                <div className="text-xs text-[#0071e3] font-semibold tabular-nums">{selected.bookingCode}</div>
                <h3 className="text-lg font-semibold text-[#1d1d1f] mt-0.5">{selected.customerName}</h3>
                <div className="text-xs text-[#6e6e73] tabular-nums">{selected.phone}</div>
              </div>
              <button
                type="button"
                onClick={() => setSelected(null)}
                className="p-1.5 text-[#86868b] hover:text-[#1d1d1f] rounded-full hover:bg-black/5 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-[#86868b] block">Selected Service</span>
                <span className="font-semibold text-[#1d1d1f]">{selected.serviceName}</span>
              </div>
              <div>
                <span className="text-[#86868b] block">Preferred Date</span>
                <span className="font-semibold text-[#1d1d1f] tabular-nums">{selected.preferredDate}</span>
              </div>
              <div>
                <span className="text-[#86868b] block">City</span>
                <span className="font-medium text-[#1d1d1f]">{selected.city}</span>
              </div>
              <div>
                <span className="text-[#86868b] block">Current Status</span>
                <StatusText status={selected.status} />
              </div>
              <div className="col-span-2">
                <span className="text-[#86868b] block">Service Address</span>
                <span className="font-medium text-[#1d1d1f]">{selected.address}</span>
              </div>
              <div className="col-span-2">
                <span className="text-[#86868b] block">Customer Message</span>
                <p className="text-[#424245] mt-1 bg-white p-3.5 rounded-2xl border border-black/[0.05]">
                  {selected.message || 'No additional notes provided.'}
                </p>
              </div>
            </div>

            <div>
              <div className="text-xs font-semibold text-[#424245] mb-2">Update Workflow Status</div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {(['pending', 'confirmed', 'completed', 'cancelled'] as const).map((st) => (
                  <button
                    key={st}
                    type="button"
                    disabled={busyId === selected.id}
                    onClick={() => updateStatus(selected.id, st)}
                    className={`py-2 px-2 text-xs font-medium rounded-full border capitalize cursor-pointer transition-colors ${
                      selected.status === st
                        ? 'bg-[#1d1d1f] text-white border-[#1d1d1f]'
                        : 'bg-white text-[#424245] border-black/[0.08] hover:border-black/25'
                    }`}
                  >
                    {st === 'confirmed' ? 'Accept' : st === 'cancelled' ? 'Reject' : st}
                  </button>
                ))}
              </div>
            </div>

            <form onSubmit={saveNotes} className="space-y-3 pt-2 border-t border-black/[0.06]">
              <label className="block text-xs font-semibold text-[#424245]">
                Internal Technician / Coordinator Notes
              </label>
              <textarea
                rows={3}
                value={notesDraft}
                onChange={(e) => setNotesDraft(e.target.value)}
                placeholder="Technician assigned, refrigerant readings, invoice notes..."
                className="w-full px-3.5 py-2.5 text-xs bg-white border border-black/[0.08] rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#0071e3]/25"
              />
              <button
                type="submit"
                disabled={busyId === selected.id}
                className="px-5 py-2 text-xs font-medium text-white bg-[#0071e3] rounded-full hover:bg-[#0077ed] cursor-pointer"
              >
                Save Internal Notes
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}

// ============================================================================
// 3. CUSTOMER MANAGEMENT
// ============================================================================
export function CustomersView({
  customers,
  onReload,
}: {
  customers: CustomerRecord[];
  onReload: () => Promise<void>;
}) {
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<CustomerRecord | null>(null);
  const [history, setHistory] = useState<BookingRecord[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [notes, setNotes] = useState('');
  const [saving, setSaving] = useState(false);

  const filtered = customers.filter((c) => {
    const q = search.trim().toLowerCase();
    return (
      !q ||
      c.fullName.toLowerCase().includes(q) ||
      c.phone.toLowerCase().includes(q) ||
      c.city.toLowerCase().includes(q) ||
      c.address.toLowerCase().includes(q)
    );
  });

  async function inspectCustomer(c: CustomerRecord) {
    setSelected(c);
    setNotes(c.notes);
    setLoadingHistory(true);
    try {
      const res = await adminApi.getCustomerBookings(c.id);
      setHistory(res.bookings);
    } finally {
      setLoadingHistory(false);
    }
  }

  async function saveCustomerNotes(e: FormEvent) {
    e.preventDefault();
    if (!selected) return;
    setSaving(true);
    try {
      await adminApi.updateCustomer(selected.id, { notes });
      await onReload();
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-5">
      <div className="bg-[#f5f5f7] border border-black/[0.04] rounded-[24px] p-4 flex flex-wrap items-center justify-between gap-4">
        <div className="relative flex-1 min-w-[220px] max-w-sm">
          <Search className="w-4 h-4 text-[#86868b] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search customer name, phone, or city..."
            className="w-full pl-10 pr-4 py-2 text-xs bg-white border border-black/[0.08] rounded-full focus:outline-none focus:ring-2 focus:ring-[#0071e3]/25"
          />
        </div>
        <div className="text-xs text-[#6e6e73] tabular-nums">
          Total Registered Customers: <strong className="text-[#1d1d1f]">{filtered.length}</strong>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        <div className={`${selected ? 'xl:col-span-7' : 'xl:col-span-12'} bg-white border border-black/[0.06] rounded-[28px] overflow-hidden`}>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-black/[0.06] bg-[#f5f5f7] text-[11px] font-semibold text-[#86868b]">
                  <th className="py-3.5 px-4">Customer</th>
                  <th className="py-3.5 px-4">Phone</th>
                  <th className="py-3.5 px-4">City &amp; Address</th>
                  <th className="py-3.5 px-4 text-right">Bookings</th>
                  <th className="py-3.5 px-4 text-right">History</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/[0.05] text-xs">
                {filtered.map((c) => (
                  <tr
                    key={c.id}
                    className={`hover:bg-[#f5f5f7]/70 transition-colors ${selected?.id === c.id ? 'bg-sky-50/50' : ''}`}
                  >
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-[#1d1d1f]">{c.fullName}</div>
                      {c.email && <div className="text-[#86868b]">{c.email}</div>}
                    </td>
                    <td className="py-3.5 px-4 text-[#424245] tabular-nums whitespace-nowrap">{c.phone}</td>
                    <td className="py-3.5 px-4">
                      <div className="text-[#1d1d1f]">{c.city}</div>
                      <div className="text-[#86868b] truncate max-w-[220px]">{c.address}</div>
                    </td>
                    <td className="py-3.5 px-4 text-right font-semibold text-[#1d1d1f] tabular-nums">
                      {c.bookingCount ?? 0}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        type="button"
                        onClick={() => inspectCustomer(c)}
                        className="px-3.5 py-1.5 text-xs font-medium text-[#0071e3] bg-sky-50 hover:bg-sky-100 rounded-full transition-colors cursor-pointer"
                      >
                        Records
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {selected && (
          <div className="xl:col-span-5 bg-[#f5f5f7] border border-black/[0.06] rounded-[28px] p-6 space-y-5">
            <div className="flex items-start justify-between border-b border-black/[0.06] pb-4">
              <div>
                <h3 className="text-lg font-semibold text-[#1d1d1f]">{selected.fullName}</h3>
                <div className="text-xs text-[#0071e3] tabular-nums mt-0.5">{selected.phone}</div>
                <div className="text-xs text-[#6e6e73] mt-1">{selected.city} · {selected.address}</div>
              </div>
              <button
                type="button"
                onClick={() => setSelected(null)}
                className="p-1.5 text-[#86868b] hover:text-[#1d1d1f] rounded-full hover:bg-black/5 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={saveCustomerNotes} className="space-y-2.5">
              <label className="block text-xs font-semibold text-[#424245]">Equipment &amp; Service Record Notes</label>
              <textarea
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Installed AC models, chiller serial numbers, AMC notes..."
                className="w-full px-3.5 py-2.5 text-xs bg-white border border-black/[0.08] rounded-2xl"
              />
              <button
                type="submit"
                disabled={saving}
                className="px-4 py-2 text-xs font-medium text-white bg-[#0071e3] rounded-full hover:bg-[#0077ed] cursor-pointer"
              >
                {saving ? 'Saving...' : 'Update Customer Record'}
              </button>
            </form>

            <div className="pt-2 border-t border-black/[0.06]">
              <h4 className="text-xs font-semibold text-[#1d1d1f] mb-3">Booking History ({history.length})</h4>
              {loadingHistory ? (
                <div className="text-xs text-[#86868b]">Loading service records...</div>
              ) : history.length === 0 ? (
                <div className="text-xs text-[#86868b]">No bookings recorded yet.</div>
              ) : (
                <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
                  {history.map((b) => (
                    <div key={b.id} className="p-3.5 bg-white border border-black/[0.05] rounded-2xl text-xs">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-[#0071e3] tabular-nums">{b.bookingCode}</span>
                        <StatusText status={b.status} />
                      </div>
                      <div className="font-medium text-[#1d1d1f] mt-1">{b.serviceName}</div>
                      <div className="text-[#86868b] mt-0.5 tabular-nums">Date: {b.preferredDate}</div>
                      {b.internalNotes && (
                        <div className="mt-2 text-[#424245] bg-[#f5f5f7] p-2.5 rounded-xl">
                          {b.internalNotes}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ============================================================================
// 4. CONTACT INQUIRY MANAGEMENT
// ============================================================================
export function InquiriesView({
  inquiries,
  onReload,
}: {
  inquiries: ContactInquiry[];
  onReload: () => Promise<void>;
}) {
  const [filter, setFilter] = useState<'all' | 'unread'>('all');
  const [selected, setSelected] = useState<ContactInquiry | null>(null);
  const [replyText, setReplyText] = useState('');
  const [saving, setSaving] = useState(false);

  const filtered = inquiries.filter((i) => (filter === 'unread' ? !i.isRead : true));

  async function toggleRead(inq: ContactInquiry) {
    await adminApi.updateInquiry(inq.id, { isRead: !inq.isRead });
    await onReload();
  }

  async function handleSaveReply(e: FormEvent) {
    e.preventDefault();
    if (!selected) return;
    setSaving(true);
    try {
      const res = await adminApi.updateInquiry(selected.id, {
        isRead: true,
        adminReply: replyText,
      });
      const updated = res.inquiries.find((x) => x.id === selected.id) || null;
      setSelected(updated);
      await onReload();
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: number) {
    await adminApi.deleteInquiry(id);
    if (selected?.id === id) setSelected(null);
    await onReload();
  }

  return (
    <div className="space-y-5">
      <div className="bg-[#f5f5f7] border border-black/[0.04] rounded-[24px] p-4 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-1 p-1 bg-white rounded-full border border-black/[0.06]">
          <button
            type="button"
            onClick={() => setFilter('all')}
            className={`px-4 py-1.5 text-xs font-medium rounded-full cursor-pointer transition-colors ${
              filter === 'all' ? 'bg-[#1d1d1f] text-white' : 'text-[#6e6e73]'
            }`}
          >
            All Inquiries ({inquiries.length})
          </button>
          <button
            type="button"
            onClick={() => setFilter('unread')}
            className={`px-4 py-1.5 text-xs font-medium rounded-full cursor-pointer transition-colors ${
              filter === 'unread' ? 'bg-[#1d1d1f] text-white' : 'text-[#6e6e73]'
            }`}
          >
            Unread ({inquiries.filter((i) => !i.isRead).length})
          </button>
        </div>

        <button
          type="button"
          onClick={() =>
            exportRowsToCsv(
              `mujahid-inquiries-${new Date().toISOString().slice(0, 10)}.csv`,
              ['ID', 'Customer', 'Phone', 'Email', 'City', 'Subject', 'Message', 'Read', 'Admin Reply', 'Created'],
              filtered.map((i) => [
                i.id,
                i.customerName,
                i.phone,
                i.email,
                i.city,
                i.subject,
                i.message,
                i.isRead ? 'Read' : 'Unread',
                i.adminReply,
                i.createdAt,
              ])
            )
          }
          className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-medium text-[#1d1d1f] bg-white border border-black/[0.08] hover:bg-black hover:text-white rounded-full transition-colors cursor-pointer"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export CSV</span>
        </button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        <div className={`${selected ? 'xl:col-span-7' : 'xl:col-span-12'} bg-white border border-black/[0.06] rounded-[28px] divide-y divide-black/[0.05] overflow-hidden`}>
          {filtered.length === 0 ? (
            <div className="py-10 text-center text-sm text-[#86868b]">No inquiries found.</div>
          ) : (
            filtered.map((inq) => (
              <div
                key={inq.id}
                className={`p-5 flex items-start justify-between gap-4 hover:bg-[#f5f5f7]/70 transition-colors ${
                  !inq.isRead ? 'bg-sky-50/40' : ''
                }`}
              >
                <button
                  type="button"
                  onClick={() => {
                    setSelected(inq);
                    setReplyText(inq.adminReply);
                    if (!inq.isRead) {
                      adminApi.updateInquiry(inq.id, { isRead: true }).then(onReload);
                    }
                  }}
                  className="text-left flex-1 cursor-pointer"
                >
                  <div className="flex flex-wrap items-center gap-2 text-xs">
                    <span className={!inq.isRead ? 'font-semibold text-[#1d1d1f]' : 'font-medium text-[#424245]'}>
                      {inq.subject}
                    </span>
                    <span className="text-[#86868b]">·</span>
                    <span className={inq.isRead ? 'text-[#86868b]' : 'text-[#0071e3] font-semibold'}>
                      {inq.isRead ? 'Read' : 'Unread'}
                    </span>
                    {inq.adminReply && (
                      <>
                        <span className="text-[#86868b]">·</span>
                        <span className="text-emerald-700 font-medium">Replied</span>
                      </>
                    )}
                  </div>
                  <div className="text-xs text-[#6e6e73] mt-1">
                    {inq.customerName} ({inq.city}) · <span className="tabular-nums">{inq.phone}</span>
                  </div>
                  <p className="text-xs text-[#86868b] mt-1 line-clamp-1">{inq.message}</p>
                </button>

                <div className="flex items-center gap-1 shrink-0">
                  <button
                    type="button"
                    onClick={() => toggleRead(inq)}
                    title={inq.isRead ? 'Mark Unread' : 'Mark Read'}
                    className="p-1.5 text-[#6e6e73] hover:text-[#1d1d1f] hover:bg-black/5 rounded-full cursor-pointer"
                  >
                    {inq.isRead ? <Mail className="w-4 h-4" /> : <MailCheck className="w-4 h-4 text-[#0071e3]" />}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(inq.id)}
                    title="Delete Inquiry"
                    className="p-1.5 text-[#86868b] hover:text-red-600 hover:bg-red-50 rounded-full cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {selected && (
          <div className="xl:col-span-5 bg-[#f5f5f7] border border-black/[0.06] rounded-[28px] p-6 space-y-4">
            <div className="flex items-start justify-between border-b border-black/[0.06] pb-3.5">
              <div>
                <h3 className="text-base font-semibold text-[#1d1d1f]">{selected.subject}</h3>
                <div className="text-xs text-[#6e6e73] mt-1">
                  {selected.customerName} · {selected.city}
                </div>
                <div className="text-xs text-[#0071e3] mt-0.5 tabular-nums">
                  {selected.phone} {selected.email ? `· ${selected.email}` : ''}
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelected(null)}
                className="p-1.5 text-[#86868b] hover:text-[#1d1d1f] rounded-full hover:bg-black/5 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 bg-white border border-black/[0.05] rounded-2xl text-xs text-[#424245] leading-relaxed">
              {selected.message}
            </div>

            <form onSubmit={handleSaveReply} className="space-y-3">
              <label className="block text-xs font-semibold text-[#424245]">
                Coordinator Response Log / Reply Note
              </label>
              <textarea
                rows={4}
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder="Record your response sent via call, WhatsApp, or email..."
                className="w-full px-3.5 py-2.5 text-xs bg-white border border-black/[0.08] rounded-2xl"
              />
              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 text-xs font-medium text-white bg-[#0071e3] rounded-full hover:bg-[#0077ed] cursor-pointer"
                >
                  {saving ? 'Saving...' : 'Save Reply'}
                </button>
                <a
                  href={`https://wa.me/92${selected.phone.replace(/^0/, '')}?text=${encodeURIComponent(
                    replyText || `Assalam-o-Alaikum ${selected.customerName}, regarding your inquiry "${selected.subject}" at Mujahid Services:`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-2 text-xs font-medium text-[#1d1d1f] bg-white border border-black/[0.08] rounded-full hover:bg-black hover:text-white transition-colors"
                >
                  Reply via WhatsApp
                </a>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
