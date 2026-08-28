import React, { useState } from 'react';
import { Plus, Minus } from 'lucide-react';

export default function FAQAccordion({ items = [] }) {
  const [open, setOpen] = useState(null);
  if (!items.length) return null;
  return (
    <div>
      {items.map((it, i) => {
        const q = it.question || it.q;
        const a = it.answer || it.a;
        const isOpen = open === i;
        return (
          <div className="accordion__item" key={i}>
            <button className="accordion__q" aria-expanded={isOpen} onClick={() => setOpen(isOpen ? null : i)}>
              <span>{q}</span>
              {isOpen ? <Minus size={18} style={{ flexShrink: 0, color: 'var(--brand)' }} /> : <Plus size={18} style={{ flexShrink: 0, color: 'var(--brand)' }} />}
            </button>
            {isOpen && <div className="accordion__a">{a}</div>}
          </div>
        );
      })}
    </div>
  );
}
