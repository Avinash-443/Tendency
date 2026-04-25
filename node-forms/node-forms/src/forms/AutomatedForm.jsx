import { useState, useEffect } from 'react';
import Field from '../components/Field';
import { getAutomations } from '../api/mockApi';

export default function AutomatedForm({ data, onChange }) {
  const [automations, setAutomations] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch action list from mock GET /automations on mount
  useEffect(() => {
    getAutomations().then((list) => {
      setAutomations(list);
      setLoading(false);
    });
  }, []);

  const selectedAction = automations.find((a) => a.id === data.actionId);

  const handleActionChange = (e) => {
    // Reset params when action changes
    onChange({ ...data, actionId: e.target.value, params: {} });
  };

  const handleParamChange = (param, value) => {
    onChange({ ...data, params: { ...data.params, [param]: value } });
  };

  return (
    <div>
      <Field label="Title">
        <input
          className="form-input"
          value={data.title || ''}
          placeholder="e.g. Send Welcome Email"
          onChange={(e) => onChange({ ...data, title: e.target.value })}
        />
      </Field>

      <Field label="Action">
        {loading ? (
          <p className="loading-text">Loading actions from API...</p>
        ) : (
          <select
            className="form-input"
            value={data.actionId || ''}
            onChange={handleActionChange}
          >
            <option value="">— choose an action —</option>
            {automations.map((a) => (
              <option key={a.id} value={a.id}>
                {a.label}
              </option>
            ))}
          </select>
        )}
      </Field>

      {/* Dynamic param fields — rendered based on selected action's params array */}
      {selectedAction && selectedAction.params.length > 0 && (
        <>
          <div className="section-divider" />
          <p className="section-label">Action Parameters</p>
          {selectedAction.params.map((param) => (
            <Field key={param} label={param}>
              <input
                className="form-input"
                value={data.params?.[param] || ''}
                placeholder={param}
                onChange={(e) => handleParamChange(param, e.target.value)}
              />
            </Field>
          ))}
        </>
      )}
    </div>
  );
}
