import { useEffect, useMemo } from 'react';
import { useSite } from './SiteContext';

function upsertMeta(attr, key, content) {
  if (!content) return;
  let el = document.head.querySelector(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

function upsertLink(rel, href) {
  if (!href) return;
  let el = document.head.querySelector(`link[rel="${rel}"]`);
  if (!el) {
    el = document.createElement('link');
    el.setAttribute('rel', rel);
    document.head.appendChild(el);
  }
  el.setAttribute('href', href);
}

export default function Seo({ title, description, image, path, type = 'website', jsonLd }) {
  const { settings } = useSite();
  const d = useMemo(() => settings?.seo_defaults || {}, [settings]);
  useEffect(() => {
    const fullTitle = title ? `${title} · Akagera Inc` : (d.title || 'Akagera Inc — Software Solutions');
    const desc = description || d.description;
    const url = (d.site_url || window.location.origin) + (path || window.location.pathname);
    document.title = fullTitle;
    upsertMeta('name', 'description', desc);
    upsertMeta('property', 'og:title', fullTitle);
    upsertMeta('property', 'og:description', desc);
    upsertMeta('property', 'og:type', type);
    upsertMeta('property', 'og:url', url);
    upsertMeta('property', 'og:image', image || d.og_image);
    upsertMeta('name', 'twitter:card', 'summary_large_image');
    upsertMeta('name', 'twitter:title', fullTitle);
    upsertMeta('name', 'twitter:description', desc);
    upsertLink('canonical', url);

    let script = document.getElementById('seo-jsonld');
    const data = jsonLd || {
      '@context': 'https://schema.org', '@type': 'Organization', name: 'Akagera Inc',
      url: d.site_url, logo: (d.site_url || '') + (settings?.brand?.logo || '/assets/inc.png'),
    };
    if (!script) {
      script = document.createElement('script');
      script.id = 'seo-jsonld';
      script.type = 'application/ld+json';
      document.head.appendChild(script);
    }
    script.textContent = JSON.stringify(data);
  }, [title, description, image, path, type, jsonLd, d, settings]);

  return null;
}
