import { useEffect } from 'react';

/**
 * Hook to dynamically update SEO meta tags and page titles per route
 * Aligned with Google Search Console & Bing Webmaster best practices
 */
export function usePageSEO({ 
  title, 
  description, 
  path = '', 
  ogType = 'website',
  keywords 
}) {
  useEffect(() => {
    if (typeof document === 'undefined') return;

    // 1. Dynamic Title
    const brand = 'EduGen Panamá';
    const fullTitle = title 
      ? (title.includes(brand) ? title : `${title} | ${brand}`)
      : 'EduGen Panamá | Generador de Planificaciones Didácticas MEDUCA con IA';
    document.title = fullTitle;

    // 2. Canonical & Full URL (Auto-syncs with actual hosting domain like vercel.app or custom domain)
    const baseDomain = (typeof window !== 'undefined' && window.location.origin && !window.location.origin.includes('localhost'))
      ? window.location.origin 
      : 'https://edugen-panama-pro.vercel.app';
    const cleanPath = path ? (path.startsWith('/') ? path : `/${path}`) : '';
    const fullUrl = `${baseDomain}${cleanPath}`;

    // Helper to create or update meta tags
    const updateMeta = (attrName, attrVal, content) => {
      if (!content) return;
      let el = document.querySelector(`meta[${attrName}="${attrVal}"]`);
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute(attrName, attrVal);
        document.head.appendChild(el);
      }
      el.setAttribute('content', content);
    };

    // 3. Descriptions
    if (description) {
      updateMeta('name', 'description', description);
      updateMeta('property', 'og:description', description);
      updateMeta('name', 'twitter:description', description);
    }

    // 4. OpenGraph & Twitter Cards
    updateMeta('property', 'og:title', fullTitle);
    updateMeta('name', 'twitter:title', fullTitle);
    updateMeta('property', 'og:url', fullUrl);
    updateMeta('property', 'og:type', ogType);

    // 5. Optional Keywords
    if (keywords) {
      updateMeta('name', 'keywords', keywords);
    }

    // 6. Canonical Link
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', fullUrl);

  }, [title, description, path, ogType, keywords]);
}

