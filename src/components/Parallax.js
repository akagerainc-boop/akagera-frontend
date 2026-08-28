import React, { useEffect, useRef, useState } from 'react';

const reduce = typeof window !== 'undefined'
  && window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/** Subtle scroll parallax. `speed` 0.1–0.4 recommended. */
export default function Parallax({ children, speed = 0.2, className = '', style }) {
  const ref = useRef(null);
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    if (reduce) return undefined;
    let raf = 0;
    const onScroll = () => {
      raf = requestAnimationFrame(() => {
        const el = ref.current;
        if (!el) return;
        const rect = el.getBoundingClientRect();
        const viewCenter = window.innerHeight / 2;
        const dist = (rect.top + rect.height / 2) - viewCenter;
        setOffset(-dist * speed);
      });
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [speed]);

  return (
    <div ref={ref} className={`parallax ${className}`} style={{ transform: `translate3d(0, ${offset}px, 0)`, ...style }}>
      {children}
    </div>
  );
}
