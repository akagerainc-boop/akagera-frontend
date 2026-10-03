import React, { useEffect, useState, useCallback } from 'react';
import { Routes, Route, NavLink, useNavigate, Navigate } from 'react-router-dom';
import {
  LayoutDashboard, Package, Wrench, ShoppingBag, Users, KeyRound,
  Download, Newspaper, GraduationCap, Briefcase, LifeBuoy, Image as ImageIcon,
  Navigation as NavIcon, Settings as SettingsIcon, ScrollText, LogOut, Plus, Trash2, Pencil, X,
  FileText, Mail, Phone, ExternalLink, Smartphone,
} from 'lucide-react';
import Seo from '../components/Seo';
import { PageLoader, IosSpinner } from '../components/Loader';
import { StatusBadge, EmptyState, Modal } from '../components/ui';
import { adminAPI, errText, mediaUrl, API_ORIGIN } from '../api';

/* ---------- resource field configs ---------- */
const ARR = (v) => Array.isArray(v) ? v.join(', ') : (v || '');
const toArr = (v) => String(v || '').split(',').map((x) => x.trim()).filter(Boolean);

const RESOURCES = {
  products: {
    label: 'Products', icon: Package, name: 'products',
    columns: ['id', 'name', 'category', 'status', 'version', 'is_featured'],
    fields: [
      ['name', 'text'], ['category', 'text'], ['short_description', 'text'], ['description', 'textarea'],
      ['status', 'select', ['draft', 'published']], ['version', 'text'],
      ['pricing_model', 'select', ['free', 'paid', 'subscription']], ['price', 'number'],
      ['platforms', 'arr'], ['features', 'arr'], ['screenshots', 'arr'],
      ['play_store_url', 'text'], ['app_store_url', 'text'], ['website_url', 'text'], ['documentation_url', 'text'],
      ['requires_license', 'bool'], ['is_featured', 'bool'], ['sort_order', 'number'],
      ['app_icon', 'image'], ['app_logo', 'image'], ['app_image', 'image'],
    ],
  },
  services: {
    label: 'Services', icon: Wrench, name: 'services',
    columns: ['id', 'name', 'category', 'price', 'duration_unit', 'status', 'is_featured'],
    fields: [
      ['name', 'text'], ['category', 'text'], ['short_description', 'text'], ['description', 'textarea'],
      ['price', 'number'], ['currency', 'text'],
      ['duration_value', 'number'], ['duration_unit', 'select', ['hour', 'day', 'week', 'month', 'year', 'lifetime', 'one_time', 'custom']],
      ['service_type', 'select', ['app_license', 'subscription', 'internship', 'system_development', 'saas']],
      ['features', 'arr'], ['requirements', 'arr'], ['process_steps', 'arr'],
      ['delivery_method', 'text'], ['terms', 'textarea'],
      ['status', 'select', ['draft', 'published']], ['availability', 'text'],
      ['is_featured', 'bool'], ['popular', 'bool'], ['sort_order', 'number'],
      ['grants_business_portal_access', 'bool'], ['portal_business_name', 'text'], ['portal_category', 'text'],
      ['portal_access_duration_days', 'number'], ['image_url', 'image'],
    ],
  },
  'service-fields': {
    label: 'Service fields', icon: Wrench, name: 'service-fields',
    columns: ['id', 'service_id', 'label', 'field_key', 'field_type', 'required'],
    fields: [
      ['service_id', 'number'], ['label', 'text'], ['field_key', 'text'],
      ['field_type', 'select', ['text', 'textarea', 'select', 'number', 'date', 'email', 'tel', 'checkbox']],
      ['options', 'arr'], ['required', 'bool'], ['help_text', 'text'], ['sort_order', 'number'],
    ],
  },
  downloads: {
    label: 'Downloads', icon: Download, name: 'downloads',
    columns: ['id', 'product_id', 'platform', 'version', 'is_active'],
    fields: [
      ['product_id', 'number'], ['platform', 'select', ['android', 'ios', 'windows', 'macos', 'linux', 'web']],
      ['label', 'text'], ['external_url', 'text'], ['version', 'text'], ['architecture', 'text'],
      ['file_size', 'text'], ['min_os', 'text'], ['release_notes', 'textarea'], ['is_active', 'bool'],
    ],
  },
  blog: {
    label: 'Blog', icon: Newspaper, name: 'blog',
    columns: ['id', 'title', 'category', 'status', 'is_featured'],
    fields: [
      ['title', 'text'], ['excerpt', 'textarea'], ['body', 'textarea'], ['category', 'text'],
      ['author', 'text'], ['tags', 'arr'], ['cover_image', 'image'], ['reading_time', 'number'],
      ['status', 'select', ['draft', 'published']], ['is_featured', 'bool'],
    ],
  },
  'case-studies': {
    label: 'Case studies', icon: Briefcase, name: 'case-studies',
    columns: ['id', 'title', 'client', 'category', 'status'],
    fields: [
      ['title', 'text'], ['client', 'text'], ['category', 'text'], ['summary', 'textarea'],
      ['challenge', 'textarea'], ['solution', 'textarea'], ['results', 'textarea'],
      ['technologies', 'arr'], ['platforms', 'arr'], ['screenshots', 'arr'], ['cover_image', 'image'],
      ['link', 'text'], ['is_featured', 'bool'], ['status', 'select', ['draft', 'published']],
    ],
  },
  internships: {
    label: 'Internships', icon: GraduationCap, name: 'internships',
    columns: ['id', 'title', 'department', 'status', 'positions'],
    fields: [
      ['title', 'text'], ['department', 'text'], ['description', 'textarea'], ['requirements', 'arr'],
      ['duration_label', 'text'], ['positions', 'number'], ['is_free', 'bool'], ['price', 'number'],
      ['deadline', 'date'], ['status', 'select', ['open', 'closed']],
    ],
  },
  careers: {
    label: 'Careers', icon: Briefcase, name: 'careers',
    columns: ['id', 'title', 'department', 'location', 'status'],
    fields: [
      ['title', 'text'], ['department', 'text'], ['location', 'text'], ['employment_type', 'text'],
      ['description', 'textarea'], ['responsibilities', 'arr'], ['requirements', 'arr'], ['benefits', 'arr'],
      ['status', 'select', ['open', 'closed']],
    ],
  },
  industries: {
    label: 'Industries', icon: LayoutDashboard, name: 'industries',
    columns: ['id', 'name', 'slug', 'is_active'],
    fields: [['name', 'text'], ['icon', 'text'], ['summary', 'textarea'], ['body', 'textarea'], ['is_active', 'bool'], ['sort_order', 'number']],
  },
  testimonials: {
    label: 'Testimonials', icon: Users, name: 'testimonials',
    columns: ['id', 'name', 'company', 'rating', 'is_active'],
    fields: [['name', 'text'], ['role', 'text'], ['company', 'text'], ['quote', 'textarea'], ['avatar', 'image'], ['rating', 'number'], ['is_active', 'bool'], ['sort_order', 'number']],
  },
  faqs: {
    label: 'FAQs', icon: LifeBuoy, name: 'faqs',
    columns: ['id', 'category', 'question', 'is_active'],
    fields: [['category', 'text'], ['question', 'text'], ['answer', 'textarea'], ['sort_order', 'number'], ['is_active', 'bool']],
  },
  docs: {
    label: 'Documentation', icon: ScrollText, name: 'docs',
    columns: ['id', 'section', 'title', 'is_published'],
    fields: [['section', 'text'], ['title', 'text'], ['body', 'textarea'], ['sort_order', 'number'], ['is_published', 'bool']],
  },
  categories: {
    label: 'Categories', icon: LayoutDashboard, name: 'categories',
    columns: ['id', 'kind', 'name', 'slug'],
    fields: [['kind', 'select', ['product', 'service', 'blog', 'case_study']], ['name', 'text'], ['sort_order', 'number'], ['is_active', 'bool']],
  },
  navigation: {
    label: 'Navigation', icon: NavIcon, name: 'navigation',
    columns: ['id', 'location', 'label', 'url', 'parent_id', 'is_enabled'],
    fields: [
      ['location', 'select', ['header', 'footer']], ['label', 'text'], ['url', 'text'],
      ['parent_id', 'number'], ['column_group', 'text'], ['sort_order', 'number'], ['is_enabled', 'bool'],
    ],
  },
};

