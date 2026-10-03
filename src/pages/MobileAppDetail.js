import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Download, ArrowLeft, ChevronLeft, ChevronRight, ShieldCheck, Smartphone, Info } from 'lucide-react';
import Seo from '../components/Seo';
import SmartImage from '../components/SmartImage';
import { PageLoader } from '../components/Loader';
import { EmptyState, Modal } from '../components/ui';
import { mobileAppAPI, mediaUrl } from '../api';
import { AppIcon } from '../components/AppCard';

const isIOS = () => /iPhone|iPad|iPod/i.test(navigator.userAgent || '');

export default function MobileAppDetail() {
  const { slug } = useParams();
  const [app, setApp] = useState(null);
  const [err, setErr] = useState(false);
  const [shot, setShot] = useState(null); // index of the screenshot open in the lightbox

  useEffect(() => {
    setApp(null); setErr(false);
    mobileAppAPI.get(slug).then((r) => setApp(r.data)).catch(() => setErr(true));
  }, [slug]);

  if (err) return <div className="container section"><EmptyState title="App not found" action={<Link className="btn btn--primary" to="/mobile-apps">All mobile apps</Link>} /></div>;
  if (!app) return <PageLoader />;

  const shots = app.screenshots || [];
  const dl = app.download_url ? mobileAppAPI.downloadUrl(app.slug) : null;
  const facts = [
    ['Version', app.version],
    ['Size', app.apk_size_label],
    ['Requires', app.min_android],
    ['Category', app.category],
    ['Updated', app.updated_at && new Date(app.updated_at).toLocaleDateString()],
    ['Downloads', app.download_count ? app.download_count.toLocaleString() : null],
  ].filter(([, v]) => v);

  return (
    <>
      <Seo title={app.name} description={app.tagline || app.description?.slice(0, 160)} image={app.icon}
        jsonLd={{ '@context': 'https://schema.org', '@type': 'MobileApplication', name: app.name,
          operatingSystem: 'Android', applicationCategory: app.category || 'Application',
          softwareVersion: app.version, offers: { '@type': 'Offer', price: 0, priceCurrency: 'USD' } }} />

      <section className="section section--dark section--tight">
        <div className="container">
          <Link to="/mobile-apps" className="row" style={{ color: 'rgba(255,255,255,.8)', fontSize: '.85rem', marginBottom: 18 }}>
            <ArrowLeft size={14} /> Mobile Apps
          </Link>
          <div className="app-hero">
            <AppIcon app={app} size={104} />
            <div style={{ minWidth: 0 }}>
              <h1 style={{ fontSize: 'clamp(1.7rem, 4vw, 2.5rem)' }}>{app.name}</h1>
              {app.tagline && <p className="mt-1">{app.tagline}</p>}
              <div className="chip-row mt-2">
                <span className="pill pill--on-dark"><Smartphone size={13} /> Android</span>
                {app.version && <span className="pill pill--on-dark">v{app.version}</span>}
                {app.apk_size_label && <span className="pill pill--on-dark">{app.apk_size_label}</span>}
              </div>
              <div className="row mt-3">
                {dl
                  ? <a href={dl} className="btn btn--primary btn--lg" rel="nofollow"><Download size={18} /> Download APK</a>
                  : <span className="muted">Download coming soon</span>}
              </div>
              {isIOS() && <p className="mt-2" style={{ fontSize: '.85rem' }}>This app is for Android devices. APK files can't be installed on iPhone or iPad.</p>}
            </div>
          </div>
        </div>
      </section>

      {shots.length > 0 && (
        <section className="section section--tight section--soft">
          <div className="container">
            <h2 style={{ fontSize: '1.3rem' }}>Screenshots</h2>
            <div className="shots-strip mt-2">
              {shots.map((s, i) => (
                <button key={i} type="button" className="shots-strip__item" onClick={() => setShot(i)} aria-label={`Open screenshot ${i + 1}`}>
                  <SmartImage src={s} alt={`${app.name} screenshot ${i + 1}`} ratio="9 / 19" />
                </button>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="section">
        <div className="container grid grid-2" style={{ alignItems: 'start' }}>
          <div>
            <h2>About this app</h2>
            <p className="mt-2" style={{ whiteSpace: 'pre-line' }}>{app.description || app.tagline}</p>
            {app.whats_new && (
              <>
                <h3 className="mt-4">What's new</h3>
                <p className="mt-1" style={{ whiteSpace: 'pre-line' }}>{app.whats_new}</p>
              </>
            )}
            <h3 className="mt-4">How to install</h3>
            <ol className="install-steps mt-2">
              <li>Tap <b>Download APK</b> on your Android phone. If your browser warns about the file type, choose <b>Download anyway</b>.</li>
              <li>Open the downloaded file from your notifications or the <b>Downloads</b> folder.</li>
              <li>If asked, allow your browser or file manager to <b>Install unknown apps</b> (Settings → Apps → Special access).</li>
              <li>Tap <b>Install</b>, then <b>Open</b>.</li>
            </ol>
          </div>

          <aside className="card card--pad-lg" style={{ position: 'sticky', top: 88 }}>
            <div className="stack" style={{ gap: 10, fontSize: '.9rem' }}>
              {facts.map(([k, v]) => <div key={k} className="between"><span className="muted">{k}</span><b>{v}</b></div>)}
            </div>
            {dl && <a href={dl} className="btn btn--primary btn--block mt-3" rel="nofollow"><Download size={16} /> Download APK</a>}
            <div className="row mt-3 muted" style={{ fontSize: '.8rem', alignItems: 'flex-start', flexWrap: 'nowrap' }}>
              <ShieldCheck size={16} style={{ flexShrink: 0 }} /> Published by Akagera Inc. Only install APKs downloaded from this site.
            </div>
            <Link to="/support" className="row mt-2" style={{ fontSize: '.85rem' }}><Info size={14} /> Need help installing?</Link>
          </aside>
        </div>
      </section>

      {dl && (
        <div className="dl-bar">
          <AppIcon app={app} size={40} />
          <div style={{ minWidth: 0, flex: 1 }}>
            <b className="dl-bar__name">{app.name}</b>
            <span className="dl-bar__meta">{[app.version && `v${app.version}`, app.apk_size_label].filter(Boolean).join(' · ')}</span>
          </div>
          <a href={dl} className="btn btn--primary" rel="nofollow"><Download size={16} /> Download</a>
        </div>
      )}

      <Modal open={shot !== null} onClose={() => setShot(null)} title={`${app.name} · ${shot !== null ? shot + 1 : ''} / ${shots.length}`}>
        {shot !== null && (
          <div className="lightbox">
            <img src={mediaUrl(shots[shot])} alt={`${app.name} screenshot ${shot + 1}`} />
            {shots.length > 1 && (
              <div className="between mt-2">
                <button className="btn btn--secondary btn--sm" onClick={() => setShot((shot - 1 + shots.length) % shots.length)}><ChevronLeft size={16} /> Prev</button>
                <button className="btn btn--secondary btn--sm" onClick={() => setShot((shot + 1) % shots.length)}>Next <ChevronRight size={16} /></button>
              </div>
            )}
          </div>
        )}
      </Modal>
    </>
  );
}
