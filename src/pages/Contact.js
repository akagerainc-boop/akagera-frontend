import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Mail, Phone, MapPin, MessageCircle, CheckCircle2 } from 'lucide-react';
import Seo from '../components/Seo';
import { SectionHead, Breadcrumbs } from '../components/ui';
import { IosSpinner } from '../components/Loader';
import { useSite } from '../components/SiteContext';
import { contactAPI, errText } from '../api';

const INTENTS = [
  ['general', 'General inquiry'], ['project', 'Start a project'], ['support', 'Technical support'],
  ['partnership', 'Partnership'], ['internship', 'Internship'], ['careers', 'Careers'], ['sales', 'Sales'],
];

export default function Contact() {
  const [params] = useSearchParams();
  const { settings } = useSite();
  const c = settings?.contact_info || {};
  const [form, setForm] = useState({
    name: '', email: '', phone: '', company: '', subject: '',
    inquiry_type: params.get('intent') || 'general', message: '',
  });
  const [state, setState] = useState('idle');
  const [err, setErr] = useState(null);

  const submit = async (e) => {
    e.preventDefault();
    setState('sending'); setErr(null);
    try {
      await contactAPI.submit(form);
      setState('done');
    } catch (e2) { setState('idle'); setErr(errText(e2)); }
  };

  return (
    <>
      <Seo title="Contact" description="Get in touch with Akagera Inc." />
      <section className="section section--soft section--tight"><div className="container">
        <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'Contact' }]} />
        <SectionHead eyebrow="Contact" title="Let's talk">Tell us what you're building — we usually respond within one business day.</SectionHead>
      </div></section>

      <section className="section"><div className="container grid grid-2" style={{ alignItems: 'start' }}>
        {state === 'done' ? (
          <div className="card text-center">
            <div className="empty__icon" style={{ background: '#E7F4EC', color: 'var(--ok)' }}><CheckCircle2 size={26} /></div>
            <h3 className="mt-2">Message sent</h3>
            <p className="muted">Thanks — we'll be in touch shortly.</p>
          </div>
        ) : (
          <form className="card" onSubmit={submit}>
            <div className="row" style={{ gap: 12 }}>
              <div className="field" style={{ flex: 1 }}><label>Name *</label><input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
              <div className="field" style={{ flex: 1 }}><label>Email *</label><input type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></div>
            </div>
            <div className="row" style={{ gap: 12 }}>
              <div className="field" style={{ flex: 1 }}><label>Phone</label><input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} /></div>
              <div className="field" style={{ flex: 1 }}><label>Company</label><input value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} /></div>
            </div>
            <div className="field"><label>Topic</label>
              <select value={form.inquiry_type} onChange={(e) => setForm({ ...form, inquiry_type: e.target.value })}>
                {INTENTS.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
              </select>
            </div>
            <div className="field"><label>Subject</label><input value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} /></div>
            <div className="field"><label>Message *</label><textarea required value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} /></div>
            {err && <p style={{ color: 'var(--err)', fontSize: '.85rem' }}>{err}</p>}
            <button className="btn btn--primary btn--block" disabled={state === 'sending'}>{state === 'sending' ? <IosSpinner size="sm" /> : 'Send message'}</button>
          </form>
        )}

        <aside className="stack">
          <div className="card">
            <div className="stack" style={{ gap: 16 }}>
              <div className="row" style={{ gap: 12, alignItems: 'flex-start' }}><Mail size={18} style={{ color: 'var(--brand)' }} /><a href={`mailto:${c.email}`}>{c.email}</a></div>
              <div className="row" style={{ gap: 12, alignItems: 'flex-start' }}><Phone size={18} style={{ color: 'var(--brand)' }} /><a href={`tel:${(c.phone || '').replace(/\s/g, '')}`}>{c.phone}</a></div>
              <div className="row" style={{ gap: 12, alignItems: 'flex-start' }}><MessageCircle size={18} style={{ color: 'var(--brand)' }} />
                <a href={`https://wa.me/${String(c.whatsapp || '').replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer">WhatsApp chat</a></div>
              <div className="row" style={{ gap: 12, alignItems: 'flex-start' }}><MapPin size={18} style={{ color: 'var(--brand)' }} /><span>{(c.address_lines || []).join(', ')}</span></div>
            </div>
          </div>
          <div className="card card--flush" style={{ overflow: 'hidden' }}>
            <iframe title="map" src={`https://www.google.com/maps?q=${encodeURIComponent(c.map_query || 'Musanze,Rwanda')}&z=14&output=embed`} style={{ width: '100%', minHeight: 240, border: 0 }} loading="lazy" />
          </div>
        </aside>
      </div></section>
    </>
  );
}
