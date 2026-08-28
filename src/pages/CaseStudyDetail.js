import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Seo from '../components/Seo';
import SmartImage from '../components/SmartImage';
import { PageLoader } from '../components/Loader';
import { Breadcrumbs, EmptyState } from '../components/ui';
import { caseStudyAPI } from '../api';

export default function CaseStudyDetail() {
  const { slug } = useParams();
  const [c, setC] = useState(null);
  const [err, setErr] = useState(false);

  useEffect(() => {
    setC(null); setErr(false);
    caseStudyAPI.get(slug).then((r) => setC(r.data)).catch(() => setErr(true));
  }, [slug]);

  if (err) return <div className="container section"><EmptyState title="Case study not found" action={<Link className="btn btn--primary" to="/case-studies">All work</Link>} /></div>;
  if (!c) return <PageLoader />;

  const blocks = [['The challenge', c.challenge], ['Our solution', c.solution], ['Results', c.results]].filter(([, v]) => v);

  return (
    <>
      <Seo title={c.title} description={c.summary} image={c.cover_image} type="article" />
      <section className="section section--dark section--tight"><div className="container">
        <Breadcrumbs items={[{ label: 'Our Work', to: '/case-studies' }, { label: c.title }]} />
        <span className="badge mb-2">{c.category}</span>
        <h1>{c.title}</h1>
        <p className="lead mt-2" style={{ color: 'rgba(255,255,255,.82)' }}>{c.summary}</p>
        <div className="chip-row mt-3">
          {c.client && <span className="pill" style={{ color: '#fff', borderColor: 'rgba(255,255,255,.25)' }}>Client: {c.client}</span>}
          {(c.platforms || []).map((p) => <span key={p} className="pill" style={{ color: '#fff', borderColor: 'rgba(255,255,255,.25)' }}>{p}</span>)}
        </div>
      </div></section>

      <section className="section"><div className="container" style={{ maxWidth: 800 }}>
        {c.cover_image && <SmartImage src={c.cover_image} alt={c.title} ratio="16 / 9" className="card--flush" style={{ borderRadius: 14, marginBottom: 32 }} />}
        {blocks.map(([title, text]) => (
          <div key={title} className="mb-3">
            <h2>{title}</h2>
            <p className="mt-2" style={{ whiteSpace: 'pre-line' }}>{text}</p>
          </div>
        ))}
        {c.technologies?.length > 0 && (
          <>
            <h3 className="mt-3">Technologies</h3>
            <div className="chip-row mt-2">{c.technologies.map((t) => <span key={t} className="pill">{t}</span>)}</div>
          </>
        )}
        {c.screenshots?.length > 0 && (
          <div className="grid grid-2 mt-4">{c.screenshots.map((s, i) => <SmartImage key={i} src={s} alt="" ratio="16 / 10" className="card--flush" style={{ borderRadius: 12 }} />)}</div>
        )}
        <div className="mt-4"><Link to="/contact?intent=project" className="btn btn--primary">Start a similar project</Link></div>
      </div></section>
    </>
  );
}
