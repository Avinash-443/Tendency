// src/types.js
// All node type definitions live here.
// Adding a new node type = add one entry per object below.

export const NODE_COLORS = {
  start:     '#22c55e',
  task:      '#3b82f6',
  approval:  '#f59e0b',
  automated: '#8b5cf6',
  end:       '#ef4444',
};

export const NODE_LABELS = {
  start:     'Start Node',
  task:      'Task Node',
  approval:  'Approval Node',
  automated: 'Automated Step',
  end:       'End Node',
};

export const NODE_DESCRIPTIONS = {
  start:     'Workflow entry point',
  task:      'Human task step',
  approval:  'Approval gate',
  automated: 'System action',
  end:       'Workflow completion',
};

export const NODE_DEFAULTS = {
  start:     { title: 'New Workflow',  metadata: {} },
  task:      { title: 'New Task',      description: '', assignee: '', dueDate: '', customFields: {} },
  approval:  { title: 'Approval',      approverRole: 'Manager', autoApproveThreshold: 3 },
  automated: { title: 'Automated Step',actionId: '', params: {} },
  end:       { endMessage: 'Done',     summaryFlag: false },
};
