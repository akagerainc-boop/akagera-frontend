import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X } from 'lucide-react';
import { contentAPI } from '../api';
import { IosSpinner } from './Loader';

const GROUPS = [
  ['products', 'Products'], ['services', 'Services'], ['blog', 'Blog'],
  ['documentation', 'Documentation'], ['case_studies', 'Case studies'], ['faqs', 'FAQs'],
];

export default function SearchBar({ onClose }) {
  const [q, setQ] = useState('');
  const [res, setRes] = useState(null);
  const [loading, setLoading] = useState(false);
  const nav = useNavigate();
  const inputRef = useRef(null);

  useEffect(() => { inputRef.current?.focus(); }, []);

  useEffect(() => {
    if (q.trim().length < 2) { setRes(null); return undefined; }
    setLoading(true);
    const t = setTimeout(() => {
      contentAPI.search(q.trim())
        .then((r) => setRes(r.data))
        .catch(() => setRes(null))
        .finally(() => setLoading(false));
    }, 250);
    return () => clearTimeout(t);
  }, [q]);

  const go = (url) => { onClose?.(); nav(url); };

  return (
    <div className="modal-scrim" onClick={onClose}>
      <div className="modal" style={{ maxWidth: 640, alignSelf: 'flex-start', marginTop: '8vh' }} onClick={(e) => e.stopPropagation()}>
        <div className="row" style={{ gap: 10, flexWrap: 'nowrap' }}>
          <Search size={20} style={{ color: 'var(--n-500)', flexShrink: 0 }} />
          <input
            ref={inputRef}
            className="input"
            placeholder="Search products, services, docs…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            style={{ border: 'none', boxShadow: 'none', fontSize: '1.05rem' }}
          />
          <button className="btn btn--ghost btn--sm" onClick={onClose} aria-label="Close"><X size={18} /></button>
        </div>
        <div className="divider" style={{ margin: '14px 0' }} />
        {loading && <div className="row" style={{ justifyContent: 'center', padding: 20 }}><IosSpinner /></div>}
        {!loading && res && (
          <div className="stack" style={{ gap: 18, maxHeight: '52vh', overflowY: 'auto' }}>
            {GROUPS.map(([key, label]) => (
              (res[key]?.length > 0) && (
                <div key={key}>
                  <div className="eyebrow" style={{ marginBottom: 6 }}>{label}</div>
                  {res[key].map((item, i) => (
                    <button key={i} className="drawer__group" style={{ display: 'block', width: '100%', textAlign: 'left' }} onClick={() => go(item.url)}>
                      <div style={{ padding: '8px 10px', borderRadius: 6 }}>
                        <strong style={{ fontSize: '.95rem' }}>{item.title}</strong>
                        {item.excerpt && <div className="muted" style={{ fontSize: '.82rem' }}>{item.excerpt}</div>}
                      </div>
                    </button>
                  ))}
                </div>
              )
            ))}
            {GROUPS.every(([k]) => !res[k]?.length) && <p className="muted text-center">No results for “{q}”.</p>}
          </div>
        )}
      </div>
    </div>
  );
}
