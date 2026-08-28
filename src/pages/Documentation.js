import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Search, BookOpen } from 'lucide-react';
import Seo from '../components/Seo';
import { PageLoader } from '../components/Loader';
import { EmptyState, Breadcrumbs } from '../components/ui';
import { docsAPI } from '../api';

export default function Documentation() {
  const { slug } = useParams();
  const [sections, setSections] = useState(null);
  const [page, setPage] = useState(null);
  const [q, setQ] = useState('');

  useEffect(() => { docsAPI.list().then((r) => setSections(r.data.sections || {})).catch(() => setSections({})); }, []);
  useEffect(() => {
    if (slug) docsAPI.get(slug).then((r) => setPage(r.data)).catch(() => setPage(false));
    else setPage(null);
  }, [slug]);

  if (!sections) return <PageLoader />;

  const allPages = Object.entries(sections).flatMap(([sec, list]) => list.map((p) => ({ ...p, section: sec })));
  const filtered = q ? allPages.filter((p) => p.title.toLowerCase().includes(q.toLowerCase())) : null;

  return (
    <>
      <Seo title={page ? page.title : 'Documentation'} description="Guides, API reference, and troubleshooting for Akagera Inc products." />
      <div className="container section">
        <Breadcrumbs items={[{ label: 'Resources' }, { label: 'Documentation', to: '/documentation' }, ...(page ? [{ label: page.title }] : [])]} />
        <div className="shell" style={{ minHeight: 'auto', border: '1px solid var(--line)', borderRadius: 'var(--r-lg)', overflow: 'hidden' }}>
          <nav className="shell__side" style={{ background: 'var(--bg-soft)', color: 'var(--n-700)' }}>
            <div className="row" style={{ gap: 8, border: '1px solid var(--n-300)', borderRadius: 6, padding: '0 10px', background: '#fff', marginBottom: 12 }}>
              <Search size={14} style={{ color: 'var(--n-500)' }} />
              <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search docs" style={{ border: 'none', padding: '8px 0', fontSize: '.85rem' }} />
            </div>
            {(filtered || allPages).length === 0 && <p className="muted" style={{ fontSize: '.85rem' }}>No pages.</p>}
            {!filtered && Object.entries(sections).map(([sec, list]) => (
              <div key={sec} style={{ marginBottom: 14 }}>
                <div className="eyebrow" style={{ fontSize: '.7rem', marginBottom: 4 }}>{sec}</div>
                {list.map((p) => (
                  <Link key={p.slug} to={`/documentation/${p.slug}`} style={{ display: 'block', padding: '7px 10px', borderRadius: 6, color: slug === p.slug ? 'var(--brand)' : 'var(--n-700)', fontWeight: slug === p.slug ? 700 : 500, fontSize: '.88rem' }}>{p.title}</Link>
                ))}
              </div>
            ))}
            {filtered && filtered.map((p) => (
              <Link key={p.slug} to={`/documentation/${p.slug}`} style={{ display: 'block', padding: '7px 10px', fontSize: '.88rem' }}>{p.title}</Link>
            ))}
          </nav>
          <div className="shell__main" style={{ background: '#fff' }}>
            {page === false && <EmptyState icon={<BookOpen size={22} />} title="Doc not found" />}
            {page && page !== false && (
              <article style={{ maxWidth: 720 }}>
                <span className="eyebrow">{page.section}</span>
                <h1>{page.title}</h1>
                <div className="mt-3" style={{ lineHeight: 1.8 }} dangerouslySetInnerHTML={{ __html: page.body || '' }} />
              </article>
            )}
            {!page && (
              <div style={{ maxWidth: 720 }}>
                <span className="eyebrow">Documentation</span>
                <h1>Akagera Inc documentation</h1>
                <p className="lead mt-2">Getting started guides, product help, installation, licensing, and developer reference.</p>
                <div className="grid grid-2 mt-3">
                  {allPages.slice(0, 6).map((p) => (
                    <Link key={p.slug} to={`/documentation/${p.slug}`} className="card card--hover" style={{ display: 'block' }}>
                      <div className="muted" style={{ fontSize: '.75rem', textTransform: 'uppercase' }}>{p.section}</div>
                      <h4 className="mt-1">{p.title}</h4>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
