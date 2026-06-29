import type { CaseTimelineNode, RiskLevel } from '../types';
import { ANOMALY_LABEL } from '../types';

export function CaseTimeline({
  nodes,
  compact = false,
}: {
  nodes: CaseTimelineNode[];
  compact?: boolean;
}) {
  if (!nodes.length) return null;

  return (
    <div className={compact ? 'mt-2' : 'mt-3'}>
      <div className="flex items-center justify-between gap-0.5">
        {nodes.map((node, i) => (
          <div key={node.stage} className="flex flex-1 flex-col items-center min-w-0">
            <div className="flex w-full items-center">
              {i > 0 && (
                <div
                  className={`h-0.5 flex-1 ${node.anomalies.length ? 'bg-amber-300' : 'bg-slate-200'}`}
                />
              )}
              <div
                className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[10px] font-bold ${
                  node.anomalies.length
                    ? 'bg-amber-100 text-amber-700 ring-1 ring-amber-300'
                    : 'bg-brand-100 text-brand-600'
                }`}
              >
                {i + 1}
              </div>
              {i < nodes.length - 1 && (
                <div className="h-0.5 flex-1 bg-slate-200" />
              )}
            </div>
            <span className="mt-1 truncate text-[10px] font-medium text-slate-500 w-full text-center">
              {node.stage_label}
            </span>
          </div>
        ))}
      </div>

      {!compact && (
        <div className="mt-3 space-y-2">
          {nodes.map((node) => (
            <div
              key={node.stage}
              className={`rounded-xl border p-3 ${
                node.anomalies.length
                  ? 'border-amber-200 bg-amber-50'
                  : 'border-slate-200 bg-slate-50'
              }`}
            >
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="rounded bg-slate-200 px-1.5 py-0.5 text-[10px] font-medium text-slate-600">
                  {node.stage_label}
                </span>
                <time className="text-[10px] text-brand-600">{node.date}</time>
                {node.anomalies.map((a) => (
                  <span
                    key={a}
                    className="rounded bg-amber-100 px-1.5 py-0.5 text-[10px] font-medium text-amber-700"
                  >
                    {ANOMALY_LABEL[a]}
                  </span>
                ))}
              </div>
              <p className="mt-1.5 text-xs leading-relaxed text-slate-600">{node.event}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export function riskLevelBadge(level: RiskLevel) {
  const map = {
    high: 'bg-red-50 text-red-700 border-red-200',
    medium: 'bg-amber-50 text-amber-700 border-amber-200',
    low: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  };
  const label = { high: '高风险', medium: '中风险', low: '低风险' };
  return (
    <span
      className={`rounded-full border px-2 py-0.5 text-[10px] font-semibold ${map[level]}`}
    >
      {label[level]}
    </span>
  );
}