/* ---------- generic resource manager ---------- */
function ResourceManager({ cfg }) {
  const [rows, setRows] = useState(null);
  const [editing, setEditing] = useState(null);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState(null);

  const load = useCallback(() => {
    setRows(null);
    adminAPI.list(cfg.name).then((r) => setRows(r.data.items || [])).catch(() => setRows([]));
  }, [cfg.name]);
  useEffect(() => { load(); }, [load]);

  const openNew = () => setEditing({});
  const openEdit = (row) => {
    const form = {};
    cfg.fields.forEach(([key, type]) => {
      form[key] = type === 'arr' ? ARR(row[key]) : (row[key] ?? (type === 'bool' ? false : ''));
    });
    setEditing({ id: row.id, ...form });
  };

  const save = async () => {
    setSaving(true); setErr(null);
    const payload = {};
    cfg.fields.forEach(([key, type]) => {
      let v = editing[key];
      if (type === 'arr') v = toArr(v);
      if (type === 'number') v = v === '' ? null : Number(v);
      if (type === 'bool') v = !!v;
      payload[key] = v;
    });
    try {
      if (editing.id) await adminAPI.update(cfg.name, editing.id, payload);
      else await adminAPI.create(cfg.name, payload);
      setEditing(null);
      load();
    } catch (e) { setErr(errText(e)); }
    finally { setSaving(false); }
  };

  const remove = async (id) => {
    if (!window.confirm('Delete this item?')) return;
    await adminAPI.remove(cfg.name, id);
    load();
  };

  const uploadImage = async (key, file) => {
    const fd = new FormData();
    fd.append('file', file);
    fd.append('folder', cfg.name);
    const { data } = await adminAPI.upload(fd);
    setEditing((e) => ({ ...e, [key]: data.path || data.url }));
  };

  if (!rows) return <PageLoader />;

  return (
    <>
      <div className="between mb-3">
        <h1>{cfg.label}</h1>
        <button className="btn btn--primary btn--sm" onClick={openNew}><Plus size={15} /> New</button>
      </div>

      {rows.length === 0 ? <EmptyState title={`No ${cfg.label.toLowerCase()} yet`} action={<button className="btn btn--primary" onClick={openNew}>Create one</button>} /> : (
        <div className="table-wrap">
          <table className="data">
            <thead><tr>{cfg.columns.map((c) => <th key={c}>{c.replace(/_/g, ' ')}</th>)}<th /></tr></thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.id}>
                  {cfg.columns.map((c) => (
                    <td key={c}>
                      {typeof row[c] === 'boolean' ? (row[c] ? '✓' : '—')
                        : (c === 'status' || c === 'is_active' || c === 'is_enabled') ? <StatusBadge status={row[c] === true ? 'active' : row[c] === false ? 'draft' : row[c]} />
                        : String(row[c] ?? '—').slice(0, 48)}
                    </td>
                  ))}
                  <td>
                    <div className="row" style={{ gap: 6, flexWrap: 'nowrap' }}>
                      <button className="btn btn--ghost btn--sm" onClick={() => openEdit(row)}><Pencil size={14} /></button>
                      <button className="btn btn--ghost btn--sm" style={{ color: 'var(--err)' }} onClick={() => remove(row.id)}><Trash2 size={14} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Modal open={!!editing} onClose={() => setEditing(null)} title={editing?.id ? `Edit ${cfg.label}` : `New ${cfg.label}`}>
        {editing && (
          <div>
            {cfg.fields.map(([key, type, opts]) => (
              <div className="field" key={key}>
                <label>{key.replace(/_/g, ' ')}{type === 'arr' ? ' (comma-separated)' : ''}</label>
                {type === 'textarea' && <textarea value={editing[key] || ''} onChange={(e) => setEditing({ ...editing, [key]: e.target.value })} />}
                {type === 'select' && (
                  <select value={editing[key] || ''} onChange={(e) => setEditing({ ...editing, [key]: e.target.value })}>
                    <option value="">—</option>
                    {opts.map((o) => <option key={o}>{o}</option>)}
                  </select>
                )}
                {type === 'bool' && (
                  <label className="row" style={{ gap: 8 }}>
                    <input type="checkbox" checked={!!editing[key]} onChange={(e) => setEditing({ ...editing, [key]: e.target.checked })} /> <span className="muted">Enabled</span>
                  </label>
                )}
                {type === 'image' && (
                  <div className="row" style={{ gap: 10 }}>
                    {editing[key] && <img src={mediaUrl(editing[key])} alt="" style={{ width: 48, height: 48, objectFit: 'cover', borderRadius: 6 }} />}
                    <input type="file" accept="image/*" onChange={(e) => e.target.files[0] && uploadImage(key, e.target.files[0])} />
                    {editing[key] && <button className="btn btn--ghost btn--sm" onClick={() => setEditing({ ...editing, [key]: '' })}><X size={13} /></button>}
                  </div>
                )}
                {['text', 'number', 'date', 'arr'].includes(type) && (
                  <input type={type === 'number' ? 'number' : type === 'date' ? 'date' : 'text'}
                    value={editing[key] || ''} onChange={(e) => setEditing({ ...editing, [key]: e.target.value })} />
                )}
              </div>
            ))}
            {err && <p style={{ color: 'var(--err)', fontSize: '.85rem' }}>{err}</p>}
            <div className="row mt-2">
              <button className="btn btn--primary" onClick={save} disabled={saving}>{saving ? <IosSpinner size="sm" /> : 'Save'}</button>
              <button className="btn btn--ghost" onClick={() => setEditing(null)}>Cancel</button>
            </div>
          </div>
        )}
      </Modal>
    </>
  );
}

/* ---------- dashboard ---------- */
function AdminHome() {
  const [s, setS] = useState(null);
  useEffect(() => { adminAPI.stats().then((r) => setS(r.data)).catch(() => setS(false)); }, []);
  if (s === null) return <PageLoader />;
  if (s === false) return <EmptyState title="Could not load stats" />;
  const cells = [
    ['Users', s.total_users], ['Orders', s.total_orders], ['Revenue', `$${(s.total_revenue || 0).toFixed(2)}`],
    ['Subscriptions', s.active_subscriptions], ['Licenses', s.active_licenses], ['Products', s.total_products],
    ['Services', s.total_services], ['Downloads', s.total_downloads], ['Open tickets', s.open_tickets],
    ['New messages', s.new_messages],
  ];
  return (
    <>
      <h1>Dashboard</h1>
      <div className="kpi-row mt-3">
        {cells.map(([label, val]) => <div className="stat-card" key={label}><b>{val}</b><span>{label}</span></div>)}
      </div>
    </>
  );
}

function Orders() {
  const [rows, setRows] = useState(null);
  const load = () => adminAPI.orders().then((r) => setRows(r.data)).catch(() => setRows([]));
  useEffect(() => { load(); }, []);
  const setStatus = async (id, status) => { await adminAPI.setOrderStatus(id, status); load(); };
  if (!rows) return <PageLoader />;
  return (
    <>
      <h1>Orders</h1>
      <div className="table-wrap mt-3">
        <table className="data">
          <thead><tr><th>Ref</th><th>Customer</th><th>Total</th><th>Status</th><th>Date</th></tr></thead>
          <tbody>{rows.map((o) => (
            <tr key={o.id}>
              <td>{o.order_ref}</td>
              <td>{o.customer?.email || '—'}</td>
              <td>${Number(o.total || 0).toFixed(2)}</td>
              <td>
                <select value={o.status} onChange={(e) => setStatus(o.id, e.target.value)}>
                  {['pending', 'processing', 'completed', 'cancelled', 'refunded'].map((s) => <option key={s}>{s}</option>)}
                </select>
              </td>
              <td>{new Date(o.created_at).toLocaleDateString()}</td>
            </tr>
          ))}</tbody>
        </table>
      </div>
    </>
  );
}

function UsersAdmin() {
  const [rows, setRows] = useState(null);
  const load = () => adminAPI.list('users').then((r) => setRows(r.data.items)).catch(() => setRows([]));
  useEffect(() => { load(); }, []);
  const setRole = async (id, role) => { await adminAPI.setUserRole(id, { role }); load(); };
  if (!rows) return <PageLoader />;
  return (
    <>
      <h1>Customers</h1>
      <div className="table-wrap mt-3">
        <table className="data">
          <thead><tr><th>ID</th><th>Name</th><th>Email</th><th>Role</th><th>Joined</th></tr></thead>
          <tbody>{rows.map((u) => (
            <tr key={u.id}>
              <td>{u.id}</td><td>{u.name}</td><td>{u.email}</td>
              <td>
                <select value={u.role} onChange={(e) => setRole(u.id, e.target.value)}>
                  {['customer', 'staff', 'developer', 'support', 'content_manager', 'admin', 'super_admin'].map((r) => <option key={r}>{r}</option>)}
                </select>
              </td>
              <td>{u.created_at ? new Date(u.created_at).toLocaleDateString() : '—'}</td>
            </tr>
          ))}</tbody>
        </table>
      </div>
    </>
  );
}

function LicensesAdmin() {
  const [rows, setRows] = useState(null);
  const load = () => adminAPI.list('licenses').then((r) => setRows(r.data.items)).catch(() => setRows([]));
  useEffect(() => { load(); }, []);
  const setStatus = async (id, status) => { await adminAPI.setLicenseStatus(id, status); load(); };
  if (!rows) return <PageLoader />;
  return (
    <>
      <h1>Licenses</h1>
      <div className="table-wrap mt-3">
        <table className="data">
          <thead><tr><th>ID</th><th>User</th><th>Key</th><th>Type</th><th>Status</th><th>Expires</th></tr></thead>
          <tbody>{rows.map((l) => (
            <tr key={l.id}>
              <td>{l.id}</td><td>{l.user_id}</td><td style={{ fontFamily: 'monospace', fontSize: '.8rem' }}>{l.license_key}</td>
              <td>{l.license_type}</td>
              <td><select value={l.status || 'active'} onChange={(e) => setStatus(l.id, e.target.value)}>{['active', 'expired', 'suspended', 'revoked'].map((s) => <option key={s}>{s}</option>)}</select></td>
              <td>{l.expires_at ? new Date(l.expires_at).toLocaleDateString() : '—'}</td>
            </tr>
          ))}</tbody>
        </table>
      </div>
    </>
  );
}

function ImagesAdmin() {
  const [rows, setRows] = useState(null);
  const [pageType, setPageType] = useState('home');
  const load = useCallback(() => adminAPI.images(pageType).then((r) => setRows(r.data.images)).catch(() => setRows([])), [pageType]);
  useEffect(() => { load(); }, [load]);
  const upload = async (file) => {
    const fd = new FormData();
    fd.append('file', file); fd.append('page_type', pageType); fd.append('alt_text', file.name);
    await adminAPI.uploadImage(fd);
    load();
  };
  if (!rows) return <PageLoader />;
  return (
    <>
      <div className="between mb-3">
        <h1>Media & carousels</h1>
        <label className="btn btn--primary btn--sm">
          <Plus size={15} /> Upload
          <input type="file" accept="image/*" hidden onChange={(e) => e.target.files[0] && upload(e.target.files[0])} />
        </label>
      </div>
      <div className="field" style={{ maxWidth: 220 }}>
        <label>Page</label>
        <select value={pageType} onChange={(e) => setPageType(e.target.value)}>
          {['home', 'products', 'services', 'about', 'contact', 'downloads'].map((p) => <option key={p}>{p}</option>)}
        </select>
      </div>
      <div className="grid grid-4 mt-2">
        {rows.map((img) => (
          <div key={img.id} className="card card--flush">
            <img src={img.url?.startsWith('http') ? img.url : mediaUrl(img.url)} alt={img.alt_text} style={{ width: '100%', aspectRatio: '4/3', objectFit: 'cover' }} />
            <div style={{ padding: 10 }}>
              <div className="muted" style={{ fontSize: '.78rem' }}>{img.filename}</div>
              <div className="row mt-1" style={{ gap: 6 }}>
                <button className="btn btn--ghost btn--sm" onClick={async () => { await adminAPI.updateImage(img.id, { is_active: !img.is_active }); load(); }}>{img.is_active ? 'Hide' : 'Show'}</button>
                <button className="btn btn--ghost btn--sm" style={{ color: 'var(--err)' }} onClick={async () => { await adminAPI.deleteImage(img.id); load(); }}><Trash2 size={13} /></button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

function ContentAdmin() {
  const [content, setContent] = useState(null);
  const [key, setKey] = useState('hero');
  const [draft, setDraft] = useState('');
  const [msg, setMsg] = useState(null);
  useEffect(() => { adminAPI.content().then((r) => setContent(r.data)).catch(() => setContent({})); }, []);
  useEffect(() => { if (content) setDraft(JSON.stringify(content[key] ?? {}, null, 2)); }, [content, key]);
  const save = async () => {
    setMsg(null);
    try {
      const value = JSON.parse(draft);
      await adminAPI.putContent(key, value);
      setContent({ ...content, [key]: value });
      setMsg('Saved ✓');
    } catch (e) { setMsg('Invalid JSON or save failed'); }
  };
  if (!content) return <PageLoader />;
  return (
    <>
      <h1>Website content</h1>
      <p className="muted mt-1">Edit homepage hero, sections, social links, contact info, legal pages, pricing, and more.</p>
      <div className="field mt-3" style={{ maxWidth: 320 }}>
        <label>Content key</label>
        <select value={key} onChange={(e) => setKey(e.target.value)}>
          {Object.keys(content).sort().map((k) => <option key={k}>{k}</option>)}
        </select>
      </div>
      <textarea value={draft} onChange={(e) => setDraft(e.target.value)} style={{ minHeight: 380, fontFamily: 'monospace', fontSize: '.85rem' }} />
      <div className="row mt-2">
        <button className="btn btn--primary" onClick={save}>Save</button>
        {msg && <span className="muted" style={{ color: msg.includes('✓') ? 'var(--ok)' : 'var(--err)' }}>{msg}</span>}
      </div>
    </>
  );
}

function SettingsAdmin() {
  const nav = useNavigate();
  const [msg, setMsg] = useState(null);
  const reseed = async () => { setMsg('Seeding…'); try { await adminAPI.seed(); setMsg('Seed complete'); } catch { setMsg('Seed failed'); } };
  return (
    <>
      <h1>Settings</h1>
      <div className="card mt-3" style={{ maxWidth: 520 }}>
        <h3>Re-run content seed</h3>
        <p className="muted" style={{ fontSize: '.9rem' }}>Adds any missing default navigation, site content, and demo catalog. Existing data is not overwritten.</p>
        <button className="btn btn--secondary mt-2" onClick={reseed}>Run seed</button>
        {msg && <p className="mt-1 muted">{msg}</p>}
      </div>
      <div className="card mt-3" style={{ maxWidth: 520 }}>
        <h3>Sign out</h3>
        <button className="btn btn--secondary mt-2" onClick={() => { localStorage.removeItem('admin_token'); nav('/admin'); }}>Sign out of admin</button>
      </div>
    </>
  );
}

const APPLICANT_STATUSES = ['submitted', 'reviewing', 'shortlisted', 'interview', 'offered', 'hired', 'rejected'];

function fileHref(u) {
  if (!u) return null;
  return /^https?:/.test(u) ? u : `${API_ORIGIN}${u}`;
}

function ApplicantsManager({ kind }) {
  const label = kind === 'internship' ? 'Internship applicants' : 'Job applicants';
  const [rows, setRows] = useState(null);
  const [filter, setFilter] = useState('');
  const [open, setOpen] = useState(null);
  const [busy, setBusy] = useState(false);

  const load = useCallback(() => {
    setRows(null);
    adminAPI.applications(kind).then((r) => setRows(r.data || [])).catch(() => setRows([]));
  }, [kind]);
  useEffect(() => { load(); }, [load]);

  const setStatus = async (id, status) => {
    setBusy(true);
    try {
      await adminAPI.setApplicationStatus(kind, id, status);
      setOpen((o) => (o && o.id === id ? { ...o, status } : o));
      setRows((rs) => rs.map((r) => (r.id === id ? { ...r, status } : r)));
    } finally { setBusy(false); }
  };

  const remove = async (id) => {
    if (!window.confirm('Delete this application?')) return;
    await adminAPI.deleteApplication(kind, id);
    setOpen(null);
    load();
  };

  if (!rows) return <PageLoader />;
  const shown = filter ? rows.filter((r) => r.status === filter) : rows;

  return (
    <>
      <div className="between mb-3">
        <h1>{label} <span className="muted" style={{ fontSize: '1rem' }}>({rows.length})</span></h1>
        <select value={filter} onChange={(e) => setFilter(e.target.value)} style={{ maxWidth: 200 }}>
          <option value="">All statuses</option>
          {APPLICANT_STATUSES.map((s) => <option key={s}>{s}</option>)}
        </select>
      </div>

      {shown.length === 0 ? <EmptyState icon={<FileText size={24} />} title="No applications yet" /> : (
        <div className="table-wrap">
          <table className="data">
            <thead><tr>
              <th>Name</th><th>Email</th><th>Phone</th>
              <th>{kind === 'internship' ? 'Program' : 'Position'}</th>
              <th>Status</th><th>Applied</th><th /></tr></thead>
            <tbody>
              {shown.map((a) => (
                <tr key={a.id}>
                  <td>{a.full_name}</td>
                  <td>{a.email}</td>
                  <td>{a.phone || '—'}</td>
                  <td>{a.position}</td>
                  <td><StatusBadge status={a.status || 'submitted'} /></td>
                  <td>{a.created_at ? new Date(a.created_at).toLocaleDateString() : '—'}</td>
                  <td><button className="btn btn--ghost btn--sm" onClick={() => setOpen(a)}>View</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Modal open={!!open} onClose={() => setOpen(null)} title={open ? open.full_name : ''}>
        {open && (
          <div className="stack" style={{ gap: 12 }}>
            <div className="row" style={{ gap: 8 }}>
              <a className="pill" href={`mailto:${open.email}`}><Mail size={13} /> {open.email}</a>
              {open.phone && <a className="pill" href={`tel:${open.phone}`}><Phone size={13} /> {open.phone}</a>}
            </div>

            <div><b>{kind === 'internship' ? 'Program' : 'Position'}:</b> {open.position}</div>
            {open.education && <div><b>Education:</b> {open.education}</div>}
            {open.interest_area && <div><b>Area of interest:</b> {open.interest_area}</div>}
            {open.preferred_duration && <div><b>Preferred duration:</b> {open.preferred_duration}</div>}
            {open.start_date && <div><b>Start date:</b> {new Date(open.start_date).toLocaleDateString()}</div>}
            {open.message && <div><b>Message:</b><p className="muted" style={{ marginTop: 4 }}>{open.message}</p></div>}
            {open.cover_letter && <div><b>Cover letter:</b><p className="muted" style={{ marginTop: 4, whiteSpace: 'pre-line' }}>{open.cover_letter}</p></div>}

            <div>
              <b>{open.file_label || 'File'}:</b>{' '}
              {open.file_url
                ? <a className="btn btn--secondary btn--sm" href={fileHref(open.file_url)} target="_blank" rel="noopener noreferrer"><Download size={14} /> Download {open.file_label} <ExternalLink size={12} /></a>
                : <span className="muted">not provided</span>}
            </div>

            <div className="field" style={{ margin: 0 }}>
              <label>Status</label>
              <select value={open.status || 'submitted'} disabled={busy} onChange={(e) => setStatus(open.id, e.target.value)}>
                {APPLICANT_STATUSES.map((s) => <option key={s}>{s}</option>)}
              </select>
            </div>

            <div className="row" style={{ justifyContent: 'space-between' }}>
              <span className="muted" style={{ fontSize: '.8rem' }}>Applied {open.created_at ? new Date(open.created_at).toLocaleString() : ''}</span>
              <button className="btn btn--ghost btn--sm" style={{ color: 'var(--err)' }} onClick={() => remove(open.id)}><Trash2 size={13} /> Delete</button>
            </div>
          </div>
        )}
      </Modal>
    </>
  );
}

function AuditAdmin() {
  const [rows, setRows] = useState(null);
  useEffect(() => { adminAPI.audit().then((r) => setRows(r.data)).catch(() => setRows([])); }, []);
  if (!rows) return <PageLoader />;
  return (
    <>
      <h1>Audit log</h1>
      <div className="table-wrap mt-3">
        <table className="data">
          <thead><tr><th>When</th><th>Actor</th><th>Action</th><th>Entity</th><th>ID</th></tr></thead>
          <tbody>{rows.map((r) => (
            <tr key={r.id}><td>{new Date(r.created_at).toLocaleString()}</td><td>{r.actor_email}</td><td>{r.action}</td><td>{r.entity}</td><td>{r.entity_id}</td></tr>
          ))}</tbody>
        </table>
      </div>
    </>
  );
}

/* ---------- mobile apps (icon + screenshots + APK) ---------- */
const MIN_SHOTS = 3;
const EMPTY_APP = {
  name: '', tagline: '', category: '', version: '', min_android: '', description: '', whats_new: '',
  icon: '', screenshots: [], apk_url: '', is_published: true, sort_order: 0,
};

function MobileAppsAdmin() {
  const [rows, setRows] = useState(null);
  const [editing, setEditing] = useState(null);
  const [apkFile, setApkFile] = useState(null);
  const [busy, setBusy] = useState('');       // '' | 'icon' | 'shots' | 'save'
  const [progress, setProgress] = useState(null);
  const [err, setErr] = useState(null);

  const load = useCallback(() => {
    adminAPI.mobileApps().then((r) => setRows(r.data || [])).catch(() => setRows([]));
  }, []);
  useEffect(() => { load(); }, [load]);

  const open = (row) => {
    setErr(null); setApkFile(null); setProgress(null);
    setEditing(row ? { ...EMPTY_APP, ...row, screenshots: row.screenshots || [], apk_url: row.apk_url || '' } : { ...EMPTY_APP });
  };
  const set = (k, v) => setEditing((e) => ({ ...e, [k]: v }));

  const uploadImage = async (file, folder) => {
    const fd = new FormData();
    fd.append('file', file);
    fd.append('folder', folder);
    const { data } = await adminAPI.upload(fd);
    return data.path || data.url;
  };

  const onIcon = async (file) => {
    setBusy('icon'); setErr(null);
    try { set('icon', await uploadImage(file, 'icons')); } catch (e) { setErr(errText(e)); } finally { setBusy(''); }
  };

  const onShots = async (files) => {
    setBusy('shots'); setErr(null);
    try {
      for (const f of Array.from(files)) {
        const url = await uploadImage(f, 'screenshots');
        setEditing((e) => ({ ...e, screenshots: [...e.screenshots, url] }));
      }
    } catch (e) { setErr(errText(e)); } finally { setBusy(''); }
  };

  const moveShot = (i, d) => setEditing((e) => {
    const s = [...e.screenshots];
    const j = i + d;
    if (j < 0 || j >= s.length) return e;
    [s[i], s[j]] = [s[j], s[i]];
    return { ...e, screenshots: s };
  });

  const save = async () => {
    const e = editing;
    const apkUrl = (e.apk_url || '').trim();
    const hasApk = !!(apkFile || e.has_apk || apkUrl);
    const problem = !e.name.trim() ? 'App name is required.'
      : !e.icon ? 'Upload an app icon.'
        : e.screenshots.length < MIN_SHOTS ? `Upload at least ${MIN_SHOTS} screenshots (${e.screenshots.length} so far).`
          : !(e.description || '').trim() ? 'Add an app description.'
            : e.is_published && !hasApk ? 'Choose an APK file (or paste a download link) before publishing.'
              : null;
    if (problem) { setErr(problem); return; }

    setBusy('save'); setErr(null);
    const wantPublished = e.is_published;
    // The server refuses to publish without an APK, so publish only after a pending upload lands.
    const publishNow = wantPublished && !(apkFile && !e.has_apk && !apkUrl);
    const payload = {
      name: e.name, tagline: e.tagline, category: e.category, version: e.version, min_android: e.min_android,
      description: e.description, whats_new: e.whats_new, icon: e.icon, screenshots: e.screenshots,
      apk_url: apkUrl, sort_order: Number(e.sort_order) || 0, is_published: publishNow,
    };
    try {
      const { data: savedRow } = e.id ? await adminAPI.updateMobileApp(e.id, payload) : await adminAPI.createMobileApp(payload);
      setEditing((cur) => ({ ...cur, id: savedRow.id, has_apk: savedRow.has_apk }));
      if (apkFile) {
        const fd = new FormData();
        fd.append('file', apkFile);
        setProgress(0);
        await adminAPI.uploadApk(savedRow.id, fd, (ev) => ev.total && setProgress(Math.round((ev.loaded / ev.total) * 100)));
        setApkFile(null);
        if (wantPublished && !publishNow) await adminAPI.updateMobileApp(savedRow.id, { is_published: true });
      }
      setEditing(null);
      load();
    } catch (e2) {
      setErr(errText(e2));
      load();
    } finally { setBusy(''); setProgress(null); }
  };

  const remove = async (row) => {
    if (!window.confirm(`Delete "${row.name}" and its APK?`)) return;
    await adminAPI.deleteMobileApp(row.id);
    load();
  };

  const togglePublish = async (row) => {
    try { await adminAPI.updateMobileApp(row.id, { is_published: !row.is_published }); load(); } catch (e) { window.alert(errText(e)); }
  };

  if (!rows) return <PageLoader />;
  const e = editing;

  return (
    <>
      <div className="between mb-3">
        <h1>Mobile apps</h1>
        <button className="btn btn--primary btn--sm" onClick={() => open(null)}><Plus size={15} /> New app</button>
      </div>

      {rows.length === 0 ? (
        <EmptyState icon={<Smartphone size={24} />} title="No mobile apps yet"
          action={<button className="btn btn--primary" onClick={() => open(null)}>Add your first app</button>}>
          Apps you add here appear on the public Mobile Apps page with screenshots and an APK download.
        </EmptyState>
      ) : (
        <div className="table-wrap">
          <table className="data">
            <thead><tr><th /><th>Name</th><th>Version</th><th>APK</th><th>Downloads</th><th>Status</th><th /></tr></thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.id}>
                  <td>{r.icon ? <img src={mediaUrl(r.icon)} alt="" style={{ width: 36, height: 36, borderRadius: 8, objectFit: 'cover' }} /> : null}</td>
                  <td><b>{r.name}</b><div className="muted" style={{ fontSize: '.78rem' }}>/mobile-apps/{r.slug}</div></td>
                  <td>{r.version || '—'}</td>
                  <td>{r.apk_file_id ? (r.apk_size_label || 'uploaded') : r.apk_url ? 'external link' : <span style={{ color: 'var(--err)' }}>missing</span>}</td>
                  <td>{r.download_count || 0}</td>
                  <td><button className="btn btn--ghost btn--sm" onClick={() => togglePublish(r)} title="Toggle published"><StatusBadge status={r.is_published ? 'published' : 'draft'} /></button></td>
                  <td>
                    <div className="row" style={{ gap: 6, flexWrap: 'nowrap' }}>
                      {r.is_published && <a className="btn btn--ghost btn--sm" href={`/mobile-apps/${r.slug}`} target="_blank" rel="noopener noreferrer" title="View"><ExternalLink size={14} /></a>}
                      <button className="btn btn--ghost btn--sm" onClick={() => open(r)} title="Edit"><Pencil size={14} /></button>
                      <button className="btn btn--ghost btn--sm" style={{ color: 'var(--err)' }} onClick={() => remove(r)} title="Delete"><Trash2 size={14} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Modal open={!!e} onClose={() => !busy && setEditing(null)} title={e?.id ? `Edit ${e.name}` : 'New mobile app'}>
        {e && (
          <div>
            <div className="field"><label>App name *</label><input value={e.name} onChange={(ev) => set('name', ev.target.value)} /></div>
            <div className="field"><label>Short tagline</label><input value={e.tagline || ''} maxLength={255} onChange={(ev) => set('tagline', ev.target.value)} placeholder="One line shown on the app card" /></div>

            <div className="field">
              <label>App icon * <span className="hint">square PNG/JPG, 512×512 recommended</span></label>
              <div className="row" style={{ gap: 12 }}>
                {e.icon && <img src={mediaUrl(e.icon)} alt="" style={{ width: 64, height: 64, objectFit: 'cover', borderRadius: 14, border: '1px solid var(--line)' }} />}
                <input type="file" accept="image/*" disabled={!!busy} onChange={(ev) => ev.target.files[0] && onIcon(ev.target.files[0])} />
                {busy === 'icon' && <IosSpinner size="sm" />}
              </div>
            </div>

            <div className="field">
              <label>Screenshots * <span className="hint">at least {MIN_SHOTS} · {e.screenshots.length} added</span></label>
              {e.screenshots.length > 0 && (
                <div className="shot-grid mb-1">
                  {e.screenshots.map((s, i) => (
                    <div className="shot-grid__item" key={s + i}>
                      <img src={mediaUrl(s)} alt={`Screenshot ${i + 1}`} />
                      <div className="shot-grid__actions">
                        <button type="button" onClick={() => moveShot(i, -1)} aria-label="Move left">‹</button>
                        <button type="button" onClick={() => set('screenshots', e.screenshots.filter((_, j) => j !== i))} aria-label="Remove"><X size={13} /></button>
                        <button type="button" onClick={() => moveShot(i, 1)} aria-label="Move right">›</button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              <div className="row" style={{ gap: 10 }}>
                <input type="file" accept="image/*" multiple disabled={!!busy} onChange={(ev) => { if (ev.target.files.length) onShots(ev.target.files); ev.target.value = ''; }} />
                {busy === 'shots' && <IosSpinner size="sm" />}
              </div>
            </div>

            <div className="field"><label>Description *</label><textarea value={e.description || ''} onChange={(ev) => set('description', ev.target.value)} placeholder="What the app does, key features…" /></div>
            <div className="field"><label>What&apos;s new <span className="hint">optional release notes</span></label><textarea value={e.whats_new || ''} style={{ minHeight: 70 }} onChange={(ev) => set('whats_new', ev.target.value)} /></div>

            <div className="grid grid-2" style={{ gap: 12 }}>
              <div className="field"><label>Version</label><input value={e.version || ''} onChange={(ev) => set('version', ev.target.value)} placeholder="1.0.0" /></div>
              <div className="field"><label>Category</label><input value={e.category || ''} onChange={(ev) => set('category', ev.target.value)} placeholder="Finance, Education…" /></div>
              <div className="field"><label>Minimum Android</label><input value={e.min_android || ''} onChange={(ev) => set('min_android', ev.target.value)} placeholder="Android 8.0+" /></div>
              <div className="field"><label>Sort order</label><input type="number" value={e.sort_order ?? 0} onChange={(ev) => set('sort_order', ev.target.value)} /></div>
            </div>

            <div className="field">
              <label>APK file {e.is_published ? '*' : ''}</label>
              {e.apk_filename && !apkFile && <div className="muted" style={{ fontSize: '.85rem' }}>Current: {e.apk_filename} ({e.apk_size_label || 'uploaded'}) — choose a file to replace it</div>}
              <input type="file" accept=".apk,application/vnd.android.package-archive" disabled={!!busy}
                onChange={(ev) => setApkFile(ev.target.files[0] || null)} />
              {apkFile && <div className="muted" style={{ fontSize: '.85rem' }}>{apkFile.name} · {(apkFile.size / 1048576).toFixed(1)} MB — uploads when you save</div>}
              {progress !== null && (
                <div className="mt-1">
                  <div className="upload-bar"><span style={{ width: `${progress}%` }} /></div>
                  <div className="muted" style={{ fontSize: '.8rem' }}>{progress < 100 ? `Uploading APK… ${progress}%` : 'Saving APK on the server…'}</div>
                </div>
              )}
            </div>
            <div className="field">
              <label>…or external download link <span className="hint">used only when no APK file is uploaded</span></label>
              <input value={e.apk_url || ''} onChange={(ev) => set('apk_url', ev.target.value)} placeholder="https://github.com/…/releases/download/…/app.apk" />
            </div>

            <label className="row" style={{ gap: 8, marginBottom: 16 }}>
              <input type="checkbox" checked={!!e.is_published} onChange={(ev) => set('is_published', ev.target.checked)} />
              <span>Published (visible on the Mobile Apps page)</span>
            </label>

            {err && <p style={{ color: 'var(--err)', fontSize: '.85rem' }}>{err}</p>}
            <div className="row mt-2">
              <button className="btn btn--primary" onClick={save} disabled={!!busy}>{busy === 'save' ? <IosSpinner size="sm" /> : 'Save'}</button>
              <button className="btn btn--ghost" onClick={() => setEditing(null)} disabled={!!busy}>Cancel</button>
            </div>
          </div>
        )}
      </Modal>
    </>
  );
}

/* ---------- login ---------- */
function AdminLogin({ onDone }) {
  const [form, setForm] = useState({ email: '', password: '' });
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState(null);
  const submit = async (e) => {
    e.preventDefault();
    setBusy(true); setErr(null);
    try {
      const { data } = await adminAPI.login(form);
      localStorage.setItem('admin_token', data.access_token);
      onDone();
    } catch (e2) { setErr(errText(e2)); setBusy(false); }
  };
  return (
    <section className="section"><div className="container" style={{ maxWidth: 400 }}>
      <h1>Admin access</h1>
      <form className="card mt-3" onSubmit={submit}>
        <div className="field"><label>Admin email</label><input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="admin@akagerainc.store" /></div>
        <div className="field"><label>Password</label><input type="password" required value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} /></div>
        {err && <p style={{ color: 'var(--err)', fontSize: '.85rem' }}>{err}</p>}
        <button className="btn btn--primary btn--block" disabled={busy}>{busy ? <IosSpinner size="sm" /> : 'Sign in'}</button>
      </form>
    </div></section>
  );
}

/* ---------- shell ---------- */
const SIDEBAR = [
  ['', 'Dashboard', LayoutDashboard],
  ['products', 'Products', Package],
  ['services', 'Services', Wrench],
  ['service-fields', 'Service fields', Wrench],
  ['mobile-apps', 'Mobile apps', Smartphone],
  ['downloads', 'Downloads', Download],
  ['orders', 'Orders', ShoppingBag],
  ['users', 'Customers', Users],
  ['licenses', 'Licenses', KeyRound],
  ['blog', 'Blog', Newspaper],
  ['case-studies', 'Case studies', Briefcase],
  ['internships', 'Internships', GraduationCap],
  ['internship-applicants', 'Internship applicants', FileText],
  ['careers', 'Careers', Briefcase],
  ['job-applicants', 'Job applicants', FileText],
  ['industries', 'Industries', LayoutDashboard],
  ['testimonials', 'Testimonials', Users],
  ['faqs', 'FAQs', LifeBuoy],
  ['docs', 'Documentation', ScrollText],
  ['categories', 'Categories', LayoutDashboard],
  ['navigation', 'Navigation', NavIcon],
  ['media', 'Media', ImageIcon],
  ['pages', 'Website content', SettingsIcon],
  ['audit', 'Audit log', ScrollText],
  ['settings', 'Settings', SettingsIcon],
];

export default function Admin() {
  const [authed, setAuthed] = useState(!!localStorage.getItem('admin_token'));
  const nav = useNavigate();

  if (!authed) return (<><Seo title="Admin" /><AdminLogin onDone={() => setAuthed(true)} /></>);

  return (
    <>
      <Seo title="Admin" />
      <div className="shell">
        <aside className="shell__side">
          <div style={{ padding: '4px 14px 14px', color: '#fff', fontWeight: 800 }}>Akagera Admin</div>
          <div className="shell__side-scroll">
            {SIDEBAR.map(([path, label, Icon]) => (
              <NavLink key={path} to={`/admin/${path}`} end={path === ''} className={({ isActive }) => isActive ? 'active' : ''}>
                <Icon size={15} /> {label}
              </NavLink>
            ))}
            <button onClick={() => { localStorage.removeItem('admin_token'); setAuthed(false); nav('/admin'); }}
              style={{ display: 'flex', gap: 10, alignItems: 'center', padding: '11px 14px', color: 'rgba(255,255,255,.7)', width: '100%', fontWeight: 600, fontSize: '.9rem' }}>
              <LogOut size={15} /> Sign out
            </button>
          </div>
        </aside>
        <main className="shell__main">
          <Routes>
            <Route index element={<AdminHome />} />
            <Route path="mobile-apps" element={<MobileAppsAdmin />} />
            <Route path="orders" element={<Orders />} />
            <Route path="users" element={<UsersAdmin />} />
            <Route path="licenses" element={<LicensesAdmin />} />
            <Route path="media" element={<ImagesAdmin />} />
            <Route path="pages" element={<ContentAdmin />} />
            <Route path="settings" element={<SettingsAdmin />} />
            <Route path="audit" element={<AuditAdmin />} />
            <Route path="internship-applicants" element={<ApplicantsManager kind="internship" />} />
            <Route path="job-applicants" element={<ApplicantsManager kind="job" />} />
            {Object.entries(RESOURCES).map(([key, cfg]) => (
              <Route key={key} path={key} element={<ResourceManager cfg={cfg} />} />
            ))}
            <Route path="*" element={<Navigate to="/admin" replace />} />
          </Routes>
        </main>
      </div>
    </>
  );
}
