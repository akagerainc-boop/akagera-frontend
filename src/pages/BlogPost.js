import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Seo from '../components/Seo';
import SmartImage from '../components/SmartImage';
import { PageLoader } from '../components/Loader';
import { BlogCard } from '../components/cards';
import { Breadcrumbs, EmptyState } from '../components/ui';
import { blogAPI } from '../api';

export default function BlogPost() {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [err, setErr] = useState(false);

  useEffect(() => {
    setPost(null); setErr(false);
    blogAPI.get(slug).then((r) => setPost(r.data)).catch(() => setErr(true));
  }, [slug]);

  if (err) return <div className="container section"><EmptyState title="Article not found" action={<Link className="btn btn--primary" to="/blog">All articles</Link>} /></div>;
  if (!post) return <PageLoader />;

  return (
    <>
      <Seo title={post.title} description={post.excerpt} image={post.cover_image} type="article"
        jsonLd={{ '@context': 'https://schema.org', '@type': 'Article', headline: post.title,
          author: { '@type': 'Organization', name: post.author || 'Akagera Inc' },
          datePublished: post.published_at }} />
      <article className="section"><div className="container" style={{ maxWidth: 760 }}>
        <Breadcrumbs items={[{ label: 'Blog', to: '/blog' }, { label: post.title }]} />
        {post.category && <span className="badge">{post.category}</span>}
        <h1 className="mt-2">{post.title}</h1>
        <div className="muted mt-1" style={{ fontSize: '.88rem' }}>
          {post.author} · {new Date(post.published_at).toLocaleDateString()} · {post.reading_time} min read
        </div>
        {post.cover_image && <SmartImage src={post.cover_image} alt={post.title} ratio="16 / 9" className="card--flush" style={{ borderRadius: 14, margin: '24px 0' }} />}
        <div className="mt-3" style={{ fontSize: '1.05rem', lineHeight: 1.8 }} dangerouslySetInnerHTML={{ __html: post.body || `<p>${post.excerpt || ''}</p>` }} />
        {post.related?.length > 0 && (
          <>
            <h3 className="mt-4">Related posts</h3>
            <div className="grid grid-2 mt-2">{post.related.map((r) => <BlogCard key={r.id} post={r} />)}</div>
          </>
        )}
      </div></article>
    </>
  );
}
