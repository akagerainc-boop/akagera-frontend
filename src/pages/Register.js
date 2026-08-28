import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CheckCircle2 } from 'lucide-react';
import Seo from '../components/Seo';
import GoogleAuthButton from '../components/GoogleAuthButton';
import OtpInput from '../components/OtpInput';
import { IosSpinner } from '../components/Loader';
import { useAuth } from '../context/AuthContext';
import { authAPI, errText } from '../api';

export default function Register() {
  const { register, refresh } = useAuth();
  const nav = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', company: '', country: '' });
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState(null);
  const [stage, setStage] = useState('form'); // form | verify
  const [code, setCode] = useState('');
  const [note, setNote] = useState(null);

  const submit = async (e) => {
    e.preventDefault();
    if (form.password.length < 8) { setErr('Password must be at least 8 characters.'); return; }
    setBusy(true); setErr(null);
    try {
      await register(form);
      try {
        const { data } = await authAPI.otpRequest(form.email, 'verify');
        setNote(data.dev_code ? `Dev code: ${data.dev_code}` : `We emailed a 6-digit code to ${form.email}.`);
      } catch { /* verification is optional */ }
      setStage('verify');
    } catch (e2) { setErr(errText(e2)); }
    finally { setBusy(false); }
  };

  const verify = async (e) => {
    e.preventDefault();
    setBusy(true); setErr(null);
    try {
      await authAPI.otpVerify({ email: form.email, code, purpose: 'verify' });
      await refresh();
      nav('/dashboard', { replace: true });
    } catch (e2) { setErr(errText(e2)); setBusy(false); }
  };

  if (stage === 'verify') {
    return (
      <>
        <Seo title="Verify your email" />
        <section className="section"><div className="container" style={{ maxWidth: 420 }}>
          <div className="empty__icon" style={{ background: '#E7F4EC', color: 'var(--ok)' }}><CheckCircle2 size={24} /></div>
          <h1 className="mt-2">Account created</h1>
          <p className="muted mt-1">Verify your email to finish, or skip for now.</p>
          <form className="card mt-3" onSubmit={verify}>
            <OtpInput value={code} onChange={setCode} disabled={busy} />
            {note && <p className="muted mt-2 text-center" style={{ fontSize: '.82rem' }}>{note}</p>}
            {err && <p style={{ color: 'var(--err)', fontSize: '.85rem' }}>{err}</p>}
            <button className="btn btn--primary btn--block mt-2" disabled={busy || code.length < 6}>{busy ? <IosSpinner size="sm" /> : 'Verify email'}</button>
            <button type="button" className="btn btn--ghost btn--block" onClick={() => nav('/dashboard', { replace: true })}>Skip for now</button>
            <button type="button" className="btn btn--ghost btn--sm" onClick={() => authAPI.otpRequest(form.email, 'verify').then(({ data }) => setNote(data.dev_code ? `Dev code: ${data.dev_code}` : 'Code resent.'))} disabled={busy}>Resend code</button>
          </form>
        </div></section>
      </>
    );
  }

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
