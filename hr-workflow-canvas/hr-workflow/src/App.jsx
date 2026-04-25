import { useState, useCallback, useRef } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  addEdge,
  useNodesState,
  useEdgesState,
  MiniMap,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import { nodeTypes, NODE_COLORS } from './nodes/nodeTypes';
import Sidebar from './components/Sidebar';
import NodeFormPanel from './components/NodeFormPanel';
import SimulatePanel from './components/SimulatePanel';

// Starting example nodes so canvas isn't empty
const initialNodes = [
  { id: 'start-1', type: 'startNode', position: { x: 220, y: 60 },  data: { title: 'Employee Onboarding', metadata: {} } },
  { id: 'task-1',  type: 'taskNode',  position: { x: 220, y: 180 }, data: { title: 'Collect Documents', assignee: 'HR Admin', description: '', dueDate: '' } },
  { id: 'end-1',   type: 'endNode',   position: { x: 220, y: 300 }, data: { endMessage: 'Onboarding complete', summaryFlag: false } },
];

const initialEdges = [
  { id: 'e1', source: 'start-1', target: 'task-1' },
  { id: 'e2', source: 'task-1',  target: 'end-1' },
];

let nodeIdCounter = 10;

export default function App() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [selectedNode, setSelectedNode]  = useState(null);
  const [showSimulate, setShowSimulate]  = useState(false);
  const [validationMsg, setValidationMsg] = useState('');
  const reactFlowWrapper = useRef(null);
  const [rfInstance, setRfInstance]      = useState(null);

  // Connect two nodes
  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  // Drop a new node onto canvas
  const onDrop = useCallback((e) => {
    e.preventDefault();
    const type = e.dataTransfer.getData('nodeType');
    if (!type || !rfInstance) return;

    const bounds = reactFlowWrapper.current.getBoundingClientRect();
    const position = rfInstance.screenToFlowPosition({
      x: e.clientX - bounds.left,
      y: e.clientY - bounds.top,
    });

    const defaultData = {
      startNode:    { title: 'Start', metadata: {} },
      taskNode:     { title: 'New Task', assignee: '', description: '', dueDate: '' },
      approvalNode: { title: 'Approval', approverRole: 'Manager', autoApproveThreshold: 3 },
      automatedNode:{ title: 'Automated Step', actionId: '', params: {} },
      endNode:      { endMessage: 'Done', summaryFlag: false },
    }[type] || {};

    const newNode = { id: `${type}-${++nodeIdCounter}`, type, position, data: defaultData };
    setNodes((nds) => nds.concat(newNode));
  }, [rfInstance, setNodes]);

  const onDragOver = (e) => { e.preventDefault(); e.dataTransfer.dropEffect = 'move'; };

  // Click a node to select/deselect
  const onNodeClick = useCallback((_, node) => {
    setSelectedNode((prev) => (prev?.id === node.id ? null : node));
  }, []);

  const onPaneClick = () => setSelectedNode(null);

  // Update node data from the form panel
  const onUpdateNode = useCallback((id, newData) => {
    setNodes((nds) =>
      nds.map((n) => (n.id === id ? { ...n, data: newData } : n))
    );
    setSelectedNode((prev) => (prev?.id === id ? { ...prev, data: newData } : prev));
  }, [setNodes]);

  // Delete a node and its connected edges
  const onDeleteNode = useCallback((id) => {
    setNodes((nds) => nds.filter((n) => n.id !== id));
    setEdges((eds) => eds.filter((e) => e.source !== id && e.target !== id));
    setSelectedNode(null);
  }, [setNodes, setEdges]);

  // Basic validation before opening simulate panel
  const openSimulate = () => {
    const hasStart = nodes.some((n) => n.type === 'startNode');
    const hasEnd   = nodes.some((n) => n.type === 'endNode');
    if (!hasStart || !hasEnd) {
      setValidationMsg(!hasStart ? 'Add a Start node first.' : 'Add an End node first.');
      setTimeout(() => setValidationMsg(''), 3000);
      return;
    }
    setShowSimulate(true);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>

      {/* ── TOP BAR ── */}
      <div style={{
        height: 48, background: '#1a1a2e', display: 'flex', alignItems: 'center',
        justifyContent: 'space-between', padding: '0 20px', flexShrink: 0,
      }}>
        <div style={{ color: '#fff', fontWeight: 700, fontSize: 15 }}>
          HR Workflow Designer
          <span style={{ fontSize: 11, color: '#8b8baa', marginLeft: 10, fontWeight: 400 }}>
            Tredence Studio · Case Study
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {validationMsg && (
            <div style={{ background: '#fef3c7', color: '#92400e', fontSize: 12, padding: '4px 10px', borderRadius: 5 }}>
              ⚠ {validationMsg}
            </div>
          )}
          <div style={{ fontSize: 11, color: '#8b8baa' }}>
            {nodes.length} nodes · {edges.length} edges
          </div>
          <button
            onClick={openSimulate}
            style={{
              background: '#22c55e', color: '#fff', border: 'none',
              borderRadius: 7, padding: '7px 16px', fontSize: 13, fontWeight: 600,
            }}
          >
            ▶ Test Workflow
          </button>
        </div>
      </div>

      {/* ── MAIN LAYOUT ── */}
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>

        {/* Left sidebar */}
        <Sidebar />

        {/* Canvas */}
        <div ref={reactFlowWrapper} style={{ flex: 1 }} onDrop={onDrop} onDragOver={onDragOver}>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onNodeClick={onNodeClick}
            onPaneClick={onPaneClick}
            onInit={setRfInstance}
            nodeTypes={nodeTypes}
            fitView
            deleteKeyCode="Delete"
          >
            <Background color="#e2e8f0" gap={20} />
            <Controls />
            <MiniMap
              nodeColor={(n) => NODE_COLORS[n.type] || '#ccc'}
              style={{ background: '#f9fafb', border: '1px solid #e5e7eb' }}
            />
          </ReactFlow>
        </div>

        {/* Right form panel */}
        <NodeFormPanel
          node={selectedNode}
          onUpdate={onUpdateNode}
          onDelete={onDeleteNode}
        />
      </div>

      {/* Simulate modal */}
      {showSimulate && (
        <SimulatePanel
          nodes={nodes}
          edges={edges}
          onClose={() => setShowSimulate(false)}
        />
      )}
    </div>
  );
}
