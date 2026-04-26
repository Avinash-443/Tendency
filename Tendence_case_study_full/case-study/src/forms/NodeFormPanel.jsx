// src/forms/NodeFormPanel.jsx
// Routes to the correct form by node.type. Each form is a controlled component.
// To add a new node type: create a form component and add one line to FORM_MAP.

import { useState, useEffect } from 'react';
import { Field }     from '../components/Field';
import { KVEditor }  from '../components/KVEditor';
import { getAutomations } from '../api/mockApi';
import { NODE_COLORS, NODE_LABELS } from '../types';

const inp = {
  width: '100%', padding: '7px 9px', border: '1px solid #d1d5db', borderRadius: 6,
  fontSize: 12, fontFamily: 'inherit', color: '#111827', background: '#fff',
  outline: 'none',
};
const textarea = { ...inp, resize: 'vertical', minHeight: 60 };
const divider  = { border: 'none', borderTop: '1px solid #f3f4f6', margin: '4px 0 12px' };
const secLabel = { fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em', color: '#9ca3af', marginBottom: 8 };

// ── Start ────────────────────────────────────
function StartForm({ data, onChange }) {
  return (
    <>
      <Field label="Start Title" required>
        <input style={inp} value={data.title || ''} placeholder="e.g. Employee Onboarding"
          onChange={(e) => onChange({ ...data, title: e.target.value })} />
      </Field>
      <hr style={divider} />
      <p style={secLabel}>Optional Metadata</p>
      <KVEditor value={data.metadata || {}} keyPlaceholder="key"
        onChange={(meta) => onChange({ ...data, metadata: meta })} />
    </>
  );
}

// ── Task ─────────────────────────────────────
function TaskForm({ data, onChange }) {
  return (
    <>
      <Field label="Title" required>
        <input style={inp} value={data.title || ''} placeholder="e.g. Collect Documents"
          onChange={(e) => onChange({ ...data, title: e.target.value })} />
      </Field>
      <Field label="Description">
        <textarea style={textarea} value={data.description || ''} placeholder="What needs to be done"
          onChange={(e) => onChange({ ...data, description: e.target.value })} />
      </Field>
      <Field label="Assignee">
        <input style={inp} value={data.assignee || ''} placeholder="e.g. HR Admin"
          onChange={(e) => onChange({ ...data, assignee: e.target.value })} />
      </Field>
      <Field label="Due Date">
        <input style={inp} type="date" value={data.dueDate || ''}
          onChange={(e) => onChange({ ...data, dueDate: e.target.value })} />
      </Field>
      <hr style={divider} />
      <p style={secLabel}>Optional Custom Fields</p>
      <KVEditor value={data.customFields || {}} keyPlaceholder="field name"
        onChange={(cf) => onChange({ ...data, customFields: cf })} />
    </>
  );
}

// ── Approval ──────────────────────────────────
function ApprovalForm({ data, onChange }) {
  return (
    <>
      <Field label="Title">
        <input style={inp} value={data.title || ''} placeholder="e.g. Manager Approval"
          onChange={(e) => onChange({ ...data, title: e.target.value })} />
      </Field>
      <Field label="Approver Role">
        <select style={inp} value={data.approverRole || ''}
          onChange={(e) => onChange({ ...data, approverRole: e.target.value })}>
          <option value="">Select role</option>
          <option value="Manager">Manager</option>
          <option value="HRBP">HRBP</option>
          <option value="Director">Director</option>
        </select>
      </Field>
      <Field label="Auto-approve Threshold (days)">
        <input style={inp} type="number" min={0} value={data.autoApproveThreshold ?? ''} placeholder="e.g. 3"
          onChange={(e) => onChange({ ...data, autoApproveThreshold: Number(e.target.value) })} />
      </Field>
    </>
  );
}

// ── Automated ─────────────────────────────────
function AutomatedForm({ data, onChange }) {
  const [automations, setAutomations] = useState([]);
  const [loading, setLoading]         = useState(true);

  useEffect(() => {
    getAutomations().then((list) => { setAutomations(list); setLoading(false); });
  }, []);

  const selected = automations.find((a) => a.id === data.actionId);

  return (
    <>
      <Field label="Title">
        <input style={inp} value={data.title || ''} placeholder="e.g. Send Welcome Email"
          onChange={(e) => onChange({ ...data, title: e.target.value })} />
      </Field>
      <Field label="Action">
        {loading
          ? <p style={{ fontSize: 12, color: '#9ca3af', fontStyle: 'italic' }}>Loading actions...</p>
          : (
            <select style={inp} value={data.actionId || ''}
              onChange={(e) => onChange({ ...data, actionId: e.target.value, params: {} })}>
              <option value="">— choose an action —</option>
              {automations.map((a) => <option key={a.id} value={a.id}>{a.label}</option>)}
            </select>
          )
        }
      </Field>
      {selected && selected.params.length > 0 && (
        <>
          <hr style={divider} />
          <p style={secLabel}>Action Parameters</p>
          {selected.params.map((param) => (
            <Field key={param} label={param}>
              <input style={inp} value={data.params?.[param] || ''} placeholder={param}
                onChange={(e) => onChange({ ...data, params: { ...data.params, [param]: e.target.value } })} />
            </Field>
          ))}
        </>
      )}
    </>
  );
}

// ── End ───────────────────────────────────────
function EndForm({ data, onChange }) {
  return (
    <>
      <Field label="End Message">
        <input style={inp} value={data.endMessage || ''} placeholder="e.g. Onboarding complete"
          onChange={(e) => onChange({ ...data, endMessage: e.target.value })} />
      </Field>
      <Field label="Summary Flag">
        <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: '#374151', cursor: 'pointer' }}>
          <input type="checkbox" checked={!!data.summaryFlag}
            onChange={(e) => onChange({ ...data, summaryFlag: e.target.checked })} />
          Generate summary report
        </label>
      </Field>
    </>
  );
}

