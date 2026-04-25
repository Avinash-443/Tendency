// Mock API layer — mirrors what a real backend would return.
// GET /automations and POST /simulate as specified in the case study.

const AUTOMATIONS = [
  { id: 'send_email',   label: 'Send Email',        params: ['to', 'subject'] },
  { id: 'generate_doc', label: 'Generate Document', params: ['template', 'recipient'] },
];

function delay(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

export async function getAutomations() {
  await delay(400);
  return AUTOMATIONS;
}

export async function simulateWorkflow(workflow) {
  await delay(700);

  const { nodes = [], edges = [] } = workflow;

  // Validate
  const startNodes = nodes.filter((n) => n.type === 'startNode');
  const endNodes   = nodes.filter((n) => n.type === 'endNode');

  if (startNodes.length === 0)
    return { ok: false, error: 'Workflow must have a Start node.' };
  if (endNodes.length === 0)
    return { ok: false, error: 'Workflow must have an End node.' };

  // BFS to get execution order
  const adj = {};
  nodes.forEach((n) => (adj[n.id] = []));
  edges.forEach((e) => { if (adj[e.source]) adj[e.source].push(e.target); });

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

  const messages = {
    startNode:    (n) => `Workflow "${n.data?.title || 'Untitled'}" started`,
    taskNode:     (n) => `Task "${n.data?.title}" assigned to ${n.data?.assignee || 'Unassigned'}`,
    approvalNode: (n) => `Approval sent to ${n.data?.approverRole || 'Manager'}`,
    automatedNode:(n) => `Running action: ${n.data?.actionId || 'unknown'}`,
    endNode:      (n) => n.data?.endMessage || 'Workflow completed',
  };

  const executionLog = order.map((id, i) => {
    const node = nodeMap[id];
    const msg  = messages[node?.type];
    return {
      step:    i + 1,
      nodeId:  id,
      type:    node?.type,
      status:  'done',
      message: msg ? msg(node) : `Processed ${id}`,
    };
  });

  return {
    ok: true,
    result: {
      workflowId:   `wf_${Date.now()}`,
      status:       'completed',
      totalSteps:   executionLog.length,
      executedAt:   new Date().toISOString(),
      executionLog,
    },
  };
}
