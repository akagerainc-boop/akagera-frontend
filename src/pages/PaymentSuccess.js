import React, { useEffect, useState } from 'react';
import { Link, useSearchParams, useLocation } from 'react-router-dom';
import { CheckCircle2, XCircle } from 'lucide-react';
import Seo from '../components/Seo';
import { PageLoader } from '../components/Loader';
import { useAuth } from '../context/AuthContext';
import { paymentAPI, errText } from '../api';

export default function PaymentSuccess() {
  const [params] = useSearchParams();
  const location = useLocation();
  const { user } = useAuth();
  const [state, setState] = useState('working'); // working | ok | error
  const [detail, setDetail] = useState(null);

  useEffect(() => {
    const paypalToken = params.get('token');
    if (paypalToken && user) {
      paymentAPI.paypalCapture(paypalToken, user.id)
        .then((r) => { setState('ok'); setDetail(r.data); })
        .catch((e) => { setState('error'); setDetail(errText(e)); });
    } else {
      // MoMo / free flow already confirmed elsewhere
      setState('ok');
    }
  }, [params, user, location.state]);

  if (state === 'working') return <PageLoader label="Confirming your payment…" />;

  return (
    <>
      <Seo title={state === 'ok' ? 'Payment confirmed' : 'Payment issue'} />
      <section className="section">
        <div className="container text-center" style={{ maxWidth: 560 }}>
          {state === 'ok' ? (
            <>
              <div className="empty__icon" style={{ width: 64, height: 64, background: '#E7F4EC', color: 'var(--ok)' }}><CheckCircle2 size={30} /></div>
              <h1 className="mt-2">Payment confirmed</h1>
              <p className="lead mt-1">Your order is active. You'll find licenses, invoices, and downloads in your dashboard.</p>
              {detail?.license_key && <p className="mt-2"><span className="pill">License: {detail.license_key}</span></p>}
              <div className="row mt-4" style={{ justifyContent: 'center' }}>
                <Link to="/dashboard/orders" className="btn btn--primary">View my orders</Link>
                <Link to="/dashboard/downloads" className="btn btn--secondary">Downloads</Link>
              </div>
            </>
          ) : (
            <>
              <div className="empty__icon" style={{ width: 64, height: 64, background: '#FBEAE8', color: 'var(--err)' }}><XCircle size={30} /></div>
              <h1 className="mt-2">We couldn't confirm the payment</h1>
              <p className="lead mt-1">{detail || 'Please try again or contact support.'}</p>
              <div className="row mt-4" style={{ justifyContent: 'center' }}>
                <Link to="/dashboard/orders" className="btn btn--primary">Check my orders</Link>
                <Link to="/support" className="btn btn--secondary">Contact support</Link>
              </div>
            </>
          )}
        </div>
      </section>
    </>
  );
}
