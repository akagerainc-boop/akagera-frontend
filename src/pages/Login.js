import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Mail, KeyRound, ArrowLeft } from 'lucide-react';
import Seo from '../components/Seo';
import GoogleAuthButton from '../components/GoogleAuthButton';
import OtpInput from '../components/OtpInput';
import { IosSpinner } from '../components/Loader';
import { useAuth } from '../context/AuthContext';
import { authAPI, errText } from '../api';

export default function Login() {
  const { login, otpLogin } = useAuth();
  const nav = useNavigate();
  const location = useLocation();
  const to = location.state?.from || '/dashboard';

  const [mode, setMode] = useState('password'); // password | code
  const [form, setForm] = useState({ email: '', password: '' });
  const [code, setCode] = useState('');
  const [step, setStep] = useState('enter'); // enter | verify
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState(null);
  const [note, setNote] = useState(null);

  const done = () => nav(to, { replace: true });

  const submitPassword = async (e) => {
    e.preventDefault();
    setBusy(true); setErr(null);
    try { await login(form.email, form.password); done(); }
    catch (e2) { setErr(e2?.response?.data?.detail || 'Invalid email or password.'); setBusy(false); }
  };

  const sendCode = async (e) => {
    e?.preventDefault();
    if (!form.email) { setErr('Enter your email first.'); return; }
    setBusy(true); setErr(null); setNote(null);
    try {
      const { data } = await authAPI.otpRequest(form.email, 'login');
      setStep('verify');
      setNote(data.dev_code ? `Dev code: ${data.dev_code}` : 'Check your inbox for a 6-digit code.');
    } catch (e2) { setErr(errText(e2)); }
    finally { setBusy(false); }
  };

  const verifyCode = async (e) => {
    e.preventDefault();
    setBusy(true); setErr(null);
    try { await otpLogin(form.email, code); done(); }
    catch (e2) { setErr(errText(e2)); setBusy(false); }
  };

  return (
    <>
      <Seo title="Sign in" />
      <section className="section"><div className="container" style={{ maxWidth: 420 }}>
        <h1>Sign in</h1>
        <p className="muted mt-1">Access your orders, licenses, downloads, and support.</p>

        <div className="row mt-3" style={{ gap: 6, background: 'var(--n-100)', padding: 4, borderRadius: 'var(--r-sm)' }}>
          {['password', 'code'].map((m) => (
            <button key={m} className="btn btn--sm" style={{ flex: 1, background: mode === m ? '#fff' : 'transparent', boxShadow: mode === m ? 'var(--shadow-1)' : 'none' }}
              onClick={() => { setMode(m); setStep('enter'); setErr(null); setNote(null); }}>
              {m === 'password' ? <><KeyRound size={14} /> Password</> : <><Mail size={14} /> Email code</>}
            </button>
          ))}
        </div>

        {mode === 'password' && (
          <form className="card mt-3" onSubmit={submitPassword}>
            <div className="field"><label>Email</label><input type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></div>
            <div className="field"><label>Password</label><input type="password" required value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} /></div>
            {err && <p style={{ color: 'var(--err)', fontSize: '.85rem' }}>{err}</p>}
            <button className="btn btn--primary btn--block" disabled={busy}>{busy ? <IosSpinner size="sm" /> : 'Sign in'}</button>
            <div className="text-center mt-1"><Link to="/forgot-password" style={{ fontSize: '.85rem' }}>Forgot password?</Link></div>
            <div className="row mt-2" style={{ justifyContent: 'center', color: 'var(--n-400)', fontSize: '.85rem' }}>or</div>
            <GoogleAuthButton onDone={done} />
          </form>
        )}

        {mode === 'code' && (
          <form className="card mt-3" onSubmit={step === 'enter' ? sendCode : verifyCode}>
            {step === 'enter' ? (
              <>
                <div className="field"><label>Email</label><input type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="you@example.com" /></div>
                <p className="muted" style={{ fontSize: '.85rem' }}>We'll email you a 6-digit code — no password needed.</p>
                {err && <p style={{ color: 'var(--err)', fontSize: '.85rem' }}>{err}</p>}
                <button className="btn btn--primary btn--block" disabled={busy}>{busy ? <IosSpinner size="sm" /> : 'Send code'}</button>
              </>
            ) : (
              <>
                <button type="button" className="btn btn--ghost btn--sm" style={{ alignSelf: 'flex-start', paddingLeft: 0 }} onClick={() => { setStep('enter'); setCode(''); }}>
                  <ArrowLeft size={14} /> Change email
                </button>
                <label className="mt-1" style={{ fontWeight: 600, fontSize: '.9rem' }}>Enter the code sent to {form.email}</label>
                <div className="mt-2"><OtpInput value={code} onChange={setCode} disabled={busy} /></div>
                {note && <p className="muted mt-2 text-center" style={{ fontSize: '.82rem' }}>{note}</p>}
                {err && <p style={{ color: 'var(--err)', fontSize: '.85rem' }}>{err}</p>}
                <button className="btn btn--primary btn--block mt-2" disabled={busy || code.length < 6}>{busy ? <IosSpinner size="sm" /> : 'Verify & sign in'}</button>
                <button type="button" className="btn btn--ghost btn--sm" onClick={sendCode} disabled={busy}>Resend code</button>
              </>
            )}
          </form>
        )}

        <p className="mt-2 muted" style={{ fontSize: '.9rem' }}>New here? <Link to="/register">Create an account</Link></p>
      </div></section>
    </>
  );
}
