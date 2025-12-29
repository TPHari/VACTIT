"use client";

import React, { useEffect, useState } from 'react';

type Result = {
  id: string;
  created_at: string;
  thetas: number[] | null;
  items: Array<any>;
  meta?: any;
};

export default function IrtResultsPage() {
  const [results, setResults] = useState<Result[]>([]);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState<Result | null>(null);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    fetch('/api/irt')
      .then((r) => r.json())
      .then((j) => {
        if (!mounted) return;
        if (j.ok && Array.isArray(j.data)) setResults(j.data);
        else setResults([]);
      })
      .catch((e) => { console.error(e); setResults([]); })
      .finally(() => { if (mounted) setLoading(false); });
    return () => { mounted = false; };
  }, []);

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h2 className="text-2xl font-semibold mb-4">IRT Results</h2>
      <div className="mb-4">
        <button onClick={() => { setLoading(true); fetch('/api/irt').then(r=>r.json()).then(j=>{ if (j.ok) setResults(j.data); }).finally(()=>setLoading(false)); }} className="px-3 py-2 bg-blue-600 text-white rounded">Refresh</button>
      </div>

      {loading ? <div>Loading…</div> : (
        <div className="bg-white rounded shadow p-4">
          {results.length === 0 ? <div className="text-slate-500">No results yet.</div> : (
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-slate-600">
                  <th className="p-2">ID</th>
                  <th className="p-2">Created</th>
                  <th className="p-2">Sections</th>
                  <th className="p-2">Items total</th>
                  <th className="p-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {results.map(r => (
                  <tr key={r.id} className="border-t">
                    <td className="p-2 align-middle">{r.id}</td>
                    <td className="p-2">{new Date(r.created_at).toLocaleString()}</td>
                    <td className="p-2">{Array.isArray(r.items) ? r.items.map((s:any)=>s.section).join(', ') : '-'}</td>
                    <td className="p-2">{Array.isArray(r.items) ? r.items.reduce((acc:any, s:any)=> acc + (Array.isArray(s.items) ? s.items.length : 0), 0) : 0}</td>
                    <td className="p-2">
                      <button onClick={() => setSelected(r)} className="text-blue-600 mr-2">View</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {selected && (
        <div className="fixed inset-0 bg-black/40 flex items-start justify-center p-8 z-50">
          <div className="bg-white w-full max-w-3xl rounded shadow p-6 overflow-auto max-h-[80vh]">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium">Result: {selected.id}</h3>
              <button onClick={() => setSelected(null)}>✖︎</button>
            </div>
            <div className="text-sm mb-4">
              <div><strong>Created:</strong> {new Date(selected.created_at).toLocaleString()}</div>
            </div>
            <div>
              <h4 className="font-medium mb-2">Items by section</h4>
              {Array.isArray(selected.items) && selected.items.map((sec:any, idx:number) => (
                <div key={idx} className="mb-4">
                  <div className="font-semibold">Section: {sec.section}</div>
                  <pre className="bg-slate-100 p-2 rounded text-xs overflow-auto">{JSON.stringify(sec.items, null, 2)}</pre>
                </div>
              ))}
            </div>
            <div className="mt-4">
              <h4 className="font-medium mb-2">Raw meta</h4>
              <pre className="bg-slate-100 p-2 rounded text-xs overflow-auto">{JSON.stringify(selected.meta?.raw ?? selected.meta, null, 2)}</pre>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
