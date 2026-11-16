import { useCallback, useEffect, useState } from 'react';
import { BookingModal } from './components/BookingModal.tsx';
import { PublicLayout } from './components/PublicLayout.tsx';
import { SeoHead } from './components/SeoHead.tsx';
import { authApi, publicApi } from './lib/api.ts';
import { AboutPage } from './pages/public/AboutPage.tsx';
import { BlogDetailPage, BlogPage } from './pages/public/BlogPage.tsx';
import { BookingPage } from './pages/public/BookingPage.tsx';
import { ContactPage } from './pages/public/ContactPage.tsx';
import { FaqsPage } from './pages/public/FaqsPage.tsx';
import { GalleryPage } from './pages/public/GalleryPage.tsx';
import { HomePage } from './pages/public/HomePage.tsx';
import { MaintenancePlansPage } from './pages/public/MaintenancePlansPage.tsx';
import { ProductsPage } from './pages/public/ProductsPage.tsx';
import { ProjectsPage } from './pages/public/ProjectsPage.tsx';
import { ReviewsPage } from './pages/public/ReviewsPage.tsx';
import { ServiceDetailPage, ServicesPage } from './pages/public/ServicesPage.tsx';
import { WhyChooseUsPage } from './pages/public/WhyChooseUsPage.tsx';
import { AdminLogin } from './pages/admin/AdminLogin.tsx';
import { AdminPanel } from './pages/admin/AdminPanel.tsx';
import type { AdminUser, PublicBootstrapData } from './types/index.ts';

