import type {
  AdminNotification,
  AdminUser,
  BlogPost,
  BookingRecord,
  BookingStatus,
  ContactInquiry,
  CustomerRecord,
  DashboardStats,
  FaqItem,
  GalleryItem,
  MaintenancePlan,
  ProductItem,
  ProjectItem,
  PublicBootstrapData,
  ReportsPayload,
  ReviewStatus,
  ServiceItem,
  SiteSettings,
  Testimonial,
} from '../types/index.ts';

const API_BASE = ((import.meta as unknown as { env?: Record<string, string | undefined> }).env?.VITE_API_URL || '').replace(/\/+$/, '');

export function resolveApiUrl(pathOrUrl: string): string {
  if (!pathOrUrl) return pathOrUrl;
  if (API_BASE && (pathOrUrl.startsWith('/api/') || pathOrUrl.startsWith('/uploads/'))) {
    return `${API_BASE}${pathOrUrl}`;
  }
  return pathOrUrl;
}

async function request<T>(url: string, options: RequestInit = {}): Promise<T> {
  const res = await fetch(resolveApiUrl(url), {
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
    ...options,
  });

  const text = await res.text();
  let data: unknown = null;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = null;
  }

  if (!res.ok) {
    const message =
      data && typeof data === 'object' && 'error' in data && typeof (data as { error: unknown }).error === 'string'
        ? (data as { error: string }).error
        : `Request failed (${res.status})`;
    throw new Error(message);
  }

  return data as T;
}

export const publicApi = {
  getBootstrap: () => request<PublicBootstrapData>('/api/public/bootstrap'),
  submitBooking: (payload: {
    customerName: string;
    phone: string;
    email?: string;
    serviceId?: number | null;
    serviceName: string;
    city: string;
    address: string;
    preferredDate: string;
    message?: string;
  }) =>
    request<{ bookingCode: string; status: string; serviceName: string; preferredDate: string }>(
      '/api/public/bookings',
      { method: 'POST', body: JSON.stringify(payload) }
    ),
  submitInquiry: (payload: {
    customerName: string;
    phone: string;
    email?: string;
    city: string;
    subject: string;
    message: string;
  }) => request<{ id: number; createdAt: string }>('/api/public/inquiries', { method: 'POST', body: JSON.stringify(payload) }),
  submitReview: (payload: {
    customerName: string;
    roleOrCompany: string;
    city: string;
    serviceName: string;
    rating: number;
    reviewText: string;
  }) => request<{ id: number; status: string }>('/api/public/testimonials', { method: 'POST', body: JSON.stringify(payload) }),
};

export const authApi = {
  login: (identifier: string, password: string) =>
    request<{ user: AdminUser }>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ identifier, password }),
    }),
  logout: () => request<{ ok: boolean }>('/api/auth/logout', { method: 'POST' }),
  me: () => request<{ user: AdminUser }>('/api/auth/me'),
  changePassword: (currentPassword: string, newPassword: string) =>
    request<{ ok: boolean; message: string }>('/api/auth/change-password', {
      method: 'POST',
      body: JSON.stringify({ currentPassword, newPassword }),
    }),
  updateProfile: (payload: { fullName: string; email: string; username: string; role: string }) =>
    request<{ user: AdminUser }>('/api/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(payload),
    }),
};

