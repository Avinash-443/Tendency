// src/App.jsx — main app, composes all modules

import { useState, useCallback, useRef } from 'react';
import {
  ReactFlow, Background, Controls, MiniMap,
  addEdge, useNodesState, useEdgesState,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import { nodeTypes }       from './nodes/customNodes';
import NodeFormPanel       from './forms/NodeFormPanel';
import SimulatePanel       from './components/SimulatePanel';
import { NODE_COLORS, NODE_LABELS, NODE_DESCRIPTIONS, NODE_DEFAULTS } from './types';

const ALL_TYPES = ['start', 'task', 'approval', 'automated', 'end'];
let idCtr = 10;
const uid = (t) => `${t}-${++idCtr}`;

const INIT_NODES = [
  { id: 'start-1',    type: 'start',     position: { x: 260, y: 50  }, data: { title: 'Employee Onboarding', metadata: {} } },
  { id: 'task-1',     type: 'task',      position: { x: 260, y: 170 }, data: { title: 'Collect Documents', assignee: 'HR Admin', description: '', dueDate: '', customFields: {} } },
  { id: 'approval-1', type: 'approval',  position: { x: 260, y: 290 }, data: { title: 'Manager Approval', approverRole: 'Manager', autoApproveThreshold: 3 } },
  { id: 'auto-1',     type: 'automated', position: { x: 260, y: 410 }, data: { title: 'Send Welcome Email', actionId: 'send_email', params: {} } },
  { id: 'end-1',      type: 'end',       position: { x: 260, y: 530 }, data: { endMessage: 'Onboarding complete', summaryFlag: false } },
];
const INIT_EDGES = [
  { id: 'e1', source: 'start-1',    target: 'task-1' },
  { id: 'e2', source: 'task-1',     target: 'approval-1' },
  { id: 'e3', source: 'approval-1', target: 'auto-1' },
  { id: 'e4', source: 'auto-1',     target: 'end-1' },
];

export default function App() {
  const [nodes, setNodes, onNodesChange] = useNodesState(INIT_NODES);
  const [edges, setEdges, onEdgesChange] = useEdgesState(INIT_EDGES);
  const [selectedId, setSelectedId]      = useState(null);
  const [showSim, setShowSim]            = useState(false);
  const [warning, setWarning]            = useState('');
  const wrapRef   = useRef(null);
  const [rfi, setRfi] = useState(null);

  const selectedNode = nodes.find((n) => n.id === selectedId) ?? null;

  const onConnect   = useCallback((p) => setEdges((e) => addEdge(p, e)), [setEdges]);
  const onDragOver  = (e) => { e.preventDefault(); e.dataTransfer.dropEffect = 'move'; };

  const onDrop = useCallback((e) => {
    e.preventDefault();
    const type = e.dataTransfer.getData('nodeType');
    if (!type || !rfi) return;
    const b    = wrapRef.current.getBoundingClientRect();
    const pos  = rfi.screenToFlowPosition({ x: e.clientX - b.left, y: e.clientY - b.top });
    const node = { id: uid(type), type, position: pos, data: { ...NODE_DEFAULTS[type] } };
    setNodes((n) => n.concat(node));
    setSelectedId(node.id);
  }, [rfi, setNodes]);

  const onNodeClick  = useCallback((_, n) => setSelectedId((p) => p === n.id ? null : n.id), []);
  const onPaneClick  = () => setSelectedId(null);

  const onUpdateNode = useCallback((id, d) => {
    setNodes((ns) => ns.map((n) => n.id === id ? { ...n, data: d } : n));
  }, [setNodes]);

  const onDeleteNode = useCallback((id) => {
    setNodes((ns) => ns.filter((n) => n.id !== id));
    setEdges((es) => es.filter((e) => e.source !== id && e.target !== id));
    setSelectedId(null);
  }, [setNodes, setEdges]);

  const openSim = () => {
    if (!nodes.some((n) => n.type === 'start')) { warn('Add a Start node first.'); return; }
    if (!nodes.some((n) => n.type === 'end'))   { warn('Add an End node first.');  return; }
    setShowSim(true);
  };

  const warn = (msg) => { setWarning(msg); setTimeout(() => setWarning(''), 3000); };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', fontFamily: "'Segoe UI',sans-serif" }}>

      {/* Top bar */}
      <header style={{ height: 50, background: '#1a1a2e', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 20px', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 30, height: 30, background: '#f97316', borderRadius: 7, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: 14 }}>T</div>
          <div>
            <div style={{ color: '#fff', fontWeight: 700, fontSize: 14 }}>HR Workflow Designer</div>
            <div style={{ color: '#8b8baa', fontSize: 11 }}>Tredence Studio · Case Study</div>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {warning && <div style={{ background: '#fef3c7', color: '#92400e', fontSize: 12, padding: '4px 10px', borderRadius: 5 }}>⚠ {warning}</div>}
          <span style={{ fontSize: 11, color: '#8b8baa', fontFamily: 'monospace' }}>{nodes.length} nodes · {edges.length} edges</span>
          <button onClick={openSim} style={{ background: '#22c55e', color: '#fff', border: 'none', borderRadius: 7, padding: '7px 16px', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>▶ Test Workflow</button>
        </div>
      </header>

      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>

        {/* Sidebar */}
        <aside style={{ width: 195, background: '#1a1a2e', borderRight: '1px solid #2d2d50', display: 'flex', flexDirection: 'column', flexShrink: 0, padding: '12px 10px' }}>
          <div style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#6b6b8a', padding: '0 4px', marginBottom: 8 }}>Drag to canvas</div>
          {ALL_TYPES.map((type) => (
            <div key={type} draggable onDragStart={(e) => e.dataTransfer.setData('nodeType', type)}
              style={{ display: 'flex', alignItems: 'center', gap: 9, padding: '8px 9px', marginBottom: 4, borderRadius: 7, cursor: 'grab', userSelect: 'none', border: `1px solid ${NODE_COLORS[type]}40`, background: NODE_COLORS[type] + '12' }}>
              <span style={{ width: 9, height: 9, borderRadius: '50%', background: NODE_COLORS[type], flexShrink: 0 }} />
              <div>
                <div style={{ color: '#e2e8f0', fontSize: 12, fontWeight: 600 }}>{NODE_LABELS[type]}</div>
                <div style={{ color: '#6b6b8a', fontSize: 10 }}>{NODE_DESCRIPTIONS[type]}</div>
              </div>
            </div>
          ))}
          <div style={{ marginTop: 'auto', padding: '10px 4px', borderTop: '1px solid #2d2d50' }}>
            <div style={{ color: '#6b6b8a', fontSize: 10, lineHeight: 1.7 }}>
              • Drag nodes onto canvas<br />
              • Click node to edit<br />
              • Connect by dragging handles<br />
              • Select + Delete to remove
            </div>
          </div>
        </aside>

        {/* Canvas */}
        <div ref={wrapRef} style={{ flex: 1 }} onDrop={onDrop} onDragOver={onDragOver}>
          <ReactFlow
            nodes={nodes} edges={edges}
            onNodesChange={onNodesChange} onEdgesChange={onEdgesChange}
            onConnect={onConnect} onNodeClick={onNodeClick}
            onPaneClick={onPaneClick} onInit={setRfi}
            nodeTypes={nodeTypes} fitView deleteKeyCode="Delete"
          >
            <Background color="#e2e8f0" gap={20} />
            <Controls />
            <MiniMap nodeColor={(n) => NODE_COLORS[n.type] || '#ccc'} style={{ background: '#f9fafb' }} />
          </ReactFlow>
        </div>

        {/* Form panel */}
        <NodeFormPanel node={selectedNode} onUpdate={onUpdateNode} onDelete={onDeleteNode} />
      </div>

      {showSim && <SimulatePanel nodes={nodes} edges={edges} onClose={() => setShowSim(false)} />}
    </div>
  );
}
