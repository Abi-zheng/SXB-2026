import { Link } from 'react-router-dom';
import { ChevronRight, FileCheck2 } from 'lucide-react';
import type { CaseRecord } from '../types';
import {
  ORDER_STATUS_LABEL,
  getOrderStatus,
  orderStatusBadgeClass,
} from '../order-status';
import {
  ACCEPTANCE_LABEL,
  getAcceptanceSuggestion,
  getMaterialPercent,
  getPreservationAmount,
} from '../utils/caseHelpers';

export function OrderCard({ record }: { record: CaseRecord }) {
  const orderStatus = getOrderStatus(record);
  const statusLabel = ORDER_STATUS_LABEL[orderStatus];
  const statusClass = orderStatusBadgeClass(orderStatus);
  const suggestion = getAcceptanceSuggestion(record);
  const acceptMeta = ACCEPTANCE_LABEL[suggestion];
  const materialPct = getMaterialPercent(record);

  return (
    <Link to={`/cases/${record.id}`} className="card block overflow-hidden active:bg-slate-50">
      <div className="border-b border-slate-100 bg-slate-50/80 px-3 py-2 flex items-center justify-between gap-2">
        <span className={`rounded-md px-2 py-0.5 text-[10px] font-semibold ring-1 ${statusClass}`}>
          {statusLabel}
        </span>
        {record.guarantee_order?.id && (
          <span className="text-[10px] text-slate-400 truncate">{record.guarantee_order.id}</span>
        )}
      </div>

      <div className="p-3 space-y-3">
        <div className="rounded-xl bg-white ring-1 ring-slate-100 p-3">
          <p className="text-[10px] font-medium text-brand-600 mb-2">案件信息</p>
          <dl className="grid grid-cols-2 gap-x-3 gap-y-1.5 text-[11px]">
            <div>
              <dt className="text-slate-400">案由</dt>
              <dd className="font-medium text-slate-800 truncate">{record.case_basic?.case_type ?? '—'}</dd>
            </div>
            <div>
              <dt className="text-slate-400">标的</dt>
              <dd className="font-medium text-slate-800 truncate">{record.case_basic?.claim_amount ?? '—'}</dd>
            </div>
            <div>
              <dt className="text-slate-400">保全金额</dt>
              <dd className="font-medium text-slate-800 truncate">{getPreservationAmount(record)}</dd>
            </div>
            <div>
              <dt className="text-slate-400">法院</dt>
              <dd className="font-medium text-slate-800 truncate">
                {record.case_basic?.court ?? record.selected_court ?? '—'}
              </dd>
            </div>
          </dl>
          <p className="mt-2 text-xs font-semibold text-slate-900 leading-snug">
            {record.case_basic?.plaintiff} 诉 {record.case_basic?.defendant}
          </p>
        </div>

        <div className="flex gap-2">
          <div className="flex-1 rounded-xl bg-slate-50 p-2.5 ring-1 ring-slate-100">
            <div className="flex items-center gap-1 text-[10px] text-slate-500 mb-1">
              <FileCheck2 className="h-3 w-3" />
              材料完整度
            </div>
            <div className="flex items-center gap-2">
              <div className="h-1.5 flex-1 rounded-full bg-slate-200">
                <div
                  className={`h-full rounded-full ${
                    materialPct >= 80 ? 'bg-emerald-500' : materialPct >= 50 ? 'bg-amber-500' : 'bg-red-400'
                  }`}
                  style={{ width: `${Math.min(100, materialPct)}%` }}
                />
              </div>
              <span className="text-xs font-bold text-slate-800">{materialPct}%</span>
            </div>
          </div>
          <div className={`flex flex-col justify-center rounded-xl px-2.5 py-2 ring-1 text-center min-w-[72px] ${acceptMeta.className}`}>
            <span className="text-[10px] font-bold">{acceptMeta.text}</span>
          </div>
        </div>

        <div className="flex items-center justify-end">
          <ChevronRight className="h-4 w-4 text-slate-300" />
        </div>
      </div>
    </Link>
  );
}
