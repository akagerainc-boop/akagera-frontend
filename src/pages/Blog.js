import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Newspaper } from 'lucide-react';
import Seo from '../components/Seo';
import { PageLoader } from '../components/Loader';
import { BlogCard } from '../components/cards';
import { SectionHead, EmptyState, Breadcrumbs } from '../components/ui';
import { blogAPI } from '../api';

export default function Blog() {
  const [posts, setPosts] = useState(null);
  const [q, setQ] = useState('');
  const [cat, setCat] = useState('');

  useEffect(() => {
    setPosts(null);
    blogAPI.list({ q: q || undefined, category: cat || undefined }).then((r) => setPosts(r.data)).catch(() => setPosts([]));
  }, [q, cat]);

  const featured = posts?.find((p) => p.is_featured);
  const cats = posts ? [...new Set(posts.map((p) => p.category).filter(Boolean))] : [];

  return (
    <>
      <Seo title="Blog" description="Technology, software development, and company news from Akagera Inc." />
      <section className="section section--soft section--tight"><div className="container">
        <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'Blog' }]} />
        <SectionHead eyebrow="Insights" title="From the Akagera blog" />
        <div className="row" style={{ maxWidth: 420 }}>
          <div className="field" style={{ flex: 1, margin: 0 }}>
            <div className="row" style={{ gap: 8, border: '1px solid var(--n-300)', borderRadius: 6, padding: '0 12px', background: '#fff' }}>
              <Search size={16} style={{ color: 'var(--n-500)' }} />
              <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search articles" style={{ border: 'none', padding: '10px 0' }} />
            </div>
          </div>
        </div>
        {cats.length > 0 && (
          <div className="chip-row mt-2">
            <button className="pill" style={!cat ? { background: 'var(--brand)', color: '#fff', borderColor: 'var(--brand)' } : {}} onClick={() => setCat('')}>All</button>
            {cats.map((c) => <button key={c} className="pill" style={cat === c ? { background: 'var(--brand)', color: '#fff', borderColor: 'var(--brand)' } : {}} onClick={() => setCat(c)}>{c}</button>)}
          </div>
        )}
      </div></section>

      <section className="section"><div className="container">
        {!posts ? <PageLoader /> : posts.length === 0 ? (
          <EmptyState icon={<Newspaper size={24} />} title="No articles found" />
        ) : (
          <>
            {featured && !q && !cat && (
              <Link to={`/blog/${featured.slug}`} className="card card--hover card--flush mb-3" style={{ display: 'grid', gridTemplateColumns: '1fr', overflow: 'hidden' }}>
                <div className="card-media" style={{ aspectRatio: '21 / 9' }}><img src={featured.cover_image || '/assets/inc.png'} alt="" style={{ objectFit: featured.cover_image ? 'cover' : 'contain' }} /></div>
                <div style={{ padding: 24 }}>
                  <span className="badge">Featured · {featured.category}</span>
                  <h2 className="mt-1" style={{ fontSize: '1.6rem' }}>{featured.title}</h2>
                  <p className="mt-1">{featured.excerpt}</p>
                </div>
              </Link>
            )}
            <div className="grid grid-3">
              {posts.filter((p) => p !== featured || q || cat).map((p) => <BlogCard key={p.id} post={p} />)}
            </div>
          </>
        )}
      </div></section>
    </>
  );
}