export default function App() {
  const [currentPath, setCurrentPath] = useState<string>(() => window.location.pathname || '/');
  const [publicData, setPublicData] = useState<PublicBootstrapData | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);

  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);
  const [authChecked, setAuthChecked] = useState(false);

  const [bookingOpen, setBookingOpen] = useState(false);
  const [bookingDefaultService, setBookingDefaultService] = useState<string | undefined>(undefined);
  const [bookingDefaultNote, setBookingDefaultNote] = useState<string | undefined>(undefined);

  const refreshPublicData = useCallback(async () => {
    try {
      const data = await publicApi.getBootstrap();
      setPublicData(data);
      setLoadError(null);
    } catch (err) {
      setLoadError(err instanceof Error ? err.message : 'Unable to load website data.');
    }
  }, []);

  useEffect(() => {
    refreshPublicData();
  }, [refreshPublicData]);

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname || '/');
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  useEffect(() => {
    if (currentPath.startsWith('/admin') && !authChecked) {
      authApi
        .me()
        .then((res) => setAdminUser(res.user))
        .catch(() => setAdminUser(null))
        .finally(() => setAuthChecked(true));
    }
  }, [currentPath, authChecked]);

  function navigate(path: string) {
    if (path !== currentPath) {
      window.history.pushState({}, '', path);
      setCurrentPath(path);
      window.scrollTo({ top: 0, behavior: 'instant' });
    }
  }

  function openBooking(serviceName?: string, note?: string) {
    setBookingDefaultService(serviceName);
    setBookingDefaultNote(note);
    setBookingOpen(true);
  }

  // Protected Admin Route (/admin)
  if (currentPath.startsWith('/admin')) {
    if (!authChecked) {
      return (
        <>
          <SeoHead currentPath={currentPath} publicData={publicData} />
          <div className="min-h-screen bg-[#fbfbfd] flex items-center justify-center text-sm text-[#6e6e73]">
            Verifying administrator session...
          </div>
        </>
      );
    }
    if (!adminUser) {
      return (
        <>
          <SeoHead currentPath={currentPath} publicData={publicData} />
          <AdminLogin
            companyName={publicData?.settings.companyName || 'Mujahid Services'}
            onSuccess={(u) => setAdminUser(u)}
            onBackToSite={() => navigate('/')}
          />
        </>
      );
    }
    return (
      <>
        <SeoHead currentPath={currentPath} publicData={publicData} />
        <AdminPanel
          adminUser={adminUser}
          onUserUpdated={setAdminUser}
          onLogout={() => {
            setAdminUser(null);
            navigate('/admin');
          }}
          onBackToSite={() => navigate('/')}
          onPublicDataChanged={refreshPublicData}
        />
      </>
    );
  }

  // Public Website Loading / Error States
  if (loadError) {
    return (
      <>
        <SeoHead currentPath={currentPath} publicData={publicData} />
        <div className="min-h-screen bg-[#fbfbfd] flex flex-col items-center justify-center p-6 text-center">
          <div className="bg-[#f5f5f7] rounded-[32px] p-8 max-w-md border border-black/[0.06]">
            <h1 className="text-xl font-semibold text-[#1d1d1f]">Service Temporarily Unavailable</h1>
            <p className="text-sm text-[#6e6e73] mt-2">{loadError}</p>
            <button
              type="button"
              onClick={refreshPublicData}
              className="mt-5 px-6 py-2.5 text-xs font-medium text-white bg-[#0071e3] rounded-full hover:bg-[#0077ed] cursor-pointer"
            >
              Retry
            </button>
          </div>
        </div>
      </>
    );
  }

  if (!publicData) {
    return (
      <>
        <SeoHead currentPath={currentPath} publicData={publicData} />
        <div className="min-h-screen bg-[#fbfbfd] flex items-center justify-center p-6">
          <div className="bg-[#f5f5f7] rounded-full px-6 py-3 text-sm font-medium text-[#1d1d1f]">
            Loading Mujahid Services...
          </div>
        </div>
      </>
    );
  }

  const pageProps = {
    data: publicData,
    onNavigate: navigate,
    onOpenBooking: openBooking,
  };

  let content = <HomePage {...pageProps} />;
  if (currentPath === '/about') {
    content = <AboutPage {...pageProps} />;
  } else if (currentPath === '/services') {
    content = <ServicesPage {...pageProps} />;
  } else if (currentPath.startsWith('/services/')) {
    const slug = currentPath.replace('/services/', '').split('/')[0];
    content = <ServiceDetailPage {...pageProps} slug={slug} />;
  } else if (currentPath === '/products') {
    content = <ProductsPage {...pageProps} />;
  } else if (currentPath === '/projects') {
    content = <ProjectsPage {...pageProps} />;
  } else if (currentPath === '/blog') {
    content = <BlogPage {...pageProps} />;
  } else if (currentPath.startsWith('/blog/')) {
    const slug = currentPath.replace('/blog/', '').split('/')[0];
    content = <BlogDetailPage {...pageProps} slug={slug} />;
  } else if (currentPath === '/gallery') {
    content = <GalleryPage {...pageProps} />;
  } else if (currentPath === '/book') {
    content = <BookingPage {...pageProps} />;
  } else if (currentPath === '/why-choose-us') {
    content = <WhyChooseUsPage {...pageProps} />;
  } else if (currentPath === '/maintenance-plans') {
    content = <MaintenancePlansPage {...pageProps} />;
  } else if (currentPath === '/reviews') {
    content = <ReviewsPage {...pageProps} />;
  } else if (currentPath === '/faqs') {
    content = <FaqsPage {...pageProps} />;
  } else if (currentPath === '/contact') {
    content = <ContactPage {...pageProps} />;
  }

  return (
    <PublicLayout
      settings={publicData.settings}
      services={publicData.services}
      currentPath={currentPath}
      onNavigate={navigate}
      onOpenBooking={openBooking}
    >
      <SeoHead currentPath={currentPath} publicData={publicData} />
      {content}
      <BookingModal
        isOpen={bookingOpen}
        onClose={() => setBookingOpen(false)}
        services={publicData.services}
        settings={publicData.settings}
        defaultServiceName={bookingDefaultService}
        defaultNote={bookingDefaultNote}
      />
    </PublicLayout>
  );
}
