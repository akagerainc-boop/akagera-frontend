import React, { useEffect, useState } from 'react';
import { Mail, Phone, MapPin, Globe, Send } from 'lucide-react';
import { contactAPI } from '../api';

function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', service_required: '', message: '' });
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setStatus('');

    try {
      await contactAPI.submit(form);
      setStatus('Your message has been sent successfully. We will respond soon.');
      setForm({ name: '', email: '', phone: '', service_required: '', message: '' });
    } catch (error) {
      setStatus(error.response?.data?.detail || 'Unable to submit the contact form right now.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-shell">
      <section className="page-hero" style={{ textAlign: 'center' }}>
        <div className="container page-hero-content">
          <h1 style={{ fontSize: 'clamp(2.3rem, 5vw, 4rem)', marginBottom: '14px' }}>Contact Akagera Inc</h1>
          <p style={{ maxWidth: '760px', margin: '0 auto', color: 'rgba(255,255,255,0.9)' }}>
            Send a project brief, request software, or ask about a business portal, and we will respond with the next step.
          </p>
        </div>
      </section>

      <section className="page-section">
        <div className="container">
          <div className="page-grid-two" style={{ alignItems: 'start' }}>
            <div className="page-grid-stack" style={{ gap: '20px' }}>
              <div className="surface-card info-card">
                <Mail size={20} />
                <div>
                  <h3>Email</h3>
                  <p>info@akagerainc.com</p>
                  <p>support@akagerainc.com</p>
                </div>
              </div>
              <div className="surface-card info-card">
                <Phone size={20} />
                <div>
                  <h3>Phone</h3>
                  <p>+250 795 226 123</p>
                </div>
              </div>
              <div className="surface-card info-card">
                <MapPin size={20} />
                <div>
                  <h3>Location</h3>
                  <p>Musanze, Rwanda</p>
                </div>
              </div>
              <div className="surface-card info-card">
                <Globe size={20} />
                <div>
                  <h3>Social</h3>
                  <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                    <a href="https://www.linkedin.com/" target="_blank" rel="noreferrer">LinkedIn</a>
                    <a href="https://www.facebook.com/" target="_blank" rel="noreferrer">Facebook</a>
                    <a href="https://www.twitter.com/" target="_blank" rel="noreferrer">Twitter</a>
                  </div>
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="contact-form-card surface-card">
              <h2 style={{ color: 'var(--primary-blue)', marginBottom: '18px' }}>Send a message</h2>
              <div className="input-grid">
                <input className="input" placeholder="Your name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
                <input className="input" type="email" placeholder="Email address" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
                <input className="input" placeholder="Phone number" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
                <input className="input" placeholder="Service required" value={form.service_required} onChange={(e) => setForm({ ...form, service_required: e.target.value })} />
              </div>
              <textarea className="input" rows="6" placeholder="Project details" value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} required style={{ marginTop: '14px' }} />
              <button className="btn btn-primary btn-large" style={{ width: '100%', marginTop: '16px' }} disabled={loading}>
                {loading ? 'Sending...' : 'Send message'} <Send size={18} style={{ marginLeft: '8px' }} />
              </button>
              {status && (
                <div style={{ marginTop: '14px', padding: '14px 16px', borderRadius: '14px', background: 'rgba(11,60,93,0.08)', color: 'var(--dark-gray)' }}>
                  {status}
                </div>
              )}
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}

export default ContactPage;
