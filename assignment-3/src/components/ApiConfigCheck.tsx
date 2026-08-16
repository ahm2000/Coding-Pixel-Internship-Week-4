'use client';

import { useState } from 'react';

type Result = { status: 'ok'; apiBaseUrl: string } | { status: 'error'; message: string };

export default function ApiConfigCheck() {
  const [result, setResult] = useState<Result | null>(null);
  const [loading, setLoading] = useState(false);

  const check = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/config');
      const data = await res.json();
      setResult(data);
    } catch {
      setResult({ status: 'error', message: 'Request failed' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button
        onClick={check}
        disabled={loading}
        className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-xs font-medium text-slate-600 hover:border-violet-300 hover:text-violet-700 disabled:opacity-60 transition-colors"
      >
        {loading ? 'Checking...' : 'GET /api/config'}
      </button>
      {result && (
        <pre className="mt-3 text-xs bg-slate-900 text-slate-100 rounded-lg p-3 overflow-x-auto">
          {JSON.stringify(result, null, 2)}
        </pre>
      )}
    </div>
  );
}
