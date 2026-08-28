import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Briefcase } from 'lucide-react';
import Seo from '../components/Seo';
import { PageLoader } from '../components/Loader';
import { SectionHead, EmptyState, Breadcrumbs } from '../components/ui';
import { caseStudyAPI } from '../api';

export default function Portfolio() {
  const [items, setItems] = useState(null);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    caseStudyAPI.list().then((r) => setItems(r.data)).catch(() => setItems([]));
  }, []);

  const cats = items ? [...new Set(items.map((c) => c.category).filter(Boolean))] : [];
  const shown = items?.filter((c) => !filter || c.category === filter) || [];

  return (
    <>
      <Seo title="Our Work" description="Case studies and projects delivered by Akagera Inc." />
      <section className="section section--soft section--tight"><div className="container">
        <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'Our Work' }]} />
        <SectionHead eyebrow="Portfolio" title="Our work">Selected projects and the outcomes they produced.</SectionHead>
        {cats.length > 0 && (
          <div className="chip-row">
            <button className="pill" style={!filter ? { background: 'var(--brand)', color: '#fff', borderColor: 'var(--brand)' } : {}} onClick={() => setFilter('')}>All</button>
            {cats.map((c) => <button key={c} className="pill" style={filter === c ? { background: 'var(--brand)', color: '#fff', borderColor: 'var(--brand)' } : {}} onClick={() => setFilter(c)}>{c}</button>)}
          </div>
        )}
      </div></section>

      <section className="section"><div className="container">
        {!items ? <PageLoader /> : shown.length === 0 ? (
          <EmptyState icon={<Briefcase size={24} />} title="No case studies yet" action={<Link to="/contact" className="btn btn--primary">Talk to us</Link>} />
        ) : (
          <div className="grid grid-3">
            {shown.map((c) => (
              <Link key={c.id} to={`/case-studies/${c.slug}`} className="card card--hover" style={{ display: 'block' }}>
                <span className="badge badge--neutral">{c.category}</span>
                <h3 className="mt-1" style={{ fontSize: '1.15rem' }}>{c.title}</h3>
                <p className="mt-1" style={{ fontSize: '.9rem' }}>{c.summary}</p>
                {c.client && <div className="muted mt-2" style={{ fontSize: '.82rem' }}>Client: {c.client}</div>}
                {c.technologies?.length > 0 && <div className="chip-row mt-2">{c.technologies.slice(0, 4).map((t) => <span key={t} className="pill">{t}</span>)}</div>}
              </Link>
            ))}
          </div>
        )}
      </div></section>
    </>
  );
}
