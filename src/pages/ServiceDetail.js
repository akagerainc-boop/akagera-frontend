import React, { useEffect, useMemo, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Check, Clock, ArrowRight, ShieldCheck } from 'lucide-react';
import Seo from '../components/Seo';
import { PageLoader } from '../components/Loader';
import { ServiceCard } from '../components/cards';
import FAQAccordion from '../components/FAQAccordion';
import DynamicForm from '../components/DynamicForm';
import { Breadcrumbs, priceLabel, EmptyState } from '../components/ui';
import { useAuth } from '../context/AuthContext';
import { serviceAPI, orderAPI, errText } from '../api';

export default function ServiceDetail() {
  const { slug } = useParams();
  const nav = useNavigate();
  const { user } = useAuth();
  const [s, setS] = useState(null);
  const [err, setErr] = useState(false);
  const [form, setForm] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState(null);

  useEffect(() => {
    setS(null); setErr(false); setForm({});
    serviceAPI.get(slug).then((r) => setS(r.data)).catch(() => setErr(true));
  }, [slug]);

  const missing = useMemo(() => (s?.fields || []).filter((f) => f.required && !String(form[f.field_key] || '').trim()).map((f) => f.label), [s, form]);

  const purchase = async () => {
    setFormError(null);
    if (!user) { nav('/login', { state: { from: `/services/${slug}` } }); return; }
    if (missing.length) { setFormError(`Please fill: ${missing.join(', ')}`); return; }
    setSubmitting(true);
    try {
      const { data } = await orderAPI.start({ service_id: s.id, form_data: form, currency: s.currency || 'USD' });
      nav(`/checkout/${data.order.order_ref}`);
    } catch (e) {
      setFormError(errText(e));
    } finally {
      setSubmitting(false);
    }
  };

  if (err) return <div className="container section"><EmptyState title="Service not found" action={<Link className="btn btn--primary" to="/services">All services</Link>} /></div>;
  if (!s) return <PageLoader />;

  return (
    <>
      <Seo title={s.name} description={s.short_description}
        jsonLd={{ '@context': 'https://schema.org', '@type': 'Service', name: s.name, description: s.description,
          offers: { '@type': 'Offer', price: s.price, priceCurrency: s.currency || 'USD' } }} />

      <section className="section section--dark section--tight">
        <div className="container">
          <Breadcrumbs items={[{ label: 'Services', to: '/services' }, { label: s.name }]} />
          <div style={{ maxWidth: 720 }}>
            {s.category && <span className="badge mb-2">{s.category}</span>}
            <h1>{s.name}</h1>
            <p className="lead mt-2" style={{ color: 'rgba(255,255,255,.82)' }}>{s.short_description || s.description}</p>
            <div className="row mt-3">
              <span className="pill pill--brand"><Clock size={14} /> {s.duration_label}</span>
              <span className="pill pill--brand">{priceLabel(s.price, s.currency)}</span>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container grid grid-2" style={{ alignItems: 'start' }}>
          <div>
            <h2>About this service</h2>
            <p className="mt-2" style={{ whiteSpace: 'pre-line' }}>{s.description}</p>

            {s.features?.length > 0 && (
              <>
                <h3 className="mt-4">What's included</h3>
                <ul className="stack mt-2" style={{ listStyle: 'none', padding: 0, gap: 10 }}>
                  {s.features.map((f, i) => <li key={i} className="row" style={{ gap: 8, alignItems: 'flex-start' }}><Check size={16} style={{ color: 'var(--brand)', marginTop: 3, flexShrink: 0 }} /> {f}</li>)}
                </ul>
              </>
            )}

            {s.requirements?.length > 0 && (
              <>
                <h3 className="mt-4">What we need from you</h3>
                <ul className="stack mt-2" style={{ gap: 8 }}>{s.requirements.map((r, i) => <li key={i}>{r}</li>)}</ul>
              </>
            )}

            {s.process_steps?.length > 0 && (
              <>
                <h3 className="mt-4">Process</h3>
                <ol className="stack mt-2" style={{ gap: 12 }}>
                  {s.process_steps.map((step, i) => (
                    <li key={i} className="row" style={{ gap: 12, alignItems: 'flex-start' }}>
                      <span className="badge badge--ink" style={{ minWidth: 26, justifyContent: 'center' }}>{i + 1}</span> {step}
                    </li>
                  ))}
                </ol>
              </>
            )}

            {s.faqs?.length > 0 && (
              <>
                <h3 className="mt-4">FAQ</h3>
                <FAQAccordion items={s.faqs} />
              </>
            )}

            {s.terms && <><h3 className="mt-4">Terms</h3><p className="mt-1 muted" style={{ fontSize: '.9rem' }}>{s.terms}</p></>}

            {s.related?.length > 0 && (
              <>
                <h3 className="mt-4">Related services</h3>
                <div className="grid grid-2 mt-2">{s.related.map((r) => <ServiceCard key={r.id} service={r} />)}</div>
              </>
            )}
          </div>

          <aside className="card card--pad-lg" style={{ position: 'sticky', top: 88 }}>
            <div className="price-accent" style={{ fontSize: '2rem', fontWeight: 800 }}>{priceLabel(s.price, s.currency)}</div>
            <div className="muted" style={{ fontSize: '.88rem' }}>{s.duration_label}</div>
            <div className="divider" />
            <h4>Start your order</h4>
            <p className="muted" style={{ fontSize: '.85rem' }}>Tell us a bit about your project — we tailor delivery to it.</p>
            <div className="mt-2"><DynamicForm fields={s.fields || []} value={form} onChange={setForm} /></div>
            {formError && <p style={{ color: 'var(--err)', fontSize: '.85rem' }}>{formError}</p>}
            <button className="btn btn--primary btn--block mt-2" onClick={purchase} disabled={submitting}>
              {submitting ? 'Creating order…' : user ? 'Continue to payment' : 'Sign in & purchase'} <ArrowRight size={16} />
            </button>
            <p className="row mt-2 muted" style={{ fontSize: '.78rem', gap: 6 }}><ShieldCheck size={14} /> Secure checkout · PayPal & Mobile Money</p>
          </aside>
        </div>
      </section>
    </>
  );
}
