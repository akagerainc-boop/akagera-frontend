import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Smartphone, Globe, Monitor, Command, Cloud, Server, PackageOpen, X,
} from 'lucide-react';

export function StatusBadge({ status }) {
  const label = String(status || '').replace(/_/g, ' ');
  return <span className={`status-badge status-badge--${status}`}>{label || 'unknown'}</span>;
}

export function Badge({ children, variant }) {
  return <span className={`badge${variant ? ` badge--${variant}` : ''}`}>{children}</span>;
}

export function Pill({ children }) {
  return <span className="pill">{children}</span>;
}

const PLATFORM_META = {
  android: { label: 'Android', icon: Smartphone },
  ios: { label: 'iOS', icon: Smartphone },
  windows: { label: 'Windows', icon: Monitor },
  macos: { label: 'macOS', icon: Command },
  linux: { label: 'Linux', icon: Server },
  web: { label: 'Web', icon: Globe },
  cloud: { label: 'Cloud', icon: Cloud },
};

export function PlatformBadge({ platform }) {
  const meta = PLATFORM_META[platform] || { label: platform, icon: PackageOpen };
  const Icon = meta.icon;
  return <span className="pill"><Icon size={13} /> {meta.label}</span>;
}

export function SectionHead({ eyebrow, title, children, center }) {
  return (
    <div className={`section-head${center ? ' section-head--center' : ''}`}>
      {eyebrow && <span className="eyebrow">{eyebrow}</span>}
      <h2>{title}</h2>
      {children && <p className="lead mt-1">{children}</p>}
    </div>
  );
}

export function Breadcrumbs({ items = [] }) {
  return (
    <nav className="breadcrumbs" aria-label="Breadcrumb">
      {items.map((it, i) => (
        <span key={i}>
          {it.to ? <Link to={it.to}>{it.label}</Link> : <span>{it.label}</span>}
          {i < items.length - 1 && <span> / </span>}
        </span>
      ))}
    </nav>
  );
}

export function EmptyState({ icon, title, children, action }) {
  return (
    <div className="empty">
      {icon && <div className="empty__icon">{icon}</div>}
      <h3>{title}</h3>
      {children && <p className="lead mt-1">{children}</p>}
      {action && <div className="row mt-3" style={{ justifyContent: 'center' }}>{action}</div>}
    </div>
  );
}

export function Modal({ open, onClose, title, children }) {
  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => e.key === 'Escape' && onClose?.();
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onClose]);
  if (!open) return null;
  return (
    <div className="modal-scrim" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
        <div className="between mb-2">
          <h3>{title}</h3>
          <button className="btn btn--ghost btn--sm" onClick={onClose} aria-label="Close"><X size={18} /></button>
        </div>
        {children}
      </div>
    </div>
  );
}

export function priceLabel(price, currency = 'USD') {
  if (price === null || price === undefined) return 'Contact us';
  const n = Number(price);
  if (!n) return 'Free';
  return `${currency === 'USD' ? '$' : currency + ' '}${n.toLocaleString(undefined, { minimumFractionDigits: n % 1 ? 2 : 0, maximumFractionDigits: 2 })}`;
}
