// Right panel — appears when a node is selected. Shows editable form for that node type.
import { useState, useEffect } from 'react';
import { getAutomations } from '../api/mockApi';

const inputStyle = {
  width: '100%',
  padding: '7px 9px',
  border: '1px solid #d1d5db',
  borderRadius: 6,
  fontSize: 12,
  outline: 'none',
  background: '#fafafa',
};

const labelStyle = {
  display: 'block',
  fontSize: 11,
  fontWeight: 600,
  color: '#555',
  marginBottom: 4,
};

function Field({ label, children }) {
  return (
    <div style={{ marginBottom: 12 }}>
      <label style={labelStyle}>{label}</label>
      {children}
    </div>
  );
}

// ── START NODE FORM ──────────────────────────────────────
function StartForm({ data, onChange }) {
  return (
    <>
      <Field label="Title">
        <input style={inputStyle} value={data.title || ''} onChange={(e) => onChange({ ...data, title: e.target.value })} placeholder="Workflow title" />
      </Field>
      <Field label="Metadata (key: value, one per line)">
        <textarea
          style={{ ...inputStyle, resize: 'vertical', minHeight: 60 }}
          value={Object.entries(data.metadata || {}).map(([k, v]) => `${k}: ${v}`).join('\n')}
          onChange={(e) => {
            const meta = {};
            e.target.value.split('\n').forEach((line) => {
              const idx = line.indexOf(':');
              if (idx > -1) meta[line.slice(0, idx).trim()] = line.slice(idx + 1).trim();
            });
            onChange({ ...data, metadata: meta });
          }}
          placeholder="department: Engineering"
        />
      </Field>
    </>
  );
}

// ── TASK NODE FORM ───────────────────────────────────────
function TaskForm({ data, onChange }) {
  return (
    <>
      <Field label="Title *">
        <input style={inputStyle} value={data.title || ''} onChange={(e) => onChange({ ...data, title: e.target.value })} placeholder="e.g. Collect Documents" />
      </Field>
      <Field label="Description">
        <textarea style={{ ...inputStyle, resize: 'vertical', minHeight: 55 }} value={data.description || ''} onChange={(e) => onChange({ ...data, description: e.target.value })} placeholder="What needs to be done" />
      </Field>
      <Field label="Assignee">
        <input style={inputStyle} value={data.assignee || ''} onChange={(e) => onChange({ ...data, assignee: e.target.value })} placeholder="HR Admin" />
      </Field>
      <Field label="Due Date">
        <input style={inputStyle} type="date" value={data.dueDate || ''} onChange={(e) => onChange({ ...data, dueDate: e.target.value })} />
      </Field>
    </>
  );
}

// ── APPROVAL NODE FORM ───────────────────────────────────
function ApprovalForm({ data, onChange }) {
  return (
    <>
      <Field label="Title">
        <input style={inputStyle} value={data.title || ''} onChange={(e) => onChange({ ...data, title: e.target.value })} placeholder="Manager Approval" />
      </Field>
      <Field label="Approver Role">
        <select style={inputStyle} value={data.approverRole || ''} onChange={(e) => onChange({ ...data, approverRole: e.target.value })}>
          <option value="">Select role</option>
          <option>Manager</option>
          <option>HRBP</option>
          <option>Director</option>
        </select>
      </Field>
      <Field label="Auto-approve Threshold (days)">
        <input style={inputStyle} type="number" min={0} value={data.autoApproveThreshold ?? ''} onChange={(e) => onChange({ ...data, autoApproveThreshold: Number(e.target.value) })} placeholder="3" />
      </Field>
    </>
  );
}

