import React from 'react';
import { Link } from 'react-router-dom';
import { Download, ChevronRight } from 'lucide-react';
import SmartImage from './SmartImage';
import { mobileAppAPI } from '../api';

export function AppIcon({ app, size = 64 }) {
  return (
    <SmartImage src={app.icon} alt={app.name} className="app-icon"
      style={{ width: size, height: size, borderRadius: size * 0.22, flexShrink: 0 }} />
  );
}

export function appMeta(app) {
  return [app.category, app.version && `v${app.version}`, app.apk_size_label].filter(Boolean).join(' · ');
}

export function MobileAppCard({ app }) {
  const to = `/mobile-apps/${app.slug}`;
  return (
    <article className="app-card">
      <Link to={to} className="app-card__head">
        <AppIcon app={app} size={60} />
        <div style={{ minWidth: 0, flex: 1 }}>
          <h3 className="app-card__name">{app.name}</h3>
          <div className="app-card__meta">{appMeta(app)}</div>
        </div>
        <ChevronRight size={18} className="app-card__chev" />
      </Link>
      {app.tagline && <p className="app-card__tagline">{app.tagline}</p>}
      {app.screenshots?.length > 0 && (
        <Link to={to} className="app-card__shots" aria-label={`${app.name} screenshots`}>
          {app.screenshots.slice(0, 3).map((s, i) => <SmartImage key={i} src={s} alt="" ratio="9 / 16" />)}
        </Link>
      )}
      <div className="app-card__actions">
        <a href={mobileAppAPI.downloadUrl(app.slug)} className="btn btn--primary" rel="nofollow">
          <Download size={17} /> Download APK
        </a>
        <Link to={to} className="btn btn--soft">Details</Link>
      </div>
    </article>
  );
}
