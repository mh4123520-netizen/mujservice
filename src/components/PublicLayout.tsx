import { useState, type ReactNode } from 'react';
import { Menu, X, Phone, MessageCircle, MapPin, Clock } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import type { ServiceItem, SiteSettings } from '../types/index.ts';

interface PublicLayoutProps {
  settings: SiteSettings;
  services: ServiceItem[];
  currentPath: string;
  onNavigate: (path: string) => void;
  onOpenBooking: (serviceName?: string, note?: string) => void;
  children: ReactNode;
}

export function PublicLayout({
  settings,
  services,
  currentPath,
  onNavigate,
  onOpenBooking,
  children,
}: PublicLayoutProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: 'Home', path: '/' },
    { label: 'Services', path: '/services' },
    { label: 'Products', path: '/products' },
    { label: 'Packages', path: '/maintenance-plans' },
    { label: 'Gallery', path: '/gallery' },
    { label: 'Blog', path: '/blog' },
    { label: 'About', path: '/about' },
    { label: 'Contact', path: '/contact' },
  ];

  const handleNav = (path: string) => {
    setMobileMenuOpen(false);
    onNavigate(path);
  };

  const isLinkActive = (path: string) => {
    if (path === '/') return currentPath === '/';
    if (path === '/services') return currentPath === '/services' || currentPath.startsWith('/services/');
    if (path === '/blog') return currentPath === '/blog' || currentPath.startsWith('/blog/');
    return currentPath === path;
  };

  const whatsappUrl = `https://wa.me/92${settings.whatsapp.replace(/^0/, '')}`;

  return (
    <div className="min-h-screen flex flex-col text-[#1d1d1f] bg-[#fbfbfd]">
      {/* Apple-Style Translucent Floating Glass Header */}
      <div className="sticky top-0 z-40 px-3 sm:px-6 pt-3 pointer-events-none">
        <header className="max-w-6xl mx-auto apple-nav-glass rounded-full px-5 sm:px-6 h-14 flex items-center justify-between gap-4 pointer-events-auto">
          <a
            href="/"
            onClick={(e) => {
              e.preventDefault();
              handleNav('/');
            }}
            className="text-[15px] font-semibold tracking-tight text-[#1d1d1f] whitespace-nowrap shrink-0"
          >
            {settings.companyName}
          </a>

          <nav
            className="hidden lg:flex items-center gap-1 text-[13px] font-normal text-[#1d1d1f]/80"
            aria-label="Main navigation"
          >
            {navLinks.map((item) => {
              const active = isLinkActive(item.path);
              return (
                <a
                  key={item.path}
                  href={item.path}
                  onClick={(e) => {
                    e.preventDefault();
                    handleNav(item.path);
                  }}
                  className={`whitespace-nowrap shrink-0 px-3 py-1.5 rounded-full transition-all duration-200 ${
                    active
                      ? 'bg-[#1d1d1f] text-white font-medium'
                      : 'text-[#1d1d1f]/75 hover:text-[#1d1d1f] hover:bg-black/[0.04]'
                  }`}
                >
                  {item.label}
                </a>
              );
            })}
          </nav>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => onOpenBooking()}
              className="hidden sm:inline-flex items-center justify-center px-4 py-1.5 text-[12px] font-medium text-white bg-[#0071e3] rounded-full hover:bg-[#0077ed] transition-colors cursor-pointer whitespace-nowrap shrink-0"
            >
              Book Service
            </button>
            <button
              type="button"
              onClick={() => setMobileMenuOpen((v) => !v)}
              aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
              className="lg:hidden p-2 text-[#1d1d1f] hover:bg-black/5 rounded-full transition-colors cursor-pointer"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </header>

        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.98 }}
              transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
              className="lg:hidden max-w-6xl mx-auto mt-2 apple-nav-glass rounded-3xl px-5 py-5 space-y-4 pointer-events-auto"
            >
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {navLinks.map((link) => (
                  <a
                    key={link.path}
                    href={link.path}
                    onClick={(e) => {
                      e.preventDefault();
                      handleNav(link.path);
                    }}
                    className={`px-3.5 py-2 text-xs font-medium rounded-2xl transition-colors ${
                      isLinkActive(link.path)
                        ? 'bg-[#1d1d1f] text-white'
                        : 'bg-black/[0.04] text-[#1d1d1f] hover:bg-black/[0.08]'
                    }`}
                  >
                    {link.label}
                  </a>
                ))}
              </div>
              <div className="pt-3 border-t border-black/10 flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenBooking();
                  }}
                  className="flex-1 px-4 py-2.5 text-xs font-medium text-white bg-[#0071e3] rounded-full cursor-pointer"
                >
                  Book Service
                </button>
                <a
                  href={`tel:${settings.phone}`}
                  className="px-4 py-2.5 text-xs font-medium text-[#1d1d1f] bg-black/[0.05] rounded-full tabular-nums"
                >
                  {settings.phone}
                </a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <main className="flex-1">{children}</main>

      {/* Clean Minimalist Apple Footer */}
      <footer className="bg-[#f5f5f7] border-t border-black/[0.06] text-[#6e6e73] pt-14 pb-10">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-10 border-b border-black/[0.08]">
            <div>
              <div className="text-base font-semibold text-[#1d1d1f] tracking-tight">{settings.companyName}</div>
              <p className="text-xs text-[#6e6e73] mt-3 leading-relaxed">{settings.tagline}</p>
              <div className="mt-5 space-y-2 text-xs">
                <a
                  href={`tel:${settings.phone}`}
                  className="flex items-center gap-2 text-[#1d1d1f] hover:text-[#0071e3] transition-colors"
                >
                  <Phone className="w-3.5 h-3.5 text-[#0071e3] shrink-0" />
                  <span className="tabular-nums font-medium">{settings.phone}</span>
                </a>
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-[#1d1d1f] hover:text-[#0071e3] transition-colors"
                >
                  <MessageCircle className="w-3.5 h-3.5 text-[#0071e3] shrink-0" />
                  <span>WhatsApp: {settings.whatsapp}</span>
                </a>
                <div className="flex items-start gap-2">
                  <MapPin className="w-3.5 h-3.5 text-[#0071e3] shrink-0 mt-0.5" />
                  <span>{settings.address}</span>
                </div>
                <div className="flex items-start gap-2">
                  <Clock className="w-3.5 h-3.5 text-[#0071e3] shrink-0 mt-0.5" />
                  <span>{settings.workingHours}</span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-xs font-semibold text-[#1d1d1f] mb-3.5">HVACR Services</h3>
              <ul className="space-y-2 text-xs">
                <li>
                  <a
                    href="/services"
                    onClick={(e) => {
                      e.preventDefault();
                      handleNav('/services');
                    }}
                    className="hover:text-[#1d1d1f] transition-colors"
                  >
                    All Services Overview
                  </a>
                </li>
                {services.map((svc) => (
                  <li key={svc.id}>
                    <a
                      href={`/services/${svc.slug}`}
                      onClick={(e) => {
                        e.preventDefault();
                        handleNav(`/services/${svc.slug}`);
                      }}
                      className="hover:text-[#1d1d1f] transition-colors"
                    >
                      {svc.title}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-xs font-semibold text-[#1d1d1f] mb-3.5">Explore</h3>
              <ul className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs">
                {[
                  { label: 'Home', path: '/' },
                  { label: 'Products', path: '/products' },
                  { label: 'Packages', path: '/maintenance-plans' },
                  { label: 'Projects', path: '/projects' },
                  { label: 'Gallery', path: '/gallery' },
                  { label: 'Blog', path: '/blog' },
                  { label: 'About', path: '/about' },
                  { label: 'Why Us', path: '/why-choose-us' },
                  { label: 'Reviews', path: '/reviews' },
                  { label: 'FAQs', path: '/faqs' },
                  { label: 'Book Online', path: '/book' },
                  { label: 'Contact', path: '/contact' },
                ].map((link) => (
                  <li key={link.path}>
                    <a
                      href={link.path}
                      onClick={(e) => {
                        e.preventDefault();
                        handleNav(link.path);
                      }}
                      className="hover:text-[#1d1d1f] transition-colors"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-xs font-semibold text-[#1d1d1f] mb-3.5">Multan &amp; Khanewal</h3>
              <p className="text-xs leading-relaxed">
                DHA Multan · Model Town · Gulgasht · Bosan Road · Cantt · Wapda Town · Peoples Colony Khanewal · Civil Lines · Tariq Abad · Kabirwala · Mian Channu · Jahania
              </p>
              <div className="mt-5">
                <button
                  type="button"
                  onClick={() => handleNav('/book')}
                  className="px-4 py-2 text-xs font-medium text-white bg-[#1d1d1f] rounded-full hover:bg-black transition-colors cursor-pointer"
                >
                  Open Booking Wizard
                </button>
              </div>
            </div>
          </div>

          <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
            <p>
              Copyright &copy; {new Date().getFullYear()} {settings.companyName}. Khanewal &amp; Multan, Pakistan.
            </p>
            <a
              href="/admin"
              onClick={(e) => {
                e.preventDefault();
                handleNav('/admin');
              }}
              className="hover:text-[#1d1d1f] transition-colors"
            >
              Admin Portal
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