export const adminApi = {
  getDashboard: () => request<DashboardStats>('/api/admin/dashboard'),
  getReports: () => request<ReportsPayload>('/api/admin/reports'),
  getNotifications: () => request<{ notifications: AdminNotification[] }>('/api/admin/notifications'),
  markAllNotificationsRead: () => request<{ ok: boolean }>('/api/admin/notifications/read-all', { method: 'POST' }),
  markNotificationRead: (id: number) =>
    request<{ ok: boolean }>(`/api/admin/notifications/${id}/read`, { method: 'PATCH' }),

  // Bookings
  getBookings: () => request<{ bookings: BookingRecord[] }>('/api/admin/bookings'),
  updateBooking: (id: number, payload: { status?: BookingStatus; internalNotes?: string; isRead?: boolean }) =>
    request<{ booking: BookingRecord }>(`/api/admin/bookings/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(payload),
    }),
  deleteBooking: (id: number) => request<{ ok: boolean }>(`/api/admin/bookings/${id}`, { method: 'DELETE' }),

  // Customers
  getCustomers: () => request<{ customers: CustomerRecord[] }>('/api/admin/customers'),
  getCustomerBookings: (id: number) => request<{ bookings: BookingRecord[] }>(`/api/admin/customers/${id}/bookings`),
  updateCustomer: (id: number, payload: Partial<CustomerRecord>) =>
    request<{ customers: CustomerRecord[] }>(`/api/admin/customers/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(payload),
    }),

  // Services
  getServices: () => request<{ services: ServiceItem[] }>('/api/admin/services'),
  createService: (payload: Partial<ServiceItem>) =>
    request<{ services: ServiceItem[] }>('/api/admin/services', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
  updateService: (id: number, payload: Partial<ServiceItem>) =>
    request<{ services: ServiceItem[] }>(`/api/admin/services/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    }),
  deleteService: (id: number) => request<{ services: ServiceItem[] }>(`/api/admin/services/${id}`, { method: 'DELETE' }),

  // Projects
  getProjects: () => request<{ projects: ProjectItem[] }>('/api/admin/projects'),
  createProject: (payload: Partial<ProjectItem>) =>
    request<{ projects: ProjectItem[] }>('/api/admin/projects', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
  updateProject: (id: number, payload: Partial<ProjectItem>) =>
    request<{ projects: ProjectItem[] }>(`/api/admin/projects/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    }),
  deleteProject: (id: number) => request<{ projects: ProjectItem[] }>(`/api/admin/projects/${id}`, { method: 'DELETE' }),

  // Plans
  getPlans: () => request<{ plans: MaintenancePlan[] }>('/api/admin/plans'),
  createPlan: (payload: Partial<MaintenancePlan>) =>
    request<{ plans: MaintenancePlan[] }>('/api/admin/plans', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
  updatePlan: (id: number, payload: Partial<MaintenancePlan>) =>
    request<{ plans: MaintenancePlan[] }>(`/api/admin/plans/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    }),
  deletePlan: (id: number) => request<{ plans: MaintenancePlan[] }>(`/api/admin/plans/${id}`, { method: 'DELETE' }),

  // FAQs
  getFaqs: () => request<{ faqs: FaqItem[] }>('/api/admin/faqs'),
  createFaq: (payload: Partial<FaqItem>) =>
    request<{ faqs: FaqItem[] }>('/api/admin/faqs', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
  updateFaq: (id: number, payload: Partial<FaqItem>) =>
    request<{ faqs: FaqItem[] }>(`/api/admin/faqs/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    }),
  deleteFaq: (id: number) => request<{ faqs: FaqItem[] }>(`/api/admin/faqs/${id}`, { method: 'DELETE' }),

  // Testimonials
  getTestimonials: () => request<{ testimonials: Testimonial[] }>('/api/admin/testimonials'),
  createTestimonial: (payload: Partial<Testimonial>) =>
    request<{ testimonials: Testimonial[] }>('/api/admin/testimonials', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
  updateTestimonial: (id: number, payload: Partial<Testimonial> & { status?: ReviewStatus }) =>
    request<{ testimonials: Testimonial[] }>(`/api/admin/testimonials/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    }),
  deleteTestimonial: (id: number) =>
    request<{ testimonials: Testimonial[] }>(`/api/admin/testimonials/${id}`, { method: 'DELETE' }),

  // Settings
  getSettings: () => request<{ settings: SiteSettings }>('/api/admin/settings'),
  updateSettings: (payload: Partial<SiteSettings>) =>
    request<{ settings: SiteSettings }>('/api/admin/settings', {
      method: 'PUT',
      body: JSON.stringify(payload),
    }),

  // Inquiries
  getInquiries: () => request<{ inquiries: ContactInquiry[] }>('/api/admin/inquiries'),
  updateInquiry: (id: number, payload: { isRead?: boolean; adminReply?: string }) =>
    request<{ inquiries: ContactInquiry[] }>(`/api/admin/inquiries/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(payload),
    }),
  deleteInquiry: (id: number) =>
    request<{ inquiries: ContactInquiry[] }>(`/api/admin/inquiries/${id}`, { method: 'DELETE' }),

  // Blog Posts
  getBlogPosts: () => request<{ blogPosts: BlogPost[] }>('/api/admin/blog'),
  createBlogPost: (payload: Partial<BlogPost>) =>
    request<{ blogPosts: BlogPost[] }>('/api/admin/blog', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
  updateBlogPost: (id: number, payload: Partial<BlogPost>) =>
    request<{ blogPosts: BlogPost[] }>(`/api/admin/blog/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    }),
  deleteBlogPost: (id: number) =>
    request<{ blogPosts: BlogPost[] }>(`/api/admin/blog/${id}`, { method: 'DELETE' }),

  // Gallery Items
  getGalleryItems: () => request<{ galleryItems: GalleryItem[] }>('/api/admin/gallery'),
  createGalleryItem: (payload: Partial<GalleryItem>) =>
    request<{ galleryItems: GalleryItem[] }>('/api/admin/gallery', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
  updateGalleryItem: (id: number, payload: Partial<GalleryItem>) =>
    request<{ galleryItems: GalleryItem[] }>(`/api/admin/gallery/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    }),
  deleteGalleryItem: (id: number) =>
    request<{ galleryItems: GalleryItem[] }>(`/api/admin/gallery/${id}`, { method: 'DELETE' }),

  // Products Catalog
  getProducts: () => request<{ products: ProductItem[] }>('/api/admin/products'),
  createProduct: (payload: Partial<ProductItem>) =>
    request<{ products: ProductItem[] }>('/api/admin/products', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
  updateProduct: (id: number, payload: Partial<ProductItem>) =>
    request<{ products: ProductItem[] }>(`/api/admin/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    }),
  deleteProduct: (id: number) =>
    request<{ products: ProductItem[] }>(`/api/admin/products/${id}`, { method: 'DELETE' }),

  // Upload image
  uploadImage: (file: File): Promise<{ url: string }> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = async () => {
        try {
          const result = await request<{ url: string }>('/api/admin/upload', {
            method: 'POST',
            body: JSON.stringify({ dataUrl: reader.result, fileName: file.name }),
          });
          resolve(result);
        } catch (err) {
          reject(err);
        }
      };
      reader.onerror = () => reject(new Error('Failed to read image file.'));
      reader.readAsDataURL(file);
    }),

  // Restore JSON Backup
  restoreJsonBackup: (payload: unknown) =>
    request<{ ok: boolean; restoredCounts: Record<string, number> }>('/api/admin/restore/json', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
};

export function exportRowsToCsv(filename: string, headers: string[], rows: (string | number | boolean | null)[][]) {
  const escapeCell = (val: string | number | boolean | null) => {
    const str = val === null || val === undefined ? '' : String(val);
    if (/[",\n\r]/.test(str)) {
      return `"${str.replace(/"/g, '""')}"`;
    }
    return str;
  };
  const csvContent =
    '\uFEFF' +
    [headers.map(escapeCell).join(','), ...rows.map((r) => r.map(escapeCell).join(','))].join('\r\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
