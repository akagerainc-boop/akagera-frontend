import React, { Suspense, lazy, useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';

import { AuthProvider, useAuth } from './context/AuthContext';
import { SiteProvider } from './components/SiteContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import WhatsAppButton from './components/WhatsAppButton';
import CookieConsent from './components/CookieConsent';
import { PageLoader } from './components/Loader';
import './index.css';

const Home = lazy(() => import('./pages/Home'));
const Products = lazy(() => import('./pages/Products'));
const ProductDetail = lazy(() => import('./pages/ProductDetail'));
const Downloads = lazy(() => import('./pages/Downloads'));
const MobileApps = lazy(() => import('./pages/MobileApps'));
const MobileAppDetail = lazy(() => import('./pages/MobileAppDetail'));
const Services = lazy(() => import('./pages/Services'));
const ServiceDetail = lazy(() => import('./pages/ServiceDetail'));
const Pricing = lazy(() => import('./pages/Pricing'));
const Checkout = lazy(() => import('./pages/Checkout'));
const PaymentSuccess = lazy(() => import('./pages/PaymentSuccess'));
const Solutions = lazy(() => import('./pages/Solutions'));
const About = lazy(() => import('./pages/About'));
const Portfolio = lazy(() => import('./pages/Portfolio'));
const CaseStudyDetail = lazy(() => import('./pages/CaseStudyDetail'));
const Blog = lazy(() => import('./pages/Blog'));
const BlogPost = lazy(() => import('./pages/BlogPost'));
const Careers = lazy(() => import('./pages/Careers'));
const CareerDetail = lazy(() => import('./pages/CareerDetail'));
const Internships = lazy(() => import('./pages/Internships'));
const InternshipDetail = lazy(() => import('./pages/InternshipDetail'));
const Documentation = lazy(() => import('./pages/Documentation'));
const Support = lazy(() => import('./pages/Support'));
const Contact = lazy(() => import('./pages/Contact'));
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const ForgotPassword = lazy(() => import('./pages/ForgotPassword'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const BusinessPortal = lazy(() => import('./pages/BusinessPortal'));
const Admin = lazy(() => import('./pages/Admin'));
const Legal = lazy(() => import('./pages/Legal'));
const NotFound = lazy(() => import('./pages/NotFound'));

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
}

// /privacy-policy is a static page (public/privacy-policy.html) that hosts serve
// directly, so it works for Google Play's reviewers without JavaScript. This only
// runs when the SPA itself routes there (client-side nav, or the dev server).
function StaticPage({ href }) {
  // If a host redirects href straight back here (e.g. "clean URLs" turning
  // .html into /privacy-policy), stop after one hop instead of looping.
  const key = `static-hop:${href}`;
  const [looped] = React.useState(() => {
    try { return Date.now() - Number(sessionStorage.getItem(key) || 0) < 5000; } catch { return false; }
  });
  useEffect(() => {
    if (looped) return;
    try { sessionStorage.setItem(key, String(Date.now())); } catch { /* storage blocked: redirect anyway */ }
    window.location.replace(href);
  }, [href, key, looped]);
  return looped ? <div className="container" style={{ padding: '48px 0' }}><a href={href}>Open the BPay Privacy Policy</a></div> : <PageLoader />;
}

function RequireAuth({ children }) {
  const { user, ready } = useAuth();
  const location = useLocation();
  if (!ready) return <PageLoader />;
  if (!user) return <Navigate to="/login" state={{ from: location.pathname + location.search }} replace />;
  return children;
}

function Shell() {
  return (
    <div className="App">
      <ScrollToTop />
      <Navbar />
      <main>
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/products" element={<Products />} />
            <Route path="/products/:slug" element={<ProductDetail />} />
            <Route path="/downloads" element={<Downloads />} />
            <Route path="/downloads/:slug" element={<Downloads />} />
            <Route path="/mobile-apps" element={<MobileApps />} />
            <Route path="/mobile-apps/:slug" element={<MobileAppDetail />} />
            <Route path="/services" element={<Services />} />
            <Route path="/services/:slug" element={<ServiceDetail />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/checkout/:orderRef" element={<RequireAuth><Checkout /></RequireAuth>} />
            <Route path="/payment-success" element={<PaymentSuccess />} />
            <Route path="/solutions" element={<Solutions />} />
            <Route path="/solutions/:slug" element={<Solutions />} />
            <Route path="/industries/:slug" element={<Solutions />} />
            <Route path="/about" element={<About />} />
            <Route path="/portfolio" element={<Portfolio />} />
            <Route path="/case-studies" element={<Portfolio />} />
            <Route path="/case-studies/:slug" element={<CaseStudyDetail />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/:slug" element={<BlogPost />} />
            <Route path="/careers" element={<Careers />} />
            <Route path="/careers/:slug" element={<CareerDetail />} />
            <Route path="/internships" element={<Internships />} />
            <Route path="/internships/:slug" element={<InternshipDetail />} />
            <Route path="/documentation" element={<Documentation />} />
            <Route path="/documentation/:slug" element={<Documentation />} />
            <Route path="/support" element={<Support />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/dashboard/*" element={<RequireAuth><Dashboard /></RequireAuth>} />
            <Route path="/business" element={<BusinessPortal />} />
            <Route path="/admin/*" element={<Admin />} />
            <Route path="/privacy" element={<Legal doc="legal_privacy" />} />
            <Route path="/privacy-policy" element={<StaticPage href="/privacy-policy.html" />} />
            <Route path="/terms" element={<Legal doc="legal_terms" />} />
            <Route path="/refund-policy" element={<Legal doc="legal_refund" />} />
            <Route path="/cookie-policy" element={<Legal doc="legal_cookie" />} />
            {/* legacy redirects */}
            <Route path="/apps" element={<Navigate to="/products" replace />} />
            <Route path="/apps/:slug" element={<Navigate to="/products" replace />} />
            <Route path="/admin-panel-xyz123" element={<Navigate to="/admin" replace />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </main>
      <Footer />
      <WhatsAppButton />
      <CookieConsent />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <SiteProvider>
        <Shell />
      </SiteProvider>
    </AuthProvider>
  );
}
