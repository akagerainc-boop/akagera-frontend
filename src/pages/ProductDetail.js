import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Download, ExternalLink, Check, FileText, ArrowLeft } from 'lucide-react';
import Seo from '../components/Seo';
import SmartImage from '../components/SmartImage';
import { PageLoader } from '../components/Loader';
import { PlatformBadge, StatusBadge, priceLabel, EmptyState } from '../components/ui';
import { productAPI } from '../api';

export default function ProductDetail() {
  const { slug } = useParams();
  const [p, setP] = useState(null);
  const [err, setErr] = useState(false);

  useEffect(() => {
    setP(null); setErr(false);
    productAPI.get(slug).then((r) => setP(r.data)).catch(() => setErr(true));
  }, [slug]);

  if (err) return <div className="container section"><EmptyState title="Product not found" action={<Link className="btn btn--primary" to="/products">All products</Link>} /></div>;
  if (!p) return <PageLoader />;

  const shots = p.screenshots || [];

  return (
    <>
      <Seo title={p.name} description={p.short_description} image={p.app_image}
        jsonLd={{ '@context': 'https://schema.org', '@type': 'SoftwareApplication', name: p.name,
          applicationCategory: p.category, operatingSystem: (p.platforms || []).join(', '),
          offers: { '@type': 'Offer', price: p.price || 0, priceCurrency: 'USD' } }} />

      <section className="hero" style={{ minHeight: 'auto' }}>
        <div className="hero__bg"><SmartImage src={p.app_image || p.app_logo} alt="" eager /></div>
        <div className="hero__scrim" />
        <div className="container">
          <div className="hero__inner" style={{ paddingTop: 90, paddingBottom: 70 }}>
            <Link to="/products" className="row" style={{ color: 'rgba(255,255,255,.8)', fontSize: '.85rem', marginBottom: 14 }}><ArrowLeft size={14} /> Products</Link>
            <div className="chip-row mb-2">
              {p.category && <span className="badge">{p.category}</span>}
              {p.version && <span className="pill" style={{ color: '#fff', borderColor: 'rgba(255,255,255,.3)' }}>v{p.version}</span>}
              <StatusBadge status={p.status} />
            </div>
            <h1>{p.name}</h1>
            <p className="lead mt-2" style={{ color: 'rgba(255,255,255,.85)' }}>{p.short_description || p.description}</p>
            <div className="chip-row mt-3">{(p.platforms || []).map((pl) => <PlatformBadge key={pl} platform={pl} />)}</div>
            <div className="row mt-4">
              {(p.downloads?.length > 0) && <Link to={`/downloads/${p.slug}`} className="btn btn--primary btn--lg"><Download size={18} /> Download</Link>}
              {p.website_url && <a href={p.website_url} target="_blank" rel="noopener noreferrer" className="btn btn--outline-light btn--lg">Visit site <ExternalLink size={16} /></a>}
              {p.documentation_url && <a href={p.documentation_url} target="_blank" rel="noopener noreferrer" className="btn btn--outline-light btn--lg"><FileText size={16} /> Docs</a>}
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container grid grid-2" style={{ alignItems: 'start' }}>
          <div>
            <h2>Overview</h2>
            <p className="mt-2" style={{ whiteSpace: 'pre-line' }}>{p.description}</p>

            {p.features?.length > 0 && (
              <>
                <h3 className="mt-4">Features</h3>
                <ul className="stack mt-2" style={{ listStyle: 'none', padding: 0, gap: 10 }}>
                  {p.features.map((f, i) => (
                    <li key={i} className="row" style={{ gap: 8, alignItems: 'flex-start' }}>
                      <Check size={16} style={{ color: 'var(--brand)', marginTop: 3, flexShrink: 0 }} /> {f}
                    </li>
                  ))}
                </ul>
              </>
            )}

            {shots.length > 0 && (
              <>
                <h3 className="mt-4">Screenshots</h3>
                <div className="grid grid-2 mt-2">
                  {shots.map((s, i) => <SmartImage key={i} src={s} alt={`${p.name} screenshot ${i + 1}`} ratio="16 / 10" className="card--flush" style={{ borderRadius: 12 }} />)}
                </div>
              </>
            )}
          </div>

          <aside className="card card--pad-lg" style={{ position: 'sticky', top: 88 }}>
            <div className="muted" style={{ fontSize: '.8rem', textTransform: 'uppercase', letterSpacing: '.06em' }}>Pricing</div>
            <div style={{ fontSize: '2rem', fontWeight: 800 }}>
              {p.pricing_model === 'subscription' ? `${priceLabel(p.price)}/mo` : priceLabel(p.price)}
            </div>
            <div className="muted" style={{ fontSize: '.85rem' }}>{p.pricing_model === 'free' ? 'Free download' : p.requires_license ? 'License required' : 'One-time'}</div>
            <div className="divider" />
            <div className="stack" style={{ gap: 8, fontSize: '.88rem' }}>
              {p.version && <div className="between"><span className="muted">Version</span><b>{p.version}</b></div>}
              {p.release_date && <div className="between"><span className="muted">Released</span><b>{new Date(p.release_date).toLocaleDateString()}</b></div>}
              <div className="between"><span className="muted">Platforms</span><b>{(p.platforms || []).join(', ') || '—'}</b></div>
            </div>
            <div className="stack mt-3">
              {p.downloads?.length > 0 && <Link to={`/downloads/${p.slug}`} className="btn btn--primary btn--block"><Download size={16} /> Get it</Link>}
              <Link to="/contact?intent=sales" className="btn btn--secondary btn--block">Talk to sales</Link>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}
