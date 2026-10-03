import React from 'react';
import Carousel from './Carousel';

/**
 * Dark page header with the admin-managed background slider behind it
 * (Admin → Media, matching page type). Falls back to a plain dark gradient.
 */
export default function PageHero({ pageType, children, className = '' }) {
  return (
    <section className={`section section--dark section--tight page-hero ${className}`}>
      <div className="page-hero__bg"><Carousel pageType={pageType} quiet /></div>
      <div className="page-hero__scrim" />
      <div className="container page-hero__inner">{children}</div>
    </section>
  );
}
