import React from 'react';
import { Link } from 'react-router-dom';
import { Linkedin, Github, Twitter, Facebook, Instagram, Youtube, MessageCircle } from 'lucide-react';
import { useSite } from './SiteContext';

const SOCIAL_ICONS = {
  linkedin: Linkedin, github: Github, x: Twitter, twitter: Twitter,
  facebook: Facebook, instagram: Instagram, youtube: Youtube,
};

export default function Footer() {
  const { nav, settings } = useSite();
  const cols = nav.footer || [];
  const social = settings?.social_links || {};
  const contact = settings?.contact_info || {};
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer__cols">
          <div className="footer__brandcol">
            <div className="nav__brand" style={{ color: '#fff' }}><span style={{ fontSize: '1.2rem' }}>Akagera<b style={{ color: 'var(--brand)' }}>Inc</b></span></div>
            <p className="mt-2" style={{ maxWidth: 320, color: 'rgba(255,255,255,.66)', fontSize: '.9rem' }}>
              {settings?.brand?.tagline || 'Technology solutions built for what comes next.'} We build software across
              mobile, web, desktop, and cloud.
            </p>
            <div className="footer__social mt-3">
              {Object.entries(social).map(([key, url]) => {
                const Icon = SOCIAL_ICONS[key];
                if (!Icon || !url) return null;
                return <a key={key} href={url} target="_blank" rel="noopener noreferrer" aria-label={key}><Icon size={18} /></a>;
              })}
            </div>
          </div>

          {cols.map((col) => (
            <div key={col.column_group}>
              <h4>{col.column_group}</h4>
              <div className="footer__links">
                {(col.children || []).map((c) => (
                  /^https?:/.test(c.url)
                    ? <a key={c.label} href={c.url} target="_blank" rel="noopener noreferrer">{c.label}</a>
                    : <Link key={c.label} to={c.url}>{c.label}</Link>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="footer__bottom">
          <span>© {year} Akagera Inc. All rights reserved.</span>
          <span className="row" style={{ gap: 16 }}>
            {contact.email && <a href={`mailto:${contact.email}`}>{contact.email}</a>}
            {contact.whatsapp && (
              <a href={`https://wa.me/${String(contact.whatsapp).replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer">
                <MessageCircle size={14} style={{ display: 'inline', marginRight: 4 }} />WhatsApp
              </a>
            )}
          </span>
        </div>
      </div>
    </footer>
  );
}
