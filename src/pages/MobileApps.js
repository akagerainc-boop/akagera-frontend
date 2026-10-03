import React, { useEffect, useMemo, useState } from 'react';
import { Smartphone, Search, Download, ShieldCheck } from 'lucide-react';
import Seo from '../components/Seo';
import { MobileAppCard } from '../components/AppCard';
import { PageLoader } from '../components/Loader';
import { SectionHead, EmptyState, Breadcrumbs } from '../components/ui';
import { mobileAppAPI } from '../api';

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
          <SectionHead eyebrow="Android apps" title="Our Apps">
            Free Android apps by Akagera Inc. See screenshots and details, then download the APK straight to your phone.
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

      {shown?.length > 0 && (
        <section className="section section--tight section--soft">
          <div className="container">
            <SectionHead eyebrow="Easy install" title="How to install an APK" />
            <ol className="steps">
              <li><span className="steps__n"><Download size={18} /></span><div><b>Download</b><p>Tap <b>Download APK</b> on your Android phone. If your browser warns, choose <b>Download anyway</b>.</p></div></li>
              <li><span className="steps__n"><Search size={18} /></span><div><b>Open the file</b><p>Find it in your notifications or the Downloads folder.</p></div></li>
              <li><span className="steps__n"><ShieldCheck size={18} /></span><div><b>Install</b><p>Allow <b>Install unknown apps</b> if asked (Settings → Apps → Special access), then tap Install.</p></div></li>
            </ol>
          </div>
        </section>
      )}
    </>
  );
}
