import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight, Smartphone, Globe, Monitor, Command, Cloud, Layers,
  Users, Download, Star, ShieldCheck, MapPin, Quote,
} from 'lucide-react';
import Seo from '../components/Seo';
import Carousel from '../components/Carousel';
import Reveal from '../components/Reveal';
import Parallax from '../components/Parallax';
import { ProductCard, ServiceCard, BlogCard } from '../components/cards';
import { SectionHead } from '../components/ui';
import { PageLoader } from '../components/Loader';
import { useSite } from '../components/SiteContext';
import { productAPI, serviceAPI, blogAPI, caseStudyAPI, contentAPI } from '../api';

const CATEGORY_ICONS = { smartphone: Smartphone, globe: Globe, monitor: Monitor, command: Command, cloud: Cloud, layers: Layers };

export default function Home() {
  const { settings } = useSite();
  const hero = settings?.hero || {};
  const [data, setData] = useState(null);

  useEffect(() => {
    Promise.allSettled([
      productAPI.list({ featured: true }),
      serviceAPI.list({ featured: true }),
      blogAPI.list(),
      caseStudyAPI.list(),
      contentAPI.testimonials(),
      contentAPI.industries(),
    ]).then(([p, s, b, c, t, i]) => {
      setData({
        products: p.value?.data || [],
        services: s.value?.data || [],
        blog: (b.value?.data || []).slice(0, 3),
        cases: (c.value?.data || []).slice(0, 3),
        testimonials: t.value?.data || [],
        industries: i.value?.data || [],
      });
    });
  }, []);

  const sections = (settings?.homepage_sections || [])
    .filter((s) => s.enabled).sort((a, b) => a.order - b.order).map((s) => s.key);
  const on = (key) => sections.length === 0 || sections.includes(key);

  const productCats = settings?.product_categories || [];
  const stats = [
    { icon: <Users size={22} />, value: '10K+', label: 'Active users' },
    { icon: <Download size={22} />, value: '50K+', label: 'Downloads' },
    { icon: <Star size={22} />, value: '4.9/5', label: 'Client rating' },
    { icon: <ShieldCheck size={22} />, value: 'Prod-ready', label: 'Security posture' },
  ];

  return (
    <>
      <Seo title={null} description={hero.subtitle} />

      {/* HERO */}
      {on('hero') && (
        <header className="hero">
          <div className="hero__bg"><Carousel pageType="home" /></div>
          <div className="hero__scrim" />
          <div className="container">
            <div className="hero__inner">
              <span className="eyebrow" style={{ color: '#fff', opacity: .8 }}>{hero.kicker || 'Akagera Inc'}</span>
              <h1>{hero.title || 'Technology Solutions Built for What Comes Next.'}</h1>
              <p className="lead mt-2" style={{ color: 'rgba(255,255,255,.85)' }}>{hero.subtitle}</p>
              <div className="row mt-4">
                <Link to={hero.primary_cta?.url || '/solutions'} className="btn btn--primary btn--lg">
                  {hero.primary_cta?.label || 'Explore Our Solutions'} <ArrowRight size={18} />
                </Link>
                <Link to={hero.secondary_cta?.url || '/contact?intent=project'} className="btn btn--outline-light btn--lg">
                  {hero.secondary_cta?.label || 'Start a Project'}
                </Link>
              </div>
              <div className="chip-row mt-4">
                {['Smartphone', 'Browser', 'Windows', 'macOS', 'Cloud', 'APIs'].map((x) => (
                  <span key={x} className="pill" style={{ background: 'rgba(255,255,255,.1)', borderColor: 'rgba(255,255,255,.2)', color: '#fff' }}>{x}</span>
                ))}
              </div>
            </div>
          </div>
        </header>
      )}

      {!data ? <PageLoader /> : (
        <>
          {/* PRODUCT GRID */}
          {on('product_grid') && (
            <section className="section">
              <div className="container">
                <Reveal><SectionHead eyebrow="Products" title="Software built by Akagera Inc">
                  Applications across every platform your organization runs on.
                </SectionHead></Reveal>
                <div className="grid grid-3">
                  {productCats.map((c, i) => {
                    const Icon = CATEGORY_ICONS[c.icon] || Layers;
                    return (
                      <Reveal key={c.slug} delay={i * 40}>
                        <Link to={`/products?category=${c.slug}`} className="card card--hover" style={{ display: 'block' }}>
                          <div className="empty__icon" style={{ marginBottom: 14 }}><Icon size={22} /></div>
                          <h3 style={{ fontSize: '1.15rem' }}>{c.name}</h3>
                          <p className="mt-1" style={{ fontSize: '.92rem' }}>{c.description}</p>
                          <span className="row mt-2" style={{ color: 'var(--brand)', fontWeight: 600, fontSize: '.88rem' }}>
                            Explore <ArrowRight size={14} />
                          </span>
                        </Link>
                      </Reveal>
                    );
                  })}
                </div>
              </div>
            </section>
          )}

          {/* FEATURED PRODUCTS */}
          {on('featured_products') && data.products.length > 0 && (
            <section className="section section--soft">
              <div className="container">
                <div className="between mb-3">
                  <SectionHead eyebrow="Featured" title="Featured Akagera Products" />
                  <Link to="/products" className="btn btn--secondary btn--sm hide-mobile">All products <ArrowRight size={15} /></Link>
                </div>
                <div className="grid grid-3">
                  {data.products.slice(0, 6).map((p) => <Reveal key={p.id}><ProductCard product={p} /></Reveal>)}
                </div>
              </div>
            </section>
          )}

          {/* SERVICES */}
          {on('services') && data.services.length > 0 && (
            <section className="section">
              <div className="container">
                <Reveal><SectionHead eyebrow="Services" title="Delivery you can buy online" center>
                  Fixed scope, clear durations, transparent pricing — purchased and tracked from your dashboard.
                </SectionHead></Reveal>
                <div className="grid grid-3">
                  {data.services.slice(0, 6).map((s) => <Reveal key={s.id}><ServiceCard service={s} /></Reveal>)}
                </div>
                <div className="text-center mt-4">
                  <Link to="/services" className="btn btn--primary">Browse all services <ArrowRight size={16} /></Link>
                </div>
              </div>
            </section>
          )}

          {/* INDUSTRIES */}
          {on('industries') && data.industries.length > 0 && (
            <section className="section section--dark">
              <div className="container">
                <SectionHead eyebrow="Industries" title="Patterns we've shipped across sectors" />
                <div className="grid grid-4">
                  {data.industries.slice(0, 8).map((ind) => (
                    <Link key={ind.slug} to={`/solutions/${ind.slug}`} className="card" style={{ background: 'rgba(255,255,255,.05)', borderColor: 'rgba(255,255,255,.12)' }}>
                      <h4 style={{ color: '#fff' }}>{ind.name}</h4>
                      <p style={{ fontSize: '.85rem', color: 'rgba(255,255,255,.66)' }}>{ind.summary}</p>
                    </Link>
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* STATS */}
          {on('stats') && (
            <section className="section--tight section">
              <div className="container">
                <div className="grid grid-4">
                  {stats.map((s) => (
                    <div key={s.label} className="card row" style={{ gap: 14 }}>
                      <span style={{ color: 'var(--brand)' }}>{s.icon}</span>
                      <span><b style={{ fontSize: '1.3rem', display: 'block' }}>{s.value}</b><span className="muted" style={{ fontSize: '.85rem' }}>{s.label}</span></span>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* CASE STUDIES */}
          {on('case_studies') && data.cases.length > 0 && (
            <section className="section section--soft">
              <div className="container">
                <div className="between mb-3">
                  <SectionHead eyebrow="Our work" title="Case studies" />
                  <Link to="/case-studies" className="btn btn--secondary btn--sm hide-mobile">See all <ArrowRight size={15} /></Link>
                </div>
                <div className="grid grid-3">
                  {data.cases.map((c) => (
                    <Reveal key={c.id}><Link to={`/case-studies/${c.slug}`} className="card card--hover" style={{ display: 'block' }}>
                      <span className="badge badge--neutral mb-1">{c.category}</span>
                      <h4 className="mt-1">{c.title}</h4>
                      <p className="mt-1" style={{ fontSize: '.9rem' }}>{c.summary}</p>
                    </Link></Reveal>
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* TESTIMONIALS */}
          {on('testimonials') && data.testimonials.length > 0 && (
            <section className="section">
              <div className="container">
                <SectionHead eyebrow="Trust" title="What clients say" center />
                <div className="grid grid-3">
                  {data.testimonials.slice(0, 3).map((t) => (
                    <div key={t.id} className="card">
                      <Quote size={22} style={{ color: 'var(--brand)' }} />
                      <p className="mt-2" style={{ color: 'var(--ink)' }}>{t.quote}</p>
                      <div className="mt-3" style={{ fontWeight: 700, fontSize: '.9rem' }}>{t.name}</div>
                      <div className="muted" style={{ fontSize: '.82rem' }}>{t.role}{t.company ? `, ${t.company}` : ''}</div>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* BLOG */}
          {on('blog') && data.blog.length > 0 && (
            <section className="section section--soft">
              <div className="container">
                <div className="between mb-3">
                  <SectionHead eyebrow="Insights" title="From the blog" />
                  <Link to="/blog" className="btn btn--secondary btn--sm hide-mobile">All posts <ArrowRight size={15} /></Link>
                </div>
                <div className="grid grid-3">
                  {data.blog.map((post) => <Reveal key={post.id}><BlogCard post={post} /></Reveal>)}
                </div>
              </div>
            </section>
          )}

          {/* CTA */}
          {on('cta') && (
            <section className="section section--brand">
              <div className="container">
                <Parallax speed={0.06}>
                  <div className="between">
                    <div>
                      <h2>Ready to build?</h2>
                      <p className="mt-1">Send a brief or ask for pricing — we respond within one business day.</p>
                    </div>
                    <div className="row">
                      <Link to="/pricing" className="btn btn--on-dark btn--lg">See pricing</Link>
                      <Link to="/contact?intent=project" className="btn btn--outline-light btn--lg">Start a project</Link>
                    </div>
                  </div>
                </Parallax>
              </div>
            </section>
          )}

          {/* LOCATION */}
          {on('location') && (
            <section className="section">
              <div className="container">
                <SectionHead eyebrow="Visit" title="Our location" />
                <div className="card card--flush grid grid-2" style={{ overflow: 'hidden' }}>
                  <iframe
                    title="Akagera Inc location"
                    src={`https://www.google.com/maps?q=${encodeURIComponent(settings?.contact_info?.map_query || 'Musanze,Rwanda')}&z=14&output=embed`}
                    style={{ width: '100%', minHeight: 320, border: 0 }} loading="lazy"
                  />
                  <div style={{ padding: 30 }}>
                    <div className="row" style={{ color: 'var(--brand)', gap: 10 }}><MapPin size={24} /><h3>Akagera Inc HQ</h3></div>
                    <p className="mt-2">{(settings?.contact_info?.address_lines || []).join(', ')}</p>
                    <p className="mt-2 muted" style={{ fontSize: '.9rem' }}>
                      {(settings?.contact_info?.hours || []).map((h) => <span key={h} style={{ display: 'block' }}>{h}</span>)}
                    </p>
                    <div className="row mt-3">
                      <a className="btn btn--primary" href={`https://maps.google.com/?q=${encodeURIComponent(settings?.contact_info?.map_query || 'Musanze,Rwanda')}`} target="_blank" rel="noopener noreferrer">Get directions</a>
                      <Link className="btn btn--secondary" to="/contact">Contact us</Link>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          )}
        </>
      )}
    </>
  );
}
