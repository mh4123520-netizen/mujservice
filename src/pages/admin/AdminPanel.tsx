import { useCallback, useEffect, useState } from 'react';
import {
  LayoutDashboard,
  CalendarCheck,
  Users,
  Wrench,
  FolderKanban,
  ShieldCheck,
  MessageSquareQuote,
  FileEdit,
  Inbox,
  BarChart3,
  Settings,
  Bell,
  ExternalLink,
  LogOut,
  Menu,
  X,
  BookOpen,
  Camera,
  Package,
} from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { adminApi, authApi } from '../../lib/api.ts';
import type {
  AdminNotification,
  AdminUser,
  BlogPost,
  BookingRecord,
  ContactInquiry,
  CustomerRecord,
  DashboardStats,
  FaqItem,
  GalleryItem,
  MaintenancePlan,
  ProductItem,
  ProjectItem,
  ReportsPayload,
  ServiceItem,
  SiteSettings,
  Testimonial,
} from '../../types/index.ts';
import {
  BookingsView,
  CustomersView,
  DashboardView,
  InquiriesView,
} from './AdminOperations.tsx';
import {
  BlogManagerView,
  GalleryManagerView,
  PlansManagerView,
  ProductsManagerView,
  ProjectsManagerView,
  ServicesManagerView,
  TestimonialsManagerView,
} from './AdminCatalog.tsx';
import {
  AdminSettingsView,
  ReportsView,
  WebsiteContentView,
} from './AdminSettingsAndReports.tsx';

interface AdminPanelProps {
  adminUser: AdminUser;
  onUserUpdated: (u: AdminUser) => void;
  onLogout: () => void;
  onBackToSite: () => void;
  onPublicDataChanged: () => Promise<void>;
}

const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'bookings', label: 'Booking Management', icon: CalendarCheck },
  { id: 'customers', label: 'Customer Records', icon: Users },
  { id: 'inquiries', label: 'Contact Inquiries', icon: Inbox },
  { id: 'services', label: 'Services Catalog', icon: Wrench },
  { id: 'products', label: 'Products Catalog', icon: Package },
  { id: 'projects', label: 'Projects Portfolio', icon: FolderKanban },
  { id: 'blog', label: 'Blog & Guides', icon: BookOpen },
  { id: 'gallery', label: 'Photo Gallery', icon: Camera },
  { id: 'plans', label: 'Maintenance Plans', icon: ShieldCheck },
  { id: 'testimonials', label: 'Customer Reviews', icon: MessageSquareQuote },
  { id: 'content', label: 'Website Content', icon: FileEdit },
  { id: 'reports', label: 'Reports & Export', icon: BarChart3 },
  { id: 'settings', label: 'Admin Settings', icon: Settings },
] as const;

