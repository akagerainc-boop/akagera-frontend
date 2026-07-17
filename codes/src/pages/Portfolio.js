import React, { useEffect, useState } from 'react';
import { Briefcase, Globe, Layers3 } from 'lucide-react';
import { contentAPI } from '../api';

function Portfolio() {
  const [portfolio, setPortfolio] = useState([]);

  useEffect(() => {
    window.scrollTo(0, 0);

    const loadContent = async () => {
      try {
        const response = await contentAPI.getSiteContent();
        setPortfolio(response.data.portfolio || []);
      } catch (error) {
        setPortfolio([]);
      }
    };

    loadContent();
  }, []);

  return (
    <div className="page-shell">
      <section className="page-hero">
        <div className="container page-hero-content">
          <div style={{ maxWidth: '760px' }}>
            <h1 style={{ fontSize: 'clamp(2.3rem, 5vw, 4rem)', marginBottom: '16px' }}>Portfolio</h1>
            <p style={{ marginBottom: 0, color: 'rgba(255,255,255,0.88)' }}>
              A selection of the software products and business systems Akagera Inc can present to clients and partners.
            </p>
          </div>
        </div>
      </section>

      <section className="section-padding">
        <div className="container">
          <div className="page-grid-three">
            {portfolio.map((project) => (
              <article key={project.name} className="surface-card" style={{ padding: '28px' }}>
                <div style={{ width: '52px', height: '52px', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(11,60,93,0.1)', color: 'var(--primary-blue)', marginBottom: '18px' }}>
                  <Briefcase size={24} />
                </div>
                <h3 style={{ color: 'var(--primary-blue)', marginBottom: '10px' }}>{project.name}</h3>
                <p style={{ color: 'var(--dark-gray)', marginBottom: '12px' }}>{project.description}</p>
                <div style={{ display: 'grid', gap: '10px', color: 'var(--dark-gray)' }}>
                  <div><strong>Client:</strong> {project.client}</div>
                  <div><strong>Technology:</strong> {project.technology}</div>
                </div>
              </article>
            ))}
          </div>

          <div className="page-grid-three" style={{ marginTop: '32px', gap: '20px' }}>
            <div className="glass-card"><Layers3 size={22} /> Software products</div>
            <div className="glass-card"><Globe size={22} /> Web portals</div>
            <div className="glass-card"><Briefcase size={22} /> Business dashboards</div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Portfolio;
