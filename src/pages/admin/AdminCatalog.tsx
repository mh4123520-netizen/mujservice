import { useState, type ChangeEvent, type FormEvent } from 'react';
import { Plus, Pencil, Trash2, Upload, Check, X } from 'lucide-react';
import { ResilientImage } from '../../components/ResilientImage.tsx';
import { adminApi } from '../../lib/api.ts';
import type {
  BlogPost,
  GalleryItem,
  MaintenancePlan,
  ProductItem,
  ProjectItem,
  ReviewStatus,
  ServiceItem,
  Testimonial,
} from '../../types/index.ts';

const INPUT_CLS = 'w-full px-3.5 py-2.5 text-xs bg-white border border-black/[0.08] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0071e3]/25';
const CARD_CLS = 'bg-[#f5f5f7] border border-black/[0.04] rounded-[24px] overflow-hidden';
const FORM_CLS = 'bg-[#f5f5f7] border border-black/[0.06] rounded-[28px] p-6 sm:p-7 space-y-4';
const BTN_PRIMARY = 'inline-flex items-center gap-1.5 px-5 py-2 text-xs font-medium text-white bg-[#0071e3] rounded-full hover:bg-[#0077ed] transition-colors cursor-pointer';
const BTN_SECONDARY = 'px-4 py-2 text-xs font-medium text-[#1d1d1f] bg-white border border-black/[0.08] rounded-full hover:bg-black/5 transition-colors cursor-pointer';