export function AdminPanel({
  adminUser,
  onUserUpdated,
  onLogout,
  onBackToSite,
  onPublicDataChanged,
}: AdminPanelProps) {
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);

  const [dashboard, setDashboard] = useState<DashboardStats | null>(null);
  const [bookings, setBookings] = useState<BookingRecord[]>([]);
  const [customers, setCustomers] = useState<CustomerRecord[]>([]);
  const [inquiries, setInquiries] = useState<ContactInquiry[]>([]);
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [projects, setProjects] = useState<ProjectItem[]>([]);
  const [plans, setPlans] = useState<MaintenancePlan[]>([]);
  const [faqs, setFaqs] = useState<FaqItem[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [reports, setReports] = useState<ReportsPayload | null>(null);
  const [notifications, setNotifications] = useState<AdminNotification[]>([]);

  const reloadAll = useCallback(async () => {
    const [
      dashRes,
      bookRes,
      custRes,
      inqRes,
      svcRes,
      prodRes,
      projRes,
      planRes,
      faqRes,
      revRes,
      blogRes,
      galRes,
      setRes,
      repRes,
      notifRes,
    ] = await Promise.all([
      adminApi.getDashboard(),
      adminApi.getBookings(),
      adminApi.getCustomers(),
      adminApi.getInquiries(),
      adminApi.getServices(),
      adminApi.getProducts(),
      adminApi.getProjects(),
      adminApi.getPlans(),
      adminApi.getFaqs(),
      adminApi.getTestimonials(),
      adminApi.getBlogPosts(),
      adminApi.getGalleryItems(),
      adminApi.getSettings(),
      adminApi.getReports(),
      adminApi.getNotifications(),
    ]);

    setDashboard(dashRes);
    setBookings(bookRes.bookings);
    setCustomers(custRes.customers);
    setInquiries(inqRes.inquiries);
    setServices(svcRes.services);
    setProducts(prodRes.products);
    setProjects(projRes.projects);
    setPlans(planRes.plans);
    setFaqs(faqRes.faqs);
    setTestimonials(revRes.testimonials);
    setBlogPosts(blogRes.blogPosts);
    setGalleryItems(galRes.galleryItems);
    setSettings(setRes.settings);
    setReports(repRes);
    setNotifications(notifRes.notifications);
    await onPublicDataChanged();
  }, [onPublicDataChanged]);

  useEffect(() => {
    reloadAll();
    const timer = window.setInterval(() => {
      adminApi.getNotifications().then((r) => setNotifications(r.notifications)).catch(() => {});
      adminApi.getDashboard().then(setDashboard).catch(() => {});
    }, 20000);
    return () => window.clearInterval(timer);
  }, [reloadAll]);

  async function handleLogout() {
    await authApi.logout();
    onLogout();
  }

  const unreadNotifCount = notifications.filter((n) => !n.isRead).length;
  const pendingBookingsCount = bookings.filter((b) => b.status === 'pending').length;
  const unreadInqCount = inquiries.filter((i) => !i.isRead).length;

  const activeNavLabel = NAV_ITEMS.find((n) => n.id === activeTab)?.label || 'Dashboard';

  return (
    <div className="min-h-screen bg-[#fbfbfd] flex text-[#1d1d1f]">
      {/* Desktop Apple-Style Sidebar */}
      <aside className="hidden lg:flex lg:flex-col lg:w-68 p-3 pr-0 shrink-0">
        <div className="h-[calc(100vh-1.5rem)] sticky top-3 bg-[#111317] text-white/75 rounded-[28px] flex flex-col overflow-hidden border border-white/10 shadow-xl">
          <div className="px-6 py-5 border-b border-white/10">
            <div className="text-sm font-semibold text-white tracking-tight">Mujahid Services</div>
            <div className="text-[11px] text-sky-400 mt-0.5">Admin Operations</div>
          </div>

          <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto" aria-label="Admin navigation">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const active = activeTab === item.id;
              const badge =
                item.id === 'bookings' && pendingBookingsCount > 0
                  ? pendingBookingsCount
                  : item.id === 'inquiries' && unreadInqCount > 0
                    ? unreadInqCount
                    : 0;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 text-xs font-medium rounded-full transition-all cursor-pointer ${
                    active
                      ? 'bg-[#0071e3] text-white shadow-sm'
                      : 'text-white/70 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <span className="flex items-center gap-2.5 truncate">
                    <Icon className="w-4 h-4 shrink-0" />
                    <span className="truncate">{item.label}</span>
                  </span>
                  {badge > 0 && (
                    <span
                      className={`text-[11px] px-2 py-0.5 rounded-full tabular-nums ${
                        active ? 'bg-white/20 text-white' : 'bg-white/10 text-sky-400'
                      }`}
                    >
                      {badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          <div className="p-3.5 border-t border-white/10 space-y-1.5">
            <button
              type="button"
              onClick={onBackToSite}
              className="w-full flex items-center gap-2.5 px-3.5 py-2 text-xs font-medium text-white/75 hover:bg-white/10 hover:text-white rounded-full transition-colors cursor-pointer"
            >
              <ExternalLink className="w-4 h-4" />
              <span>View Public Website</span>
            </button>
            <button
              type="button"
              onClick={handleLogout}
              className="w-full flex items-center gap-2.5 px-3.5 py-2 text-xs font-medium text-red-300 hover:bg-red-500/15 hover:text-red-200 rounded-full transition-colors cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile Sidebar Drawer */}
      <AnimatePresence>
        {sidebarOpen && (
          <div className="fixed inset-0 z-50 lg:hidden flex">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-xs"
              onClick={() => setSidebarOpen(false)}
            />
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="relative w-72 max-w-[85vw] bg-[#111317] text-white/75 flex flex-col h-full z-10 rounded-r-[28px] overflow-hidden"
            >
              <div className="h-16 px-5 flex items-center justify-between border-b border-white/10">
                <span className="text-sm font-semibold text-white">Mujahid Services Admin</span>
                <button
                  type="button"
                  onClick={() => setSidebarOpen(false)}
                  className="text-white/60 hover:text-white p-1.5 rounded-full hover:bg-white/10"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
                {NAV_ITEMS.map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => {
                        setActiveTab(item.id);
                        setSidebarOpen(false);
                      }}
                      className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 text-xs font-medium rounded-full transition-colors ${
                        activeTab === item.id ? 'bg-[#0071e3] text-white' : 'text-white/75 hover:bg-white/10'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </nav>
              <div className="p-4 border-t border-white/10 space-y-1.5">
                <button
                  type="button"
                  onClick={onBackToSite}
                  className="w-full flex items-center gap-2.5 px-3.5 py-2 text-xs text-white/75 hover:bg-white/10 rounded-full"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>Public Website</span>
                </button>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2.5 px-3.5 py-2 text-xs text-red-300 hover:bg-red-500/15 rounded-full"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </button>
              </div>
            </motion.aside>
          </div>
        )}
      </AnimatePresence>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <div className="px-4 sm:px-6 pt-3 sticky top-0 z-30">
          <header className="apple-nav-glass rounded-full px-4 sm:px-6 h-14 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 min-w-0">
              <button
                type="button"
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 text-[#1d1d1f] hover:bg-black/5 rounded-full"
                aria-label="Open admin menu"
              >
                <Menu className="w-5 h-5" />
              </button>
              <div className="text-sm text-[#6e6e73] flex items-center gap-2 truncate">
                <span className="hidden sm:inline">Admin</span>
                <span className="hidden sm:inline" aria-hidden="true">/</span>
                <span className="font-semibold text-[#1d1d1f] truncate">{activeNavLabel}</span>
              </div>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              {/* Real Notification Bell */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setNotifOpen((v) => !v)}
                  aria-label="Notifications"
                  className="relative p-2 text-[#1d1d1f] hover:bg-black/5 rounded-full transition-colors cursor-pointer"
                >
                  <Bell className="w-5 h-5" />
                  {unreadNotifCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 bg-[#0071e3] text-white text-[10px] font-semibold rounded-full flex items-center justify-center tabular-nums">
                      {unreadNotifCount}
                    </span>
                  )}
                </button>

                <AnimatePresence>
                  {notifOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.97 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.97 }}
                      transition={{ duration: 0.2 }}
                      className="absolute right-0 mt-2 w-80 sm:w-96 bg-white/95 backdrop-blur-xl border border-black/[0.08] rounded-[24px] shadow-2xl z-40 overflow-hidden"
                    >
                      <div className="px-5 py-3.5 border-b border-black/[0.06] flex items-center justify-between bg-[#f5f5f7]">
                        <span className="text-xs font-semibold text-[#1d1d1f]">
                          Notifications ({unreadNotifCount} unread)
                        </span>
                        {unreadNotifCount > 0 && (
                          <button
                            type="button"
                            onClick={async () => {
                              await adminApi.markAllNotificationsRead();
                              await reloadAll();
                            }}
                            className="text-[11px] font-medium text-[#0071e3] hover:underline cursor-pointer"
                          >
                            Mark all read
                          </button>
                        )}
                      </div>
                      <div className="max-h-80 overflow-y-auto divide-y divide-black/[0.05]">
                        {notifications.length === 0 ? (
                          <div className="p-6 text-center text-xs text-[#86868b]">No notifications yet.</div>
                        ) : (
                          notifications.map((n) => (
                            <button
                              key={n.id}
                              type="button"
                              onClick={async () => {
                                if (!n.isRead) {
                                  await adminApi.markNotificationRead(n.id);
                                }
                                setNotifOpen(false);
                                if (n.type === 'booking') setActiveTab('bookings');
                                else if (n.type === 'inquiry') setActiveTab('inquiries');
                                else if (n.type === 'review') setActiveTab('testimonials');
                                await reloadAll();
                              }}
                              className={`w-full text-left p-4 hover:bg-[#f5f5f7] transition-colors cursor-pointer ${
                                !n.isRead ? 'bg-sky-50/50' : ''
                              }`}
                            >
                              <div className="flex items-center justify-between gap-2 text-xs">
                                <span className={!n.isRead ? 'font-semibold text-[#1d1d1f]' : 'font-medium text-[#424245]'}>
                                  {n.title}
                                </span>
                                <span className="text-[10px] text-[#86868b] tabular-nums">
                                  {n.createdAt.slice(0, 10)}
                                </span>
                              </div>
                              <p className="text-xs text-[#6e6e73] mt-1">{n.message}</p>
                            </button>
                          ))
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="hidden sm:block text-right pr-1">
                <div className="text-xs font-semibold text-[#1d1d1f]">{adminUser.fullName}</div>
                <div className="text-[11px] text-[#6e6e73]">{adminUser.role}</div>
              </div>
            </div>
          </header>
        </div>

        <main className="flex-1 p-4 sm:p-6 max-w-7xl w-full mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            >
              {activeTab === 'dashboard' && (
                <DashboardView stats={dashboard} onOpenSection={setActiveTab} />
              )}
              {activeTab === 'bookings' && (
                <BookingsView bookings={bookings} onReload={reloadAll} />
              )}
              {activeTab === 'customers' && (
                <CustomersView customers={customers} onReload={reloadAll} />
              )}
              {activeTab === 'inquiries' && (
                <InquiriesView inquiries={inquiries} onReload={reloadAll} />
              )}
              {activeTab === 'services' && (
                <ServicesManagerView services={services} onReload={reloadAll} />
              )}
              {activeTab === 'products' && (
                <ProductsManagerView products={products} onReload={reloadAll} />
              )}
              {activeTab === 'projects' && (
                <ProjectsManagerView projects={projects} onReload={reloadAll} />
              )}
              {activeTab === 'blog' && (
                <BlogManagerView blogPosts={blogPosts} onReload={reloadAll} />
              )}
              {activeTab === 'gallery' && (
                <GalleryManagerView galleryItems={galleryItems} onReload={reloadAll} />
              )}
              {activeTab === 'plans' && (
                <PlansManagerView plans={plans} onReload={reloadAll} />
              )}
              {activeTab === 'testimonials' && (
                <TestimonialsManagerView testimonials={testimonials} onReload={reloadAll} />
              )}
              {activeTab === 'content' && settings && (
                <WebsiteContentView settings={settings} faqs={faqs} onReload={reloadAll} />
              )}
              {activeTab === 'reports' && (
                <ReportsView reports={reports} bookings={bookings} inquiries={inquiries} />
              )}
              {activeTab === 'settings' && (
                <AdminSettingsView
                  adminUser={adminUser}
                  onUserUpdated={onUserUpdated}
                  onReloadAll={reloadAll}
                  onLogout={handleLogout}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
