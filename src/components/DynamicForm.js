import React from 'react';

/**
 * Renders admin-defined `service_fields` into a controlled form.
 * `value` is a { field_key: value } map; `onChange(next)` receives the updated map.
 */
export default function DynamicForm({ fields = [], value = {}, onChange }) {
  const set = (key, v) => onChange({ ...value, [key]: v });

  if (!fields.length) {
    return <p className="muted">No additional information required for this service.</p>;
  }

  return (
    <div>
      {fields.map((f) => {
        const common = {
          id: f.field_key,
          value: value[f.field_key] || '',
          onChange: (e) => set(f.field_key, e.target.value),
          required: f.required,
        };
        return (
          <div className="field" key={f.id || f.field_key}>
            <label htmlFor={f.field_key}>
              {f.label}{f.required && <span style={{ color: 'var(--brand)' }}> *</span>}
            </label>
            {f.field_type === 'textarea' && <textarea {...common} rows={4} />}
            {f.field_type === 'select' && (
              <select {...common}>
                <option value="">Select…</option>
                {(f.options || []).map((o) => <option key={o} value={o}>{o}</option>)}
              </select>
            )}
            {f.field_type === 'checkbox' && (
              <label className="row" style={{ gap: 8 }}>
                <input type="checkbox" checked={!!value[f.field_key]} onChange={(e) => set(f.field_key, e.target.checked)} />
                <span className="muted" style={{ fontSize: '.9rem' }}>{f.help_text || 'Yes'}</span>
              </label>
            )}
            {['text', 'email', 'tel', 'number', 'date'].includes(f.field_type) && (
              <input type={f.field_type} {...common} />
            )}
            {!['textarea', 'select', 'checkbox', 'text', 'email', 'tel', 'number', 'date'].includes(f.field_type) && (
              <input type="text" {...common} />
            )}
            {f.help_text && f.field_type !== 'checkbox' && <span className="hint">{f.help_text}</span>}
          </div>
        );
      })}
    </div>
  );
}
