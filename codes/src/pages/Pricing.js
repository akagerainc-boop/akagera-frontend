import React, { useEffect, useState } from 'react';
import { CheckCircle2, ArrowRight } from 'lucide-react';
import { contentAPI } from '../api';
import { useNavigate } from 'react-router-dom';

function Pricing() {
  const [plans, setPlans] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);

    const loadContent = async () => {
      try {
        const response = await contentAPI.getSiteContent();
        setPlans(response.data.pricing || []);
      } catch (error) {
        setPlans([]);
      }
    };

    loadContent();
  }, []);

  return (
    <div className="page-shell">
      <section className="page-hero">
        <div className="container page-hero-content">
          <div style={{ maxWidth: '760px' }}>
            <h1 style={{ fontSize: 'clamp(2.3rem, 5vw, 4rem)', marginBottom: '16px' }}>Pricing</h1>
            <p style={{ marginBottom: 0, color: 'rgba(255,255,255,0.88)' }}>
              Flexible packages for startups, growing businesses, and enterprise clients.
            </p>
          </div>
        </div>
      </section>

      <section className="section-padding">
        <div className="container">
          <div className="page-grid-three">
            {plans.map((plan) => (
              <div key={plan.name} className="surface-card" style={{ padding: '30px', border: plan.name === 'Professional' ? '2px solid var(--primary-blue)' : '1px solid rgba(0,0,0,0.06)' }}>
                <p style={{ color: 'var(--dark-gray)', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: '8px' }}>{plan.name}</p>
                <h2 style={{ color: 'var(--primary-blue)', marginBottom: '12px' }}>{plan.price}</h2>
                <p style={{ color: 'var(--dark-gray)', minHeight: '72px' }}>{plan.description}</p>
                <div style={{ display: 'grid', gap: '10px', marginTop: '18px' }}>
                  {plan.features.map((feature) => (
                    <div key={feature} style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--dark-gray)' }}>
                      <CheckCircle2 size={18} style={{ color: 'var(--primary-blue)', flexShrink: 0 }} />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
                <button className="btn btn-primary btn-large" style={{ width: '100%', marginTop: '24px' }} onClick={() => navigate('/contact')}>
                  Request Quote <ArrowRight size={18} style={{ marginLeft: '8px' }} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

export default Pricing;
