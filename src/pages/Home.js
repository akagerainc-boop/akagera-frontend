import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight, Download, ShieldCheck, Smartphone, MapPin, Quote, Search, BadgeCheck, Zap,
} from 'lucide-react';
import Seo from '../components/Seo';
import Carousel from '../components/Carousel';
import Reveal from '../components/Reveal';
import Parallax from '../components/Parallax';
import { ProductCard, ServiceCard, BlogCard } from '../components/cards';
import { AppIcon, MobileAppCard, appMeta } from '../components/AppCard';
import { SectionHead, EmptyState } from '../components/ui';
import { PageLoader } from '../components/Loader';
import { useSite } from '../components/SiteContext';
import { productAPI, serviceAPI, blogAPI, caseStudyAPI, contentAPI, mobileAppAPI, mediaUrl } from '../api';

const HOME_APP_LIMIT = 6;

function FeaturedApp({ app }) {
  return (
    <div className="hero-app">
      <span className="hero-app__label">Featured app</span>
      <Link to={`/mobile-apps/${app.slug}`} className="hero-app__head">
        <AppIcon app={app} size={72} />
        <div style={{ minWidth: 0 }}>
          <h3>{app.name}</h3>
          <div className="hero-app__meta">{appMeta(app)}</div>
        </div>
      </Link>
      {app.tagline && <p className="hero-app__tagline">{app.tagline}</p>}
      {app.screenshots?.length > 0 && (
        <Link to={`/mobile-apps/${app.slug}`} className="hero-app__shots" aria-label={`${app.name} screenshots`}>
          {app.screenshots.slice(0, 3).map((s, i) => (
            <img key={i} src={mediaUrl(s)} alt="" loading={i ? 'lazy' : 'eager'} />
          ))}
        </Link>
      )}
      <a href={mobileAppAPI.downloadUrl(app.slug)} className="btn btn--primary btn--lg btn--block" rel="nofollow">
        <Download size={18} /> Download APK
      </a>
    </div>
  );
}

export default function Home() {
  const { settings } = useSite();
  const [apps, setApps] = useState(null);
  const [data, setData] = useState(null);

  useEffect(() => {
    // Apps load on their own so the main content never waits on the secondary sections.
    mobileAppAPI.list().then((r) => setApps(r.data || [])).catch(() => setApps([]));
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

  const featured = apps?.[0];

  return (
    <>
      <Seo title={null} description="Download free Android apps by Akagera Inc. Install the APK directly on your phone." />

      {/* HERO — apps first */}
      <header className="apps-hero">
        {/* background slider: images uploaded in Admin → Media (page type "home") */}
        <div className="apps-hero__bg"><Carousel pageType="home" /></div>
        <div className="apps-hero__scrim" />
        <div className="container apps-hero__grid">
          <div className="apps-hero__copy">
            <span className="pill pill--on-dark"><Smartphone size={13} /> Android apps</span>
            <h1>Useful apps for your Android phone.</h1>
            <p className="lead">
              Built by Akagera Inc. Free to download — get the APK straight from us and install it in seconds.
            </p>
            <div className="row mt-3">
              <a href="#apps" className="btn btn--primary btn--lg">Browse apps <ArrowRight size={18} /></a>
              <a href="#install" className="btn btn--outline-light btn--lg">How to install</a>
            </div>
            <ul className="apps-hero__trust">
              <li><BadgeCheck size={16} /> Free</li>
              <li><ShieldCheck size={16} /> Published by Akagera Inc</li>
              <li><Zap size={16} /> Direct download</li>
            </ul>
          </div>
          {featured && <FeaturedApp app={featured} />}
        </div>
      </header>

      {/* ALL APPS */}
      <section className="section section--tight" id="apps">
        <div className="container">
          <div className="between mb-3">
            <SectionHead eyebrow="Our apps" title="Download our apps" />
            {apps?.length > HOME_APP_LIMIT && (
              <Link to="/mobile-apps" className="btn btn--secondary btn--sm">See all {apps.length} apps <ArrowRight size={15} /></Link>
            )}
          </div>
          {!apps ? <PageLoader /> : apps.length === 0 ? (
            <EmptyState icon={<Smartphone size={26} />} title="No apps published yet">
              Our first apps are on the way. Check back soon.
            </EmptyState>
          ) : (
            <div className="grid grid-3">
              {apps.slice(0, HOME_APP_LIMIT).map((a) => <MobileAppCard key={a.id} app={a} />)}
            </div>
          )}
        </div>
      </section>

      {/* INSTALL STEPS */}
      {apps?.length > 0 && (
        <section className="section section--tight section--soft" id="install">
          <div className="container">
            <SectionHead eyebrow="Easy install" title="Install in three steps" />
            <ol className="steps">
              <li><span className="steps__n"><Download size={18} /></span><div><b>Download</b><p>Tap <b>Download APK</b> on your Android phone.</p></div></li>
              <li><span className="steps__n"><Search size={18} /></span><div><b>Open the file</b><p>Find it in your notifications or the Downloads folder.</p></div></li>
              <li><span className="steps__n"><ShieldCheck size={18} /></span><div><b>Install</b><p>Allow <b>Install unknown apps</b> if asked, then tap Install.</p></div></li>
            </ol>
          </div>
        </section>
      )}

      {data && (
        <>
          {/* FEATURED PRODUCTS */}
          {on('featured_products') && data.products.length > 0 && (
            <section className="section">
              <div className="container">
                <div className="between mb-3">
                  <SectionHead eyebrow="More from us" title="Other products" />
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
            <section className="section section--soft">
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
                      <h2>Need an app built?</h2>
                      <p className="mt-1">We also build Android apps for businesses. Send a brief — we reply within one business day.</p>
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
