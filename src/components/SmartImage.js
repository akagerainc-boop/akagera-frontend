import React, { useState } from 'react';
import { mediaUrl } from '../api';

/**
 * Lazy, low-CLS image with a blur-up placeholder.
 * `src` may be a stored path or absolute URL.
 */
export default function SmartImage({ src, alt = '', ratio, className = '', eager = false, style }) {
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);
  const url = mediaUrl(src);

  const wrapStyle = { ...(ratio ? { aspectRatio: ratio } : {}), ...style };

  if (!url || failed) {
    return (
      <div className={`smart-img ${className}`} style={wrapStyle} aria-label={alt} role="img">
        <div style={{
          width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: 'var(--brand-050)', color: 'var(--brand)', fontWeight: 800, fontSize: '1.4rem',
        }}>
          {(alt || 'A').trim().charAt(0).toUpperCase()}
        </div>
      </div>
    );
  }

  return (
    <div className={`smart-img ${className}`} style={wrapStyle}>
      <img
        src={url}
        alt={alt}
        loading={eager ? 'eager' : 'lazy'}
        decoding="async"
        onLoad={() => setLoaded(true)}
        onError={() => setFailed(true)}
        className={loaded ? '' : 'loading'}
        style={{ width: '100%', height: '100%', objectFit: 'cover', filter: loaded ? 'none' : 'blur(12px)' }}
      />
    </div>
  );
}
