import { Link2, Unlink } from 'lucide-react';
import type { EvidenceChainItem } from '../types';

export function EvidenceChainPanel({ chain }: { chain: EvidenceChainItem[] }) {
  if (chain.length === 0) return null;

  return (
    <section className="card p-4">
      <div className="flex items-center gap-2 mb-1">
        <Link2 className="h-4 w-4 text-brand-600" />
        <h2 className="text-sm font-semibold text-slate-900">证据 ↔ 事实 ↔ 诉请 对应链</h2>
      </div>
      <p className="text-[10px] text-slate-500 mb-3">审核时核对各环节证据是否闭合</p>
      <ol className="space-y-2">
        {chain.map((item, i) => {
          const isGap = item.evidence_name.includes('缺失');
          return (
            <li
              key={`${item.evidence_name}-${i}`}
              className={`rounded-xl border p-3 text-xs ${
                isGap ? 'border-red-200 bg-red-50/80' : 'border-slate-100 bg-slate-50/80'
              }`}
            >
              <div className="flex items-start gap-2">
                {isGap ? (
                  <Unlink className="h-4 w-4 shrink-0 text-red-500 mt-0.5" />
                ) : (
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-[10px] font-bold text-emerald-700">
                    {i + 1}
                  </span>
                )}
                <div className="min-w-0 flex-1 space-y-1">
                  <p className={`font-semibold ${isGap ? 'text-red-700' : 'text-slate-800'}`}>
                    {item.evidence_name}
                  </p>
                  <p className="text-slate-600">
                    <span className="text-slate-400">事实 · </span>
                    {item.fact}
                  </p>
                  <p className="text-slate-600">
                    <span className="text-slate-400">诉请 · </span>
                    {item.claim}
                  </p>
                </div>
              </div>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
