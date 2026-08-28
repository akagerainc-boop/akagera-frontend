import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Check, CheckCircle2 } from 'lucide-react';
import Seo from '../components/Seo';
import { PageLoader } from '../components/Loader';
import { Breadcrumbs, EmptyState, priceLabel } from '../components/ui';
import { internshipAPI, errText } from '../api';

export default function InternshipDetail() {
  const { slug } = useParams();
  const [i, setI] = useState(null);
  const [err, setErr] = useState(false);
  const [form, setForm] = useState({ full_name: '', email: '', phone: '', education: '', interest_area: '', preferred_duration: '', start_date: '', message: '' });
  const [file, setFile] = useState(null);
  const [state, setState] = useState('idle');
  const [msg, setMsg] = useState(null);

  useEffect(() => {
    setI(null); setErr(false);
    internshipAPI.get(slug).then((r) => setI(r.data)).catch(() => setErr(true));
  }, [slug]);

  const submit = async (e) => {
    e.preventDefault();
    setState('sending'); setMsg(null);
    const fd = new FormData();
    Object.entries(form).forEach(([k, v]) => v && fd.append(k, v));
    if (file) fd.append('cv', file);
    try {
      const r = await internshipAPI.apply(slug, fd);
      setState('done'); setMsg(r.data.message);
    } catch (e2) { setState('idle'); setMsg(errText(e2)); }
  };

  if (err) return <div className="container section"><EmptyState title="Internship not found" action={<Link className="btn btn--primary" to="/internships">All programs</Link>} /></div>;
  if (!i) return <PageLoader />;

  return (
    <>
      <Seo title={i.title} description={i.description} />
      <section className="section section--dark section--tight"><div className="container">
        <Breadcrumbs items={[{ label: 'Internships', to: '/internships' }, { label: i.title }]} />
        <span className="badge mb-2">{i.department}</span>
        <h1>{i.title}</h1>
        <div className="row mt-2" style={{ color: 'rgba(255,255,255,.8)' }}>
          <span>{i.duration_label}</span> · <span>{i.positions} positions</span> · <span>{i.is_free ? 'Free' : priceLabel(i.price)}</span>
        </div>
      </div></section>

      <section className="section"><div className="container grid grid-2" style={{ alignItems: 'start' }}>
        <div>
          <p style={{ whiteSpace: 'pre-line' }}>{i.description}</p>
          {i.requirements?.length > 0 && (
            <>
              <h3 className="mt-4">Requirements</h3>
              <ul className="stack mt-2" style={{ listStyle: 'none', padding: 0, gap: 8 }}>
                {i.requirements.map((r, k) => <li key={k} className="row" style={{ gap: 8, alignItems: 'flex-start' }}><Check size={15} style={{ color: 'var(--brand)', marginTop: 4 }} /> {r}</li>)}
              </ul>
            </>
          )}
        </div>

        <aside className="card card--pad-lg" style={{ position: 'sticky', top: 88 }}>
          {state === 'done' ? (
            <div className="text-center">
              <div className="empty__icon" style={{ background: '#E7F4EC', color: 'var(--ok)' }}><CheckCircle2 size={26} /></div>
              <h3 className="mt-2">Application submitted</h3>
              <p className="muted">{msg}</p>
            </div>
          ) : (
            <form onSubmit={submit}>
              <h3>Apply</h3>
              <div className="field mt-2"><label>Full name *</label><input required value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} /></div>
              <div className="field"><label>Email *</label><input type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></div>
              <div className="field"><label>Phone</label><input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} /></div>
              <div className="field"><label>Education</label><input value={form.education} onChange={(e) => setForm({ ...form, education: e.target.value })} /></div>
              <div className="field"><label>Area of interest</label>
                <select value={form.interest_area} onChange={(e) => setForm({ ...form, interest_area: e.target.value })}>
                  <option value="">Select…</option>
                  {['Mobile', 'Web', 'Backend', 'UI/UX', 'AI/ML', 'Cybersecurity', 'QA', 'DevOps'].map((o) => <option key={o}>{o}</option>)}
                </select>
              </div>
              <div className="field"><label>Preferred start date</label><input type="date" value={form.start_date} onChange={(e) => setForm({ ...form, start_date: e.target.value })} /></div>
              <div className="field"><label>CV (PDF/DOC)</label><input type="file" accept=".pdf,.doc,.docx" onChange={(e) => setFile(e.target.files[0])} /></div>
              {msg && <p style={{ color: 'var(--err)', fontSize: '.85rem' }}>{msg}</p>}
              <button className="btn btn--primary btn--block" disabled={state === 'sending'}>{state === 'sending' ? 'Sending…' : 'Submit application'}</button>
            </form>
          )}
        </aside>
      </div></section>
    </>
  );
}
