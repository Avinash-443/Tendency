import { useState } from 'react';
import NodeFormPanel from './components/NodeFormPanel';
import './App.css';

// Initial mock nodes — simulating what the canvas would have
const INITIAL_NODES = [
  {
    id: 'start-1',
    type: 'start',
    data: { title: '', metadata: {} },
  },
  {
    id: 'task-1',
    type: 'task',
    data: { title: 'Collect Documents', description: '', assignee: 'HR Admin', dueDate: '', customFields: {} },
  },
  {
    id: 'approval-1',
    type: 'approval',
    data: { title: 'Manager Approval', approverRole: 'Manager', autoApproveThreshold: 3 },
  },
  {
    id: 'automated-1',
    type: 'automated',
    data: { title: 'Send Welcome Email', actionId: '', params: {} },
  },
  {
    id: 'end-1',
    type: 'end',
    data: { endMessage: 'Onboarding complete', summaryFlag: false },
  },
];

const TYPE_LABEL = {
  start:    'Start Node',
  task:     'Task Node',
  approval: 'Approval Node',
  automated:'Automated Step',
  end:      'End Node',
};

const TYPE_DESC = {
  start:    'Workflow entry point',
  task:     'Human task step',
  approval: 'Approval gate',
  automated:'System action',
  end:      'Workflow completion',
};

const NODE_COLOR = {
  start:    '#22c55e',
  task:     '#3b82f6',
  approval: '#f59e0b',
  automated:'#8b5cf6',
  end:      '#ef4444',
};

export default function App() {
  const [nodes, setNodes]           = useState(INITIAL_NODES);
  const [selectedId, setSelectedId] = useState('start-1');

  // Always derive selected node from the nodes array — never stale
  const selectedNode = nodes.find((n) => n.id === selectedId) || null;

  const handleUpdate = (id, newData) => {
    setNodes((prev) => prev.map((n) => (n.id === id ? { ...n, data: newData } : n)));
  };

  return (
    <div className="app">

      {/* ── Top bar ── */}
      <header className="topbar">
        <div className="topbar-left">
          <span className="topbar-logo">T</span>
          <div>
            <div className="topbar-title">HR Workflow Designer</div>
            <div className="topbar-sub">Node Configuration Forms · Tredence Studio</div>
          </div>
        </div>
        <div className="topbar-right">
          <span className="topbar-hint">Click any node to edit its fields →</span>
        </div>
      </header>

      {/* ── Body ── */}
      <div className="body">

        {/* Left — node list */}
        <aside className="sidebar">
          <div className="sidebar-label">Workflow Nodes</div>
          {nodes.map((node) => {
            const active = node.id === selectedId;
            const color  = NODE_COLOR[node.type];
            return (
              <button
                key={node.id}
                className={`node-item ${active ? 'node-item-active' : ''}`}
                style={active ? { borderColor: color, background: color + '10' } : {}}
                onClick={() => setSelectedId(node.id)}
              >
                <span className="node-dot" style={{ background: color }} />
                <div className="node-item-text">
                  <div className="node-item-label">{TYPE_LABEL[node.type]}</div>
                  <div className="node-item-desc">
                    {node.data.title || TYPE_DESC[node.type]}
                  </div>
                </div>
                {active && <span className="node-item-arrow">→</span>}
              </button>
            );
          })}

          {/* Live data preview */}
          {selectedNode && (
            <div className="data-preview">
              <div className="preview-label">Live data (JSON)</div>
              <pre className="preview-code">
                {JSON.stringify(selectedNode.data, null, 2)}
              </pre>
            </div>
          )}
        </aside>

        {/* Right — form panel */}
        <main className="main">
          <NodeFormPanel
            node={selectedNode}
            onUpdate={handleUpdate}
          />
        </main>

      </div>
    </div>
  );
}
