import React, { useEffect, useState } from 'react';
import { Routes, Route, NavLink, useNavigate, Navigate } from 'react-router-dom';
import {
  LayoutDashboard, ShoppingBag, Wrench, KeyRound, RefreshCw, Download,
  FileText, LifeBuoy, User, Shield, LogOut, Copy, Building2,
} from 'lucide-react';
import Seo from '../components/Seo';
import { PageLoader } from '../components/Loader';
import { StatusBadge, EmptyState, priceLabel } from '../components/ui';
import { DownloadCard } from '../components/cards';
import { useAuth } from '../context/AuthContext';
import {
  dashboardAPI, orderAPI, invoiceAPI, subscriptionAPI, supportAPI,
  licenseAPI, authAPI, errText,
} from '../api';

const NAV = [
  ['', 'Overview', LayoutDashboard],
  ['orders', 'My Orders', ShoppingBag],
  ['services', 'My Services', Wrench],
  ['licenses', 'Licenses', KeyRound],
  ['subscriptions', 'Subscriptions', RefreshCw],
  ['downloads', 'Downloads', Download],
  ['invoices', 'Invoices', FileText],
  ['support', 'Support', LifeBuoy],
  ['profile', 'Profile', User],
  ['security', 'Security', Shield],
];

const copy = (t) => navigator.clipboard?.writeText(t);

