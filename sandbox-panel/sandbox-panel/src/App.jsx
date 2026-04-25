import { useState } from 'react';
import { simulateWorkflow } from './api/mockApi';
import './App.css';

// --- Sample workflows to test different cases ---
const SAMPLES = {
  valid: {
    label: '✓  Valid — Onboarding Workflow',
    workflow: {
      nodes: [
        { id: 'start-1',    type: 'start',     data: { title: 'Employee Onboarding' } },
        { id: 'task-1',     type: 'task',      data: { title: 'Collect Documents', assignee: 'HR Admin' } },
        { id: 'approval-1', type: 'approval',  data: { title: 'Manager Approval', approverRole: 'Manager' } },
        { id: 'auto-1',     type: 'automated', data: { title: 'Send Welcome Email', actionId: 'send_email' } },
        { id: 'end-1',      type: 'end',       data: { endMessage: 'Onboarding complete' } },
      ],
      edges: [
        { id: 'e1', source: 'start-1',    target: 'task-1' },
        { id: 'e2', source: 'task-1',     target: 'approval-1' },
        { id: 'e3', source: 'approval-1', target: 'auto-1' },
        { id: 'e4', source: 'auto-1',     target: 'end-1' },
      ],
    },
  },
  no_start: {
    label: '✕  Error — Missing Start Node',
    workflow: {
      nodes: [
        { id: 'task-1', type: 'task', data: { title: 'Some Task' } },
        { id: 'end-1',  type: 'end',  data: { endMessage: 'Done' } },
      ],
      edges: [{ id: 'e1', source: 'task-1', target: 'end-1' }],
    },
  },
  cycle: {
    label: '✕  Error — Cycle Detected',
    workflow: {
      nodes: [
        { id: 'start-1', type: 'start', data: { title: 'Start' } },
        { id: 'task-1',  type: 'task',  data: { title: 'Task A' } },
        { id: 'task-2',  type: 'task',  data: { title: 'Task B' } },
        { id: 'end-1',   type: 'end',   data: { endMessage: 'Done' } },
      ],
      edges: [
        { id: 'e1', source: 'start-1', target: 'task-1' },
        { id: 'e2', source: 'task-1',  target: 'task-2' },
        { id: 'e3', source: 'task-2',  target: 'task-1' }, // cycle
        { id: 'e4', source: 'task-2',  target: 'end-1' },
      ],
    },
  },
  disconnected: {
    label: '✕  Error — Disconnected Node',
    workflow: {
      nodes: [
        { id: 'start-1', type: 'start', data: { title: 'Start' } },
        { id: 'task-1',  type: 'task',  data: { title: 'Floating Task' } },
        { id: 'end-1',   type: 'end',   data: { endMessage: 'Done' } },
      ],
      edges: [{ id: 'e1', source: 'start-1', target: 'end-1' }],
    },
  },
};

const NODE_COLOR = {
  start: '#22c55e', task: '#3b82f6',
  approval: '#f59e0b', automated: '#8b5cf6', end: '#ef4444',
};

const NODE_ICON = {
  start: '▶', task: '☑', approval: '✔', automated: '⚙', end: '⏹',
};

