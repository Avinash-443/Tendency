import { useState } from 'react';

// Converts an object { key: value } to an editable list of rows
// and syncs back to the parent as an object on every change.
export default function KVEditor({ value = {}, onChange, keyPlaceholder = 'key', valPlaceholder = 'value' }) {
  const [rows, setRows] = useState(
    Object.entries(value).map(([k, v]) => ({ k, v, id: Math.random() }))
  );

  const syncToParent = (newRows) => {
    setRows(newRows);
    const obj = {};
    newRows.forEach(({ k, v }) => {
      if (k.trim()) obj[k.trim()] = v;
    });
    onChange(obj);
  };

  const updateRow = (id, field, val) => {
    syncToParent(rows.map((r) => (r.id === id ? { ...r, [field]: val } : r)));
  };

  const addRow = () => {
    syncToParent([...rows, { k: '', v: '', id: Math.random() }]);
  };

  const removeRow = (id) => {
    syncToParent(rows.filter((r) => r.id !== id));
  };

  return (
    <div className="kv-editor">
      {rows.map((row) => (
        <div key={row.id} className="kv-row">
          <input
            className="form-input kv-input"
            placeholder={keyPlaceholder}
            value={row.k}
            onChange={(e) => updateRow(row.id, 'k', e.target.value)}
          />
          <input
            className="form-input kv-input"
            placeholder={valPlaceholder}
            value={row.v}
            onChange={(e) => updateRow(row.id, 'v', e.target.value)}
          />
          <button className="kv-remove" onClick={() => removeRow(row.id)}>✕</button>
        </div>
      ))}
      <button className="kv-add" onClick={addRow}>+ Add pair</button>
    </div>
  );
}
