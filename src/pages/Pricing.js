import React, { useEffect, useState } from 'react';
import Seo from '../components/Seo';
import { PageLoader } from '../components/Loader';
import { PricingCard, ServiceCard } from '../components/cards';
import { SectionHead } from '../components/ui';
import FAQAccordion from '../components/FAQAccordion';
import { serviceAPI, contentAPI } from '../api';

export default function Pricing() {
  const [data, setData] = useState(null);
  const [faqs, setFaqs] = useState([]);

  useEffect(() => {
    Promise.allSettled([serviceAPI.pricing(), contentAPI.faqs('billing')]).then(([p, f]) => {
      setData(p.value?.data || { plans: [], featured_services: [] });
      setFaqs(f.value?.data || []);
    });
  }, []);

  if (!data) return <PageLoader />;

  return (
    <>
      <Seo title="Pricing" description="Transparent pricing for Akagera Inc services, licenses, and subscriptions." />
      <section className="section section--soft section--tight">
        <div className="container">
          <SectionHead eyebrow="Pricing" title="Choose the solution that fits your needs" center>
            Simple packages for common needs — or buy a specific service with its own price and duration.
          </SectionHead>
        </div>
      </section>

      {data.plans?.length > 0 && (
        <section className="section">
          <div className="container">
            <div className="grid grid-3">{data.plans.map((p, i) => <PricingCard key={i} plan={p} />)}</div>
          </div>
        </section>
      )}

      {data.featured_services?.length > 0 && (
        <section className="section section--soft">
          <div className="container">
            <SectionHead eyebrow="Services" title="Featured services" />
            <div className="grid grid-3">{data.featured_services.map((s) => <ServiceCard key={s.id} service={s} />)}</div>
          </div>
        </section>
      )}

      {faqs.length > 0 && (
        <section className="section">
          <div className="container" style={{ maxWidth: 760 }}>
            <SectionHead eyebrow="Questions" title="Billing FAQ" />
            <FAQAccordion items={faqs} />
          </div>
        </section>
      )}
    </>
  );
}
