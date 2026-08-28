import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Wrench } from 'lucide-react';
import Seo from '../components/Seo';
import { PageLoader } from '../components/Loader';
import { ServiceCard } from '../components/cards';
import { SectionHead, EmptyState, Breadcrumbs } from '../components/ui';
import { serviceAPI } from '../api';

export default function Services() {
  const [params, setParams] = useSearchParams();
  const category = params.get('category') || '';
  const [items, setItems] = useState(null);
  const [cats, setCats] = useState([]);

  useEffect(() => {
    setItems(null);
    serviceAPI.list({ category: category || undefined }).then((r) => {
      setItems(r.data);
      if (!category) setCats([...new Set(r.data.map((s) => s.category).filter(Boolean))]);
    }).catch(() => setItems([]));
  }, [category]);

  return (
    <>
      <Seo title="Services" description="Buy software development, licensing, subscriptions, internships, and support from Akagera Inc." />
      <section className="section section--soft section--tight">
        <div className="container">
          <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'Services' }]} />
          <SectionHead eyebrow="Services marketplace" title="Choose the solution that fits your needs">
            Every service has a clear price and duration. Purchase online and track delivery from your dashboard.
          </SectionHead>
          <div className="chip-row">
            <button className="pill" style={!category ? { background: 'var(--brand)', color: '#fff', borderColor: 'var(--brand)' } : {}} onClick={() => setParams({})}>All</button>
            {cats.map((c) => (
              <button key={c} className="pill" style={category === c ? { background: 'var(--brand)', color: '#fff', borderColor: 'var(--brand)' } : {}} onClick={() => setParams({ category: c })}>{c}</button>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          {!items ? <PageLoader /> : items.length === 0 ? (
            <EmptyState icon={<Wrench size={26} />} title="No services published yet"
              action={<Link to="/contact" className="btn btn--primary">Contact us</Link>} />
          ) : (
            <div className="grid grid-3">{items.map((s) => <ServiceCard key={s.id} service={s} />)}</div>
          )}
        </div>
      </section>
    </>
  );
}
