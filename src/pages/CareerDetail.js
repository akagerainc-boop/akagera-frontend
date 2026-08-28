import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Check, CheckCircle2 } from 'lucide-react';
import Seo from '../components/Seo';
import { PageLoader } from '../components/Loader';
import { Breadcrumbs, EmptyState } from '../components/ui';
import { careersAPI, errText } from '../api';

function List({ title, items }) {
  if (!items?.length) return null;
  return (
    <>
      <h3 className="mt-4">{title}</h3>
      <ul className="stack mt-2" style={{ listStyle: 'none', padding: 0, gap: 8 }}>
        {items.map((x, i) => <li key={i} className="row" style={{ gap: 8, alignItems: 'flex-start' }}><Check size={15} style={{ color: 'var(--brand)', marginTop: 4, flexShrink: 0 }} /> {x}</li>)}
      </ul>
    </>
  );
}

export default function CareerDetail() {
  const { slug } = useParams();
  const [j, setJ] = useState(null);
  const [err, setErr] = useState(false);
  const [form, setForm] = useState({ full_name: '', email: '', phone: '', cover_letter: '' });
  const [file, setFile] = useState(null);
  const [state, setState] = useState('idle');
  const [msg, setMsg] = useState(null);

  useEffect(() => {
    setJ(null); setErr(false);
    careersAPI.get(slug).then((r) => setJ(r.data)).catch(() => setErr(true));
  }, [slug]);

  const submit = async (e) => {
    e.preventDefault();
    setState('sending'); setMsg(null);
    const fd = new FormData();
    Object.entries(form).forEach(([k, v]) => fd.append(k, v));
    if (file) fd.append('resume', file);
    try {
      const r = await careersAPI.apply(slug, fd);
      setState('done'); setMsg(r.data.message);
    } catch (e2) {
      setState('idle'); setMsg(errText(e2));
    }
  };

  if (err) return <div className="container section"><EmptyState title="Position not found" action={<Link className="btn btn--primary" to="/careers">All roles</Link>} /></div>;
  if (!j) return <PageLoader />;

  return (
    <>
      <Seo title={j.title} description={j.description} />
      <section className="section section--dark section--tight"><div className="container">
        <Breadcrumbs items={[{ label: 'Careers', to: '/careers' }, { label: j.title }]} />
        <h1>{j.title}</h1>
        <div className="row mt-2" style={{ color: 'rgba(255,255,255,.8)' }}><span>{j.department}</span> · <span>{j.location}</span> · <span>{j.employment_type}</span></div>
      </div></section>

      <section className="section"><div className="container grid grid-2" style={{ alignItems: 'start' }}>
        <div>
          <p style={{ whiteSpace: 'pre-line' }}>{j.description}</p>
          <List title="Responsibilities" items={j.responsibilities} />
          <List title="Requirements" items={j.requirements} />
          <List title="Benefits" items={j.benefits} />
        </div>

        <aside className="card card--pad-lg" style={{ position: 'sticky', top: 88 }}>
          {state === 'done' ? (
            <div className="text-center">
              <div className="empty__icon" style={{ background: '#E7F4EC', color: 'var(--ok)' }}><CheckCircle2 size={26} /></div>
              <h3 className="mt-2">Application sent</h3>
              <p className="muted">{msg}</p>
            </div>
          ) : (
            <form onSubmit={submit}>
              <h3>Apply for this role</h3>
              <div className="field mt-2"><label>Full name *</label><input required value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} /></div>
              <div className="field"><label>Email *</label><input type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></div>
              <div className="field"><label>Phone</label><input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} /></div>
              <div className="field"><label>Cover letter</label><textarea value={form.cover_letter} onChange={(e) => setForm({ ...form, cover_letter: e.target.value })} /></div>
              <div className="field"><label>Résumé (PDF/DOC)</label><input type="file" accept=".pdf,.doc,.docx" onChange={(e) => setFile(e.target.files[0])} /></div>
              {msg && <p style={{ color: 'var(--err)', fontSize: '.85rem' }}>{msg}</p>}
              <button className="btn btn--primary btn--block" disabled={state === 'sending'}>{state === 'sending' ? 'Sending…' : 'Submit application'}</button>
            </form>
          )}
        </aside>
      </div></section>
    </>
  );
}
