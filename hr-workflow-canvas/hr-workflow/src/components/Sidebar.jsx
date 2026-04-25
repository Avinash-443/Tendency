// Left sidebar — drag these onto the canvas
import { NODE_COLORS, NODE_LABELS } from '../nodes/nodeTypes';

const NODE_TYPES = ['startNode', 'taskNode', 'approvalNode', 'automatedNode', 'endNode'];

const NODE_DESC = {
  startNode:    'Workflow entry point',
  taskNode:     'Human task step',
  approvalNode: 'Approval gate',
  automatedNode:'System action',
  endNode:      'Workflow end',
};

export default function Sidebar() {
  const onDragStart = (e, type) => {
    e.dataTransfer.setData('nodeType', type);
    e.dataTransfer.effectAllowed = 'move';
  };

  return (
    <div style={{
      width: 190,
      background: '#1a1a2e',
      borderRight: '1px solid #2d2d50',
      display: 'flex',
      flexDirection: 'column',
      flexShrink: 0,
    }}>
      {/* Header */}
      <div style={{ padding: '16px 14px 12px', borderBottom: '1px solid #2d2d50' }}>
        <div style={{ color: '#fff', fontWeight: 700, fontSize: 15 }}>HR Workflow</div>
        <div style={{ color: '#8b8baa', fontSize: 11, marginTop: 2 }}>Designer</div>
      </div>

      {/* Node list */}
      <div style={{ padding: '12px 10px' }}>
        <div style={{ color: '#8b8baa', fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8, paddingLeft: 4 }}>
          Drag to canvas
        </div>
        {NODE_TYPES.map((type) => (
          <div
            key={type}
            draggable
            onDragStart={(e) => onDragStart(e, type)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 9,
              padding: '8px 10px',
              marginBottom: 4,
              borderRadius: 7,
              border: `1px solid ${NODE_COLORS[type]}40`,
              background: NODE_COLORS[type] + '12',
              cursor: 'grab',
              userSelect: 'none',
            }}
          >
            <div style={{
              width: 10, height: 10, borderRadius: '50%',
              background: NODE_COLORS[type], flexShrink: 0,
            }} />
            <div>
              <div style={{ color: '#e2e8f0', fontSize: 12, fontWeight: 600 }}>
                {NODE_LABELS[type]}
              </div>
              <div style={{ color: '#8b8baa', fontSize: 10 }}>
                {NODE_DESC[type]}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Instructions */}
      <div style={{ marginTop: 'auto', padding: '12px 14px', borderTop: '1px solid #2d2d50' }}>
        <div style={{ color: '#8b8baa', fontSize: 10, lineHeight: 1.6 }}>
          • Drag nodes onto canvas<br />
          • Click node to edit<br />
          • Connect nodes by dragging handles<br />
          • Select + Delete key to remove
        </div>
      </div>
    </div>
  );
}
