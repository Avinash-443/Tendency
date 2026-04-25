import { Handle, Position } from '@xyflow/react';

// Shared colours per node type
export const NODE_COLORS = {
  startNode:    '#22c55e',
  taskNode:     '#3b82f6',
  approvalNode: '#f59e0b',
  automatedNode:'#8b5cf6',
  endNode:      '#ef4444',
};

export const NODE_LABELS = {
  startNode:    'Start',
  taskNode:     'Task',
  approvalNode: 'Approval',
  automatedNode:'Automated',
  endNode:      'End',
};

const baseStyle = (color) => ({
  background: '#fff',
  border: `2px solid ${color}`,
  borderRadius: 8,
  padding: '10px 14px',
  minWidth: 150,
  fontSize: 13,
  boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
  cursor: 'pointer',
});

const typeTag = (color, label) => ({
  display: 'inline-block',
  background: color + '20',
  color: color,
  fontSize: 10,
  fontWeight: 700,
  padding: '1px 6px',
  borderRadius: 4,
  marginBottom: 4,
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
});

function NodeWrapper({ type, data, children, hasTarget = true, hasSource = true }) {
  const color = NODE_COLORS[type];
  return (
    <div style={baseStyle(color)}>
      {hasTarget && <Handle type="target" position={Position.Top} style={{ background: color }} />}
      <div style={typeTag(color, NODE_LABELS[type])}>{NODE_LABELS[type]}</div>
      <div style={{ fontWeight: 600, fontSize: 13, color: '#1e1e2e' }}>
        {data.title || NODE_LABELS[type]}
      </div>
      {children}
      {hasSource && <Handle type="source" position={Position.Bottom} style={{ background: color }} />}
    </div>
  );
}

export function StartNode({ data }) {
  return (
    <NodeWrapper type="startNode" data={data} hasTarget={false}>
      {data.metadata && Object.keys(data.metadata).length > 0 && (
        <div style={{ fontSize: 11, color: '#6b7280', marginTop: 4 }}>
          {Object.entries(data.metadata).map(([k, v]) => (
            <div key={k}>{k}: {v}</div>
          ))}
        </div>
      )}
    </NodeWrapper>
  );
}

export function TaskNode({ data }) {
  return (
    <NodeWrapper type="taskNode" data={data}>
      {data.assignee && (
        <div style={{ fontSize: 11, color: '#6b7280', marginTop: 3 }}>👤 {data.assignee}</div>
      )}
      {data.dueDate && (
        <div style={{ fontSize: 11, color: '#6b7280' }}>📅 {data.dueDate}</div>
      )}
    </NodeWrapper>
  );
}

export function ApprovalNode({ data }) {
  return (
    <NodeWrapper type="approvalNode" data={data}>
      {data.approverRole && (
        <div style={{ fontSize: 11, color: '#6b7280', marginTop: 3 }}>Role: {data.approverRole}</div>
      )}
    </NodeWrapper>
  );
}

export function AutomatedNode({ data }) {
  return (
    <NodeWrapper type="automatedNode" data={data}>
      {data.actionId && (
        <div style={{ fontSize: 11, color: '#6b7280', marginTop: 3 }}>⚙ {data.actionId}</div>
      )}
    </NodeWrapper>
  );
}

export function EndNode({ data }) {
  return (
    <NodeWrapper type="endNode" data={data} hasSource={false}>
      {data.endMessage && (
        <div style={{ fontSize: 11, color: '#6b7280', marginTop: 3 }}>{data.endMessage}</div>
      )}
    </NodeWrapper>
  );
}

export const nodeTypes = {
  startNode:    StartNode,
  taskNode:     TaskNode,
  approvalNode: ApprovalNode,
  automatedNode:AutomatedNode,
  endNode:      EndNode,
};
