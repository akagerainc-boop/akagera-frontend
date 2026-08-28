import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { LifeBuoy, Send, CheckCircle2 } from 'lucide-react';
import Seo from '../components/Seo';
import FAQAccordion from '../components/FAQAccordion';
import { SectionHead, StatusBadge, Breadcrumbs } from '../components/ui';
import { IosSpinner } from '../components/Loader';
import { useAuth } from '../context/AuthContext';
import { supportAPI, contentAPI, errText } from '../api';

export default function Support() {
  const [params] = useSearchParams();
  const { user } = useAuth();
  const view = params.get('view');
  const [faqs, setFaqs] = useState([]);
  const [tickets, setTickets] = useState([]);
  const [form, setForm] = useState({ subject: '', category: 'general', priority: 'normal', message: '', name: '', email: '' });
  const [state, setState] = useState('idle');
  const [msg, setMsg] = useState(null);

  useEffect(() => {
    contentAPI.faqs().then((r) => setFaqs(r.data)).catch(() => {});
    if (user) supportAPI.mine().then((r) => setTickets(r.data)).catch(() => {});
  }, [user]);

  const submit = async (e) => {
    e.preventDefault();
    setState('sending'); setMsg(null);
    try {
      const r = await supportAPI.create(form);
      setState('done'); setMsg(`Ticket ${r.data.ticket_ref} created.`);
      if (user) supportAPI.mine().then((res) => setTickets(res.data));
    } catch (e2) { setState('idle'); setMsg(errText(e2)); }
  };

  return (
    <>
      <Seo title="Support" description="Open a support ticket or search help articles." />
      <section className="section section--dark section--tight"><div className="container">
        <Breadcrumbs items={[{ label: 'Resources' }, { label: 'Support' }]} />
        <h1>Akagera Support</h1>
        <p className="lead mt-2" style={{ color: 'rgba(255,255,255,.82)' }}>Search help articles, open a ticket, or report a bug.</p>
      </div></section>

      <section className="section"><div className="container grid grid-2" style={{ alignItems: 'start' }}>
        <div>
          <SectionHead eyebrow={view === 'faq' ? 'Help' : 'Get help'} title={view === 'faq' ? 'Frequently asked questions' : 'Open a support ticket'} />
          {view === 'faq' ? (
            <FAQAccordion items={faqs} />
          ) : state === 'done' ? (
            <div className="card text-center">
              <div className="empty__icon" style={{ background: '#E7F4EC', color: 'var(--ok)' }}><CheckCircle2 size={26} /></div>
              <h3 className="mt-2">Ticket created</h3>
              <p className="muted">{msg}</p>
              {user && <Link to="/dashboard/support" className="btn btn--primary mt-2">Track it in your dashboard</Link>}
            </div>
          ) : (
            <form className="card" onSubmit={submit}>
              {!user && (
                <>
                  <div className="field"><label>Your name</label><input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
                  <div className="field"><label>Email *</label><input type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></div>
                </>
              )}
              <div className="field"><label>Subject *</label><input required value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} /></div>
              <div className="row" style={{ gap: 12 }}>
                <div className="field" style={{ flex: 1 }}><label>Category</label>
                  <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
                    {['general', 'billing', 'technical', 'bug', 'feature-request', 'account'].map((c) => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div className="field" style={{ flex: 1 }}><label>Priority</label>
                  <select value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value })}>
                    {['low', 'normal', 'high', 'urgent'].map((c) => <option key={c}>{c}</option>)}
                  </select>
                </div>
              </div>
              <div className="field"><label>Describe the issue *</label><textarea required value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} /></div>
              {msg && <p style={{ color: 'var(--err)', fontSize: '.85rem' }}>{msg}</p>}
              <button className="btn btn--primary btn--block" disabled={state === 'sending'}>
                {state === 'sending' ? <IosSpinner size="sm" /> : <><Send size={15} /> Submit ticket</>}
              </button>
            </form>
          )}
        </div>

        <aside>
          {user && tickets.length > 0 && (
            <div className="card mb-3">
              <h3>Your recent tickets</h3>
              <div className="stack mt-2">
                {tickets.slice(0, 5).map((t) => (
                  <Link key={t.id} to="/dashboard/support" className="between" style={{ padding: '8px 0', borderBottom: '1px solid var(--line)' }}>
                    <span>{t.subject}</span><StatusBadge status={t.status} />
                  </Link>
                ))}
              </div>
            </div>
          )}
          <div className="card">
            <div className="empty__icon"><LifeBuoy size={20} /></div>
            <h3 className="mt-2">Prefer to chat?</h3>
            <p className="muted" style={{ fontSize: '.9rem' }}>Message us on WhatsApp for quick questions.</p>
            <Link to="/support?view=faq" className="btn btn--secondary btn--block mt-2">Browse FAQs</Link>
          </div>
        </aside>
      </div></section>
    </>
  );
}
