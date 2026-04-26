// src/components/SimulatePanel.jsx
// Sandbox panel — serializes graph, calls POST /simulate, shows execution log.

import { useSimulate } from '../hooks/useSimulate';
import { NODE_COLORS } from '../types';

const ICON = { start: '▶', task: '☑', approval: '✔', automated: '⚙', end: '⏹' };

export default function SimulatePanel({ nodes, edges, onClose }) {
  const { loading, result, error, run } = useSimulate();

  const payload = {
    nodes: nodes.map((n) => ({ id: n.id, type: n.type, data: n.data })),
    edges: edges.map((e) => ({ id: e.id, source: e.source, target: e.target })),
  };

  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 999,
    }}>
      <div style={{
        background: '#fff', borderRadius: 10, width: 500, maxHeight: '85vh',
        display: 'flex', flexDirection: 'column', boxShadow: '0 20px 60px rgba(0,0,0,0.25)',
        overflow: 'hidden',
      }}>
        {/* Header */}
        <div style={{
          padding: '15px 20px', borderBottom: '1px solid #f3f4f6',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0,
        }}>
          <div>
            <div style={{ fontWeight: 700, fontSize: 15 }}>Workflow Sandbox</div>
            <div style={{ fontSize: 11, color: '#9ca3af', marginTop: 1 }}>
              {nodes.length} nodes · {edges.length} edges
            </div>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: 20, color: '#9ca3af', cursor: 'pointer', lineHeight: 1 }}>✕</button>
        </div>

        {/* Body */}
        <div style={{ padding: '16px 20px', overflowY: 'auto', flex: 1 }}>

          {/* Payload */}
          <div style={{ marginBottom: 14 }}>
            <div style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em', color: '#6b7280', marginBottom: 6 }}>
              Payload (POST /simulate)
            </div>
            <pre style={{
              background: '#0f172a', color: '#86efac', fontSize: 10, padding: 12,
              borderRadius: 7, overflowX: 'auto', maxHeight: 130, lineHeight: 1.7,
              whiteSpace: 'pre-wrap', margin: 0,
            }}>
              {JSON.stringify(payload, null, 2)}
            </pre>
          </div>

          {/* Error */}
          {error && (
            <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 7, padding: '11px 14px', marginBottom: 12 }}>
              <div style={{ fontWeight: 700, color: '#dc2626', marginBottom: 3, fontSize: 13 }}>✕ Simulation Failed</div>
              <div style={{ fontSize: 12, color: '#7f1d1d' }}>{error}</div>
            </div>
          )}

          {/* Result */}
          {result && (
            <div>
              <div style={{ display: 'flex', gap: 10, marginBottom: 14 }}>
                {[
                  { label: 'Status', value: result.status.toUpperCase(), color: '#22c55e' },
                  { label: 'Steps',  value: result.totalSteps },
                ].map((c) => (
                  <div key={c.label} style={{
                    flex: 1, background: '#f9fafb', border: '1px solid #e5e7eb',
                    borderRadius: 7, padding: '10px 12px', textAlign: 'center',
                  }}>
                    <div style={{ fontWeight: 700, fontSize: 14, color: c.color || '#111827', marginBottom: 2 }}>{c.value}</div>
                    <div style={{ fontSize: 10, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{c.label}</div>
                  </div>
                ))}
              </div>

              <div style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em', color: '#6b7280', marginBottom: 8 }}>
                Execution Log
              </div>
              <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 8, overflow: 'hidden' }}>
                {result.executionLog.map((step, i) => {
                  const color = NODE_COLORS[step.type] || '#9ca3af';
                  const last  = i === result.executionLog.length - 1;
                  return (
                    <div key={step.step} style={{ display: 'flex', gap: 12, alignItems: 'flex-start', padding: '11px 14px', borderBottom: last ? 'none' : '1px solid #f3f4f6' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>
                        <div style={{
                          width: 28, height: 28, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                          background: color + '20', color, border: `1.5px solid ${color}60`, fontSize: 12,
                        }}>
                          {ICON[step.type] || step.step}
                        </div>
                        {!last && <div style={{ width: 1, flex: 1, minHeight: 14, background: '#e5e7eb', marginTop: 4 }} />}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 13, fontWeight: 500, color: '#111827', marginBottom: 2 }}>{step.message}</div>
                        <div style={{ fontSize: 10, color: '#9ca3af', fontFamily: 'monospace' }}>
                          {step.nodeId} · {step.type}
                          <span style={{ color, fontWeight: 700 }}> {step.status}</span>
                        </div>
                      </div>
                      <div style={{ fontSize: 10, color: '#d1d5db', fontFamily: 'monospace', paddingTop: 5 }}>#{step.step}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{ padding: '12px 20px', borderTop: '1px solid #f3f4f6', display: 'flex', gap: 8, flexShrink: 0 }}>
          <button
            onClick={() => run(nodes, edges)}
            disabled={loading}
            style={{
              flex: 1, padding: '9px', background: loading ? '#9ca3af' : '#1a1a2e',
              color: '#fff', border: 'none', borderRadius: 7, fontSize: 13,
              fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer', fontFamily: 'inherit',
            }}
          >
            {loading ? '⟳  Running...' : '▶  Run Simulation'}
          </button>
          <button onClick={onClose} style={{
            padding: '9px 16px', background: '#f3f4f6', border: 'none',
            borderRadius: 7, fontSize: 13, cursor: 'pointer', fontFamily: 'inherit', color: '#374151',
          }}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
