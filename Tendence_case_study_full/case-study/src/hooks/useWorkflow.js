// src/hooks/useWorkflow.js
// Custom hook — owns all workflow state. Components are pure UI.

import { useState, useCallback } from 'react';
import { NODE_DEFAULTS } from '../types';

let counter = 10;
const uid = (type) => `${type}-${++counter}`;

export function useWorkflow() {
  const [nodes, setNodes]           = useState([]);
  const [edges, setEdges]           = useState([]);
  const [selectedId, setSelectedId] = useState(null);

  // Derive live — never stale
  const selectedNode = nodes.find((n) => n.id === selectedId) ?? null;

  const selectNode = useCallback((id) => {
    setSelectedId((prev) => (prev === id ? null : id));
  }, []);

  const addNode = useCallback((type, position) => {
    const node = { id: uid(type), type, position, data: { ...NODE_DEFAULTS[type] } };
    setNodes((prev) => [...prev, node]);
    setSelectedId(node.id);
    return node;
  }, []);

  const updateNodeData = useCallback((id, newData) => {
    setNodes((prev) => prev.map((n) => (n.id === id ? { ...n, data: newData } : n)));
  }, []);

  const updateNodePosition = useCallback((id, position) => {
    setNodes((prev) => prev.map((n) => (n.id === id ? { ...n, position } : n)));
  }, []);

  const deleteNode = useCallback((id) => {
    setNodes((prev) => prev.filter((n) => n.id !== id));
    setEdges((prev) => prev.filter((e) => e.source !== id && e.target !== id));
    setSelectedId((prev) => (prev === id ? null : prev));
  }, []);

  const addEdge = useCallback((source, target) => {
    const exists = (prev) => prev.some((e) => e.source === source && e.target === target);
    setEdges((prev) => exists(prev) ? prev : [...prev, { id: `e-${Date.now()}`, source, target }]);
  }, []);

  const deleteEdge = useCallback((id) => {
    setEdges((prev) => prev.filter((e) => e.id !== id));
  }, []);

  const clearAll = useCallback(() => {
    setNodes([]); setEdges([]); setSelectedId(null);
  }, []);

  return { nodes, edges, selectedNode, selectNode, addNode, updateNodeData, updateNodePosition, deleteNode, addEdge, deleteEdge, clearAll };
}
