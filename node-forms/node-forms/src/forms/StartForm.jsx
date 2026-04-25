import { useState } from 'react';
import Field from '../components/Field';
import KVEditor from '../components/KVEditor';

export default function StartForm({ data, onChange }) {
  return (
    <div>
      <Field label="Start Title" required>
        <input
          className="form-input"
          value={data.title || ''}
          placeholder="e.g. Employee Onboarding"
          onChange={(e) => onChange({ ...data, title: e.target.value })}
        />
      </Field>

      <div className="section-divider" />
      <p className="section-label">Optional Metadata</p>
      <KVEditor
        value={data.metadata || {}}
        onChange={(meta) => onChange({ ...data, metadata: meta })}
        keyPlaceholder="key"
        valPlaceholder="value"
      />
    </div>
  );
}
