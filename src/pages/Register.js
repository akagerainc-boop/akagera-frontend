import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Seo from '../components/Seo';
import GoogleAuthButton from '../components/GoogleAuthButton';
import { IosSpinner } from '../components/Loader';
import { useAuth } from '../context/AuthContext';
import { errText } from '../api';

export default function Register() {
  const { register } = useAuth();
  const nav = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', company: '', country: '' });
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState(null);

  const submit = async (e) => {
    e.preventDefault();
    if (form.password.length < 8) { setErr('Password must be at least 8 characters.'); return; }
    setBusy(true); setErr(null);
    try {
      await register(form);
      nav('/dashboard', { replace: true });
    } catch (e2) { setErr(errText(e2)); setBusy(false); }
  };

  return (
    <>
      <Seo title="Create account" />
      <section className="section"><div className="container" style={{ maxWidth: 460 }}>
        <h1>Create your account</h1>
        <p className="muted mt-1">Buy services, manage licenses and subscriptions, and download software.</p>
        <form className="card mt-3" onSubmit={submit}>
          <div className="field"><label>Full name</label><input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
          <div className="field"><label>Email</label><input type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></div>
          <div className="field"><label>Password</label><input type="password" required value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} /><span className="hint">At least 8 characters.</span></div>
          <div className="row" style={{ gap: 12 }}>
            <div className="field" style={{ flex: 1 }}><label>Company</label><input value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} /></div>
            <div className="field" style={{ flex: 1 }}><label>Country</label><input value={form.country} onChange={(e) => setForm({ ...form, country: e.target.value })} /></div>
          </div>
          {err && <p style={{ color: 'var(--err)', fontSize: '.85rem' }}>{err}</p>}
          <button className="btn btn--primary btn--block" disabled={busy}>{busy ? <IosSpinner size="sm" /> : 'Create account'}</button>
          <div className="row mt-2" style={{ justifyContent: 'center', color: 'var(--n-400)', fontSize: '.85rem' }}>or</div>
          <GoogleAuthButton label="Sign up with Google" onDone={() => nav('/dashboard', { replace: true })} />
        </form>
        <p className="mt-2 muted" style={{ fontSize: '.9rem' }}>Already have an account? <Link to="/login">Sign in</Link></p>
      </div></section>
    </>
  );
}
