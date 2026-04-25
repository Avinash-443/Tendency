import Field from '../components/Field';

export default function ApprovalForm({ data, onChange }) {
  return (
    <div>
      <Field label="Title">
        <input
          className="form-input"
          value={data.title || ''}
          placeholder="e.g. Manager Approval"
          onChange={(e) => onChange({ ...data, title: e.target.value })}
        />
      </Field>

      <Field label="Approver Role">
        <select
          className="form-input"
          value={data.approverRole || ''}
          onChange={(e) => onChange({ ...data, approverRole: e.target.value })}
        >
          <option value="">Select a role</option>
          <option value="Manager">Manager</option>
          <option value="HRBP">HRBP</option>
          <option value="Director">Director</option>
        </select>
      </Field>

      <Field label="Auto-approve Threshold (days)">
        <input
          className="form-input"
          type="number"
          min={0}
          value={data.autoApproveThreshold ?? ''}
          placeholder="e.g. 3"
          onChange={(e) =>
            onChange({ ...data, autoApproveThreshold: Number(e.target.value) })
          }
        />
      </Field>
    </div>
  );
}