// ── AUTOMATED NODE FORM ──────────────────────────────────
function AutomatedForm({ data, onChange }) {
  const [automations, setAutomations] = useState([]);

  useEffect(() => {
    getAutomations().then(setAutomations);
  }, []);

  const selected = automations.find((a) => a.id === data.actionId);

  return (
    <>
      <Field label="Title">
        <input style={inputStyle} value={data.title || ''} onChange={(e) => onChange({ ...data, title: e.target.value })} placeholder="Send Welcome Email" />
      </Field>
      <Field label="Action">
        <select
          style={inputStyle}
          value={data.actionId || ''}
          onChange={(e) => onChange({ ...data, actionId: e.target.value, params: {} })}
        >
          <option value="">— pick an action —</option>
          {automations.map((a) => (
            <option key={a.id} value={a.id}>{a.label}</option>
          ))}
        </select>
      </Field>
      {selected && selected.params.map((param) => (
        <Field key={param} label={param}>
          <input
            style={inputStyle}
            value={data.params?.[param] || ''}
            onChange={(e) => onChange({ ...data, params: { ...data.params, [param]: e.target.value } })}
            placeholder={param}
          />
        </Field>
      ))}
    </>
  );
}

// ── END NODE FORM ────────────────────────────────────────
function EndForm({ data, onChange }) {
  return (
    <>
      <Field label="End Message">
        <input style={inputStyle} value={data.endMessage || ''} onChange={(e) => onChange({ ...data, endMessage: e.target.value })} placeholder="Workflow complete" />
      </Field>
      <Field label="Summary Flag">
        <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
          <input type="checkbox" checked={!!data.summaryFlag} onChange={(e) => onChange({ ...data, summaryFlag: e.target.checked })} />
          <span style={{ fontSize: 12, color: '#374151' }}>Generate summary report</span>
        </label>
      </Field>
    </>
  );
}

// ── MAIN PANEL ───────────────────────────────────────────
const FORM_MAP = {
  startNode:    StartForm,
  taskNode:     TaskForm,
  approvalNode: ApprovalForm,
  automatedNode:AutomatedForm,
  endNode:      EndForm,
};

const TYPE_LABEL = {
  startNode: 'Start Node',
  taskNode: 'Task Node',
  approvalNode: 'Approval Node',
  automatedNode: 'Automated Step',
  endNode: 'End Node',
};

export default function NodeFormPanel({ node, onUpdate, onDelete }) {
  if (!node) {
    return (
      <div style={{ width: 240, background: '#fff', borderLeft: '1px solid #e5e7eb', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        <div style={{ textAlign: 'center', color: '#9ca3af', fontSize: 12, padding: 20 }}>
          <div style={{ fontSize: 28, marginBottom: 8 }}>←</div>
          Click a node to edit it
        </div>
      </div>
    );
  }

  const Form = FORM_MAP[node.type];

  return (
    <div style={{ width: 240, background: '#fff', borderLeft: '1px solid #e5e7eb', display: 'flex', flexDirection: 'column', flexShrink: 0, overflow: 'hidden' }}>
      {/* Header */}
      <div style={{ padding: '14px 16px', borderBottom: '1px solid #f3f4f6', background: '#f9fafb' }}>
        <div style={{ fontWeight: 700, fontSize: 13, color: '#111827' }}>{TYPE_LABEL[node.type]}</div>
        <div style={{ fontSize: 10, color: '#9ca3af', fontFamily: 'monospace', marginTop: 2 }}>{node.id}</div>
      </div>

      {/* Form */}
      <div style={{ padding: '14px 16px', overflowY: 'auto', flex: 1 }}>
        {Form && <Form data={node.data} onChange={(newData) => onUpdate(node.id, newData)} />}
      </div>

      {/* Delete */}
      <div style={{ padding: '12px 16px', borderTop: '1px solid #f3f4f6' }}>
        <button
          onClick={() => onDelete(node.id)}
          style={{ width: '100%', padding: '7px', background: '#fee2e2', color: '#dc2626', border: '1px solid #fecaca', borderRadius: 6, fontSize: 12, fontWeight: 600 }}
        >
          Delete Node
        </button>
      </div>
    </div>
  );
}
