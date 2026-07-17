import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Smartphone, Globe, ShieldCheck, Building2, Star, Download, Users, Briefcase, MapPin } from 'lucide-react';
import ImageCarousel from '../components/ImageCarousel';
import { appAPI, serviceAPI, contentAPI } from '../api';

const fallbackContent = {
  hero: {
    title: 'Building Innovative Software Solutions For Businesses And Communities.',
    subtitle: 'Akagera Inc develops mobile applications, websites, enterprise systems and digital solutions that help organizations grow.',
  },
  services: [],
  business_categories: ['Restaurant', 'School', 'Hospital', 'Hotel', 'Shop', 'Pharmacy'],
  portfolio: [],
  pricing: [],
};

function HomePage() {
  const [apps, setApps] = useState([]);
  const [services, setServices] = useState([]);
  const [siteContent, setSiteContent] = useState(fallbackContent);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);

    const loadHomeData = async () => {
      try {
        const [contentRes, appsRes, servicesRes] = await Promise.all([
          contentAPI.getSiteContent(),
          appAPI.getAll(),
          serviceAPI.getAll(),
        ]);

        setSiteContent({ ...fallbackContent, ...contentRes.data });
        setApps(Array.isArray(appsRes.data) ? appsRes.data.slice(0, 6) : []);
        setServices(Array.isArray(servicesRes.data) ? servicesRes.data : []);
      } catch (error) {
        console.error('Unable to load home data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadHomeData();
  }, []);

  const stats = [
    { icon: <Users size={24} />, value: '10K+', label: 'Active users' },
    { icon: <Download size={24} />, value: '50K+', label: 'Downloads' },
    { icon: <Star size={24} />, value: '4.9/5', label: 'Client rating' },
    { icon: <ShieldCheck size={24} />, value: 'Production', label: 'Security ready' },
  ];

  const highlightCards = [
    { icon: <Smartphone size={24} />, title: 'Mobile Apps', text: 'Android and iOS applications designed for real business use.' },
    { icon: <Globe size={24} />, title: 'Web Systems', text: 'Secure dashboards, portals, and SaaS platforms built to scale.' },
    { icon: <Building2 size={24} />, title: 'Business Portal', text: 'Private access for customers using generated 10-digit tokens.' },
    { icon: <Briefcase size={24} />, title: 'Marketplace', text: 'Software products, licenses, downloads, and service packages.' },
  ];

  const serviceCards = (siteContent.services.length ? siteContent.services : services).slice(0, 4);

  return (
    <div style={{ background: 'var(--light-gray)' }}>
      <section className="hero" style={{ minHeight: '92vh', position: 'relative' }}>
        <ImageCarousel autoSlide={true} interval={5000} showDescriptions={false} />
        <div className="hero-overlay" style={{ background: 'linear-gradient(135deg, rgba(11,60,93,0.45), rgba(17,17,17,0.38))' }}>
          <div className="container">
            <div className="hero-content">
              <div className="hero-text" data-aos="fade-right">
                <div className="hero-kicker">Akagera Inc Digital Platform</div>
                <h1>{siteContent.hero.title}</h1>
                <p>{siteContent.hero.subtitle}</p>
                <div className="hero-buttons">
                  <Link to="/apps" className="btn btn-primary btn-large">
                    Explore Products <ArrowRight size={18} style={{ marginLeft: '8px' }} />
                  </Link>
                  <Link to="/business" className="btn btn-secondary btn-large">
                    Business Portal
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section-padding" style={{ marginTop: '24px', paddingTop: '28px', paddingBottom: '24px', position: 'relative', zIndex: 5 }}>
        <div className="container">
          <div className="glass-grid">
            {stats.map((stat) => (
              <div key={stat.label} className="glass-card">
                <div className="glass-icon">{stat.icon}</div>
                <div>
                  <h3>{stat.value}</h3>
                  <p>{stat.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding">
        <div className="container">
          <div className="section-title" data-aos="fade-up">
            <h2>What We Build</h2>
            <p>Software products, service delivery platforms, and business portals that can be used in production.</p>
          </div>
          <div className="feature-grid">
            {highlightCards.map((card) => (
              <article key={card.title} className="feature-card" data-aos="fade-up">
                <div className="feature-icon">{card.icon}</div>
                <h3>{card.title}</h3>
                <p>{card.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding alt-section">
        <div className="container">
          <div className="section-title" data-aos="fade-up">
            <h2>Services</h2>
            <p>Production-ready delivery across mobile, web, cloud, and custom software.</p>
          </div>
          <div className="service-grid">
            {serviceCards.map((service, index) => (
              <article key={service.id || service.title} className="service-card-modern" data-aos="fade-up" data-aos-delay={index * 90}>
                <div className="service-card-top">
                  <div className="service-pill">{service.icon || 'Solution'}</div>
                </div>
                <h3>{service.title || service.name}</h3>
                <p>{service.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding">
        <div className="container">
          <div className="section-title" data-aos="fade-up">
            <h2>Featured Software</h2>
            <p>Highlights from the current marketplace catalog.</p>
          </div>
          <div className="portfolio-grid">
            {apps.map((app) => (
              <article key={app.id} className="portfolio-card" data-aos="fade-up">
                <h3>{app.name}</h3>
                <p>{app.short_description || app.description}</p>
                <div className="meta-row"><strong>Status:</strong> {app.requires_license ? 'Licensed product' : 'Free download'}</div>
                <div className="meta-row"><strong>Features:</strong> {(app.features || []).slice(0, 3).join(', ') || 'Available on request'}</div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding">
        <div className="container">
          <div className="two-column-grid">
            <div className="panel-card dark-panel" data-aos="fade-right">
              <h2>Marketplace Products</h2>
              <p>Showcase downloadable apps, web systems, and licensed software with secure access and purchase flows.</p>
              <div className="inline-points">
                <span>Downloadable software</span>
                <span>Paid licenses</span>
                <span>Platform details</span>
                <span>Purchase support</span>
              </div>
              <Link to="/apps" className="btn btn-outline btn-large" style={{ color: 'white', borderColor: 'white', marginTop: '18px' }}>
                View Products
              </Link>
            </div>

            <div className="panel-card light-panel" data-aos="fade-left">
              <h2>Business Portal</h2>
              <p>Each business receives a unique access token for its private system, managed by the admin dashboard.</p>
              <div className="token-list">
                {siteContent.business_categories.map((category) => (
                  <span key={category} className="badge">{category}</span>
                ))}
              </div>
              <Link to="/business" className="btn btn-primary btn-large" style={{ marginTop: '18px' }}>
                Access Portal <ArrowRight size={18} style={{ marginLeft: '8px' }} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="section-padding alt-section">
        <div className="container">
          <div className="section-title" data-aos="fade-up">
            <h2>Portfolio</h2>
            <p>Examples of systems we can present to clients in a production sales flow.</p>
          </div>
          <div className="portfolio-grid">
            {(siteContent.portfolio || []).map((project) => (
              <article key={project.name} className="portfolio-card" data-aos="fade-up">
                <h3>{project.name}</h3>
                <p>{project.description}</p>
                <div className="meta-row"><strong>Client:</strong> {project.client}</div>
                <div className="meta-row"><strong>Tech:</strong> {project.technology}</div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding">
        <div className="container">
          <div className="cta-band" data-aos="fade-up">
            <div>
              <h2>Ready to upgrade your business system?</h2>
              <p>Request software, ask for pricing, or send a project brief and we will take it from there.</p>
            </div>
            <div className="cta-actions">
              <Link to="/pricing" className="btn btn-secondary btn-large">See Pricing</Link>
              <Link to="/contact" className="btn btn-primary btn-large">Contact Us</Link>
            </div>
          </div>
        </div>
      </section>

      <section className="section-padding bg-muted">
        <div className="container">
          <div className="section-title" data-aos="fade-up">
            <h2>Our Location</h2>
            <p>Visit us in Musanze, Rwanda. The map below shows the office area so clients can find us easily.</p>
          </div>

          <div className="page-grid-two surface-card" data-aos="fade-up" style={{ overflow: 'hidden' }}>
            <div style={{ minHeight: '360px' }}>
              <iframe
                title="Akagera Inc location map"
                src="https://www.google.com/maps?q=Musanze,Rwanda&z=15&output=embed"
                style={{ width: '100%', height: '100%', minHeight: '360px', border: 0, display: 'block' }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>

            <div style={{ padding: '30px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px', color: 'var(--primary-blue)' }}>
                <MapPin size={28} />
                <h3 style={{ margin: 0 }}>Akagera Inc Headquarters</h3>
              </div>
              <p style={{ color: 'var(--dark-gray)' }}>
                Innovation Hub Building<br />
                Main Street, Musanze District<br />
                Northern Province, Rwanda
              </p>
              <p style={{ color: 'var(--dark-gray)', marginBottom: '18px' }}>
                Monday - Friday: 8:00 AM - 6:00 PM<br />
                Saturday: 9:00 AM - 1:00 PM<br />
                Sunday: Closed
              </p>
              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                <a href="https://maps.google.com/?q=Musanze,Rwanda" target="_blank" rel="noopener noreferrer" className="btn btn-primary">Get Directions</a>
                <Link to="/contact" className="btn btn-secondary">Contact Us</Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {loading && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(255,255,255,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50 }}>
          <div className="spinner"></div>
        </div>
      )}
    </div>
  );
}

export default HomePage;
