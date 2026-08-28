import React, { useEffect, useRef, useState } from 'react';
import { contentAPI, mediaUrl } from '../api';
import { IosSpinner } from './Loader';

const STYLES = `
.akg-carousel { position: absolute; inset: 0; overflow: hidden; }
.akg-carousel__slide { position: absolute; inset: 0; opacity: 0; transition: opacity 1.1s ease; }
.akg-carousel__slide.active { opacity: 1; }
.akg-carousel__slide img { width: 100%; height: 100%; object-fit: cover; transform: scale(1.06); transition: transform 7s ease; }
.akg-carousel__slide.active img { transform: scale(1); }
.akg-carousel__dots { position: absolute; bottom: 20px; left: 50%; transform: translateX(-50%); display: flex; gap: 8px; z-index: 3; }
.akg-carousel__dots button { width: 8px; height: 8px; border-radius: 999px; background: rgba(255,255,255,.4); transition: all .3s; }
.akg-carousel__dots button.active { width: 22px; background: #fff; }
`;

/**
 * Full-bleed background carousel driven by admin-managed images (by page_type).
 * Falls back to a solid brand backdrop when there are no images.
 */
export default function Carousel({ pageType = 'home', interval = 6000, images: propImages }) {
  const [images, setImages] = useState(propImages || []);
  const [idx, setIdx] = useState(0);
  const [loading, setLoading] = useState(!propImages);
  const timer = useRef(null);

  useEffect(() => {
    if (propImages) { setImages(propImages); setLoading(false); return; }
    let alive = true;
    contentAPI.images(pageType)
      .then((r) => { if (alive) setImages(r.data || []); })
      .catch(() => {})
      .finally(() => alive && setLoading(false));
    return () => { alive = false; };
  }, [pageType, propImages]);

  useEffect(() => {
    if (images.length <= 1) return undefined;
    timer.current = setInterval(() => setIdx((i) => (i + 1) % images.length), interval);
    return () => clearInterval(timer.current);
  }, [images.length, interval]);

  if (loading) {
    return (
      <div className="akg-carousel" style={{ background: 'var(--ink)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
        <IosSpinner size="lg" color="#fff" />
      </div>
    );
  }

  if (!images.length) {
    return <div className="akg-carousel" style={{ background: 'linear-gradient(120deg, #171717, #2a2a2a 60%, #6b241a)' }} />;
  }

  return (
    <div className="akg-carousel">
      <style>{STYLES}</style>
      {images.map((img, i) => (
        <div key={img.id || i} className={`akg-carousel__slide ${i === idx ? 'active' : ''}`}>
          <img src={mediaUrl(img.url)} alt={img.alt || ''} loading={i === 0 ? 'eager' : 'lazy'} decoding="async" />
        </div>
      ))}
      {images.length > 1 && (
        <div className="akg-carousel__dots">
          {images.map((_, i) => (
            <button key={i} className={i === idx ? 'active' : ''} onClick={() => setIdx(i)} aria-label={`Slide ${i + 1}`} />
          ))}
        </div>
      )}
    </div>
  );
}
