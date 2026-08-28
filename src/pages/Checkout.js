import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ShieldCheck, Smartphone, CreditCard } from 'lucide-react';
import Seo from '../components/Seo';
import { PageLoader, IosSpinner } from '../components/Loader';
import { Breadcrumbs, priceLabel, EmptyState } from '../components/ui';
import { useAuth } from '../context/AuthContext';
import { orderAPI, paymentAPI, errText } from '../api';

export default function Checkout() {
  const { orderRef } = useParams();
  const nav = useNavigate();
  const { user } = useAuth();
  const [order, setOrder] = useState(null);
  const [err, setErr] = useState(null);
  const [method, setMethod] = useState('paypal');
  const [phone, setPhone] = useState('');
  const [busy, setBusy] = useState(false);
  const [stage, setStage] = useState('select'); // select | momo-wait
  const pollRef = useRef(null);

  useEffect(() => {
    orderAPI.get(orderRef).then((r) => setOrder(r.data)).catch(() => setErr('Order not found'));
    return () => clearInterval(pollRef.current);
  }, [orderRef]);

  const amount = order ? Number(order.total) : 0;

  const payPaypal = async () => {
    setBusy(true); setErr(null);
    try {
      const { data } = await paymentAPI.paypalCreate(user.id, { amount, service_id: order.items[0]?.ref_id, currency: order.currency || 'USD' }, orderRef);
      if (data.approval_url) window.location.href = data.approval_url;
      else throw new Error('Could not start PayPal checkout');
    } catch (e) { setErr(errText(e)); setBusy(false); }
  };

  const payMomo = async () => {
    if (!/^07[2-9]\d{7}$/.test(phone)) { setErr('Enter a valid Rwandan number, e.g. 07XXXXXXXX'); return; }
    setBusy(true); setErr(null);
    try {
      const { data } = await paymentAPI.momoInitiate({
        amount, service_id: order.items[0]?.ref_id, currency: 'USD', user_id: user.id, phone_number: phone, order_ref: orderRef,
      });
      const ref = data.req_ref || data.momo_reference;
      if (!data.success || !ref) throw new Error(data.error || 'MoMo initiation failed');
      setStage('momo-wait');
      let tries = 0;
      pollRef.current = setInterval(async () => {
        tries += 1;
        try {
          const s = await paymentAPI.momoStatus(ref);
          if (s.data?.status === 'completed') {
            clearInterval(pollRef.current);
            nav('/payment-success', { state: { orderRef } });
          }
        } catch { /* keep polling */ }
        if (tries > 24) { clearInterval(pollRef.current); setErr('Payment not confirmed yet. Check your dashboard shortly.'); }
      }, 5000);
    } catch (e) { setErr(errText(e)); }
    finally { setBusy(false); }
  };

  if (err && !order) return <div className="container section"><EmptyState title={err} action={<button className="btn btn--primary" onClick={() => nav('/services')}>Back to services</button>} /></div>;
  if (!order) return <PageLoader />;

  return (
    <>
      <Seo title="Checkout" />
      <section className="section">
        <div className="container" style={{ maxWidth: 900 }}>
          <Breadcrumbs items={[{ label: 'Services', to: '/services' }, { label: 'Checkout' }]} />
          <h1>Complete your payment</h1>

          <div className="grid grid-2 mt-3" style={{ alignItems: 'start' }}>
            <div className="card">
              <h3>Order {order.order_ref}</h3>
              {order.items.map((it) => (
                <div key={it.id} className="between mt-2" style={{ borderBottom: '1px solid var(--line)', paddingBottom: 10 }}>
                  <div><b>{it.name}</b><div className="muted" style={{ fontSize: '.82rem' }}>{it.duration_label}</div></div>
                  <b>{priceLabel(it.unit_amount, order.currency)}</b>
                </div>
              ))}
              <div className="between mt-3" style={{ fontSize: '1.15rem' }}><b>Total</b><b>{priceLabel(order.total, order.currency)}</b></div>
              {order.status === 'completed' && <p className="mt-2" style={{ color: 'var(--ok)' }}>This order is already paid.</p>}
            </div>

            <div className="card">
              {stage === 'select' && (
                <>
                  <h3>Payment method</h3>
                  <div className="stack mt-2">
                    <button className={`card ${method === 'paypal' ? '' : ''}`} style={{ textAlign: 'left', borderColor: method === 'paypal' ? 'var(--brand)' : 'var(--line)' }} onClick={() => setMethod('paypal')}>
                      <div className="row" style={{ gap: 10 }}><CreditCard size={18} /> <b>Card / PayPal</b></div>
                      <p className="muted" style={{ fontSize: '.85rem' }}>Visa, Mastercard, Amex via PayPal.</p>
                    </button>
                    <button className="card" style={{ textAlign: 'left', borderColor: method === 'momo' ? 'var(--brand)' : 'var(--line)' }} onClick={() => setMethod('momo')}>
                      <div className="row" style={{ gap: 10 }}><Smartphone size={18} /> <b>Mobile Money</b></div>
                      <p className="muted" style={{ fontSize: '.85rem' }}>MTN / Airtel Rwanda.</p>
                    </button>
                  </div>
                  {method === 'momo' && (
                    <div className="field mt-2">
                      <label>Phone number</label>
                      <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="07XXXXXXXX" />
                    </div>
                  )}
                  {err && <p style={{ color: 'var(--err)', fontSize: '.85rem' }}>{err}</p>}
                  <button className="btn btn--primary btn--block mt-2" disabled={busy || order.status === 'completed'} onClick={method === 'paypal' ? payPaypal : payMomo}>
                    {busy ? 'Processing…' : `Pay ${priceLabel(order.total, order.currency)}`}
                  </button>
                  <p className="row mt-2 muted" style={{ gap: 6, fontSize: '.78rem' }}><ShieldCheck size={13} /> Only the amount above will be charged.</p>
                </>
              )}
              {stage === 'momo-wait' && (
                <div className="text-center" style={{ padding: 20 }}>
                  <IosSpinner size="lg" />
                  <h3 className="mt-2">Approve on your phone</h3>
                  <p className="muted">We sent a payment prompt to {phone}. This page updates automatically once confirmed.</p>
                  {err && <p style={{ color: 'var(--warn)' }}>{err}</p>}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
