import React from 'react';
import { Link } from 'react-router-dom';
import { Target, Eye, Heart, Cpu, Workflow, Award, Globe2 } from 'lucide-react';
import Seo from '../components/Seo';
import { SectionHead } from '../components/ui';
import { useSite } from '../components/SiteContext';

export default function About() {
  const { settings } = useSite();
  const c = settings?.company_info || {};
  const blocks = [
    { icon: <Target size={20} />, title: 'Our mission', text: c.mission || 'To create useful, scalable, and reliable technology that helps people and organizations do more.' },
    { icon: <Eye size={20} />, title: 'Our vision', text: c.vision || 'A connected Africa where every organization runs on software it can trust.' },
    { icon: <Cpu size={20} />, title: 'Technology', text: 'React, FastAPI, cloud infrastructure, and mobile-first engineering — chosen for reliability, not novelty.' },
    { icon: <Workflow size={20} />, title: 'Our approach', text: 'Discovery, design, build, test, deploy, maintain — with demos every step so you always know where things stand.' },
    { icon: <Award size={20} />, title: 'Why Akagera', text: 'Clean code, clear communication, and long-term support. We build software we can stand behind.' },
    { icon: <Globe2 size={20} />, title: 'Global reach', text: 'Headquartered in Musanze, Rwanda — delivering remotely for clients across sectors and borders.' },
  ];
  return (
    <>
      <Seo title="About" description="Akagera Inc is a software solutions company focused on useful, scalable, and reliable technology." />
      <section className="hero" style={{ minHeight: 'auto' }}>
        <div className="hero__scrim" style={{ background: 'linear-gradient(120deg, #171717, #4a1a12)' }} />
        <div className="container"><div className="hero__inner" style={{ paddingTop: 90, paddingBottom: 70 }}>
          <span className="eyebrow" style={{ color: '#fff', opacity: .8 }}>About Akagera Inc</span>
          <h1>We build software that organizations can trust.</h1>
          <p className="lead mt-2" style={{ color: 'rgba(255,255,255,.85)' }}>
            {c.who_we_are || 'Akagera Inc is a technology and software solutions company. We design, build, and maintain software across mobile, web, desktop, and cloud.'}
          </p>
        </div></div>
      </section>

      <section className="section">
        <div className="container">
          <SectionHead eyebrow="Who we are" title="A focused software company" center>
            Founded {c.founded || '2021'} · {c.headquarters || 'Musanze, Rwanda'}
          </SectionHead>
          <div className="grid grid-3">
            {blocks.map((b) => (
              <div key={b.title} className="card">
                <div className="empty__icon" style={{ marginBottom: 12 }}>{b.icon}</div>
                <h3 style={{ fontSize: '1.15rem' }}>{b.title}</h3>
                <p className="mt-1" style={{ fontSize: '.92rem' }}>{b.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section section--soft">
        <div className="container">
          <SectionHead eyebrow="Our values" title="What we hold to" />
          <div className="chip-row">
            {(c.values || ['Reliability', 'Craft', 'Transparency', 'Long-term thinking', 'Customer obsession']).map((v) => (
              <span key={v} className="pill" style={{ fontSize: '.95rem', padding: '10px 16px' }}><Heart size={14} style={{ color: 'var(--brand)' }} /> {v}</span>
            ))}
          </div>
        </div>
      </section>

      <section className="section section--brand">
        <div className="container between">
          <h2>Have a project in mind?</h2>
          <Link to="/contact?intent=project" className="btn btn--on-dark btn--lg">Start a conversation</Link>
        </div>
      </section>
    </>
  );
}
