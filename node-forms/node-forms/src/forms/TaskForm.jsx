import Field from '../components/Field';
import KVEditor from '../components/KVEditor';

export default function TaskForm({ data, onChange }) {
  return (
    <div>
      <Field label="Title" required>
        <input
          className="form-input"
          value={data.title || ''}
          placeholder="e.g. Collect Documents"
          onChange={(e) => onChange({ ...data, title: e.target.value })}
        />
      </Field>

      <Field label="Description">
        <textarea
          className="form-input form-textarea"
          value={data.description || ''}
          placeholder="What needs to be done"
          onChange={(e) => onChange({ ...data, description: e.target.value })}
        />
      </Field>

      <Field label="Assignee">
        <input
          className="form-input"
          value={data.assignee || ''}
          placeholder="e.g. HR Admin"
          onChange={(e) => onChange({ ...data, assignee: e.target.value })}
        />
      </Field>

      <Field label="Due Date">
        <input
          className="form-input"
          type="date"
          value={data.dueDate || ''}
          onChange={(e) => onChange({ ...data, dueDate: e.target.value })}
        />
      </Field>

      <div className="section-divider" />
      <p className="section-label">Optional Custom Fields</p>
      <KVEditor
        value={data.customFields || {}}
        onChange={(cf) => onChange({ ...data, customFields: cf })}
        keyPlaceholder="field name"
        valPlaceholder="value"
      />
    </div>
  );
}
