import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Smartphone, Download, Search, ArrowRight } from 'lucide-react';
import Seo from '../components/Seo';
import SmartImage from '../components/SmartImage';
import { PageLoader } from '../components/Loader';
import { SectionHead, EmptyState, Breadcrumbs } from '../components/ui';
import { mobileAppAPI } from '../api';

export function AppIcon({ app, size = 64 }) {
  return (
    <SmartImage src={app.icon} alt={app.name} className="app-icon"
      style={{ width: size, height: size, borderRadius: size * 0.22, flexShrink: 0 }} />
  );
}

function MobileAppCard({ app }) {
  return (
    <article className="card card--hover app-card">
      <Link to={`/mobile-apps/${app.slug}`} className="app-card__head">
        <AppIcon app={app} />
        <div style={{ minWidth: 0 }}>
          <h3 className="app-card__name">{app.name}</h3>
          <div className="muted" style={{ fontSize: '.82rem' }}>
            {[app.category, app.version && `v${app.version}`, app.apk_size_label].filter(Boolean).join(' · ')}
          </div>
        </div>
      </Link>
      {app.tagline && <p className="mt-2" style={{ fontSize: '.92rem' }}>{app.tagline}</p>}
      {app.screenshots?.length > 0 && (
        <Link to={`/mobile-apps/${app.slug}`} className="app-card__shots" aria-label={`${app.name} screenshots`}>
          {app.screenshots.slice(0, 3).map((s, i) => <SmartImage key={i} src={s} alt="" ratio="9 / 16" />)}
        </Link>
      )}
      <div className="between mt-3">
        <Link to={`/mobile-apps/${app.slug}`} className="btn btn--ghost btn--sm" style={{ paddingLeft: 0 }}>
          Details <ArrowRight size={15} />
        </Link>
        <a href={mobileAppAPI.downloadUrl(app.slug)} className="btn btn--primary btn--sm" rel="nofollow">
          <Download size={15} /> Download APK
        </a>
      </div>
    </article>
  );
}

export default function MobileApps() {
  const [apps, setApps] = useState(null);
  const [q, setQ] = useState('');

  useEffect(() => {
    mobileAppAPI.list().then((r) => setApps(r.data || [])).catch(() => setApps([]));
  }, []);

  const shown = useMemo(() => {
    if (!apps) return null;
    const term = q.trim().toLowerCase();
    if (!term) return apps;
    return apps.filter((a) => [a.name, a.tagline, a.category].some((v) => (v || '').toLowerCase().includes(term)));
  }, [apps, q]);

  return (
    <>
      <Seo title="Mobile Apps" description="Download Akagera Inc Android apps directly as APK files." />
      <section className="section section--dark section--tight">
        <div className="container">
          <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'Mobile Apps' }]} />
          <SectionHead eyebrow="Android apps" title="Mobile Apps">
            Browse our Android apps, see screenshots and details, and download the APK straight to your phone.
          </SectionHead>
          {apps?.length > 3 && (
            <div className="app-search">
              <Search size={16} />
              <input type="search" placeholder="Search apps" value={q} onChange={(e) => setQ(e.target.value)} aria-label="Search apps" />
            </div>
          )}
        </div>
      </section>

      <section className="section">
        <div className="container">
          {!shown ? <PageLoader /> : shown.length === 0 ? (
            <EmptyState icon={<Smartphone size={26} />} title={q ? 'No apps match your search' : 'No apps published yet'}>
              {q ? 'Try a different name.' : 'Our team will publish apps here soon. Check back later.'}
            </EmptyState>
          ) : (
            <div className="grid grid-3">
              {shown.map((a) => <MobileAppCard key={a.id} app={a} />)}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
