import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Briefcase } from 'lucide-react';
import Seo from '../components/Seo';
import { PageLoader } from '../components/Loader';
import { SectionHead, EmptyState, StatusBadge, Breadcrumbs } from '../components/ui';
import { careersAPI } from '../api';

export default function Careers() {
  const [jobs, setJobs] = useState(null);
  useEffect(() => { careersAPI.list().then((r) => setJobs(r.data)).catch(() => setJobs([])); }, []);

  const byDept = {};
  (jobs || []).forEach((j) => { (byDept[j.department || 'Other'] ||= []).push(j); });

  return (
    <>
      <Seo title="Careers" description="Open roles at Akagera Inc." />
      <section className="section section--dark section--tight"><div className="container">
        <Breadcrumbs items={[{ label: 'Company', to: '/about' }, { label: 'Careers' }]} />
        <h1>Careers at Akagera Inc</h1>
        <p className="lead mt-2" style={{ color: 'rgba(255,255,255,.82)' }}>Build software that organizations across the region depend on.</p>
      </div></section>

      <section className="section"><div className="container">
        {!jobs ? <PageLoader /> : jobs.length === 0 ? (
          <EmptyState icon={<Briefcase size={24} />} title="No open roles right now"
            action={<Link to="/contact?intent=careers" className="btn btn--primary">Send an open application</Link>} />
        ) : (
          Object.entries(byDept).map(([dept, list]) => (
            <div key={dept} className="mb-4">
              <SectionHead eyebrow={dept} title={`${list.length} open ${list.length === 1 ? 'role' : 'roles'}`} />
              <div className="stack">
                {list.map((j) => (
                  <Link key={j.id} to={`/careers/${j.slug}`} className="card card--hover between" style={{ display: 'flex' }}>
                    <div>
                      <h3 style={{ fontSize: '1.15rem' }}>{j.title}</h3>
                      <div className="row mt-1 muted" style={{ fontSize: '.85rem', gap: 14 }}>
                        <span><MapPin size={13} style={{ display: 'inline' }} /> {j.location}</span>
                        <span>{j.employment_type}</span>
                      </div>
                    </div>
                    <StatusBadge status={j.status} />
                  </Link>
                ))}
              </div>
            </div>
          ))
        )}
      </div></section>
    </>
  );
}
