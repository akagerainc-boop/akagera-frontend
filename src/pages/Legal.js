import React from 'react';
import Seo from '../components/Seo';
import { Breadcrumbs } from '../components/ui';
import { useSite } from '../components/SiteContext';

export default function Legal({ doc }) {
  const { settings } = useSite();
  const d = settings?.[doc] || {};
  return (
    <>
      <Seo title={d.title || 'Legal'} />
      <section className="section"><div className="container" style={{ maxWidth: 760 }}>
        <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: d.title || 'Legal' }]} />
        <h1>{d.title || 'Legal'}</h1>
        {d.updated && <p className="muted mt-1">Last updated: {d.updated}</p>}
        <div className="mt-3" style={{ lineHeight: 1.9, whiteSpace: 'pre-line' }}>
          {d.body || 'This document is being finalised. Contact legal@akagerainc.store for questions.'}
        </div>
      </div></section>
    </>
  );
}
