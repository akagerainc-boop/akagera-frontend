import React, { useRef } from 'react';

/** 6-box one-time-code input. `value` is a string, `onChange(next)` gets the joined string. */
export default function OtpInput({ value = '', onChange, length = 6, disabled }) {
  const refs = useRef([]);
  const chars = value.split('').concat(Array(length).fill('')).slice(0, length);

  const setAt = (i, ch) => {
    const next = chars.slice();
    next[i] = ch;
    onChange(next.join('').slice(0, length));
  };

  const onKey = (i, e) => {
    if (e.key === 'Backspace' && !chars[i] && i > 0) refs.current[i - 1]?.focus();
  };

  const onPaste = (e) => {
    const digits = (e.clipboardData.getData('text') || '').replace(/\D/g, '').slice(0, length);
    if (digits) {
      e.preventDefault();
      onChange(digits);
      refs.current[Math.min(digits.length, length - 1)]?.focus();
    }
  };

  return (
    <div className="row" style={{ gap: 8, justifyContent: 'center', flexWrap: 'nowrap' }} onPaste={onPaste}>
      {chars.map((c, i) => (
        <input
          key={i}
          ref={(el) => (refs.current[i] = el)}
          value={c}
          disabled={disabled}
          inputMode="numeric"
          maxLength={1}
          aria-label={`Digit ${i + 1}`}
          onChange={(e) => {
            const d = e.target.value.replace(/\D/g, '').slice(-1);
            setAt(i, d);
            if (d && i < length - 1) refs.current[i + 1]?.focus();
          }}
          onKeyDown={(e) => onKey(i, e)}
          style={{
            width: 44, height: 52, textAlign: 'center', fontSize: '1.4rem', fontWeight: 700,
            border: '1px solid var(--n-300)', borderRadius: 'var(--r-sm)', color: 'var(--ink)',
          }}
        />
      ))}
    </div>
  );
}
