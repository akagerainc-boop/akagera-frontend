import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowRight, Layers } from 'lucide-react';
import Seo from '../components/Seo';
import { PageLoader } from '../components/Loader';
import { SectionHead, Breadcrumbs } from '../components/ui';
import { contentAPI, serviceAPI } from '../api';

const STATIC_SOLUTIONS = {
  business: 'Websites, portals, and internal tools that make daily operations faster.',
  enterprise: 'Custom enterprise software, integrations, and long-term delivery with SLAs.',
  startup: 'MVPs and product engineering to get you to market and iterate quickly.',
  ecommerce: 'Storefronts, checkout, inventory, and fulfilment workflows.',
  automation: 'Replace manual, repetitive work with reliable automated processes.',
  cloud: 'Hosting, deployment pipelines, databases, and monitoring.',
  'custom-software': 'Software designed specifically for your organization and processes.',
  'digital-transformation': 'A staged plan to move core operations onto software you own.',
};

export default function Solutions() {
  const { slug } = useParams();
  const [industries, setIndustries] = useState(null);
  const [industry, setIndustry] = useState(null);
  const [services, setServices] = useState([]);

  useEffect(() => {
    contentAPI.industries().then((r) => setIndustries(r.data)).catch(() => setIndustries([]));
    serviceAPI.list().then((r) => setServices(r.data.slice(0, 6))).catch(() => {});
  }, []);

  useEffect(() => {
    if (!slug) { setIndustry(null); return; }
    contentAPI.industry(slug).then((r) => setIndustry(r.data)).catch(() => setIndustry(null));
  }, [slug]);

  if (!industries) return <PageLoader />;

  // industry landing
  if (slug && industry) {
    return (
      <>
        <Seo title={industry.name} description={industry.summary} />
        <section className="section section--dark section--tight">
          <div className="container">
            <Breadcrumbs items={[{ label: 'Solutions', to: '/solutions' }, { label: industry.name }]} />
            <h1>{industry.name}</h1>
            <p className="lead mt-2" style={{ color: 'rgba(255,255,255,.82)' }}>{industry.summary}</p>
          </div>
        </section>
        <section className="section"><div className="container" style={{ maxWidth: 780 }}>
          <p style={{ whiteSpace: 'pre-line' }}>{industry.body}</p>
          <div className="row mt-4">
            <Link to="/contact?intent=project" className="btn btn--primary">Discuss a project <ArrowRight size={16} /></Link>
            <Link to="/case-studies" className="btn btn--secondary">See related work</Link>
          </div>
        </div></section>
      </>
    );
  }

  // generic solution slug
  if (slug && STATIC_SOLUTIONS[slug]) {
    const title = slug.replace(/-/g, ' ').replace(/\b\w/g, (m) => m.toUpperCase());
    return (
      <>
        <Seo title={`${title} Solutions`} />
        <section className="section section--dark section--tight"><div className="container">
          <Breadcrumbs items={[{ label: 'Solutions', to: '/solutions' }, { label: title }]} />
          <h1>{title}</h1>
          <p className="lead mt-2" style={{ color: 'rgba(255,255,255,.82)' }}>{STATIC_SOLUTIONS[slug]}</p>
        </div></section>
        <section className="section"><div className="container">
          <SectionHead eyebrow="How we help" title="Services that apply here" />
          <div className="grid grid-3">
            {services.map((s) => (
              <Link key={s.id} to={`/services/${s.slug}`} className="card card--hover" style={{ display: 'block' }}>
                <h4>{s.name}</h4><p className="mt-1" style={{ fontSize: '.9rem' }}>{s.short_description}</p>
              </Link>
            ))}
          </div>
          <div className="mt-4"><Link to="/contact?intent=project" className="btn btn--primary">Start a project <ArrowRight size={16} /></Link></div>
        </div></section>
      </>
    );
  }

  // index
  return (
    <>
      <Seo title="Solutions" description="Industry and business solutions from Akagera Inc." />
      <section className="section section--soft section--tight"><div className="container">
        <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'Solutions' }]} />
        <SectionHead eyebrow="Solutions" title="Software for the way your organization works">
          Pick a starting point — by business need or by industry.
        </SectionHead>
      </div></section>

      <section className="section"><div className="container">
        <h3>By need</h3>
        <div className="grid grid-4 mt-2">
          {Object.entries(STATIC_SOLUTIONS).map(([key, text]) => (
            <Link key={key} to={`/solutions/${key}`} className="card card--hover" style={{ display: 'block' }}>
              <div className="empty__icon" style={{ marginBottom: 10 }}><Layers size={18} /></div>
              <h4 style={{ textTransform: 'capitalize', fontSize: '1rem' }}>{key.replace(/-/g, ' ')}</h4>
              <p className="mt-1" style={{ fontSize: '.85rem' }}>{text}</p>
            </Link>
          ))}
        </div>

        <h3 className="mt-4">By industry</h3>
        <div className="grid grid-4 mt-2">
          {industries.map((ind) => (
            <Link key={ind.slug} to={`/solutions/${ind.slug}`} className="card card--hover" style={{ display: 'block' }}>
              <h4 style={{ fontSize: '1rem' }}>{ind.name}</h4>
              <p className="mt-1" style={{ fontSize: '.85rem' }}>{ind.summary}</p>
            </Link>
          ))}
        </div>
      </div></section>
    </>
  );
}
