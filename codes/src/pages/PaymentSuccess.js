import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Payment.css';

function PaymentSuccess() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = window.setTimeout(() => {
      navigate('/dashboard');
    }, 4000);
    return () => window.clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="payment-container">
      <div className="payment-content">
        <div className="payment-card" style={{ textAlign: 'center', maxWidth: '560px' }}>
          <div style={{ fontSize: '3rem', marginBottom: '12px' }}>✅</div>
          <h2 style={{ marginBottom: '10px' }}>Payment Completed Successfully</h2>
          <p style={{ fontSize: '1rem', lineHeight: 1.6, marginBottom: '20px' }}>
            Your payment has been confirmed. Your service access is now active and your dashboard has been updated.
          </p>
          <button className="payment-button" onClick={() => navigate('/dashboard')}>
            Go to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}

export default PaymentSuccess;
