import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import Seo from '../components/Seo';
import GoogleAuthButton from '../components/GoogleAuthButton';
import { IosSpinner } from '../components/Loader';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { login } = useAuth();
  const nav = useNavigate();
  const location = useLocation();
  const to = location.state?.from || '/dashboard';
  const [form, setForm] = useState({ email: '', password: '' });
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState(null);

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true); setErr(null);
    try {
      await login(form.email, form.password);
      nav(to, { replace: true });
    } catch (e2) {
      setErr(e2?.response?.data?.detail || 'Invalid email or password.');
      setBusy(false);
    }
  };

  return (
    <>
      <Seo title="Sign in" />
      <section className="section"><div className="container" style={{ maxWidth: 420 }}>
        <h1>Sign in</h1>
        <p className="muted mt-1">Access your orders, licenses, downloads, and support.</p>
        <form className="card mt-3" onSubmit={submit}>
          <div className="field"><label>Email</label><input type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></div>
          <div className="field"><label>Password</label><input type="password" required value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} /></div>
          {err && <p style={{ color: 'var(--err)', fontSize: '.85rem' }}>{err}</p>}
          <button className="btn btn--primary btn--block" disabled={busy}>{busy ? <IosSpinner size="sm" /> : 'Sign in'}</button>
          <div className="row mt-2" style={{ justifyContent: 'center', color: 'var(--n-400)', fontSize: '.85rem' }}>or</div>
          <GoogleAuthButton onDone={() => nav(to, { replace: true })} />
        </form>
        <p className="mt-2 muted" style={{ fontSize: '.9rem' }}>New here? <Link to="/register">Create an account</Link></p>
      </div></section>
    </>
  );
}
