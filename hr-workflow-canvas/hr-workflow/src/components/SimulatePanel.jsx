// Sandbox / Test panel — serializes graph, calls POST /simulate, shows execution log
import { useState } from 'react';
import { simulateWorkflow } from '../api/mockApi';

export default function SimulatePanel({ nodes, edges, onClose }) {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError]   = useState(null);

  const run = async () => {
    setLoading(true);
    setResult(null);
    setError(null);

    const res = await simulateWorkflow({ nodes, edges });

    setLoading(false);
    if (res.ok) setResult(res.result);
    else setError(res.error);
  };

  const STATUS_COLOR = { done: '#22c55e', failed: '#ef4444', skipped: '#9ca3af' };

  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 999,
    }}>
      <div style={{
        background: '#fff', borderRadius: 10, width: 480, maxHeight: '80vh',
        display: 'flex', flexDirection: 'column', boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
        overflow: 'hidden',
      }}>
        {/* Header */}
        <div style={{ padding: '16px 20px', borderBottom: '1px solid #f3f4f6', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontWeight: 700, fontSize: 15 }}>Workflow Simulator</div>
            <div style={{ fontSize: 11, color: '#9ca3af', marginTop: 1 }}>{nodes.length} nodes · {edges.length} edges</div>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: 18, color: '#9ca3af', lineHeight: 1 }}>✕</button>
        </div>

        {/* Body */}
        <div style={{ padding: '16px 20px', overflowY: 'auto', flex: 1 }}>

          {/* Payload preview */}
          <div style={{ marginBottom: 14 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#555', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Payload (POST /simulate)</div>
            <pre style={{
              background: '#0f172a', color: '#86efac', fontSize: 10,
              padding: 12, borderRadius: 6, overflowX: 'auto', maxHeight: 120,
              lineHeight: 1.6,
            }}>
              {JSON.stringify({ nodes: nodes.map(n => ({ id: n.id, type: n.type, data: n.data })), edges: edges.map(e => ({ id: e.id, source: e.source, target: e.target })) }, null, 2)}
            </pre>
          </div>

          {/* Error */}
          {error && (
            <div style={{ background: '#fee2e2', border: '1px solid #fecaca', borderRadius: 6, padding: '10px 12px', fontSize: 13, color: '#dc2626', marginBottom: 12 }}>
              ✕ {error}
            </div>
          )}

          {/* Execution log */}
          {result && (
            <div>
              <div style={{ display: 'flex', gap: 10, marginBottom: 12 }}>
                <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 6, padding: '8px 12px', flex: 1, textAlign: 'center' }}>
                  <div style={{ fontSize: 11, color: '#16a34a', fontWeight: 700 }}>{result.status.toUpperCase()}</div>
                  <div style={{ fontSize: 10, color: '#9ca3af' }}>Status</div>
                </div>
                <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: 6, padding: '8px 12px', flex: 1, textAlign: 'center' }}>
                  <div style={{ fontSize: 11, color: '#1d4ed8', fontWeight: 700 }}>{result.totalSteps}</div>
                  <div style={{ fontSize: 10, color: '#9ca3af' }}>Steps</div>
                </div>
              </div>

              <div style={{ fontSize: 11, fontWeight: 700, color: '#555', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Execution Log</div>

              {result.executionLog.map((s) => (
                <div key={s.step} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', padding: '8px 0', borderBottom: '1px solid #f3f4f6' }}>
                  <div style={{
                    width: 22, height: 22, borderRadius: '50%', flexShrink: 0,
                    background: STATUS_COLOR[s.status] + '20',
                    color: STATUS_COLOR[s.status],
                    fontSize: 10, fontWeight: 700,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>{s.step}</div>
                  <div>
                    <div style={{ fontSize: 13 }}>{s.message}</div>
                    <div style={{ fontSize: 10, color: '#9ca3af', marginTop: 1, fontFamily: 'monospace' }}>{s.nodeId} · {s.type}</div>
                  </div>
                  <div style={{ marginLeft: 'auto', fontSize: 10, fontWeight: 700, color: STATUS_COLOR[s.status] }}>
                    {s.status}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{ padding: '12px 20px', borderTop: '1px solid #f3f4f6', display: 'flex', gap: 8 }}>
          <button
            onClick={run}
            disabled={loading}
            style={{
              flex: 1, padding: '9px', background: loading ? '#9ca3af' : '#1a1a2e',
              color: '#fff', border: 'none', borderRadius: 7, fontSize: 13, fontWeight: 600,
            }}
          >
            {loading ? '⟳ Running...' : '▶ Run Simulation'}
          </button>
          <button onClick={onClose} style={{ padding: '9px 16px', background: '#f3f4f6', border: 'none', borderRadius: 7, fontSize: 13, color: '#374151' }}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
