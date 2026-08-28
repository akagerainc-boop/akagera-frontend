import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import Seo from '../components/Seo';
import OtpInput from '../components/OtpInput';
import { IosSpinner } from '../components/Loader';
import { useAuth } from '../context/AuthContext';
import { authAPI, errText } from '../api';

export default function ForgotPassword() {
  const { finishPasswordReset } = useAuth();
  const nav = useNavigate();
  const [step, setStep] = useState('email'); // email | code | password
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [pw, setPw] = useState('');
  const [resetToken, setResetToken] = useState(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState(null);
  const [note, setNote] = useState(null);

  const sendCode = async (e) => {
    e.preventDefault();
    setBusy(true); setErr(null);
    try {
      const { data } = await authAPI.otpRequest(email, 'reset');
      setStep('code');
      setNote(data.dev_code ? `Dev code: ${data.dev_code}` : 'If that email has an account, a code is on its way.');
    } catch (e2) { setErr(errText(e2)); }
    finally { setBusy(false); }
  };

  const verifyCode = async (e) => {
    e.preventDefault();
    setBusy(true); setErr(null);
    try {
      const { data } = await authAPI.otpVerify({ email, code, purpose: 'reset' });
      setResetToken(data.reset_token);
      setStep('password');
    } catch (e2) { setErr(errText(e2)); }
    finally { setBusy(false); }
  };

  const setNewPassword = async (e) => {
    e.preventDefault();
    if (pw.length < 8) { setErr('Password must be at least 8 characters.'); return; }
    setBusy(true); setErr(null);
    try { await finishPasswordReset(resetToken, pw); nav('/dashboard', { replace: true }); }
    catch (e2) { setErr(errText(e2)); setBusy(false); }
  };

  return (
    <>
      <Seo title="Reset password" />
      <section className="section"><div className="container" style={{ maxWidth: 420 }}>
        <Link to="/login" className="row" style={{ fontSize: '.85rem', marginBottom: 12 }}><ArrowLeft size={14} /> Back to sign in</Link>
        <h1>Reset your password</h1>

        {step === 'email' && (
          <form className="card mt-3" onSubmit={sendCode}>
            <div className="field"><label>Email</label><input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} /></div>
            <p className="muted" style={{ fontSize: '.85rem' }}>We'll email you a 6-digit code to confirm it's you.</p>
            {err && <p style={{ color: 'var(--err)', fontSize: '.85rem' }}>{err}</p>}
            <button className="btn btn--primary btn--block" disabled={busy}>{busy ? <IosSpinner size="sm" /> : 'Send code'}</button>
          </form>
        )}

        {step === 'code' && (
          <form className="card mt-3" onSubmit={verifyCode}>
            <label style={{ fontWeight: 600, fontSize: '.9rem' }}>Enter the code sent to {email}</label>
            <div className="mt-2"><OtpInput value={code} onChange={setCode} disabled={busy} /></div>
            {note && <p className="muted mt-2 text-center" style={{ fontSize: '.82rem' }}>{note}</p>}
            {err && <p style={{ color: 'var(--err)', fontSize: '.85rem' }}>{err}</p>}
            <button className="btn btn--primary btn--block mt-2" disabled={busy || code.length < 6}>{busy ? <IosSpinner size="sm" /> : 'Verify'}</button>
            <button type="button" className="btn btn--ghost btn--sm" onClick={sendCode} disabled={busy}>Resend code</button>
          </form>
        )}

        {step === 'password' && (
          <form className="card mt-3" onSubmit={setNewPassword}>
            <div className="field"><label>New password</label><input type="password" required value={pw} onChange={(e) => setPw(e.target.value)} /><span className="hint">At least 8 characters.</span></div>
            {err && <p style={{ color: 'var(--err)', fontSize: '.85rem' }}>{err}</p>}
            <button className="btn btn--primary btn--block" disabled={busy}>{busy ? <IosSpinner size="sm" /> : 'Set new password'}</button>
          </form>
        )}
      </div></section>
    </>
  );
}
