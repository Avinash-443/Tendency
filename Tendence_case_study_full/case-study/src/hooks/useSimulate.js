// src/hooks/useSimulate.js
// Custom hook — owns simulate API call state.

import { useState, useCallback } from 'react';
import { simulateWorkflow } from '../api/mockApi';

export function useSimulate() {
  const [loading, setLoading] = useState(false);
  const [result,  setResult]  = useState(null);
  const [error,   setError]   = useState('');

  const run = useCallback(async (nodes, edges) => {
    setLoading(true); setResult(null); setError('');
    const res = await simulateWorkflow(nodes, edges);
    setLoading(false);
    if (res.ok) setResult(res.result);
    else        setError(res.error);
  }, []);

  const reset = useCallback(() => { setResult(null); setError(''); }, []);

  return { loading, result, error, run, reset };
}
