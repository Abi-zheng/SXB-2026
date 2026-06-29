import { Link } from 'react-router-dom';
import { Bell, ChevronRight } from 'lucide-react';
import type { OrderHallItem } from '../institution-types';
import { formatDateYmd } from '../utils/formatDate';

function completenessTone(percent: number): string {
  if (percent >= 80) return 'text-emerald-700 bg-emerald-50 ring-emerald-200';
  if (percent >= 60) return 'text-amber-700 bg-amber-50 ring-amber-200';
  return 'text-red-700 bg-red-50 ring-red-200';
}

export function OrderHallCaseCard({ item }: { item: OrderHallItem }) {
  const postedLabel = formatDateYmd(item.posted_at);
  const reasonTone = completenessTone(item.material_completeness_percent);

  return (
    <Link
      to={`/reminders/${item.case_id}`}
      className="card block overflow-hidden active:bg-slate-50"
    >
      <div className="flex items-center justify-between gap-2 border-b border-slate-100 bg-slate-50/80 px-3 py-2">
        <div className="flex items-center gap-1.5 min-w-0">
          <Bell className="h-3.5 w-3.5 shrink-0 text-brand-600" />
          <span className="text-[11px] font-semibold text-slate-700 truncate">
            {item.case_type}
          </span>
        </div>
        <span className="text-[10px] text-slate-400 shrink-0 tabular-nums">{postedLabel}</span>
      </div>

      <div className="p-3">
        <p className="text-[10px] font-medium text-brand-600 mb-2">信息卡</p>
        <dl className="grid grid-cols-2 gap-x-3 gap-y-2 text-[11px]">
          <div className="col-span-2">
            <dt className="text-slate-400">法院</dt>
            <dd className="font-medium text-slate-800 mt-0.5 leading-snug">{item.court}</dd>
          </div>
          <div>
            <dt className="text-slate-400">标的金额</dt>
            <dd className="font-semibold text-slate-900 mt-0.5 truncate">{item.claim_amount}</dd>
          </div>
          <div>
            <dt className="text-slate-400">案由</dt>
            <dd className="font-medium text-slate-800 mt-0.5 truncate">{item.case_type}</dd>
          </div>
          <div className="col-span-2">
            <dt className="text-slate-400">建议跟进理由</dt>
            <dd className="mt-1">
              <span
                className={`inline-flex items-center rounded-md px-2 py-0.5 text-[11px] font-semibold ring-1 ${reasonTone}`}
              >
                {item.follow_up_reason}
              </span>
            </dd>
          </div>
        </dl>

        <div className="mt-3 flex items-center justify-end text-[10px] text-brand-600 font-medium">
          查看详情
          <ChevronRight className="h-3 w-3" />
        </div>
      </div>
    </Link>
  );
}
