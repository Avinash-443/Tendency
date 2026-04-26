// src/nodes/customNodes.jsx
// All 5 custom React Flow node components.
// Canvas logic only — no form or API knowledge here.

import { Handle, Position } from '@xyflow/react';
import { NODE_COLORS, NODE_LABELS } from '../types';

const ICON = { start: '▶', task: '☑', approval: '✔', automated: '⚙', end: '⏹' };

function BaseNode({ type, data, children, hasTarget = true, hasSource = true }) {
  const color = NODE_COLORS[type];
  return (
    <div style={{
      background: '#fff',
      border: `2px solid ${color}`,
      borderRadius: 8,
      padding: '10px 14px',
      minWidth: 160,
      boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
      cursor: 'pointer',
      position: 'relative',
    }}>
      {hasTarget && <Handle type="target" position={Position.Top} style={{ background: color, width: 10, height: 10 }} />}
      <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 4 }}>
        <span style={{
          fontSize: 10, fontWeight: 700, padding: '1px 6px', borderRadius: 4,
          background: color + '20', color, textTransform: 'uppercase', letterSpacing: '0.05em',
        }}>
          {ICON[type]} {NODE_LABELS[type]}
        </span>
      </div>
      <div style={{ fontWeight: 600, fontSize: 13, color: '#111827' }}>
        {data.title || data.endMessage || NODE_LABELS[type]}
      </div>
      {children}
      {hasSource && <Handle type="source" position={Position.Bottom} style={{ background: color, width: 10, height: 10 }} />}
    </div>
  );
}

export function StartNode({ data }) {
  return (
    <BaseNode type="start" data={data} hasTarget={false}>
      {Object.keys(data.metadata || {}).length > 0 && (
        <div style={{ fontSize: 10, color: '#6b7280', marginTop: 3 }}>
          {Object.entries(data.metadata).slice(0, 2).map(([k, v]) => (
            <div key={k}>{k}: {v}</div>
          ))}
        </div>
      )}
    </BaseNode>
  );
}

export function TaskNode({ data }) {
  return (
    <BaseNode type="task" data={data}>
      {data.assignee && <div style={{ fontSize: 11, color: '#6b7280', marginTop: 3 }}>👤 {data.assignee}</div>}
      {data.dueDate  && <div style={{ fontSize: 11, color: '#6b7280' }}>📅 {data.dueDate}</div>}
    </BaseNode>
  );
}

export function ApprovalNode({ data }) {
  return (
    <BaseNode type="approval" data={data}>
      {data.approverRole && <div style={{ fontSize: 11, color: '#6b7280', marginTop: 3 }}>Role: {data.approverRole}</div>}
    </BaseNode>
  );
}

export function AutomatedNode({ data }) {
  return (
    <BaseNode type="automated" data={data}>
      {data.actionId && <div style={{ fontSize: 11, color: '#6b7280', marginTop: 3 }}>⚙ {data.actionId}</div>}
    </BaseNode>
  );
}

export function EndNode({ data }) {
  return (
    <BaseNode type="end" data={data} hasSource={false}>
      {data.summaryFlag && <div style={{ fontSize: 10, color: '#ef4444', marginTop: 3 }}>📋 Summary report</div>}
    </BaseNode>
  );
}

export const nodeTypes = {
  start:     StartNode,
  task:      TaskNode,
  approval:  ApprovalNode,
  automated: AutomatedNode,
  end:       EndNode,
};