// ============================================================================
// 5. SERVICES MANAGEMENT
// ============================================================================
export function ServicesManagerView({
  services,
  onReload,
}: {
  services: ServiceItem[];
  onReload: () => Promise<void>;
}) {
  const [editing, setEditing] = useState<Partial<ServiceItem> | null>(null);
  const [featuresText, setFeaturesText] = useState('');
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  function openNew() {
    setEditing({
      title: '',
      slug: '',
      shortDescription: '',
      fullDescription: '',
      priceRange: 'PKR 2,500 – 10,000',
      responseWindow: 'Same-Day Dispatch',
      imageUrl: '/src/assets/images/service_ac_systems_1794822111871.jpg',
      isActive: true,
      sortOrder: services.length + 1,
    });
    setFeaturesText('');
  }

  function openEdit(svc: ServiceItem) {
    setEditing({ ...svc });
    setFeaturesText(svc.features.join('\n'));
  }

  async function handleImageUpload(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !editing) return;
    setUploading(true);
    try {
      const { url } = await adminApi.uploadImage(file);
      setEditing({ ...editing, imageUrl: url });
    } finally {
      setUploading(false);
    }
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!editing) return;
    setSaving(true);
    try {
      const features = featuresText
        .split('\n')
        .map((s) => s.trim())
        .filter(Boolean);
      const payload = { ...editing, features };
      if (editing.id) {
        await adminApi.updateService(editing.id, payload);
      } else {
        await adminApi.createService(payload);
      }
      setEditing(null);
      await onReload();
    } finally {
      setSaving(false);
    }
  }

  async function toggleActive(svc: ServiceItem) {
    await adminApi.updateService(svc.id, { isActive: !svc.isActive });
    await onReload();
  }

  async function handleDelete(id: number) {
    await adminApi.deleteService(id);
    if (editing?.id === id) setEditing(null);
    await onReload();
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-semibold text-[#1d1d1f]">Service Catalog ({services.length})</h2>
          <p className="text-xs text-[#6e6e73]">Active services appear automatically on the public website and booking form.</p>
        </div>
        <button type="button" onClick={openNew} className={BTN_PRIMARY}>
          <Plus className="w-4 h-4" />
          <span>Add Service</span>
        </button>
      </div>

      {editing && (
        <form onSubmit={handleSubmit} className={FORM_CLS}>
          <div className="flex items-center justify-between border-b border-black/[0.06] pb-3.5">
            <h3 className="text-sm font-semibold text-[#1d1d1f]">
              {editing.id ? `Edit Service: ${editing.title}` : 'Create New Service'}
            </h3>
            <button type="button" onClick={() => setEditing(null)} className="text-[#86868b] hover:text-[#1d1d1f] p-1 rounded-full cursor-pointer">
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-[#424245] mb-1">Service Title *</label>
              <input type="text" required value={editing.title || ''} onChange={(e) => setEditing({ ...editing, title: e.target.value })} className={INPUT_CLS} />
            </div>
            <div>
              <label className="block text-xs font-medium text-[#424245] mb-1">URL Slug</label>
              <input type="text" value={editing.slug || ''} onChange={(e) => setEditing({ ...editing, slug: e.target.value })} placeholder="auto-generated if blank" className={INPUT_CLS} />
            </div>
            <div>
              <label className="block text-xs font-medium text-[#424245] mb-1">Price Range</label>
              <input type="text" value={editing.priceRange || ''} onChange={(e) => setEditing({ ...editing, priceRange: e.target.value })} className={`${INPUT_CLS} tabular-nums`} />
            </div>
            <div>
              <label className="block text-xs font-medium text-[#424245] mb-1">Response Window</label>
              <input type="text" value={editing.responseWindow || ''} onChange={(e) => setEditing({ ...editing, responseWindow: e.target.value })} className={INPUT_CLS} />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-[#424245] mb-1">Short Description *</label>
            <textarea rows={2} required value={editing.shortDescription || ''} onChange={(e) => setEditing({ ...editing, shortDescription: e.target.value })} className={INPUT_CLS} />
          </div>

          <div>
            <label className="block text-xs font-medium text-[#424245] mb-1">Full Technical Description</label>
            <textarea rows={3} value={editing.fullDescription || ''} onChange={(e) => setEditing({ ...editing, fullDescription: e.target.value })} className={INPUT_CLS} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-[#424245] mb-1">Deliverables (One per line)</label>
              <textarea rows={4} value={featuresText} onChange={(e) => setFeaturesText(e.target.value)} className={INPUT_CLS} />
            </div>
            <div className="space-y-3">
              <label className="block text-xs font-medium text-[#424245]">Service Image</label>
              <div className="flex items-center gap-2">
                <input type="text" value={editing.imageUrl || ''} onChange={(e) => setEditing({ ...editing, imageUrl: e.target.value })} className={`flex-1 ${INPUT_CLS}`} />
                <label className="inline-flex items-center gap-1.5 px-3.5 py-2.5 text-xs font-medium text-[#1d1d1f] bg-white border border-black/[0.08] hover:bg-black hover:text-white rounded-full transition-colors cursor-pointer shrink-0">
                  <Upload className="w-3.5 h-3.5" />
                  <span>{uploading ? 'Uploading...' : 'Upload'}</span>
                  <input type="file" accept="image/png,image/jpeg,image/webp" className="hidden" onChange={handleImageUpload} />
                </label>
              </div>
              <label className="flex items-center gap-2 text-xs text-[#424245] pt-2">
                <input type="checkbox" checked={editing.isActive !== false} onChange={(e) => setEditing({ ...editing, isActive: e.target.checked })} />
                <span>Active (visible on public website)</span>
              </label>
            </div>
          </div>

          <div className="flex items-center gap-3 pt-2">
            <button type="submit" disabled={saving} className={BTN_PRIMARY}>
              {saving ? 'Saving...' : 'Save Service'}
            </button>
            <button type="button" onClick={() => setEditing(null)} className={BTN_SECONDARY}>
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {services.map((svc) => (
          <div key={svc.id} className={`${CARD_CLS} flex`}>
            <div className="w-32 shrink-0 bg-slate-200">
              <ResilientImage src={svc.imageUrl} alt={svc.title} className="w-full h-full object-cover" />
            </div>
            <div className="p-4 flex-1 flex flex-col justify-between bg-white/80">
              <div>
                <div className="flex items-center justify-between gap-2">
                  <h3 className="text-sm font-semibold text-[#1d1d1f]">{svc.title}</h3>
                  <span className={`text-[11px] font-semibold ${svc.isActive ? 'text-emerald-700' : 'text-[#86868b]'}`}>
                    {svc.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
                <div className="text-xs font-medium text-[#0071e3] mt-0.5 tabular-nums">{svc.priceRange}</div>
                <p className="text-xs text-[#6e6e73] mt-1.5 line-clamp-2">{svc.shortDescription}</p>
              </div>
              <div className="mt-3 pt-2.5 border-t border-black/[0.05] flex items-center justify-between gap-2">
                <button type="button" onClick={() => toggleActive(svc)} className="text-xs font-medium text-[#6e6e73] hover:text-[#1d1d1f] cursor-pointer">
                  {svc.isActive ? 'Deactivate' : 'Activate'}
                </button>
                <div className="flex items-center gap-1">
                  <button type="button" onClick={() => openEdit(svc)} className="p-1.5 text-[#6e6e73] hover:text-[#1d1d1f] hover:bg-black/5 rounded-full cursor-pointer">
                    <Pencil className="w-3.5 h-3.5" />
                  </button>
                  <button type="button" onClick={() => handleDelete(svc.id)} className="p-1.5 text-[#86868b] hover:text-red-600 hover:bg-red-50 rounded-full cursor-pointer">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ============================================================================
// 6. PROJECTS / PORTFOLIO MANAGEMENT
// ============================================================================
export function ProjectsManagerView({
  projects,
  onReload,
}: {
  projects: ProjectItem[];
  onReload: () => Promise<void>;
}) {
  const [editing, setEditing] = useState<Partial<ProjectItem> | null>(null);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  function openNew() {
    setEditing({
      title: '',
      category: 'AC Installation',
      clientName: '',
      location: 'Multan',
      completionDate: new Date().toISOString().slice(0, 10),
      summary: '',
      metrics: '',
      imageUrl: '/src/assets/images/project_multan_commercial_1794822111869.jpg',
      isPublished: true,
    });
  }

  async function handleImageUpload(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !editing) return;
    setUploading(true);
    try {
      const { url } = await adminApi.uploadImage(file);
      setEditing({ ...editing, imageUrl: url });
    } finally {
      setUploading(false);
    }
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!editing) return;
    setSaving(true);
    try {
      if (editing.id) {
        await adminApi.updateProject(editing.id, editing);
      } else {
        await adminApi.createProject(editing);
      }
      setEditing(null);
      await onReload();
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-semibold text-[#1d1d1f]">Portfolio Projects ({projects.length})</h2>
          <p className="text-xs text-[#6e6e73]">Published projects are showcased in the public portfolio.</p>
        </div>
        <button type="button" onClick={openNew} className={BTN_PRIMARY}>
          <Plus className="w-4 h-4" />
          <span>Add Project</span>
        </button>
      </div>

      {editing && (
        <form onSubmit={handleSubmit} className={FORM_CLS}>
          <div className="flex items-center justify-between border-b border-black/[0.06] pb-3.5">
            <h3 className="text-sm font-semibold text-[#1d1d1f]">
              {editing.id ? 'Edit Project' : 'Add Portfolio Project'}
            </h3>
            <button type="button" onClick={() => setEditing(null)} className="text-[#86868b] hover:text-[#1d1d1f] p-1 rounded-full cursor-pointer">
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-[#424245] mb-1">Project Title *</label>
              <input type="text" required value={editing.title || ''} onChange={(e) => setEditing({ ...editing, title: e.target.value })} className={INPUT_CLS} />
            </div>
            <div>
              <label className="block text-xs font-medium text-[#424245] mb-1">Category *</label>
              <input type="text" required value={editing.category || ''} onChange={(e) => setEditing({ ...editing, category: e.target.value })} placeholder="e.g. Commercial Refrigeration" className={INPUT_CLS} />
            </div>
            <div>
              <label className="block text-xs font-medium text-[#424245] mb-1">Client / Facility</label>
              <input type="text" value={editing.clientName || ''} onChange={(e) => setEditing({ ...editing, clientName: e.target.value })} className={INPUT_CLS} />
            </div>
            <div>
              <label className="block text-xs font-medium text-[#424245] mb-1">Location</label>
              <input type="text" value={editing.location || ''} onChange={(e) => setEditing({ ...editing, location: e.target.value })} className={INPUT_CLS} />
            </div>
            <div>
              <label className="block text-xs font-medium text-[#424245] mb-1">Completion Date</label>
              <input type="date" value={editing.completionDate || ''} onChange={(e) => setEditing({ ...editing, completionDate: e.target.value })} className={`${INPUT_CLS} tabular-nums`} />
            </div>
            <div>
              <label className="block text-xs font-medium text-[#424245] mb-1">Measured Outcome / Metrics</label>
              <input type="text" value={editing.metrics || ''} onChange={(e) => setEditing({ ...editing, metrics: e.target.value })} placeholder="e.g. 30% energy savings · 18 zones" className={INPUT_CLS} />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-[#424245] mb-1">Project Summary *</label>
            <textarea rows={3} required value={editing.summary || ''} onChange={(e) => setEditing({ ...editing, summary: e.target.value })} className={INPUT_CLS} />
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex-1 min-w-[240px] flex items-center gap-2">
              <input type="text" value={editing.imageUrl || ''} onChange={(e) => setEditing({ ...editing, imageUrl: e.target.value })} className={`flex-1 ${INPUT_CLS}`} />
              <label className="inline-flex items-center gap-1.5 px-3.5 py-2.5 text-xs font-medium text-[#1d1d1f] bg-white border border-black/[0.08] hover:bg-black hover:text-white rounded-full transition-colors cursor-pointer shrink-0">
                <Upload className="w-3.5 h-3.5" />
                <span>{uploading ? 'Uploading...' : 'Upload'}</span>
                <input type="file" accept="image/png,image/jpeg,image/webp" className="hidden" onChange={handleImageUpload} />
              </label>
            </div>
            <label className="flex items-center gap-2 text-xs text-[#424245]">
              <input type="checkbox" checked={editing.isPublished !== false} onChange={(e) => setEditing({ ...editing, isPublished: e.target.checked })} />
              <span>Published</span>
            </label>
          </div>
          <div className="flex gap-3">
            <button type="submit" disabled={saving} className={BTN_PRIMARY}>
              {saving ? 'Saving...' : 'Save Project'}
            </button>
            <button type="button" onClick={() => setEditing(null)} className={BTN_SECONDARY}>
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {projects.map((p) => (
          <div key={p.id} className={`${CARD_CLS} flex`}>
            <div className="w-32 shrink-0 bg-slate-200">
              <ResilientImage src={p.imageUrl} alt={p.title} className="w-full h-full object-cover" />
            </div>
            <div className="p-4 flex-1 flex flex-col justify-between bg-white/80">
              <div>
                <div className="flex items-center justify-between text-[11px] text-[#6e6e73]">
                  <span>{p.category} · {p.location}</span>
                  <span className={p.isPublished ? 'text-emerald-700 font-semibold' : 'text-[#86868b]'}>
                    {p.isPublished ? 'Published' : 'Draft'}
                  </span>
                </div>
                <h3 className="text-sm font-semibold text-[#1d1d1f] mt-1">{p.title}</h3>
                <p className="text-xs text-[#6e6e73] mt-1 line-clamp-2">{p.summary}</p>
              </div>
              <div className="mt-3 pt-2.5 border-t border-black/[0.05] flex items-center justify-between">
                <span className="text-[11px] font-medium text-[#0071e3] truncate max-w-[190px]">{p.metrics}</span>
                <div className="flex items-center gap-1">
                  <button type="button" onClick={() => setEditing({ ...p })} className="p-1.5 text-[#6e6e73] hover:text-[#1d1d1f] hover:bg-black/5 rounded-full cursor-pointer">
                    <Pencil className="w-3.5 h-3.5" />
                  </button>
                  <button type="button" onClick={() => adminApi.deleteProject(p.id).then(onReload)} className="p-1.5 text-[#86868b] hover:text-red-600 hover:bg-red-50 rounded-full cursor-pointer">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ============================================================================
// 7. MAINTENANCE PLANS MANAGEMENT
// ============================================================================
export function PlansManagerView({
  plans,
  onReload,
}: {
  plans: MaintenancePlan[];
  onReload: () => Promise<void>;
}) {
  const [editing, setEditing] = useState<Partial<MaintenancePlan> | null>(null);
  const [featuresText, setFeaturesText] = useState('');
  const [saving, setSaving] = useState(false);

  function openNew() {
    setEditing({
      name: '',
      targetAudience: '',
      billingCycle: 'Annual',
      pricePkr: 10000,
      description: '',
      isPublished: true,
      sortOrder: plans.length + 1,
    });
    setFeaturesText('');
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!editing) return;
    setSaving(true);
    try {
      const features = featuresText.split('\n').map((s) => s.trim()).filter(Boolean);
      const payload = { ...editing, features };
      if (editing.id) {
        await adminApi.updatePlan(editing.id, payload);
      } else {
        await adminApi.createPlan(payload);
      }
      setEditing(null);
      await onReload();
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-semibold text-[#1d1d1f]">Maintenance Plans ({plans.length})</h2>
          <p className="text-xs text-[#6e6e73]">Manage service contract packages, PKR pricing, and publication state.</p>
        </div>
        <button type="button" onClick={openNew} className={BTN_PRIMARY}>
          <Plus className="w-4 h-4" />
          <span>Add Package</span>
        </button>
      </div>

      {editing && (
        <form onSubmit={handleSubmit} className={FORM_CLS}>
          <div className="flex items-center justify-between border-b border-black/[0.06] pb-3.5">
            <h3 className="text-sm font-semibold text-[#1d1d1f]">
              {editing.id ? `Edit Plan: ${editing.name}` : 'Create Maintenance Plan'}
            </h3>
            <button type="button" onClick={() => setEditing(null)} className="text-[#86868b] hover:text-[#1d1d1f] p-1 rounded-full cursor-pointer">
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-[#424245] mb-1">Package Name *</label>
              <input type="text" required value={editing.name || ''} onChange={(e) => setEditing({ ...editing, name: e.target.value })} className={INPUT_CLS} />
            </div>
            <div>
              <label className="block text-xs font-medium text-[#424245] mb-1">Target Audience</label>
              <input type="text" value={editing.targetAudience || ''} onChange={(e) => setEditing({ ...editing, targetAudience: e.target.value })} className={INPUT_CLS} />
            </div>
            <div>
              <label className="block text-xs font-medium text-[#424245] mb-1">Billing Cycle</label>
              <select value={editing.billingCycle || 'Annual'} onChange={(e) => setEditing({ ...editing, billingCycle: e.target.value as MaintenancePlan['billingCycle'] })} className={INPUT_CLS}>
                <option value="Monthly">Monthly</option>
                <option value="Quarterly">Quarterly</option>
                <option value="Annual">Annual</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-[#424245] mb-1">Price (PKR) *</label>
              <input type="number" required min={0} value={editing.pricePkr ?? 0} onChange={(e) => setEditing({ ...editing, pricePkr: Number(e.target.value) })} className={`${INPUT_CLS} tabular-nums`} />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-[#424245] mb-1">Package Description</label>
            <textarea rows={2} value={editing.description || ''} onChange={(e) => setEditing({ ...editing, description: e.target.value })} className={INPUT_CLS} />
          </div>
          <div>
            <label className="block text-xs font-medium text-[#424245] mb-1">Package Features (One per line)</label>
            <textarea rows={4} value={featuresText} onChange={(e) => setFeaturesText(e.target.value)} className={INPUT_CLS} />
          </div>
          <label className="flex items-center gap-2 text-xs text-[#424245]">
            <input type="checkbox" checked={editing.isPublished !== false} onChange={(e) => setEditing({ ...editing, isPublished: e.target.checked })} />
            <span>Publish package on public website</span>
          </label>
          <div className="flex gap-3">
            <button type="submit" disabled={saving} className={BTN_PRIMARY}>
              {saving ? 'Saving...' : 'Save Package'}
            </button>
            <button type="button" onClick={() => setEditing(null)} className={BTN_SECONDARY}>
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {plans.map((plan) => (
          <div key={plan.id} className="bg-[#f5f5f7] border border-black/[0.04] rounded-[26px] p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-[#6e6e73]">{plan.billingCycle}</span>
                <span className={plan.isPublished ? 'text-emerald-700 font-semibold' : 'text-[#86868b]'}>
                  {plan.isPublished ? 'Published' : 'Unpublished'}
                </span>
              </div>
              <h3 className="text-base font-semibold text-[#1d1d1f] mt-1">{plan.name}</h3>
              <div className="text-2xl font-semibold text-[#0071e3] mt-2 tabular-nums">
                PKR {plan.pricePkr.toLocaleString()}
              </div>
              <p className="text-xs text-[#6e6e73] mt-2">{plan.description}</p>
            </div>

            <div className="mt-5 pt-3 border-t border-black/[0.06] flex items-center justify-between">
              <button
                type="button"
                onClick={() => adminApi.updatePlan(plan.id, { isPublished: !plan.isPublished }).then(onReload)}
                className="text-xs font-medium text-[#6e6e73] hover:text-[#1d1d1f] cursor-pointer"
              >
                {plan.isPublished ? 'Unpublish' : 'Publish'}
              </button>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => {
                    setEditing({ ...plan });
                    setFeaturesText(plan.features.join('\n'));
                  }}
                  className="p-1.5 text-[#6e6e73] hover:text-[#1d1d1f] hover:bg-black/5 rounded-full cursor-pointer"
                >
                  <Pencil className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => adminApi.deletePlan(plan.id).then(onReload)}
                  className="p-1.5 text-[#86868b] hover:text-red-600 hover:bg-red-50 rounded-full cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ============================================================================
// 8. TESTIMONIALS MANAGEMENT
// ============================================================================
export function TestimonialsManagerView({
  testimonials,
  onReload,
}: {
  testimonials: Testimonial[];
  onReload: () => Promise<void>;
}) {
  const [editing, setEditing] = useState<Partial<Testimonial> | null>(null);
  const [saving, setSaving] = useState(false);

  function openNew() {
    setEditing({
      customerName: '',
      roleOrCompany: '',
      city: 'Khanewal',
      serviceName: 'AC Repair',
      rating: 5,
      reviewText: '',
      status: 'approved',
    });
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!editing) return;
    setSaving(true);
    try {
      if (editing.id) {
        await adminApi.updateTestimonial(editing.id, editing);
      } else {
        await adminApi.createTestimonial(editing);
      }
      setEditing(null);
      await onReload();
    } finally {
      setSaving(false);
    }
  }

  async function setStatus(id: number, status: ReviewStatus) {
    await adminApi.updateTestimonial(id, { status });
    await onReload();
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-semibold text-[#1d1d1f]">Customer Reviews ({testimonials.length})</h2>
          <p className="text-xs text-[#6e6e73]">Approve customer-submitted testimonials or add verified client reviews.</p>
        </div>
        <button type="button" onClick={openNew} className={BTN_PRIMARY}>
          <Plus className="w-4 h-4" />
          <span>Add Review</span>
        </button>
      </div>

      {editing && (
        <form onSubmit={handleSubmit} className={FORM_CLS}>
          <div className="flex items-center justify-between border-b border-black/[0.06] pb-3.5">
            <h3 className="text-sm font-semibold text-[#1d1d1f]">
              {editing.id ? 'Edit Testimonial' : 'Add Testimonial'}
            </h3>
            <button type="button" onClick={() => setEditing(null)} className="text-[#86868b] hover:text-[#1d1d1f] p-1 rounded-full cursor-pointer">
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-[#424245] mb-1">Customer Name *</label>
              <input type="text" required value={editing.customerName || ''} onChange={(e) => setEditing({ ...editing, customerName: e.target.value })} className={INPUT_CLS} />
            </div>
            <div>
              <label className="block text-xs font-medium text-[#424245] mb-1">Role / Company</label>
              <input type="text" value={editing.roleOrCompany || ''} onChange={(e) => setEditing({ ...editing, roleOrCompany: e.target.value })} className={INPUT_CLS} />
            </div>
            <div>
              <label className="block text-xs font-medium text-[#424245] mb-1">City</label>
              <input type="text" value={editing.city || ''} onChange={(e) => setEditing({ ...editing, city: e.target.value })} className={INPUT_CLS} />
            </div>
            <div>
              <label className="block text-xs font-medium text-[#424245] mb-1">Service Name</label>
              <input type="text" value={editing.serviceName || ''} onChange={(e) => setEditing({ ...editing, serviceName: e.target.value })} className={INPUT_CLS} />
            </div>
            <div>
              <label className="block text-xs font-medium text-[#424245] mb-1">Rating</label>
              <select value={editing.rating ?? 5} onChange={(e) => setEditing({ ...editing, rating: Number(e.target.value) })} className={INPUT_CLS}>
                {[5, 4, 3, 2, 1].map((r) => (
                  <option key={r} value={r}>{r} Stars</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-[#424245] mb-1">Moderation Status</label>
              <select value={editing.status || 'approved'} onChange={(e) => setEditing({ ...editing, status: e.target.value as ReviewStatus })} className={INPUT_CLS}>
                <option value="approved">Approved</option>
                <option value="pending">Pending</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-[#424245] mb-1">Review Text *</label>
            <textarea rows={3} required value={editing.reviewText || ''} onChange={(e) => setEditing({ ...editing, reviewText: e.target.value })} className={INPUT_CLS} />
          </div>
          <div className="flex gap-3">
            <button type="submit" disabled={saving} className={BTN_PRIMARY}>
              {saving ? 'Saving...' : 'Save Review'}
            </button>
            <button type="button" onClick={() => setEditing(null)} className={BTN_SECONDARY}>
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="bg-white border border-black/[0.06] rounded-[28px] divide-y divide-black/[0.05] overflow-hidden">
        {testimonials.map((rev) => (
          <div key={rev.id} className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-2 text-xs">
                <span className="font-semibold text-[#1d1d1f]">{rev.customerName}</span>
                <span className="text-[#86868b]">·</span>
                <span className="text-[#6e6e73]">{rev.roleOrCompany}</span>
                <span className="text-[#86868b]">·</span>
                <span className="text-amber-600 font-semibold tabular-nums">{rev.rating}/5</span>
                <span className="text-[#86868b]">·</span>
                <span className={`font-semibold capitalize ${rev.status === 'approved' ? 'text-emerald-700' : rev.status === 'pending' ? 'text-amber-700' : 'text-red-600'}`}>
                  {rev.status}
                </span>
              </div>
              <p className="text-xs text-[#424245] mt-1.5">“{rev.reviewText}”</p>
            </div>
            <div className="flex items-center gap-1.5 shrink-0">
              {rev.status !== 'approved' && (
                <button type="button" onClick={() => setStatus(rev.id, 'approved')} className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-full cursor-pointer">
                  <Check className="w-3.5 h-3.5" />
                  <span>Approve</span>
                </button>
              )}
              {rev.status !== 'rejected' && (
                <button type="button" onClick={() => setStatus(rev.id, 'rejected')} className="px-3 py-1.5 text-xs font-medium text-[#6e6e73] bg-[#f5f5f7] hover:bg-[#e8e8ed] rounded-full cursor-pointer">
                  Reject
                </button>
              )}
              <button type="button" onClick={() => setEditing({ ...rev })} className="p-1.5 text-[#6e6e73] hover:text-[#1d1d1f] hover:bg-black/5 rounded-full cursor-pointer">
                <Pencil className="w-3.5 h-3.5" />
              </button>
              <button type="button" onClick={() => adminApi.deleteTestimonial(rev.id).then(onReload)} className="p-1.5 text-[#86868b] hover:text-red-600 hover:bg-red-50 rounded-full cursor-pointer">
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ============================================================================
// 9. BLOG & GUIDES MANAGEMENT
// ============================================================================
export function BlogManagerView({
  blogPosts,
  onReload,
}: {
  blogPosts: BlogPost[];
  onReload: () => Promise<void>;
}) {
  const [editing, setEditing] = useState<Partial<BlogPost> | null>(null);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  function openNew() {
    setEditing({
      title: '',
      slug: '',
      category: 'AC Engineering',
      excerpt: '',
      content: '',
      author: 'Engr. Mujahid Ali',
      readTime: '4 min read',
      imageUrl: '/src/assets/images/gallery_inverter_pcb_1794823621561.jpg',
      isPublished: true,
      publishedAt: new Date().toISOString().slice(0, 10),
    });
  }

  async function handleImageUpload(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !editing) return;
    setUploading(true);
    try {
      const { url } = await adminApi.uploadImage(file);
      setEditing({ ...editing, imageUrl: url });
    } finally {
      setUploading(false);
    }
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!editing) return;
    setSaving(true);
    try {
      if (editing.id) {
        await adminApi.updateBlogPost(editing.id, editing);
      } else {
        await adminApi.createBlogPost(editing);
      }
      setEditing(null);
      await onReload();
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-semibold text-[#1d1d1f]">Engineering Blog Posts ({blogPosts.length})</h2>
          <p className="text-xs text-[#6e6e73]">Publish HVACR guides and seasonal maintenance tips visible on /blog.</p>
        </div>
        <button type="button" onClick={openNew} className={BTN_PRIMARY}>
          <Plus className="w-4 h-4" />
          <span>New Article</span>
        </button>
      </div>

      {editing && (
        <form onSubmit={handleSubmit} className={FORM_CLS}>
          <div className="flex items-center justify-between border-b border-black/[0.06] pb-3.5">
            <h3 className="text-sm font-semibold text-[#1d1d1f]">
              {editing.id ? `Edit Article: ${editing.title}` : 'Publish Engineering Article'}
            </h3>
            <button type="button" onClick={() => setEditing(null)} className="text-[#86868b] hover:text-[#1d1d1f] p-1 rounded-full cursor-pointer">
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-[#424245] mb-1">Article Title *</label>
              <input type="text" required value={editing.title || ''} onChange={(e) => setEditing({ ...editing, title: e.target.value })} className={INPUT_CLS} />
            </div>
            <div>
              <label className="block text-xs font-medium text-[#424245] mb-1">URL Slug</label>
              <input type="text" value={editing.slug || ''} onChange={(e) => setEditing({ ...editing, slug: e.target.value })} placeholder="auto-generated if blank" className={INPUT_CLS} />
            </div>
            <div>
              <label className="block text-xs font-medium text-[#424245] mb-1">Category *</label>
              <input type="text" required value={editing.category || ''} onChange={(e) => setEditing({ ...editing, category: e.target.value })} className={INPUT_CLS} />
            </div>
            <div>
              <label className="block text-xs font-medium text-[#424245] mb-1">Author</label>
              <input type="text" value={editing.author || ''} onChange={(e) => setEditing({ ...editing, author: e.target.value })} className={INPUT_CLS} />
            </div>
            <div>
              <label className="block text-xs font-medium text-[#424245] mb-1">Read Time</label>
              <input type="text" value={editing.readTime || ''} onChange={(e) => setEditing({ ...editing, readTime: e.target.value })} className={INPUT_CLS} />
            </div>
            <div>
              <label className="block text-xs font-medium text-[#424245] mb-1">Publish Date</label>
              <input type="date" value={editing.publishedAt || ''} onChange={(e) => setEditing({ ...editing, publishedAt: e.target.value })} className={`${INPUT_CLS} tabular-nums`} />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-[#424245] mb-1">Excerpt *</label>
            <textarea rows={2} required value={editing.excerpt || ''} onChange={(e) => setEditing({ ...editing, excerpt: e.target.value })} className={INPUT_CLS} />
          </div>

          <div>
            <label className="block text-xs font-medium text-[#424245] mb-1">Full Article Content (Separate paragraphs with blank line) *</label>
            <textarea rows={6} required value={editing.content || ''} onChange={(e) => setEditing({ ...editing, content: e.target.value })} className={INPUT_CLS} />
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <div className="flex-1 min-w-[240px] flex items-center gap-2">
              <input type="text" value={editing.imageUrl || ''} onChange={(e) => setEditing({ ...editing, imageUrl: e.target.value })} className={`flex-1 ${INPUT_CLS}`} />
              <label className="inline-flex items-center gap-1.5 px-3.5 py-2.5 text-xs font-medium text-[#1d1d1f] bg-white border border-black/[0.08] hover:bg-black hover:text-white rounded-full transition-colors cursor-pointer shrink-0">
                <Upload className="w-3.5 h-3.5" />
                <span>{uploading ? 'Uploading...' : 'Upload'}</span>
                <input type="file" accept="image/png,image/jpeg,image/webp" className="hidden" onChange={handleImageUpload} />
              </label>
            </div>
            <label className="flex items-center gap-2 text-xs text-[#424245]">
              <input type="checkbox" checked={editing.isPublished !== false} onChange={(e) => setEditing({ ...editing, isPublished: e.target.checked })} />
              <span>Published</span>
            </label>
          </div>

          <div className="flex gap-3">
            <button type="submit" disabled={saving} className={BTN_PRIMARY}>
              {saving ? 'Saving...' : 'Save Article'}
            </button>
            <button type="button" onClick={() => setEditing(null)} className={BTN_SECONDARY}>
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {blogPosts.map((post) => (
          <div key={post.id} className={`${CARD_CLS} flex`}>
            <div className="w-32 shrink-0 bg-slate-200">
              <ResilientImage src={post.imageUrl} alt={post.title} className="w-full h-full object-cover" />
            </div>
            <div className="p-4 flex-1 flex flex-col justify-between bg-white/80">
              <div>
                <div className="flex items-center justify-between text-[11px] text-[#6e6e73]">
                  <span>{post.category} · {post.readTime}</span>
                  <span className={post.isPublished ? 'text-emerald-700 font-semibold' : 'text-[#86868b]'}>
                    {post.isPublished ? 'Published' : 'Draft'}
                  </span>
                </div>
                <h3 className="text-sm font-semibold text-[#1d1d1f] mt-1 line-clamp-1">{post.title}</h3>
                <p className="text-xs text-[#6e6e73] mt-1 line-clamp-2">{post.excerpt}</p>
              </div>
              <div className="mt-3 pt-2.5 border-t border-black/[0.05] flex items-center justify-between">
                <span className="text-[11px] text-[#86868b] tabular-nums">{post.publishedAt}</span>
                <div className="flex items-center gap-1">
                  <button type="button" onClick={() => setEditing({ ...post })} className="p-1.5 text-[#6e6e73] hover:text-[#1d1d1f] hover:bg-black/5 rounded-full cursor-pointer">
                    <Pencil className="w-3.5 h-3.5" />
                  </button>
                  <button type="button" onClick={() => adminApi.deleteBlogPost(post.id).then(onReload)} className="p-1.5 text-[#86868b] hover:text-red-600 hover:bg-red-50 rounded-full cursor-pointer">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ============================================================================
// 10. PHOTO GALLERY MANAGEMENT
// ============================================================================
export function GalleryManagerView({
  galleryItems,
  onReload,
}: {
  galleryItems: GalleryItem[];
  onReload: () => Promise<void>;
}) {
  const [editing, setEditing] = useState<Partial<GalleryItem> | null>(null);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  function openNew() {
    setEditing({
      title: '',
      category: 'Commercial HVAC',
      location: 'DHA Multan',
      caption: '',
      imageUrl: '/src/assets/images/gallery_ductwork_vrf_1794823622234.jpg',
      isPublished: true,
      sortOrder: galleryItems.length + 1,
    });
  }

  async function handleImageUpload(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !editing) return;
    setUploading(true);
    try {
      const { url } = await adminApi.uploadImage(file);
      setEditing({ ...editing, imageUrl: url });
    } finally {
      setUploading(false);
    }
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!editing) return;
    setSaving(true);
    try {
      if (editing.id) {
        await adminApi.updateGalleryItem(editing.id, editing);
      } else {
        await adminApi.createGalleryItem(editing);
      }
      setEditing(null);
      await onReload();
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-semibold text-[#1d1d1f]">Field Photo Gallery ({galleryItems.length})</h2>
          <p className="text-xs text-[#6e6e73]">Published photos appear in the /gallery showcase and homepage gallery preview.</p>
        </div>
        <button type="button" onClick={openNew} className={BTN_PRIMARY}>
          <Plus className="w-4 h-4" />
          <span>Add Photo</span>
        </button>
      </div>

      {editing && (
        <form onSubmit={handleSubmit} className={FORM_CLS}>
          <div className="flex items-center justify-between border-b border-black/[0.06] pb-3.5">
            <h3 className="text-sm font-semibold text-[#1d1d1f]">
              {editing.id ? 'Edit Gallery Photo' : 'Add Gallery Photo'}
            </h3>
            <button type="button" onClick={() => setEditing(null)} className="text-[#86868b] hover:text-[#1d1d1f] p-1 rounded-full cursor-pointer">
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-[#424245] mb-1">Photo Title *</label>
              <input type="text" required value={editing.title || ''} onChange={(e) => setEditing({ ...editing, title: e.target.value })} className={INPUT_CLS} />
            </div>
            <div>
              <label className="block text-xs font-medium text-[#424245] mb-1">Category *</label>
              <input type="text" required value={editing.category || ''} onChange={(e) => setEditing({ ...editing, category: e.target.value })} className={INPUT_CLS} />
            </div>
            <div>
              <label className="block text-xs font-medium text-[#424245] mb-1">Location (Colony / City)</label>
              <input type="text" value={editing.location || ''} onChange={(e) => setEditing({ ...editing, location: e.target.value })} className={INPUT_CLS} />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-[#424245] mb-1">Technical Caption</label>
            <textarea rows={2} value={editing.caption || ''} onChange={(e) => setEditing({ ...editing, caption: e.target.value })} className={INPUT_CLS} />
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <div className="flex-1 min-w-[240px] flex items-center gap-2">
              <input type="text" required value={editing.imageUrl || ''} onChange={(e) => setEditing({ ...editing, imageUrl: e.target.value })} className={`flex-1 ${INPUT_CLS}`} />
              <label className="inline-flex items-center gap-1.5 px-3.5 py-2.5 text-xs font-medium text-[#1d1d1f] bg-white border border-black/[0.08] hover:bg-black hover:text-white rounded-full transition-colors cursor-pointer shrink-0">
                <Upload className="w-3.5 h-3.5" />
                <span>{uploading ? 'Uploading...' : 'Upload'}</span>
                <input type="file" accept="image/png,image/jpeg,image/webp" className="hidden" onChange={handleImageUpload} />
              </label>
            </div>
            <label className="flex items-center gap-2 text-xs text-[#424245]">
              <input type="checkbox" checked={editing.isPublished !== false} onChange={(e) => setEditing({ ...editing, isPublished: e.target.checked })} />
              <span>Published</span>
            </label>
          </div>

          <div className="flex gap-3">
            <button type="submit" disabled={saving} className={BTN_PRIMARY}>
              {saving ? 'Saving...' : 'Save Photo'}
            </button>
            <button type="button" onClick={() => setEditing(null)} className={BTN_SECONDARY}>
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {galleryItems.map((item) => (
          <div key={item.id} className={`${CARD_CLS} flex flex-col justify-between`}>
            <div className="h-44 bg-slate-200">
              <ResilientImage src={item.imageUrl} alt={item.title} className="w-full h-full object-cover" />
            </div>
            <div className="p-4 flex-1 flex flex-col justify-between bg-white/80">
              <div>
                <div className="flex items-center justify-between text-[11px] text-[#6e6e73]">
                  <span>{item.category}</span>
                  <span className={item.isPublished ? 'text-emerald-700 font-semibold' : 'text-[#86868b]'}>
                    {item.isPublished ? 'Published' : 'Hidden'}
                  </span>
                </div>
                <h3 className="text-sm font-semibold text-[#1d1d1f] mt-1">{item.title}</h3>
                <p className="text-xs text-[#6e6e73] mt-0.5">{item.location}</p>
              </div>
              <div className="mt-3 pt-2.5 border-t border-black/[0.05] flex items-center justify-between">
                <span className="text-[11px] text-[#86868b] truncate max-w-[160px]">{item.caption}</span>
                <div className="flex items-center gap-1">
                  <button type="button" onClick={() => setEditing({ ...item })} className="p-1.5 text-[#6e6e73] hover:text-[#1d1d1f] hover:bg-black/5 rounded-full cursor-pointer">
                    <Pencil className="w-3.5 h-3.5" />
                  </button>
                  <button type="button" onClick={() => adminApi.deleteGalleryItem(item.id).then(onReload)} className="p-1.5 text-[#86868b] hover:text-red-600 hover:bg-red-50 rounded-full cursor-pointer">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ============================================================================
// 11. PRODUCTS CATALOG MANAGEMENT
// ============================================================================
export function ProductsManagerView({
  products,
  onReload,
}: {
  products: ProductItem[];
  onReload: () => Promise<void>;
}) {
  const [editing, setEditing] = useState<Partial<ProductItem> | null>(null);
  const [specsText, setSpecsText] = useState('');
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  function openNew() {
    setEditing({
      name: '',
      category: 'Inverter AC Units',
      brand: 'Gree / Haier / Dawlance',
      capacityOrSpec: '1.5 Ton · T3 Tropicalized',
      pricePkr: 'PKR 165,000',
      stockStatus: 'In Stock',
      summary: '',
      imageUrl: '/src/assets/images/product_hvac_hardware_1794825552921.jpg',
      isPublished: true,
      sortOrder: products.length + 1,
    });
    setSpecsText('');
  }

  function openEdit(item: ProductItem) {
    setEditing({ ...item });
    setSpecsText(item.specs.join('\n'));
  }

  async function handleImageUpload(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !editing) return;
    setUploading(true);
    try {
      const { url } = await adminApi.uploadImage(file);
      setEditing({ ...editing, imageUrl: url });
    } finally {
      setUploading(false);
    }
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!editing) return;
    setSaving(true);
    try {
      const specs = specsText.split('\n').map((s) => s.trim()).filter(Boolean);
      const payload = { ...editing, specs };
      if (editing.id) {
        await adminApi.updateProduct(editing.id, payload);
      } else {
        await adminApi.createProduct(payload);
      }
      setEditing(null);
      await onReload();
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-semibold text-[#1d1d1f]">Products &amp; Hardware Catalog ({products.length})</h2>
          <p className="text-xs text-[#6e6e73]">Published equipment and spare kits appear on /products and the Home preview.</p>
        </div>
        <button type="button" onClick={openNew} className={BTN_PRIMARY}>
          <Plus className="w-4 h-4" />
          <span>Add Product</span>
        </button>
      </div>

      {editing && (
        <form onSubmit={handleSubmit} className={FORM_CLS}>
          <div className="flex items-center justify-between border-b border-black/[0.06] pb-3.5">
            <h3 className="text-sm font-semibold text-[#1d1d1f]">
              {editing.id ? `Edit Product: ${editing.name}` : 'Add HVACR Product'}
            </h3>
            <button type="button" onClick={() => setEditing(null)} className="text-[#86868b] hover:text-[#1d1d1f] p-1 rounded-full cursor-pointer">
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-[#424245] mb-1">Product Name *</label>
              <input type="text" required value={editing.name || ''} onChange={(e) => setEditing({ ...editing, name: e.target.value })} className={INPUT_CLS} />
            </div>
            <div>
              <label className="block text-xs font-medium text-[#424245] mb-1">Category *</label>
              <input type="text" required value={editing.category || ''} onChange={(e) => setEditing({ ...editing, category: e.target.value })} className={INPUT_CLS} />
            </div>
            <div>
              <label className="block text-xs font-medium text-[#424245] mb-1">Brand *</label>
              <input type="text" required value={editing.brand || ''} onChange={(e) => setEditing({ ...editing, brand: e.target.value })} className={INPUT_CLS} />
            </div>
            <div>
              <label className="block text-xs font-medium text-[#424245] mb-1">Capacity / Spec *</label>
              <input type="text" required value={editing.capacityOrSpec || ''} onChange={(e) => setEditing({ ...editing, capacityOrSpec: e.target.value })} className={INPUT_CLS} />
            </div>
            <div>
              <label className="block text-xs font-medium text-[#424245] mb-1">Price (PKR) *</label>
              <input type="text" required value={editing.pricePkr || ''} onChange={(e) => setEditing({ ...editing, pricePkr: e.target.value })} className={`${INPUT_CLS} tabular-nums`} />
            </div>
            <div>
              <label className="block text-xs font-medium text-[#424245] mb-1">Stock Status</label>
              <select value={editing.stockStatus || 'In Stock'} onChange={(e) => setEditing({ ...editing, stockStatus: e.target.value as ProductItem['stockStatus'] })} className={INPUT_CLS}>
                <option value="In Stock">In Stock</option>
                <option value="Workshop Stock">Workshop Stock</option>
                <option value="On Order">On Order</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-[#424245] mb-1">Product Summary *</label>
            <textarea rows={2} required value={editing.summary || ''} onChange={(e) => setEditing({ ...editing, summary: e.target.value })} className={INPUT_CLS} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-[#424245] mb-1">Technical Specs (One per line)</label>
              <textarea rows={4} value={specsText} onChange={(e) => setSpecsText(e.target.value)} className={INPUT_CLS} />
            </div>
            <div className="space-y-3">
              <label className="block text-xs font-medium text-[#424245]">Product Image</label>
              <div className="flex items-center gap-2">
                <input type="text" value={editing.imageUrl || ''} onChange={(e) => setEditing({ ...editing, imageUrl: e.target.value })} className={`flex-1 ${INPUT_CLS}`} />
                <label className="inline-flex items-center gap-1.5 px-3.5 py-2.5 text-xs font-medium text-[#1d1d1f] bg-white border border-black/[0.08] hover:bg-black hover:text-white rounded-full transition-colors cursor-pointer shrink-0">
                  <Upload className="w-3.5 h-3.5" />
                  <span>{uploading ? 'Uploading...' : 'Upload'}</span>
                  <input type="file" accept="image/png,image/jpeg,image/webp" className="hidden" onChange={handleImageUpload} />
                </label>
              </div>
              <label className="flex items-center gap-2 text-xs text-[#424245] pt-2">
                <input type="checkbox" checked={editing.isPublished !== false} onChange={(e) => setEditing({ ...editing, isPublished: e.target.checked })} />
                <span>Published on public catalog</span>
              </label>
            </div>
          </div>

          <div className="flex gap-3">
            <button type="submit" disabled={saving} className={BTN_PRIMARY}>
              {saving ? 'Saving...' : 'Save Product'}
            </button>
            <button type="button" onClick={() => setEditing(null)} className={BTN_SECONDARY}>
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {products.map((item) => (
          <div key={item.id} className={`${CARD_CLS} flex flex-col justify-between`}>
            <div className="h-44 bg-slate-200">
              <ResilientImage src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
            </div>
            <div className="p-4 flex-1 flex flex-col justify-between bg-white/80">
              <div>
                <div className="flex items-center justify-between text-[11px] text-[#6e6e73]">
                  <span>{item.category}</span>
                  <span className={item.isPublished ? 'text-emerald-700 font-semibold' : 'text-[#86868b]'}>
                    {item.isPublished ? item.stockStatus : 'Hidden'}
                  </span>
                </div>
                <h3 className="text-sm font-semibold text-[#1d1d1f] mt-1">{item.name}</h3>
                <div className="text-xs font-medium text-[#0071e3] mt-0.5 tabular-nums">{item.pricePkr}</div>
                <p className="text-xs text-[#6e6e73] mt-1 line-clamp-2">{item.summary}</p>
              </div>
              <div className="mt-3 pt-2.5 border-t border-black/[0.05] flex items-center justify-between">
                <span className="text-[11px] text-[#86868b] truncate max-w-[160px]">{item.capacityOrSpec}</span>
                <div className="flex items-center gap-1">
                  <button type="button" onClick={() => openEdit(item)} className="p-1.5 text-[#6e6e73] hover:text-[#1d1d1f] hover:bg-black/5 rounded-full cursor-pointer">
                    <Pencil className="w-3.5 h-3.5" />
                  </button>
                  <button type="button" onClick={() => adminApi.deleteProduct(item.id).then(onReload)} className="p-1.5 text-[#86868b] hover:text-red-600 hover:bg-red-50 rounded-full cursor-pointer">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
