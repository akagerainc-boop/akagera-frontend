import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { PackageOpen } from 'lucide-react';
import Seo from '../components/Seo';
import { PageLoader } from '../components/Loader';
import { ProductCard } from '../components/cards';
import { SectionHead, EmptyState, Breadcrumbs } from '../components/ui';
import { productAPI } from '../api';

const PLATFORMS = ['android', 'ios', 'windows', 'macos', 'web', 'cloud'];

export default function Products() {
  const [params, setParams] = useSearchParams();
  const category = params.get('category') || '';
  const platform = params.get('platform') || '';
  const [items, setItems] = useState(null);
  const [cats, setCats] = useState([]);

  useEffect(() => {
    setItems(null);
    productAPI.list({ category: category || undefined, platform: platform || undefined })
      .then((r) => {
        setItems(r.data);
        if (!category) setCats([...new Set(r.data.map((p) => p.category).filter(Boolean))]);
      })
      .catch(() => setItems([]));
  }, [category, platform]);

  const setFilter = (key, val) => {
    const next = new URLSearchParams(params);
    if (val) next.set(key, val); else next.delete(key);
    setParams(next);
  };

  return (
    <>
      <Seo title="Products" description="Software products built by Akagera Inc across mobile, web, Windows, macOS, and cloud." />
      <section className="section section--soft section--tight">
        <div className="container">
          <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'Products' }]} />
          <SectionHead eyebrow="Products" title="Software built by Akagera Inc">
            Explore apps, platforms, and tools we build and maintain.
          </SectionHead>
          <div className="chip-row">
            <button className={`pill ${!category ? 'badge--ink' : ''}`} style={!category ? { color: '#fff', border: 'none' } : {}} onClick={() => setFilter('category', '')}>All</button>
            {cats.map((c) => (
              <button key={c} className="pill" style={category === c ? { background: 'var(--brand)', color: '#fff', borderColor: 'var(--brand)' } : {}} onClick={() => setFilter('category', c)}>{c}</button>
            ))}
          </div>
          <div className="chip-row mt-2">
            {PLATFORMS.map((p) => (
              <button key={p} className="pill" style={platform === p ? { background: 'var(--ink)', color: '#fff' } : {}} onClick={() => setFilter('platform', platform === p ? '' : p)}>{p}</button>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          {!items ? <PageLoader /> : items.length === 0 ? (
            <EmptyState icon={<PackageOpen size={26} />} title="No products match that filter"
              action={<button className="btn btn--secondary" onClick={() => setParams({})}>Clear filters</button>} />
          ) : (
            <div className="grid grid-3">
              {items.map((p) => <ProductCard key={p.id} product={p} />)}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
