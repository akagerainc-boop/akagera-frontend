import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Building2, LockKeyhole, LogOut, ShieldCheck, Clock, ArrowRight } from 'lucide-react';
import Seo from '../components/Seo';
import { IosSpinner } from '../components/Loader';
import { SectionHead, StatusBadge } from '../components/ui';
import { businessAPI, errText } from '../api';

export default function BusinessPortal() {
  const [session, setSession] = useState(() => {
    try { return JSON.parse(localStorage.getItem('business_session') || 'null'); } catch { return null; }
  });
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({ business_name: '', category: '', token: '' });
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState(null);

  useEffect(() => {
    businessAPI.getCategories().then((r) => {
      setCategories(r.data.categories || []);
      setForm((f) => ({ ...f, category: r.data.categories?.[0] || '' }));
    }).catch(() => {});
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true); setErr(null);
    try {
      const { data } = await businessAPI.login({ ...form, token: form.token.trim().toUpperCase() });
      localStorage.setItem('business_session', JSON.stringify(data.business));
      localStorage.setItem('business_token', data.access_token || '');
      setSession(data.business);
    } catch (e2) { setErr(errText(e2)); }
    finally { setBusy(false); }
  };

  const signOut = () => {
    localStorage.removeItem('business_session');
    localStorage.removeItem('business_token');
    setSession(null);
  };

  if (session) {
    return (
      <>
        <Seo title="Business Portal" />
        <section className="section section--dark section--tight"><div className="container between">
          <div>
            <span className="eyebrow" style={{ color: '#fff', opacity: .7 }}>Business Portal</span>
            <h1 style={{ fontSize: '2rem' }}>{session.business_name}</h1>
            <div className="row mt-1" style={{ color: 'rgba(255,255,255,.75)' }}>
              <span>{session.category}</span> · <StatusBadge status={session.status} />
            </div>
          </div>
          <button className="btn btn--outline-light btn--sm" onClick={signOut}><LogOut size={14} /> Sign out</button>
        </div></section>

        <section className="section"><div className="container grid grid-3">
          <div className="card">
            <div className="empty__icon"><Building2 size={20} /></div>
            <h3 className="mt-2">Access token</h3>
            <code style={{ fontFamily: 'monospace', letterSpacing: 1 }}>{session.token}</code>
            <div className="muted mt-1" style={{ fontSize: '.82rem' }}><Clock size={12} style={{ display: 'inline' }} /> Expires {session.expires_at ? new Date(session.expires_at).toLocaleDateString() : '—'}</div>
          </div>
          <div className="card">
            <h3>Purchased systems</h3>
            <p className="muted mt-1" style={{ fontSize: '.9rem' }}>Your private system links appear here once provisioned by our team.</p>
            <Link to="/support" className="btn btn--secondary btn--sm mt-2">Request access</Link>
          </div>
          <div className="card">
            <h3>Support</h3>
            <p className="muted mt-1" style={{ fontSize: '.9rem' }}>Need a change or a new user? Open a ticket and reference your business name.</p>
            <Link to="/support" className="btn btn--primary btn--sm mt-2">Open a ticket</Link>
          </div>
        </div></section>
      </>
    );
  }

  return (
    <>
      <Seo title="Business Portal" description="Businesses sign in to their Akagera Inc dashboard with a 10-character access token." />
      <section className="section section--dark section--tight"><div className="container">
        <SectionHead eyebrow="Business Portal" title="Sign in to your business dashboard" />
        <p style={{ color: 'rgba(255,255,255,.8)', maxWidth: 640 }}>
          Access purchased systems with your business name, category, and the 10-character access token issued by Akagera Inc.
        </p>
      </div></section>

      <section className="section"><div className="container grid grid-2" style={{ alignItems: 'start' }}>
        <form className="card card--pad-lg" onSubmit={submit}>
          <div className="row" style={{ gap: 10, color: 'var(--brand)' }}><LockKeyhole size={20} /><h3>Business login</h3></div>
          <div className="field mt-2"><label>Business name</label><input required value={form.business_name} onChange={(e) => setForm({ ...form, business_name: e.target.value })} /></div>
          <div className="field"><label>Category</label>
            <select required value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
              <option value="">Select…</option>
              {categories.map((c) => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div className="field"><label>Access token</label>
            <input required maxLength={10} value={form.token} onChange={(e) => setForm({ ...form, token: e.target.value.toUpperCase() })} placeholder="10 characters" />
          </div>
          {err && <p style={{ color: 'var(--err)', fontSize: '.85rem' }}>{err}</p>}
          <button className="btn btn--primary btn--block" disabled={busy}>{busy ? <IosSpinner size="sm" /> : <>Enter portal <ArrowRight size={15} /></>}</button>
        </form>

        <aside className="stack">
          <div className="card">
            <h3>Supported categories</h3>
            <div className="chip-row mt-2">{categories.map((c) => <span key={c} className="pill">{c}</span>)}</div>
          </div>
          <div className="card section--dark" style={{ background: 'var(--ink)' }}>
            <div className="row" style={{ gap: 8 }}><ShieldCheck size={18} style={{ color: 'var(--brand)' }} /><h3 style={{ color: '#fff' }}>Token rules</h3></div>
            <ul className="stack mt-2" style={{ color: 'rgba(255,255,255,.8)', paddingLeft: 18 }}>
              <li>Exactly 10 characters, uppercase + digits</li>
              <li>Issued from the admin dashboard on purchase</li>
              <li>Expires after the configured access period</li>
            </ul>
          </div>
        </aside>
      </div></section>
    </>
  );
}
