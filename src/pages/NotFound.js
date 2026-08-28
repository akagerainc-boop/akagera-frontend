import React from 'react';
import { Link } from 'react-router-dom';
import { Compass } from 'lucide-react';
import Seo from '../components/Seo';

export default function NotFound() {
  return (
    <>
      <Seo title="Page not found" />
      <section className="section"><div className="container text-center" style={{ maxWidth: 520 }}>
        <div className="empty__icon" style={{ width: 64, height: 64 }}><Compass size={28} /></div>
        <h1 className="mt-2">We couldn't find that page.</h1>
        <p className="lead mt-1">The link may be broken or the page may have moved.</p>
        <div className="row mt-4" style={{ justifyContent: 'center' }}>
          <Link to="/" className="btn btn--primary">Go home</Link>
          <Link to="/products" className="btn btn--secondary">Explore products</Link>
        </div>
      </div></section>
    </>
  );
}
