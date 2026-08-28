import React from 'react';

/** iPhone-style activity indicator (12 tapered bars). */
export function IosSpinner({ size = 'md', color }) {
  return (
    <span className={`ios-spinner ${size}`} style={color ? { color } : undefined} role="status" aria-label="Loading">
      {Array.from({ length: 12 }).map((_, i) => <i key={i} />)}
    </span>
  );
}

export function PageLoader({ label = 'Loading…' }) {
  return (
    <div className="page-loader">
      <IosSpinner size="lg" />
      {label && <span>{label}</span>}
    </div>
  );
}

export function OverlayLoader() {
  return (
    <div className="overlay-loader">
      <IosSpinner size="lg" />
    </div>
  );
}

export function InlineLoader({ label }) {
  return (
    <span className="inline-loader">
      <IosSpinner size="sm" />
      {label}
    </span>
  );
}

export default PageLoader;
