import React, { useEffect, useState } from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import { DownloadCloud, Smartphone, Monitor, Command, Globe } from 'lucide-react';
import Seo from '../components/Seo';
import { PageLoader } from '../components/Loader';
import { DownloadCard } from '../components/cards';
import { SectionHead, EmptyState, Breadcrumbs } from '../components/ui';
import { downloadAPI } from '../api';

const PLATS = [
  { key: '', label: 'All', icon: DownloadCloud },
  { key: 'android', label: 'Android', icon: Smartphone },
  { key: 'ios', label: 'iOS', icon: Smartphone },
  { key: 'windows', label: 'Windows', icon: Monitor },
  { key: 'macos', label: 'macOS', icon: Command },
  { key: 'web', label: 'Web', icon: Globe },
];

function detectOS() {
  const ua = navigator.userAgent || '';
  if (/Android/i.test(ua)) return 'android';
  if (/iPhone|iPad|iPod/i.test(ua)) return 'ios';
  if (/Macintosh/i.test(ua)) return 'macos';
  if (/Windows/i.test(ua)) return 'windows';
  return '';
}

export default function Downloads() {
  const { slug } = useParams();
  const [params, setParams] = useSearchParams();
  const platform = params.get('platform') || '';
  const [items, setItems] = useState(null);
  const [product, setProduct] = useState(null);
  const suggested = detectOS();

  useEffect(() => {
    setItems(null);
    if (slug) {
      downloadAPI.forProduct(slug).then((r) => { setProduct(r.data.product); setItems(r.data.downloads); }).catch(() => setItems([]));
    } else {
      downloadAPI.list(platform || undefined).then((r) => setItems(r.data)).catch(() => setItems([]));
    }
  }, [slug, platform]);

  return (
    <>
      <Seo title="Downloads" description="Download Akagera Inc apps for Android, iOS, Windows, and macOS." />
      <section className="section section--dark section--tight">
        <div className="container">
          <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'Downloads' }]} />
          <SectionHead eyebrow="Download center" title={product ? `Download ${product.name}` : 'Software releases'}>
            {suggested && !slug ? `We detected ${PLATS.find((p) => p.key === suggested)?.label} — showing everything, your platform first.` : 'Choose your platform to get the latest release.'}
          </SectionHead>
          {!slug && (
            <div className="chip-row">
              {PLATS.map(({ key, label, icon: Icon }) => (
                <button key={key} className={`pill ${platform === key ? '' : 'pill--on-dark'}`} style={platform === key ? { background: 'var(--brand)', color: '#fff', borderColor: 'var(--brand)' } : undefined}
                  onClick={() => { const n = new URLSearchParams(params); key ? n.set('platform', key) : n.delete('platform'); setParams(n); }}>
                  <Icon size={14} /> {label}
                </button>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="section">
        <div className="container">
          {!items ? <PageLoader /> : items.length === 0 ? (
            <EmptyState icon={<DownloadCloud size={26} />} title="No downloads available yet"
              action={<Link to="/products" className="btn btn--primary">Browse products</Link>}>
              Releases are published by our team. Check back soon or contact us for early access.
            </EmptyState>
          ) : (
            <div className="grid grid-3">
              {[...items].sort((a, b) => (b.platform === suggested) - (a.platform === suggested)).map((d) => (
                <DownloadCard key={d.id} item={d} />
              ))}
            </div>
          )}
          {slug && product && (
            <div className="mt-4"><Link to={`/products/${product.slug}`} className="btn btn--secondary">← Back to {product.name}</Link></div>
          )}
        </div>
      </section>
    </>
  );
}
