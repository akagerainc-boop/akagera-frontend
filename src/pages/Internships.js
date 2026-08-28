import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { GraduationCap, Clock, Users } from 'lucide-react';
import Seo from '../components/Seo';
import { PageLoader } from '../components/Loader';
import { EmptyState, StatusBadge, Breadcrumbs, priceLabel } from '../components/ui';
import { internshipAPI } from '../api';

export default function Internships() {
  const [items, setItems] = useState(null);
  useEffect(() => { internshipAPI.list().then((r) => setItems(r.data)).catch(() => setItems([])); }, []);

  return (
    <>
      <Seo title="Internships" description="Structured internship programs at Akagera Inc." />
      <section className="section section--dark section--tight"><div className="container">
        <Breadcrumbs items={[{ label: 'Company', to: '/about' }, { label: 'Internships' }]} />
        <h1>Internships</h1>
        <p className="lead mt-2" style={{ color: 'rgba(255,255,255,.82)' }}>Learn by shipping real software with mentorship and weekly reviews.</p>
      </div></section>

      <section className="section"><div className="container">
        {!items ? <PageLoader /> : items.length === 0 ? (
          <EmptyState icon={<GraduationCap size={24} />} title="No internship programs open right now"
            action={<Link to="/contact?intent=internship" className="btn btn--primary">Register your interest</Link>} />
        ) : (
          <div className="grid grid-2">
            {items.map((i) => (
              <Link key={i.id} to={`/internships/${i.slug}`} className="card card--hover" style={{ display: 'block' }}>
                <div className="between mb-1">
                  <span className="badge">{i.department}</span>
                  <StatusBadge status={i.status} />
                </div>
                <h3 style={{ fontSize: '1.2rem' }}>{i.title}</h3>
                <div className="row mt-2 muted" style={{ fontSize: '.85rem', gap: 14 }}>
                  <span><Clock size={13} style={{ display: 'inline' }} /> {i.duration_label}</span>
                  <span><Users size={13} style={{ display: 'inline' }} /> {i.positions} positions</span>
                  <span>{i.is_free ? 'Free' : priceLabel(i.price)}</span>
                </div>
                {i.deadline && <div className="muted mt-1" style={{ fontSize: '.82rem' }}>Apply by {new Date(i.deadline).toLocaleDateString()}</div>}
              </Link>
            ))}
          </div>
        )}
      </div></section>
    </>
  );
}