function Overview() {
  const [d, setD] = useState(null);
  useEffect(() => { dashboardAPI.overview().then((r) => setD(r.data)).catch(() => setD(false)); }, []);
  if (d === null) return <PageLoader />;
  if (d === false) return <EmptyState title="Could not load your dashboard" />;
  const s = d.stats;
  return (
    <>
      <h1>Overview</h1>
      <div className="kpi-row mt-3">
        <div className="stat-card"><b>{s.orders}</b><span>Orders</span></div>
        <div className="stat-card"><b>{s.active_licenses}</b><span>Active licenses</span></div>
        <div className="stat-card"><b>{s.active_subscriptions}</b><span>Subscriptions</span></div>
        <div className="stat-card"><b>{priceLabel(s.total_spent)}</b><span>Total spent</span></div>
      </div>

      {d.business_tokens?.length > 0 && (
        <div className="card mt-3">
          <h3 className="row" style={{ gap: 8 }}><Building2 size={18} /> Business portal access</h3>
          {d.business_tokens.map((t) => (
            <div key={t.token} className="between mt-2" style={{ padding: '10px 0', borderBottom: '1px solid var(--line)' }}>
              <div><b>{t.business_name}</b> <span className="muted">· {t.category}</span></div>
              <button className="pill" onClick={() => copy(t.token)}><Copy size={13} /> {t.token}</button>
            </div>
          ))}
        </div>
      )}

      <div className="card mt-3">
        <h3>Recent orders</h3>
        {d.recent_orders.length === 0 ? <p className="muted mt-1">No orders yet.</p> : (
          <div className="table-wrap mt-2">
            <table className="data">
              <thead><tr><th>Order</th><th>Total</th><th>Status</th><th>Date</th></tr></thead>
              <tbody>{d.recent_orders.map((o) => (
                <tr key={o.id}><td>{o.order_ref}</td><td>{priceLabel(o.total, o.currency)}</td><td><StatusBadge status={o.status} /></td><td>{new Date(o.created_at).toLocaleDateString()}</td></tr>
              ))}</tbody>
            </table>
          </div>
        )}
      </div>

      {d.notifications?.length > 0 && (
        <div className="card mt-3">
          <h3>Notifications</h3>
          <div className="stack mt-2">
            {d.notifications.map((n) => (
              <div key={n.id} style={{ padding: '8px 0', borderBottom: '1px solid var(--line)' }}>
                <b style={{ fontSize: '.92rem' }}>{n.title}</b>
                <div className="muted" style={{ fontSize: '.85rem' }}>{n.body}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
}

function Orders() {
  const [rows, setRows] = useState(null);
  useEffect(() => { orderAPI.mine().then((r) => setRows(r.data)).catch(() => setRows([])); }, []);
  if (!rows) return <PageLoader />;
  return (
    <>
      <h1>My Orders</h1>
      {rows.length === 0 ? <EmptyState title="No orders yet" action={<a className="btn btn--primary" href="/services">Browse services</a>} /> : (
        <div className="stack mt-3">
          {rows.map((o) => (
            <div key={o.id} className="card">
              <div className="between">
                <div><b>{o.order_ref}</b> <StatusBadge status={o.status} /></div>
                <b>{priceLabel(o.total, o.currency)}</b>
              </div>
              {o.items.map((it) => <div key={it.id} className="muted mt-1" style={{ fontSize: '.88rem' }}>{it.name} — {it.duration_label}</div>)}
              <div className="muted mt-1" style={{ fontSize: '.8rem' }}>{new Date(o.created_at).toLocaleString()}</div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}

function Licenses() {
  const { user } = useAuth();
  const [rows, setRows] = useState(null);
  useEffect(() => { licenseAPI.getUserLicenses(user.id).then((r) => setRows(r.data)).catch(() => setRows([])); }, [user.id]);
  if (!rows) return <PageLoader />;
  return (
    <>
      <h1>Licenses</h1>
      {rows.length === 0 ? <EmptyState title="No licenses yet" /> : (
        <div className="grid grid-2 mt-3">
          {rows.map((l) => (
            <div key={l.id} className="card">
              <div className="between"><span className="badge">{l.license_type || 'license'}</span><StatusBadge status={l.status || (l.is_active ? 'active' : 'expired')} /></div>
              <div className="mt-2 row" style={{ gap: 8 }}>
                <code style={{ fontFamily: 'monospace', fontSize: '1rem', letterSpacing: '1px' }}>{l.license_key}</code>
                <button className="btn btn--ghost btn--sm" onClick={() => copy(l.license_key)}><Copy size={13} /></button>
              </div>
              {l.expires_at && <div className="muted mt-1" style={{ fontSize: '.82rem' }}>Expires {new Date(l.expires_at).toLocaleDateString()}</div>}
            </div>
          ))}
        </div>
      )}
    </>
  );
}

function Subscriptions() {
  const [rows, setRows] = useState(null);
  const load = () => subscriptionAPI.mine().then((r) => setRows(r.data)).catch(() => setRows([]));
  useEffect(() => { load(); }, []);
  const cancel = async (id) => { await subscriptionAPI.cancel(id); load(); };
  if (!rows) return <PageLoader />;
  return (
    <>
      <h1>Subscriptions</h1>
      {rows.length === 0 ? <EmptyState title="No subscriptions" /> : (
        <div className="stack mt-3">
          {rows.map((s) => (
            <div key={s.id} className="card between">
              <div>
                <b>{s.plan_name}</b> <StatusBadge status={s.status} />
                <div className="muted" style={{ fontSize: '.85rem' }}>{priceLabel(s.price, s.currency)} · {s.billing_period}{s.renewal_date ? ` · renews ${new Date(s.renewal_date).toLocaleDateString()}` : ''}</div>
              </div>
              {s.status === 'active' && <button className="btn btn--secondary btn--sm" onClick={() => cancel(s.id)}>Cancel</button>}
            </div>
          ))}
        </div>
      )}
    </>
  );
}

function Downloads() {
  const [rows, setRows] = useState(null);
  useEffect(() => { dashboardAPI.downloads().then((r) => setRows(r.data)).catch(() => setRows([])); }, []);
  if (!rows) return <PageLoader />;
  const flat = rows.flatMap((p) => p.accessible ? p.downloads.map((d) => ({ ...d, product: p.product })) : []);
  return (
    <>
      <h1>Downloads</h1>
      {flat.length === 0 ? <EmptyState title="No downloads available" /> : (
        <div className="grid grid-3 mt-3">{flat.map((d) => <DownloadCard key={d.id} item={d} />)}</div>
      )}
    </>
  );
}

function Invoices() {
  const [rows, setRows] = useState(null);
  useEffect(() => { invoiceAPI.mine().then((r) => setRows(r.data)).catch(() => setRows([])); }, []);
  if (!rows) return <PageLoader />;
  return (
    <>
      <h1>Invoices</h1>
      {rows.length === 0 ? <EmptyState title="No invoices yet" /> : (
        <div className="table-wrap mt-3">
          <table className="data">
            <thead><tr><th>Invoice</th><th>Amount</th><th>Date</th><th /></tr></thead>
            <tbody>{rows.map((i) => (
              <tr key={i.invoice_ref}>
                <td>{i.invoice_ref}</td><td>{priceLabel(i.amount, i.currency)}</td>
                <td>{new Date(i.issued_at).toLocaleDateString()}</td>
                <td>{i.has_pdf && <a className="btn btn--ghost btn--sm" href={`${invoiceAPI.pdfUrl(i.invoice_ref)}`} target="_blank" rel="noopener noreferrer">PDF</a>}</td>
              </tr>
            ))}</tbody>
          </table>
        </div>
      )}
    </>
  );
}

function Support() {
  const [rows, setRows] = useState(null);
  const [open, setOpen] = useState(null);
  const [reply, setReply] = useState('');
  useEffect(() => { supportAPI.mine().then((r) => setRows(r.data)).catch(() => setRows([])); }, []);
  const view = async (ref) => { const r = await supportAPI.get(ref); setOpen(r.data); };
  const send = async () => { const r = await supportAPI.reply(open.ticket_ref, reply); setOpen(r.data); setReply(''); };
  if (!rows) return <PageLoader />;
  return (
    <>
      <h1>Support</h1>
      {open ? (
        <div className="card mt-3">
          <button className="btn btn--ghost btn--sm" onClick={() => setOpen(null)}>← All tickets</button>
          <div className="between mt-2"><h3>{open.subject}</h3><StatusBadge status={open.status} /></div>
          <div className="stack mt-3">
            {open.messages.map((m) => (
              <div key={m.id} className="card" style={{ background: m.sender === 'staff' ? 'var(--brand-050)' : 'var(--bg-soft)' }}>
                <div className="muted" style={{ fontSize: '.75rem', textTransform: 'uppercase' }}>{m.sender}</div>
                <p className="mt-1" style={{ fontSize: '.92rem' }}>{m.body}</p>
              </div>
            ))}
          </div>
          {open.status !== 'closed' && (
            <div className="mt-3">
              <textarea value={reply} onChange={(e) => setReply(e.target.value)} placeholder="Reply…" />
              <button className="btn btn--primary mt-1" disabled={!reply.trim()} onClick={send}>Send reply</button>
            </div>
          )}
        </div>
      ) : rows.length === 0 ? (
        <EmptyState title="No tickets" action={<a className="btn btn--primary" href="/support">Open a ticket</a>} />
      ) : (
        <div className="stack mt-3">
          {rows.map((t) => (
            <button key={t.id} className="card between" style={{ textAlign: 'left', width: '100%' }} onClick={() => view(t.ticket_ref)}>
              <div><b>{t.subject}</b><div className="muted" style={{ fontSize: '.82rem' }}>{t.ticket_ref} · {t.category}</div></div>
              <StatusBadge status={t.status} />
            </button>
          ))}
        </div>
      )}
    </>
  );
}

function Profile() {
  const { user, refresh } = useAuth();
  const [form, setForm] = useState({ name: user.name || '', phone: user.phone || '', company: user.company || '', country: user.country || '' });
  const [saved, setSaved] = useState(false);
  const save = async (e) => {
    e.preventDefault();
    await authAPI.updateProfile(form);
    await refresh();
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };
  return (
    <>
      <h1>Profile</h1>
      <form className="card mt-3" style={{ maxWidth: 520 }} onSubmit={save}>
        <div className="field"><label>Name</label><input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
        <div className="field"><label>Email</label><input value={user.email} disabled /></div>
        <div className="row" style={{ gap: 12 }}>
          <div className="field" style={{ flex: 1 }}><label>Phone</label><input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} /></div>
          <div className="field" style={{ flex: 1 }}><label>Country</label><input value={form.country} onChange={(e) => setForm({ ...form, country: e.target.value })} /></div>
        </div>
        <div className="field"><label>Company</label><input value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} /></div>
        <button className="btn btn--primary">{saved ? 'Saved ✓' : 'Save changes'}</button>
      </form>
    </>
  );
}

function Security() {
  const { logout } = useAuth();
  const nav = useNavigate();
  const [pw, setPw] = useState({ current_password: '', new_password: '' });
  const [msg, setMsg] = useState(null);
  const change = async (e) => {
    e.preventDefault();
    try { await authAPI.changePassword(pw); setMsg('Password updated.'); setPw({ current_password: '', new_password: '' }); }
    catch (e2) { setMsg(errText(e2)); }
  };
  const del = async () => {
    if (!window.confirm('Delete your account permanently? This cannot be undone.')) return;
    await authAPI.deleteAccount();
    logout();
    nav('/');
  };
  return (
    <>
      <h1>Security</h1>
      <form className="card mt-3" style={{ maxWidth: 480 }} onSubmit={change}>
        <h3>Change password</h3>
        <div className="field mt-2"><label>Current password</label><input type="password" value={pw.current_password} onChange={(e) => setPw({ ...pw, current_password: e.target.value })} /></div>
        <div className="field"><label>New password</label><input type="password" value={pw.new_password} onChange={(e) => setPw({ ...pw, new_password: e.target.value })} /></div>
        {msg && <p style={{ fontSize: '.85rem', color: msg.includes('updated') ? 'var(--ok)' : 'var(--err)' }}>{msg}</p>}
        <button className="btn btn--primary">Update password</button>
      </form>
      <div className="card mt-3" style={{ maxWidth: 480 }}>
        <h3>Two-factor authentication</h3>
        <p className="muted" style={{ fontSize: '.9rem' }}>Coming soon.</p>
      </div>
      <div className="card mt-3" style={{ maxWidth: 480, borderColor: 'var(--err)' }}>
        <h3>Delete account</h3>
        <p className="muted" style={{ fontSize: '.9rem' }}>Permanently removes your account and data.</p>
        <button className="btn btn--secondary" style={{ borderColor: 'var(--err)', color: 'var(--err)' }} onClick={del}>Delete my account</button>
      </div>
    </>
  );
}

function MyServices() {
  const [rows, setRows] = useState(null);
  useEffect(() => { orderAPI.mine().then((r) => setRows(r.data)).catch(() => setRows([])); }, []);
  if (!rows) return <PageLoader />;
  const items = rows.flatMap((o) => o.items.filter((i) => i.item_type === 'service').map((i) => ({ ...i, order: o })));
  return (
    <>
      <h1>My Services</h1>
      {items.length === 0 ? <EmptyState title="No services purchased yet" /> : (
        <div className="table-wrap mt-3">
          <table className="data">
            <thead><tr><th>Service</th><th>Duration</th><th>Order</th><th>Status</th></tr></thead>
            <tbody>{items.map((i, k) => (
              <tr key={k}><td>{i.name}</td><td>{i.duration_label}</td><td>{i.order.order_ref}</td><td><StatusBadge status={i.order.status} /></td></tr>
            ))}</tbody>
          </table>
        </div>
      )}
    </>
  );
}

export default function Dashboard() {
  const { user, logout } = useAuth();
  const nav = useNavigate();
  return (
    <>
      <Seo title="Dashboard" />
      <div className="shell">
        <aside className="shell__side">
          <div className="row" style={{ padding: '4px 14px 14px', gap: 10 }}>
            <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'var(--brand)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 800 }}>
              {(user.name || 'U').charAt(0).toUpperCase()}
            </div>
            <div style={{ overflow: 'hidden' }}><b style={{ color: '#fff', fontSize: '.9rem', display: 'block' }}>{user.name}</b><span style={{ fontSize: '.75rem' }}>{user.email}</span></div>
          </div>
          <div className="shell__side-scroll">
            {NAV.map(([path, label, Icon]) => (
              <NavLink key={path} to={`/dashboard/${path}`} end={path === ''} className={({ isActive }) => isActive ? 'active' : ''}>
                <Icon size={16} /> {label}
              </NavLink>
            ))}
            <button onClick={() => { logout(); nav('/'); }} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '11px 14px', color: 'rgba(255,255,255,.75)', fontWeight: 600, fontSize: '.9rem', width: '100%' }}>
              <LogOut size={16} /> Sign out
            </button>
          </div>
        </aside>
        <main className="shell__main">
          <Routes>
            <Route index element={<Overview />} />
            <Route path="orders" element={<Orders />} />
            <Route path="services" element={<MyServices />} />
            <Route path="licenses" element={<Licenses />} />
            <Route path="subscriptions" element={<Subscriptions />} />
            <Route path="downloads" element={<Downloads />} />
            <Route path="invoices" element={<Invoices />} />
            <Route path="support" element={<Support />} />
            <Route path="profile" element={<Profile />} />
            <Route path="security" element={<Security />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </main>
      </div>
    </>
  );
}
