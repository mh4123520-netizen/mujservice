import { useEffect } from 'react';
import type { PublicBootstrapData } from '../types/index.ts';

interface SeoHeadProps {
  currentPath: string;
  publicData: PublicBootstrapData | null;
}

function upsertMeta(attr: 'name' | 'property', key: string, content: string) {
  let el = document.querySelector(`meta[${attr}="${key}"]`) as HTMLMetaElement | null;
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

function upsertLink(rel: string, href: string) {
  let el = document.querySelector(`link[rel="${rel}"]`) as HTMLLinkElement | null;
  if (!el) {
    el = document.createElement('link');
    el.setAttribute('rel', rel);
    document.head.appendChild(el);
  }
  el.setAttribute('href', href);
}

function upsertJsonLd(id: string, payload: unknown) {
  let script = document.getElementById(id) as HTMLScriptElement | null;
  if (!script) {
    script = document.createElement('script');
    script.id = id;
    script.type = 'application/ld+json';
    document.head.appendChild(script);
  }
  script.textContent = JSON.stringify(payload);
}

export function SeoHead({ currentPath, publicData }: SeoHeadProps) {
  useEffect(() => {
    const company = publicData?.settings.companyName || 'Mujahid Services';
    const phone = publicData?.settings.phone || '03041241947';
    const origin = window.location.origin;
    const cleanPath = currentPath.split('?')[0] || '/';
    const canonicalUrl = `${origin}${cleanPath}`;
    const defaultImage = `${origin}${publicData?.settings.heroBannerImage || '/src/assets/images/hero_hvac_chiller_1794822110796.jpg'}`;

    const isAdmin = cleanPath.startsWith('/admin');

    let title = `${company} — AC Repair & HVACR | Khanewal & Multan`;
    let description = `Book certified AC repair, inverter installation, fridge repair, and commercial cold-room maintenance across Khanewal & Multan. Call ${phone}.`;
    let ogImage = defaultImage;
    let robots = 'index, follow, max-image-preview:large';

    if (isAdmin) {
      title = `${company} — Admin Operations Portal`;
      description = 'Protected administrator operations dashboard for Mujahid Services.';
      robots = 'noindex, nofollow';
    } else if (cleanPath === '/services') {
      title = `HVACR Services — AC & Fridge Repair | ${company}`;
      description = `Explore AC repair, inverter installation, fridge repair, HVAC AMC maintenance, and commercial refrigeration in Khanewal & Multan.`;
    } else if (cleanPath.startsWith('/services/') && publicData) {
      const slug = cleanPath.replace('/services/', '').split('/')[0];
      const svc = publicData.services.find((s) => s.slug === slug);
      if (svc) {
        title = `${svc.title} in Khanewal & Multan | ${company}`;
        description = `${svc.shortDescription} Dispatch window: ${svc.responseWindow}. Call ${phone}.`.slice(0, 160);
        ogImage = svc.imageUrl.startsWith('http') ? svc.imageUrl : `${origin}${svc.imageUrl}`;
      }
    } else if (cleanPath === '/products') {
      title = `HVACR Units, Inverters & Chillers | ${company}`;
      description = `Browse OEM-certified T3 inverter ACs, copper piping kits, commercial chillers, and HVAC spare hardware in Khanewal & Multan.`;
    } else if (cleanPath === '/projects') {
      title = `HVACR Case Studies & Projects | ${company}`;
      description = `Completed commercial VRF, cold-storage room, and residential HVAC installations across Multan and Khanewal.`;
    } else if (cleanPath === '/maintenance-plans') {
      title = `AC & HVAC Maintenance Packages | ${company}`;
      description = `Seasonal residential and commercial HVACR preventive maintenance plans with priority dispatch in Khanewal and Multan.`;
    } else if (cleanPath === '/gallery') {
      title = `Field Work & Installation Gallery | ${company}`;
      description = `Inspect verified AC installations, nitrogen pressure tests, inverter PCB repairs, and cold-room setups across Multan & Khanewal.`;
    } else if (cleanPath === '/blog') {
      title = `HVACR Technical Blog & Guides | ${company}`;
      description = `Read practical AC efficiency guides, inverter troubleshooting, and commercial refrigeration tips for Southern Punjab.`;
    } else if (cleanPath.startsWith('/blog/') && publicData) {
      const slug = cleanPath.replace('/blog/', '').split('/')[0];
      const post = publicData.blogPosts.find((p) => p.slug === slug);
      if (post) {
        title = `${post.title} | ${company}`;
        description = post.excerpt.slice(0, 160);
        ogImage = post.imageUrl.startsWith('http') ? post.imageUrl : `${origin}${post.imageUrl}`;
      }
    } else if (cleanPath === '/about') {
      title = `About ${company} — Khanewal & Multan HVACR`;
      description = `Learn about ${company}, our calibrated HVACR workshops, certified field engineers, and 40+ covered colonies in Khanewal & Multan.`;
    } else if (cleanPath === '/why-choose-us') {
      title = `Why Choose ${company} — 500-Micron Standard`;
      description = `Digital manifold calibration, nitrogen brazing, genuine OEM spares, and 90-day workmanship warranty across Multan & Khanewal.`;
    } else if (cleanPath === '/reviews') {
      title = `Verified Customer Reviews | ${company}`;
      description = `Read verified reviews from homeowners, clinics, and cold-storage operators in Multan and Khanewal.`;
    } else if (cleanPath === '/faqs') {
      title = `HVACR Frequently Asked Questions | ${company}`;
      description = `Answers on AC installation, refrigerant charging, inverter PCB repair, commercial cold rooms, and dispatch times.`;
    } else if (cleanPath === '/contact') {
      title = `Contact & Dispatch Desk — ${phone} | ${company}`;
      description = `Contact ${company} in Khanewal and Multan for urgent AC repair, AMC contracts, or commercial refrigeration quotes.`;
    } else if (cleanPath === '/book') {
      title = `Book AC & HVACR Technician Online | ${company}`;
      description = `Schedule a certified HVACR technician in under 90 minutes across 40+ localities of Khanewal and Multan.`;
    }

    document.title = title;
    upsertMeta('name', 'description', description);
    upsertMeta('name', 'robots', robots);
    upsertLink('canonical', canonicalUrl);

    upsertMeta('property', 'og:title', title);
    upsertMeta('property', 'og:description', description);
    upsertMeta('property', 'og:url', canonicalUrl);
    upsertMeta('property', 'og:image', ogImage);
    upsertMeta('property', 'og:site_name', company);

    upsertMeta('name', 'twitter:title', title);
    upsertMeta('name', 'twitter:description', description);
    upsertMeta('name', 'twitter:image', ogImage);

    if (isAdmin || !publicData) return;

    const avgRating =
      publicData.testimonials.length > 0
        ? (
            publicData.testimonials.reduce((acc, r) => acc + Number(r.rating || 5), 0) /
            publicData.testimonials.length
          ).toFixed(1)
        : '4.9';

    const localBusinessSchema: Record<string, unknown> = {
      '@context': 'https://schema.org',
      '@type': 'HVACBusiness',
      name: company,
      url: origin,
      image: defaultImage,
      telephone: phone,
      email: publicData.settings.email,
      address: {
        '@type': 'PostalAddress',
        streetAddress: publicData.settings.address,
        addressLocality: 'Multan & Khanewal',
        addressRegion: 'Punjab',
        addressCountry: 'PK',
      },
      areaServed: publicData.settings.serviceAreas.map((area) => ({
        '@type': 'Place',
        name: area,
      })),
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: avgRating,
        reviewCount: Math.max(1, publicData.testimonials.length),
      },
      hasOfferCatalog: {
        '@type': 'OfferCatalog',
        name: 'HVACR Engineering Services',
        itemListElement: publicData.services.map((svc) => ({
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: svc.title,
            description: svc.shortDescription,
            url: `${origin}/services/${svc.slug}`,
          },
        })),
      },
    };

    upsertJsonLd('ms-dynamic-ldjson', localBusinessSchema);

    if (cleanPath === '/faqs' && publicData.faqs.length > 0) {
      upsertJsonLd('ms-page-ldjson', {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: publicData.faqs.map((f) => ({
          '@type': 'Question',
          name: f.question,
          acceptedAnswer: {
            '@type': 'Answer',
            text: f.answer,
          },
        })),
      });
    } else if (cleanPath.startsWith('/blog/')) {
      const slug = cleanPath.replace('/blog/', '').split('/')[0];
      const post = publicData.blogPosts.find((p) => p.slug === slug);
      if (post) {
        upsertJsonLd('ms-page-ldjson', {
          '@context': 'https://schema.org',
          '@type': 'Article',
          headline: post.title,
          description: post.excerpt,
          datePublished: post.publishedAt,
          author: { '@type': 'Person', name: post.author },
          publisher: { '@type': 'Organization', name: company },
          image: ogImage,
          mainEntityOfPage: canonicalUrl,
        });
      }
    } else if (cleanPath !== '/') {
      upsertJsonLd('ms-page-ldjson', {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: origin },
          { '@type': 'ListItem', position: 2, name: title.split('|')[0].trim(), item: canonicalUrl },
        ],
      });
    } else {
      const extra = document.getElementById('ms-page-ldjson');
      if (extra) extra.remove();
    }
  }, [currentPath, publicData]);

  return null;
}
