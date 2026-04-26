// src/api/mockApi.js
// All API logic isolated here. Swap with real fetch() without touching components.

const AUTOMATIONS = [
  { id: 'send_email',   label: 'Send Email',        params: ['to', 'subject'] },
  { id: 'generate_doc', label: 'Generate Document', params: ['template', 'recipient'] },
];

const delay = (ms) => new Promise((r) => setTimeout(r, ms));

// GET /automations
export async function getAutomations() {
  await delay(400);
  return AUTOMATIONS;
}

// POST /simulate
export async function simulateWorkflow(nodes, edges) {
  await delay(800);

  const starts = nodes.filter((n) => n.type === 'start');
  const ends   = nodes.filter((n) => n.type === 'end');

  if (starts.length === 0) return { ok: false, error: 'Workflow must have a Start node.' };
  if (starts.length  > 1) return { ok: false, error: 'Only one Start node allowed.' };
  if (ends.length   === 0) return { ok: false, error: 'Workflow must have an End node.' };

  // Build adjacency list
  const adj = {};
  nodes.forEach((n) => (adj[n.id] = []));
  edges.forEach((e) => { if (adj[e.source]) adj[e.source].push(e.target); });

  // Cycle detection — DFS white/gray/black
  const WHITE = 0, GRAY = 1, BLACK = 2;
  const color = {};
  nodes.forEach((n) => (color[n.id] = WHITE));
  let hasCycle = false;
  function dfs(id) {
    color[id] = GRAY;
    for (const nb of adj[id] || []) {
      if (color[nb] === GRAY) { hasCycle = true; return; }
      if (color[nb] === WHITE) dfs(nb);
    }
    color[id] = BLACK;
  }
  nodes.forEach((n) => { if (color[n.id] === WHITE) dfs(n.id); });
  if (hasCycle) return { ok: false, error: 'Workflow contains a cycle.' };

  // BFS from start → execution order
  const nodeMap = Object.fromEntries(nodes.map((n) => [n.id, n]));
  const visited = new Set();
  const queue   = [starts[0].id];
  const order   = [];
  while (queue.length) {
    const id = queue.shift();
    if (visited.has(id)) continue;
    visited.add(id);
    order.push(id);
    (adj[id] || []).forEach((t) => queue.push(t));
  }

  const MSG = {
    start:     (n) => `Workflow "${n.data?.title || 'Untitled'}" started`,
    task:      (n) => `Task "${n.data?.title}" assigned to ${n.data?.assignee || 'Unassigned'}`,
    approval:  (n) => `Approval sent to ${n.data?.approverRole || 'Manager'}`,
    automated: (n) => `Running: ${n.data?.actionId || 'unknown action'}`,
    end:       (n) => n.data?.endMessage || 'Workflow complete',
  };

  const executionLog = order.map((id, i) => {
    const node = nodeMap[id];
    return {
      step: i + 1, nodeId: id, type: node?.type, status: 'done',
      message: MSG[node?.type]?.(node) ?? `Processed ${id}`,
    };
  });

  return { ok: true, result: { status: 'completed', totalSteps: executionLog.length, executionLog } };
}
