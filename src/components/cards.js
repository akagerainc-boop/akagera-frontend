import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Download, Check, Star } from 'lucide-react';
import SmartImage from './SmartImage';
import { PlatformBadge, priceLabel } from './ui';

export function ProductCard({ product }) {
  const p = product;
  return (
    <article className="card card--hover card--flush">
      <Link to={`/products/${p.slug}`} className="card-media">
        <SmartImage src={p.app_image || p.app_logo || p.app_icon} alt={p.name} ratio="16 / 10" />
      </Link>
      <div style={{ padding: 22 }}>
        <div className="row mb-1" style={{ gap: 8 }}>
          {p.category && <span className="badge badge--neutral">{p.category}</span>}
          {p.version && <span className="pill">v{p.version}</span>}
        </div>
        <h3 style={{ fontSize: '1.2rem' }}><Link to={`/products/${p.slug}`} style={{ color: 'var(--ink)' }}>{p.name}</Link></h3>
        <p className="mt-1" style={{ fontSize: '.94rem', minHeight: 42 }}>{p.short_description || p.description}</p>
        <div className="chip-row mt-2">
          {(p.platforms || []).slice(0, 4).map((pl) => <PlatformBadge key={pl} platform={pl} />)}
        </div>
        <div className="between mt-3">
          <Link to={`/products/${p.slug}`} className="btn btn--ghost btn--sm" style={{ paddingLeft: 0 }}>
            Learn more <ArrowRight size={15} />
          </Link>
          {(p.downloads?.length > 0 || p.download_url) && (
            <Link to={`/downloads/${p.slug}`} className="btn btn--primary btn--sm"><Download size={15} /> Download</Link>
          )}
        </div>
      </div>
    </article>
  );
}

export function ServiceCard({ service: s }) {
  return (
    <article className="card card--hover">
      <div className="row mb-2" style={{ justifyContent: 'space-between' }}>
        {s.category && <span className="badge">{s.category}</span>}
        {s.popular && <span className="badge badge--ink"><Star size={12} /> Popular</span>}
      </div>
      <h3 style={{ fontSize: '1.2rem' }}><Link to={`/services/${s.slug}`} style={{ color: 'var(--ink)' }}>{s.name}</Link></h3>
      <p className="mt-1" style={{ fontSize: '.94rem', minHeight: 44 }}>{s.short_description || s.description}</p>
      <div className="divider" style={{ margin: '18px 0' }} />
      <div className="between">
        <div>
          <strong className="price-accent" style={{ fontSize: '1.5rem' }}>{priceLabel(s.price, s.currency)}</strong>
          <div className="muted" style={{ fontSize: '.82rem' }}>{s.duration_label}</div>
        </div>
        <Link to={`/services/${s.slug}`} className="btn btn--primary btn--sm">View <ArrowRight size={15} /></Link>
      </div>
    </article>
  );
}

export function PricingCard({ plan }) {
  const features = Array.isArray(plan.features) ? plan.features : [];
  return (
    <article className={`card ${plan.popular ? 'card--pad-lg' : ''}`} style={plan.popular ? { borderColor: 'var(--brand)', borderWidth: 2 } : {}}>
      {plan.popular && <span className="badge mb-2"><Star size={12} /> Most popular</span>}
      <h3>{plan.name}</h3>
      {plan.description && <p className="mt-1" style={{ fontSize: '.9rem' }}>{plan.description}</p>}
      <div className="mt-2" style={{ fontSize: '2rem', fontWeight: 800 }}>{plan.price}</div>
      {plan.duration && <div className="muted" style={{ fontSize: '.85rem' }}>{plan.duration}</div>}
      <ul className="stack mt-3" style={{ gap: 10, listStyle: 'none', padding: 0 }}>
        {features.map((f, i) => (
          <li key={i} className="row" style={{ gap: 8, alignItems: 'flex-start' }}>
            <Check size={16} style={{ color: 'var(--brand)', flexShrink: 0, marginTop: 3 }} /> <span style={{ fontSize: '.92rem' }}>{f}</span>
          </li>
        ))}
      </ul>
      <Link to="/services" className={`btn btn--block mt-4 ${plan.popular ? 'btn--primary' : 'btn--secondary'}`}>Get started</Link>
    </article>
  );
}

export function DownloadCard({ item }) {
  const d = item;
  return (
    <article className="card">
      <div className="between mb-1">
        <PlatformBadge platform={d.platform} />
        {d.version && <span className="pill">v{d.version}</span>}
      </div>
      {d.product && <h4 className="mt-1">{d.product.name}</h4>}
      <div className="muted mt-1" style={{ fontSize: '.85rem', lineHeight: 1.9 }}>
        {d.architecture && <div>Architecture: {d.architecture}</div>}
        {d.file_size && <div>Size: {d.file_size}</div>}
        {d.min_os && <div>Requires: {d.min_os}</div>}
        {d.released_at && <div>Released: {new Date(d.released_at).toLocaleDateString()}</div>}
      </div>
      {d.release_notes && <p className="mt-2" style={{ fontSize: '.88rem' }}>{d.release_notes}</p>}
      <a href={d.url || '#'} target="_blank" rel="noopener noreferrer" className="btn btn--primary btn--block mt-3">
        <Download size={16} /> Download
      </a>
    </article>
  );
}

export function BlogCard({ post }) {
  return (
    <article className="card card--hover card--flush">
      <Link to={`/blog/${post.slug}`} className="card-media">
        <SmartImage src={post.cover_image} alt={post.title} ratio="16 / 9" />
      </Link>
      <div style={{ padding: 20 }}>
        {post.category && <span className="badge badge--neutral mb-1">{post.category}</span>}
        <h4 className="mt-1"><Link to={`/blog/${post.slug}`} style={{ color: 'var(--ink)' }}>{post.title}</Link></h4>
        <p className="mt-1" style={{ fontSize: '.9rem' }}>{post.excerpt}</p>
        <div className="muted mt-2" style={{ fontSize: '.8rem' }}>
          {post.author} · {post.reading_time} min read
        </div>
      </div>
    </article>
  );
}
