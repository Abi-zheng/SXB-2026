import { CheckCircle2, Circle, AlertCircle } from 'lucide-react';
import type { EvidenceStructure } from '../types';

const STATUS_ICON = {
  established: CheckCircle2,
  partial: AlertCircle,
  missing: Circle,
};

const STATUS_COLOR = {
  established: 'text-emerald-600 bg-emerald-50',
  partial: 'text-amber-600 bg-amber-50',
  missing: 'text-slate-400 bg-slate-50',
};

export function EvidenceStructurePanel({ structure }: { structure: EvidenceStructure }) {
  return (
    <section className="card p-4">
      <h2 className="text-sm font-semibold text-slate-900">证据结构 · 四节点事实链</h2>
      <p className="mt-0.5 text-[10px] text-slate-500">{structure.case_type}</p>

      <ol className="mt-3 space-y-2">
        {structure.fact_nodes.map((node, i) => {
          const Icon = STATUS_ICON[node.status];
          return (
            <li
              key={node.key}
              className={`flex gap-3 rounded-xl p-3 ${STATUS_COLOR[node.status]}`}
            >
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white text-xs font-bold">
                {i + 1}
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <Icon className="h-4 w-4 shrink-0" />
                  <span className="text-sm font-medium">{node.label}</span>
                </div>
                <p className="mt-0.5 text-xs opacity-80">{node.description}</p>
                {node.evidence_refs.length > 0 && (
                  <p className="mt-1 text-[10px] truncate opacity-70">
                    依据：{node.evidence_refs.join('、')}
                  </p>
                )}
              </div>
            </li>
          );
        })}
      </ol>

      {structure.case_specific_checks.length > 0 && (
        <div className="mt-4 border-t border-slate-100 pt-3">
          <p className="text-xs font-medium text-slate-600">案由专项证据检查</p>
          <ul className="mt-2 space-y-1.5">
            {structure.case_specific_checks.map((c) => (
              <li key={c.label} className="flex items-start gap-2 text-xs">
                <span
                  className={
                    c.status === 'present'
                      ? 'text-emerald-600'
                      : c.status === 'partial'
                        ? 'text-amber-600'
                        : 'text-red-500'
                  }
                >
                  {c.status === 'present' ? '✓' : c.status === 'partial' ? '△' : '✗'}
                </span>
                <span className="text-slate-700">
                  {c.label}
                  <span className="text-slate-400"> — {c.note}</span>
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}