// ── FORM MAP — add new node types here ────────
const FORM_MAP = {
  start:     StartForm,
  task:      TaskForm,
  approval:  ApprovalForm,
  automated: AutomatedForm,
  end:       EndForm,
};

// ── Main export ───────────────────────────────
export default function NodeFormPanel({ node, onUpdate, onDelete }) {
  if (!node) {
    return (
      <div style={{
        width: 250, background: '#fff', borderLeft: '1px solid #e5e7eb',
        display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
      }}>
        <div style={{ textAlign: 'center', color: '#9ca3af', fontSize: 13 }}>
          <div style={{ fontSize: 32, marginBottom: 8 }}>☝</div>
          Click a node to edit
        </div>
      </div>
    );
  }

  const Form  = FORM_MAP[node.type];
  const color = NODE_COLORS[node.type];

  return (
    <div style={{
      width: 250, background: '#fff', borderLeft: '1px solid #e5e7eb',
      display: 'flex', flexDirection: 'column', flexShrink: 0,
    }}>
      {/* Header */}
      <div style={{
        padding: '13px 16px', borderBottom: '1px solid #f3f4f6', background: '#f9fafb',
        borderTop: `3px solid ${color}`, flexShrink: 0,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ width: 9, height: 9, borderRadius: '50%', background: color, display: 'inline-block' }} />
          <span style={{ fontWeight: 700, fontSize: 13, color: '#111827' }}>{NODE_LABELS[node.type]}</span>
        </div>
        <div style={{ fontFamily: 'monospace', fontSize: 10, color: '#9ca3af', marginTop: 2 }}>{node.id}</div>
      </div>

      {/* Form */}
      <div style={{ padding: '14px 16px', overflowY: 'auto', flex: 1 }}>
        {Form
          ? <Form data={node.data} onChange={(newData) => onUpdate(node.id, newData)} />
          : <p style={{ color: '#9ca3af', fontSize: 12 }}>No form for this node type.</p>
        }
      </div>

      {/* Delete */}
      <div style={{ padding: '12px 16px', borderTop: '1px solid #f3f4f6', flexShrink: 0 }}>
        <button onClick={() => onDelete(node.id)} style={{
          width: '100%', padding: '7px', background: '#fef2f2', color: '#dc2626',
          border: '1px solid #fecaca', borderRadius: 6, fontSize: 12, fontWeight: 600,
          cursor: 'pointer', fontFamily: 'inherit',
        }}>
          Delete Node
        </button>
      </div>
    </div>
  );
}
