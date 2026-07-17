import React, { useState, useEffect } from 'react';
import { Copy, Key, CreditCard, LogOut, Building2, Download } from 'lucide-react';
import { licenseAPI, paymentAPI } from '../api';
import { useNavigate } from 'react-router-dom';

function Dashboard({ user }) {
  const [licenses, setLicenses] = useState([]);
  const [payments, setPayments] = useState([]);
  const [portalTokens, setPortalTokens] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const [licensesRes, paymentsRes, portalTokensRes] = await Promise.all([
          licenseAPI.getUserLicenses(user.id),
          paymentAPI.getUserPayments(user.id),
          fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:8000/api'}/business/tokens/user/${user.id}`).then(res => res.json())
        ]);
        setLicenses(licensesRes.data);
        setPayments(paymentsRes.data);
        setPortalTokens(portalTokensRes.tokens || []);
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user?.id) {
      fetchUserData();
    }
  }, [user]);

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    alert('✅ Copied to clipboard!');
  };

  const handleDownloadReceipt = (paymentId) => {
    const url = `${process.env.REACT_APP_API_URL || 'http://localhost:8000/api'}/payments/${paymentId}/receipt?user_id=${user?.id}`;
    window.open(url, '_blank');
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('access_token');
    navigate('/');
  };

  return (
    <div className="page-shell" style={{ minHeight: '100vh', paddingTop: '120px', paddingBottom: '40px', backgroundImage: "url('/dashboard-bg.jpg')", backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat', position: 'relative', backgroundColor: 'var(--light-gray)' }}>
      <div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(255, 255, 255, 0.44)', zIndex: 1 }} />
      <div className="container" style={{ position: 'relative', zIndex: 2 }}>
        {/* Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '40px',
          flexWrap: 'wrap',
          gap: '20px'
        }}>
          <div>
            <h1 style={{ color: 'var(--primary-blue)', marginBottom: '10px' }}>Welcome, {user?.name}!</h1>
            <p style={{ color: 'var(--dark-gray)' }}>{user?.email}</p>
          </div>
          <button
            className="btn btn-outline"
            onClick={handleLogout}
            style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>

        {/* User Stats */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '20px',
          marginBottom: '40px'
        }}>
          <div style={{
            background: 'var(--white)',
            padding: '25px',
            borderRadius: '12px',
            boxShadow: 'var(--box-shadow)',
            textAlign: 'center'
          }}>
            <h3 style={{ color: 'var(--dark-gray)', fontSize: '0.9rem', marginBottom: '10px' }}>
              Active Licenses
            </h3>
            <p style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--secondary-red)' }}>
              {licenses.filter(l => l.is_active).length}
            </p>
          </div>

          <div style={{
            background: 'var(--white)',
            padding: '25px',
            borderRadius: '12px',
            boxShadow: 'var(--box-shadow)',
            textAlign: 'center'
          }}>
            <h3 style={{ color: 'var(--dark-gray)', fontSize: '0.9rem', marginBottom: '10px' }}>
              Total Purchases
            </h3>
            <p style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--primary-blue)' }}>
              {payments.filter(p => p.status === 'completed').length}
            </p>
          </div>

          <div style={{
            background: 'var(--white)',
            padding: '25px',
            borderRadius: '12px',
            boxShadow: 'var(--box-shadow)',
            textAlign: 'center'
          }}>
            <h3 style={{ color: 'var(--dark-gray)', fontSize: '0.9rem', marginBottom: '10px' }}>
              Total Spent
            </h3>
            <p style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--success)' }}>
              ${payments
                .filter(p => p.status === 'completed')
                .reduce((sum, p) => sum + parseFloat(p.amount), 0)
                .toFixed(2)}
            </p>
          </div>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px' }}>
            <div className="spinner"></div>
          </div>
        ) : (
          <>
            {/* Licenses Section */}
            <section style={{ marginBottom: '40px' }}>
              <h2 style={{ color: 'var(--primary-blue)', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Key size={28} />
                Your Licenses
              </h2>

              {licenses.length === 0 ? (
                <div style={{
                  background: 'var(--white)',
                  padding: '40px',
                  borderRadius: '12px',
                  textAlign: 'center',
                  boxShadow: 'var(--box-shadow)'
                }}>
                  <p style={{ color: 'var(--dark-gray)', marginBottom: '20px' }}>
                    You don't have any licenses yet
                  </p>
                  <button
                    className="btn btn-primary"
                    onClick={() => navigate('/services')}
                  >
                    Purchase a Service
                  </button>
                </div>
              ) : (
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                  gap: '20px'
                }}>
                  {licenses.map((license) => (
                    <div
                      key={license.id}
                      style={{
                        background: license.is_active ? 'var(--white)' : 'rgba(255,255,255,0.5)',
                        padding: '25px',
                        borderRadius: '12px',
                        boxShadow: 'var(--box-shadow)',
                        border: license.is_active ? '2px solid var(--success)' : '2px solid var(--medium-gray)',
                        opacity: license.is_active ? 1 : 0.7
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '15px' }}>
                        <div>
                          <h4 style={{ color: 'var(--primary-blue)', marginBottom: '5px' }}>License Credential</h4>
                          <p style={{
                            fontFamily: 'monospace',
                            fontSize: '1.1rem',
                            fontWeight: 'bold',
                            color: 'var(--dark-gray)',
                            letterSpacing: '2px'
                          }}>
                            {license.license_key}
                          </p>
                        </div>
                        <button
                          className="btn btn-secondary"
                          onClick={() => copyToClipboard(license.license_key)}
                          style={{ display: 'flex', alignItems: 'center', gap: '5px', padding: '8px 12px', fontSize: '0.9rem' }}
                        >
                          <Copy size={14} />
                          Copy
                        </button>
                      </div>

                      <div style={{ marginBottom: '10px' }}>
                        <p style={{ color: 'var(--dark-gray)', fontSize: '0.9rem', marginBottom: '3px' }}>
                          Status: {' '}
                          <span style={{
                            color: license.is_active ? 'var(--success)' : 'var(--danger)',
                            fontWeight: 'bold'
                          }}>
                            {license.is_active ? '✅ Active' : '❌ Inactive'}
                          </span>
                        </p>
                        {license.expires_at && (
                          <p style={{ color: 'var(--dark-gray)', fontSize: '0.9rem' }}>
                            Expires: {new Date(license.expires_at).toLocaleDateString()}
                          </p>
                        )}
                      </div>

                      <p style={{ color: 'var(--dark-gray)', fontSize: '0.85rem' }}>
                        Created: {new Date(license.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </section>

            {/* Portal Tokens Section */}
            {portalTokens.length > 0 && (
              <section style={{ marginBottom: '40px' }}>
                <h2 style={{ color: 'var(--primary-blue)', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Building2 size={28} />
                  Your Portal Access Tokens
                </h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '20px' }}>
                  {portalTokens.map((token) => (
                    <div key={token.id} style={{ background: 'var(--white)', padding: '25px', borderRadius: '12px', boxShadow: 'var(--box-shadow)', border: '2px solid var(--success)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '10px' }}>
                        <div>
                          <h4 style={{ color: 'var(--primary-blue)', marginBottom: '5px' }}>{token.business_name}</h4>
                          <p style={{ color: 'var(--dark-gray)', fontSize: '0.9rem', marginBottom: '6px' }}>{token.category}</p>
                        </div>
                        <button className="btn btn-secondary" onClick={() => copyToClipboard(token.token)} style={{ display: 'flex', alignItems: 'center', gap: '5px', padding: '8px 12px', fontSize: '0.9rem' }}>
                          <Copy size={14} />
                          Copy
                        </button>
                      </div>
                      <p style={{ fontFamily: 'monospace', fontSize: '1.05rem', fontWeight: 'bold', color: 'var(--dark-gray)', letterSpacing: '2px', marginBottom: '8px' }}>{token.token}</p>
                      <p style={{ color: 'var(--dark-gray)', fontSize: '0.85rem' }}>
                        Expires: {token.expires_at ? new Date(token.expires_at).toLocaleDateString() : 'No expiry'}
                      </p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Payments Section */}
            <section>
              <h2 style={{ color: 'var(--primary-blue)', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <CreditCard size={28} />
                Payment History
              </h2>

              {payments.length === 0 ? (
                <div style={{
                  background: 'var(--white)',
                  padding: '40px',
                  borderRadius: '12px',
                  textAlign: 'center',
                  boxShadow: 'var(--box-shadow)'
                }}>
                  <p style={{ color: 'var(--dark-gray)' }}>No payment history yet</p>
                </div>
              ) : (
                <div style={{
                  background: 'var(--white)',
                  borderRadius: '12px',
                  boxShadow: 'var(--box-shadow)',
                  overflow: 'hidden'
                }}>
                  <div className="responsive-table-wrap">
                  <table style={{
                    width: '100%',
                    borderCollapse: 'collapse'
                  }}>
                    <thead>
                      <tr style={{ background: 'var(--light-gray)', borderBottom: '2px solid var(--medium-gray)' }}>
                        <th style={{ padding: '15px', textAlign: 'left', fontWeight: 'bold', color: 'var(--primary-blue)' }}>
                          Date
                        </th>
                        <th style={{ padding: '15px', textAlign: 'left', fontWeight: 'bold', color: 'var(--primary-blue)' }}>
                          Service
                        </th>
                        <th style={{ padding: '15px', textAlign: 'left', fontWeight: 'bold', color: 'var(--primary-blue)' }}>
                          Amount
                        </th>
                        <th style={{ padding: '15px', textAlign: 'left', fontWeight: 'bold', color: 'var(--primary-blue)' }}>
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {payments.map((payment) => (
                        <tr key={payment.id} style={{ borderBottom: '1px solid var(--medium-gray)' }}>
                          <td style={{ padding: '15px', color: 'var(--dark-gray)' }}>
                            {new Date(payment.created_at).toLocaleDateString()}
                          </td>
                          <td style={{ padding: '15px', color: 'var(--dark-gray)' }}>
                            {payment.service ? payment.service.name : 'Unknown Service'}
                          </td>
                          <td style={{ padding: '15px', color: 'var(--secondary-red)', fontWeight: 'bold' }}>
                            ${parseFloat(payment.amount).toFixed(2)}
                          </td>
                          <td style={{ padding: '15px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                              <span style={{
                                padding: '5px 12px',
                                borderRadius: '20px',
                                fontSize: '0.85rem',
                                fontWeight: 'bold',
                                background: payment.status === 'completed' ? 'var(--success)' : payment.status === 'pending' ? 'var(--warning)' : 'var(--danger)',
                                color: 'white'
                              }}>
                                {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                              </span>
                              {payment.status === 'completed' && (
                                <button
                                  className="btn btn-secondary"
                                  onClick={() => handleDownloadReceipt(payment.id)}
                                  style={{ display: 'flex', alignItems: 'center', gap: '5px', padding: '6px 10px', fontSize: '0.8rem' }}
                                >
                                  <Download size={14} />
                                  Receipt
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  </div>
                </div>
              )}
            </section>

            {/* CTA Section */}
            {licenses.length > 0 && (
              <div style={{
                marginTop: '40px',
                background: 'linear-gradient(135deg, var(--primary-blue), #1a5a7f)',
                color: 'white',
                padding: '40px',
                borderRadius: '12px',
                textAlign: 'center'
              }}>
                <h3 style={{ color: 'white', marginBottom: '15px' }}>Need More Services?</h3>
                <p style={{ marginBottom: '20px' }}>Explore our full range of professional solutions</p>
                <button
                  className="btn btn-outline"
                  onClick={() => navigate('/services')}
                  style={{ color: 'white', borderColor: 'white' }}
                >
                  Browse Services
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
