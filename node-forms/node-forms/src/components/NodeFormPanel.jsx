import StartForm    from '../forms/StartForm';
import TaskForm     from '../forms/TaskForm';
import ApprovalForm from '../forms/ApprovalForm';
import AutomatedForm from '../forms/AutomatedForm';
import EndForm      from '../forms/EndForm';

// Maps node type → form component
const FORM_MAP = {
  start:    StartForm,
  task:     TaskForm,
  approval: ApprovalForm,
  automated: AutomatedForm,
  end:      EndForm,
};

const TYPE_LABEL = {
  start:    'Start Node',
  task:     'Task Node',
  approval: 'Approval Node',
  automated: 'Automated Step',
  end:      'End Node',
};

const NODE_COLOR = {
  start:    '#22c55e',
  task:     '#3b82f6',
  approval: '#f59e0b',
  automated:'#8b5cf6',
  end:      '#ef4444',
};

export default function NodeFormPanel({ node, onUpdate }) {
  if (!node) {
    return (
      <div className="panel panel-empty">
        <div className="empty-state">
          <span className="empty-icon">☝</span>
          <span>Select a node from the list to edit its fields</span>
        </div>
      </div>
    );
  }

  const Form  = FORM_MAP[node.type];
  const color = NODE_COLOR[node.type];

  return (
    <div className="panel">
      {/* Panel header */}
      <div className="panel-header" style={{ borderTop: `3px solid ${color}` }}>
        <div className="panel-header-left">
          <span className="node-dot" style={{ background: color }} />
          <span className="panel-title">{TYPE_LABEL[node.type]}</span>
        </div>
        <span className="node-id">{node.id}</span>
      </div>

      {/* Form body */}
      <div className="panel-body">
        {Form
          ? <Form data={node.data} onChange={(newData) => onUpdate(node.id, newData)} />
          : <p style={{ color: '#9ca3af', fontSize: 12 }}>No form for this node type.</p>
        }
      </div>
    </div>
  );
}
