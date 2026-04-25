import Field from '../components/Field';

export default function EndForm({ data, onChange }) {
  return (
    <div>
      <Field label="End Message">
        <input
          className="form-input"
          value={data.endMessage || ''}
          placeholder="e.g. Onboarding complete"
          onChange={(e) => onChange({ ...data, endMessage: e.target.value })}
        />
      </Field>

      <Field label="Summary Flag">
        <label className="checkbox-label">
          <input
            type="checkbox"
            checked={!!data.summaryFlag}
            onChange={(e) => onChange({ ...data, summaryFlag: e.target.checked })}
          />
          Generate summary report
        </label>
      </Field>
    </div>
  );
}
