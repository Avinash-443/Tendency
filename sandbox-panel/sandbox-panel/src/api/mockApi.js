// POST /simulate — mock API as specified in the case study PDF

function delay(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

export async function simulateWorkflow(workflow) {
  await delay(700);

  const nodes = workflow.nodes || [];
  const edges = workflow.edges || [];

  // --- Validation ---

  if (nodes.length === 0)
    return { ok: false, error: 'No nodes found in workflow.' };

  const startNodes = nodes.filter((n) => n.type === 'start');
  const endNodes   = nodes.filter((n) => n.type === 'end');

  if (startNodes.length === 0)
    return { ok: false, error: 'Workflow must have a Start node.' };

  if (startNodes.length > 1)
    return { ok: false, error: 'Only one Start node is allowed.' };

  if (endNodes.length === 0)
    return { ok: false, error: 'Workflow must have an End node.' };

  // --- Build adjacency list ---
  const adj = {};
  nodes.forEach((n) => (adj[n.id] = []));
  edges.forEach((e) => {
    if (adj[e.source]) adj[e.source].push(e.target);
  });

  // --- Cycle detection via DFS ---
  const WHITE = 0, GRAY = 1, BLACK = 2;
  const color = {};
  nodes.forEach((n) => (color[n.id] = WHITE));
  let hasCycle = false;

  function dfs(id) {
    color[id] = GRAY;
    for (const neighbor of adj[id] || []) {
      if (color[neighbor] === GRAY) { hasCycle = true; return; }
      if (color[neighbor] === WHITE) dfs(neighbor);
    }
    color[id] = BLACK;
  }
  nodes.forEach((n) => { if (color[n.id] === WHITE) dfs(n.id); });

  if (hasCycle)
    return { ok: false, error: 'Workflow contains a cycle.' };

  // --- Check for disconnected nodes ---
  const targets = new Set(edges.map((e) => e.target));
  const sources = new Set(edges.map((e) => e.source));
  const floating = nodes.filter(
    (n) => n.type !== 'start' && n.type !== 'end'
          && !targets.has(n.id) && !sources.has(n.id)
  );
  if (floating.length > 0)
    return { ok: false, error: `Node "${floating[0].data?.title || floating[0].id}" has no connections.` };

  // --- BFS from start to get execution order ---
  const nodeMap = Object.fromEntries(nodes.map((n) => [n.id, n]));
  const visited = new Set();
  const queue   = [startNodes[0].id];
  const order   = [];

  while (queue.length) {
    const id = queue.shift();
    if (visited.has(id)) continue;
    visited.add(id);
    order.push(id);
    (adj[id] || []).forEach((t) => queue.push(t));
  }

  // --- Build execution log ---
  const getMessage = {
    start:     (n) => `Workflow "${n.data?.title || 'Untitled'}" started`,
    task:      (n) => `Task "${n.data?.title}" assigned to ${n.data?.assignee || 'Unassigned'}`,
    approval:  (n) => `Approval request sent to ${n.data?.approverRole || 'Manager'}`,
    automated: (n) => `Running action: ${n.data?.actionId || 'unknown'}`,
    end:       (n) => n.data?.endMessage || 'Workflow completed',
  };

  const executionLog = order.map((id, i) => {
    const node = nodeMap[id];
    const fn   = getMessage[node?.type];
    return {
      step:    i + 1,
      nodeId:  id,
      type:    node?.type,
      status:  'done',
      message: fn ? fn(node) : `Processed ${id}`,
    };
  });

  return {
    ok: true,
    result: {
      status:       'completed',
      totalSteps:   executionLog.length,
      executedAt:   new Date().toISOString(),
      executionLog,
    },
  };
}
