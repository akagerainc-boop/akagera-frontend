import React, { useEffect, useState } from 'react';
import { LockKeyhole, BadgeCheck, ArrowRight } from 'lucide-react';
import { businessAPI } from '../api';

function BusinessPortal() {
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({ business_name: '', category: '', token: '' });
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    const loadCategories = async () => {
      try {
        const response = await businessAPI.getCategories();
        setCategories(response.data.categories || []);
        setForm((current) => ({ ...current, category: response.data.categories?.[0] || '' }));
      } catch (error) {
        setCategories([]);
      }
    };

    loadCategories();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const response = await businessAPI.login({
        business_name: form.business_name,
        category: form.category,
        token: form.token,
      });
      localStorage.setItem('business_access', JSON.stringify(response.data.business));
      localStorage.setItem('business_access_token', response.data.access_token || '');
      setMessage(`Access granted for ${response.data.business.business_name}. Token verified.`);
    } catch (error) {
      setMessage(error.response?.data?.detail || 'Unable to verify business access.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-shell">
      <section className="page-hero">
        <div className="container page-hero-content">
          <div style={{ maxWidth: '760px' }}>
            <h1 style={{ fontSize: 'clamp(2.3rem, 5vw, 4rem)', marginBottom: '16px' }}>Business Portal</h1>
            <p style={{ marginBottom: 0, color: 'rgba(255,255,255,0.88)' }}>
              Access purchased systems using the business name, category, and 10-character access token issued by Akagera Inc.
            </p>
          </div>
        </div>
      </section>

      <section className="page-section">
        <div className="container">
          <div className="page-grid-two" style={{ alignItems: 'start' }}>
            <form onSubmit={handleSubmit} className="surface-card" style={{ padding: '30px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '18px', color: 'var(--primary-blue)' }}>
                <LockKeyhole size={22} />
                <h2 style={{ margin: 0, color: 'var(--primary-blue)' }}>Login to your business system</h2>
              </div>

              <div className="form-grid" style={{ display: 'grid', gap: '14px' }}>
                <input
                  className="input"
                  placeholder="Business name"
                  value={form.business_name}
                  onChange={(event) => setForm({ ...form, business_name: event.target.value })}
                  required
                />
                <select
                  className="input"
                  value={form.category}
                  onChange={(event) => setForm({ ...form, category: event.target.value })}
                  required
                >
                  <option value="">Select category</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
                <input
                  className="input"
                  placeholder="10-digit access token"
                  value={form.token}
                  maxLength={10}
                  onChange={(event) => setForm({ ...form, token: event.target.value.toUpperCase() })}
                  required
                />
              </div>

              <button className="btn btn-primary btn-large" style={{ width: '100%', marginTop: '18px' }} disabled={loading}>
                {loading ? 'Checking access...' : 'Enter portal'} <ArrowRight size={18} style={{ marginLeft: '8px' }} />
              </button>

              {message && (
                <div style={{ marginTop: '16px', padding: '14px 16px', borderRadius: '14px', background: 'rgba(11,60,93,0.08)', color: 'var(--dark-gray)' }}>
                  {message}
                </div>
              )}
            </form>

            <div className="page-grid-stack" style={{ gap: '20px' }}>
              <div className="surface-card" style={{ padding: '26px' }}>
                <h3 style={{ color: 'var(--primary-blue)', marginBottom: '12px' }}>Supported categories</h3>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                  {categories.map((category) => (
                    <span key={category} className="badge">{category}</span>
                  ))}
                </div>
              </div>

              <div className="dark-surface surface-card" style={{ padding: '26px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                  <BadgeCheck size={22} />
                  <h3 style={{ color: 'white', margin: 0 }}>Token rules</h3>
                </div>
                <ul style={{ margin: 0, paddingLeft: '18px', lineHeight: 1.9 }}>
                  <li>Exactly 10 characters</li>
                  <li>Uppercase letters and numbers</li>
                  <li>Generated by the admin dashboard</li>
                  <li>Expires according to the configured access period</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default BusinessPortal;
