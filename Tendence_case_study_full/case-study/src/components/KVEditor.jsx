// src/components/KVEditor.jsx
// Reusable key-value pair editor used by Start (metadata) and Task (custom fields).

import { useState } from 'react';

export function KVEditor({ value = {}, onChange, keyPlaceholder = 'key' }) {
  const [rows, setRows] = useState(
    Object.entries(value).map(([k, v]) => ({ k, v, id: Math.random() }))
  );

  const sync = (next) => {
    setRows(next);
    const obj = {};
    next.forEach(({ k, v }) => { if (k.trim()) obj[k.trim()] = v; });
    onChange(obj);
  };

  const update = (id, field, val) => sync(rows.map((r) => r.id === id ? { ...r, [field]: val } : r));
  const add    = () => sync([...rows, { k: '', v: '', id: Math.random() }]);
  const remove = (id) => sync(rows.filter((r) => r.id !== id));

  const inp = {
    flex: 1, padding: '5px 7px', border: '1px solid #d1d5db', borderRadius: 5,
    fontSize: 11, fontFamily: 'inherit', outline: 'none', background: '#fff',
  };

  return (
    <div>
      {rows.map((row) => (
        <div key={row.id} style={{ display: 'flex', gap: 5, alignItems: 'center', marginBottom: 5 }}>
          <input style={inp} placeholder={keyPlaceholder} value={row.k} onChange={(e) => update(row.id, 'k', e.target.value)} />
          <input style={inp} placeholder="value"         value={row.v} onChange={(e) => update(row.id, 'v', e.target.value)} />
          <button onClick={() => remove(row.id)} style={{ background: 'none', border: 'none', color: '#9ca3af', cursor: 'pointer', fontSize: 13 }}>✕</button>
        </div>
      ))}
      <button onClick={add} style={{
        background: 'none', border: '1px dashed #c7d2fe', borderRadius: 5,
        padding: '4px 8px', fontSize: 11, color: '#6366f1', cursor: 'pointer', width: '100%', fontFamily: 'inherit',
      }}>+ Add pair</button>
    </div>
  );
}
