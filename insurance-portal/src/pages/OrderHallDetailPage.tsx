import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, Bell, ShieldCheck } from 'lucide-react';
import { fetchOrderHallDetail } from '../api';
import { PageShell } from '../components/layout/PageShell';
import type { OrderHallBasicDetail } from '../institution-types';
import { formatDateYmd } from '../utils/formatDate';

const ASSIGNMENT_HINT: Record<OrderHallBasicDetail['assignment'], string> = {
  open: '用户尚未指定金融机构，当前仅可查看基础摘要。',
  assigned_other: '该订单已指定其他金融机构，当前仅可查看基础摘要。',
  assigned_me: '用户已指定本机构承保，可进入工作台进行完整审核。',
};

function completenessTone(percent: number): string {
  if (percent >= 80) return 'text-emerald-700 bg-emerald-50 ring-emerald-200';
  if (percent >= 60) return 'text-amber-700 bg-amber-50 ring-amber-200';
  return 'text-red-700 bg-red-50 ring-red-200';
}

export default function OrderHallDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [detail, setDetail] = useState<OrderHallBasicDetail | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    fetchOrderHallDetail(id)
      .then(setDetail)
      .catch((e) => setError(e instanceof Error ? e.message : '加载失败'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="flex flex-1 items-center justify-center py-16">
        <span className="h-7 w-7 animate-spin rounded-full border-2 border-slate-200 border-t-brand-600" />
      </div>
    );
  }

  if (error || !detail) {
    return (
      <p className="m-4 rounded-xl bg-red-50 px-3 py-2.5 text-sm text-red-700" role="alert">
        {error || '提醒不存在'}
      </p>
    );
  }

  const reasonTone = completenessTone(detail.material_completeness_percent);

  return (
    <PageShell
      bottomInset="none"
      header={
        <>
          <Link
            to="/reminders"
            className="inline-flex items-center gap-1 text-xs text-slate-500 active:text-brand-600"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            返回提醒中心
          </Link>

          <div className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 flex gap-2">
            <Bell className="h-4 w-4 text-brand-600 shrink-0 mt-0.5" />
            <p className="text-[11px] text-slate-600 leading-relaxed">
              {ASSIGNMENT_HINT[detail.assignment]}
            </p>
          </div>
        </>
      }
    >
      <div className="space-y-3">
        {!detail.in_my_scope && (
          <div className="rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-[11px] text-amber-800">
            该案件不在当前业务范围配置内，仅供浏览基础摘要。
          </div>
        )}

        <div className="card p-4">
          <div className="flex items-center gap-2 mb-3">
            <h1 className="text-sm font-bold text-slate-900">{detail.case_type}</h1>
            <span className="ml-auto text-[10px] text-slate-400 tabular-nums">
              {formatDateYmd(detail.posted_at)}
            </span>
          </div>

          <dl className="grid grid-cols-2 gap-x-3 gap-y-3 text-[11px]">
            <div className="col-span-2">
              <dt className="text-slate-400">法院</dt>
              <dd className="font-medium text-slate-900 mt-0.5">{detail.court}</dd>
            </div>
            <div>
              <dt className="text-slate-400">标的金额</dt>
              <dd className="text-base font-bold text-slate-900 mt-0.5">{detail.claim_amount}</dd>
            </div>
            <div>
              <dt className="text-slate-400">案由</dt>
              <dd className="font-medium text-slate-900 mt-0.5">{detail.case_type}</dd>
            </div>
            <div className="col-span-2">
              <dt className="text-slate-400">建议跟进理由</dt>
              <dd className="mt-1">
                <span
                  className={`inline-flex items-center rounded-md px-2 py-0.5 text-[11px] font-semibold ring-1 ${reasonTone}`}
                >
                  {detail.follow_up_reason}
                </span>
              </dd>
            </div>
            {detail.preservation_type_label && (
              <div className="col-span-2">
                <dt className="text-slate-400">保全类型</dt>
                <dd className="font-medium text-slate-900 mt-0.5">{detail.preservation_type_label}</dd>
              </div>
            )}
          </dl>
        </div>

        {detail.assignment === 'assigned_me' && (
          <Link
            to={`/cases/${detail.case_id}`}
            className="btn-primary flex items-center justify-center gap-2 min-h-12 rounded-xl bg-brand-600 text-white text-sm font-semibold"
          >
            <ShieldCheck className="h-4 w-4" />
            进入完整审核
          </Link>
        )}
      </div>
    </PageShell>
  );
}