export default function App() {
  const [activeKey, setActiveKey]   = useState('valid');
  const [jsonText, setJsonText]     = useState(JSON.stringify(SAMPLES.valid.workflow, null, 2));
  const [parseError, setParseError] = useState('');
  const [loading, setLoading]       = useState(false);
  const [result, setResult]         = useState(null);
  const [apiError, setApiError]     = useState('');

  const loadSample = (key) => {
    setActiveKey(key);
    setJsonText(JSON.stringify(SAMPLES[key].workflow, null, 2));
    setResult(null);
    setApiError('');
    setParseError('');
  };

  const runSimulation = async () => {
    setResult(null);
    setApiError('');
    setParseError('');

    let workflow;
    try {
      workflow = JSON.parse(jsonText);
    } catch (e) {
      setParseError('Invalid JSON: ' + e.message);
      return;
    }

    setLoading(true);
    const res = await simulateWorkflow(workflow);
    setLoading(false);

    if (res.ok) setResult(res.result);
    else        setApiError(res.error);
  };

  return (
    <div className="app">

      {/* Top bar */}
      <header className="topbar">
        <div className="topbar-left">
          <div className="logo">T</div>
          <div>
            <div className="topbar-title">HR Workflow Designer</div>
            <div className="topbar-sub">Workflow Sandbox Panel · Tredence Studio</div>
          </div>
        </div>
      </header>

      {/* Body — two columns */}
      <div className="body">

        {/* LEFT — payload input */}
        <div className="left">

          <p className="col-label">Sample Workflows</p>
          <div className="samples">
            {Object.entries(SAMPLES).map(([key, s]) => (
              <button
                key={key}
                className={`sample-btn ${activeKey === key ? 'sample-active' : ''}`}
                onClick={() => loadSample(key)}
              >
                {s.label}
              </button>
            ))}
          </div>

          <p className="col-label" style={{ marginTop: 16 }}>
            Workflow JSON &nbsp;
            <span className="col-hint">POST /simulate</span>
          </p>
          <textarea
            className="json-box"
            value={jsonText}
            spellCheck={false}
            onChange={(e) => {
              setJsonText(e.target.value);
              setResult(null);
              setApiError('');
              setParseError('');
            }}
          />
          {parseError && <div className="parse-err">{parseError}</div>}

          <button
            className="run-btn"
            onClick={runSimulation}
            disabled={loading}
          >
            {loading ? '⟳  Simulating...' : '▶  Run Simulation'}
          </button>
        </div>

        {/* RIGHT — result */}
        <div className="right">

          {!result && !apiError && !loading && (
            <div className="placeholder">
              <div style={{ fontSize: 36, marginBottom: 10 }}>⟳</div>
              Click <strong>Run Simulation</strong> to see the execution log
            </div>
          )}

          {loading && (
            <div className="placeholder">
              <div className="spinner" />
              <div style={{ marginTop: 12, fontSize: 13 }}>Simulating workflow...</div>
            </div>
          )}

          {/* Error */}
          {!loading && apiError && (
            <div className="err-box">
              <div className="err-title">✕ Simulation Failed</div>
              <div className="err-msg">{apiError}</div>
            </div>
          )}

          {/* Success */}
          {!loading && result && (
            <>
              {/* Summary */}
              <div className="summary-row">
                <div className="summary-card">
                  <div className="summary-val green">{result.status.toUpperCase()}</div>
                  <div className="summary-key">Status</div>
                </div>
                <div className="summary-card">
                  <div className="summary-val">{result.totalSteps}</div>
                  <div className="summary-key">Total Steps</div>
                </div>
                <div className="summary-card">
                  <div className="summary-val" style={{ fontSize: 12 }}>
                    {new Date(result.executedAt).toLocaleTimeString()}
                  </div>
                  <div className="summary-key">Executed At</div>
                </div>
              </div>

              {/* Execution log */}
              <p className="col-label" style={{ marginBottom: 10 }}>Execution Log</p>
              <div className="log-list">
                {result.executionLog.map((step, i) => {
                  const color = NODE_COLOR[step.type] || '#9ca3af';
                  const icon  = NODE_ICON[step.type]  || step.step;
                  const last  = i === result.executionLog.length - 1;
                  return (
                    <div key={step.step} className="log-item">
                      {/* Vertical connector */}
                      <div className="log-left">
                        <div
                          className="log-circle"
                          style={{ background: color + '20', color, border: `1.5px solid ${color}60` }}
                        >
                          {icon}
                        </div>
                        {!last && <div className="log-line" />}
                      </div>

                      {/* Content */}
                      <div className="log-content">
                        <div className="log-message">{step.message}</div>
                        <div className="log-meta">
                          {step.nodeId} · {step.type}
                          <span className="log-status" style={{ color }}>  {step.status}</span>
                        </div>
                      </div>

                      <div className="log-step">#{step.step}</div>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>

      </div>
    </div>
  );
}
