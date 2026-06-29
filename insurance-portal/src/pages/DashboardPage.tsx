import { useCallback, useEffect, useState } from 'react';
import { RefreshCw, Timer } from 'lucide-react';
import { fetchDashboardStats, listInstitutionCases } from '../api';
import { OrderCard } from '../components/OrderCard';
import { CollapsibleFilterBar } from '../components/layout/CollapsibleFilterBar';
import { PageShell } from '../components/layout/PageShell';
import { PaginationBar } from '../components/layout/PaginationBar';
import { useClientPagination } from '../hooks/useClientPagination';
import { useAuth } from '../auth/AuthContext';
import {
  ORDER_TAB_LABEL,
  type DashboardStats,
  type OrderListTab,
} from '../order-status';
import type { CaseRecord } from '../types';

const ORDER_TABS: OrderListTab[] = ['all', 'pending_review', 'issued', 'surrender'];
const PAGE_SIZE = 6;

export default function DashboardPage() {
  const { profile } = useAuth();
  const [cases, setCases] = useState<CaseRecord[]>([]);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [tab, setTab] = useState<OrderListTab>('all');

  const load = useCallback(async () => {
    setLoadError('');
    try {
      const [data, dash] = await Promise.all([
        listInstitutionCases({ orderTab: tab }),
        fetchDashboardStats(),
      ]);
      setCases(data.filter((c) => c.status !== 'parsing' && c.status !== 'draft'));
      setStats(dash);
    } catch (e) {
      setLoadError(e instanceof Error ? e.message : '无法连接 Mock API');
    } finally {
      setLoading(false);
    }
  }, [tab]);

  useEffect(() => {
    setLoading(true);
    load();
    const timer = setInterval(load, 4000);
    return () => clearInterval(timer);
  }, [load]);

  const institutionName =
    stats?.institution_name ?? profile?.institution_name ?? '金融机构';

  const { page, setPage, totalPages, pageItems, total } = useClientPagination(cases, PAGE_SIZE);

  return (
    <PageShell
      bottomInset="nav"
      footer={
        total > 0 ? (
          <PaginationBar page={page} totalPages={totalPages} total={total} onPageChange={setPage} />
        ) : null
      }
      header={
        <>
          <div>
            <p className="text-[10px] font-medium uppercase tracking-wider text-brand-600">工作台</p>
            <h1 className="mt-0.5 text-lg font-bold text-slate-900 leading-snug">{institutionName}</h1>
          </div>

          <div className="card p-4">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
                <Timer className="h-5 w-5" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold text-slate-900">机构订单处理时效</p>
                <p className="mt-1 text-[11px] text-slate-500 leading-relaxed">
                  推送给本机构订单的
                  <span className="font-semibold text-brand-600"> 平均出函时效 </span>
                  （推送 → 出函成功）
                </p>
                <p className="mt-2 text-2xl font-bold text-slate-900">
                  {stats?.avg_issue_hours ?? '—'}
                  <span className="ml-1 text-sm font-medium text-slate-500">小时</span>
                </p>
              </div>
            </div>
            <div className="mt-3 grid grid-cols-3 gap-2 border-t border-slate-100 pt-3">
              {[
                { label: '全部订单', value: stats?.total_orders ?? 0 },
                { label: '待审核', value: stats?.pending_review_count ?? 0 },
                { label: '已出函', value: stats?.issued_count ?? 0 },
              ].map((s) => (
                <div key={s.label} className="text-center">
                  <p className="text-base font-bold text-slate-900">{s.value}</p>
                  <p className="text-[10px] text-slate-500">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </>
      }
      filter={
        <CollapsibleFilterBar
          summary={`筛选：${ORDER_TAB_LABEL[tab]}`}
          actions={
            <button
              type="button"
              onClick={load}
              aria-label="刷新"
              className="mr-2 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-slate-400 active:bg-slate-100 cursor-pointer"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
          }
        >
          <div className="flex flex-wrap gap-1">
            {ORDER_TABS.map((key) => (
              <button
                key={key}
                type="button"
                onClick={() => setTab(key)}
                className={`rounded-md px-3 py-2 text-xs font-medium cursor-pointer whitespace-nowrap ${
                  tab === key ? 'bg-brand-600 text-white shadow-sm' : 'bg-slate-100 text-slate-600'
                }`}
              >
                {ORDER_TAB_LABEL[key]}
              </button>
            ))}
          </div>
        </CollapsibleFilterBar>
      }
    >
      {loadError && (
        <div className="mb-3 rounded-xl border border-red-200 bg-red-50 px-3 py-2.5 text-xs text-red-700">
          {loadError}
        </div>
      )}

      {loading && cases.length === 0 && !loadError ? (
        <div className="flex justify-center py-16">
          <span className="h-7 w-7 animate-spin rounded-full border-2 border-slate-200 border-t-brand-600" />
        </div>
      ) : cases.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center">
          <p className="text-sm text-slate-500">暂无{ORDER_TAB_LABEL[tab]}订单</p>
          <p className="mt-1 text-[10px] text-slate-400">用户端提交后按状态出现在对应列表</p>
        </div>
      ) : (
        <ul className="space-y-3">
          {pageItems.map((c) => (
            <li key={c.id}>
              <OrderCard record={c} />
            </li>
          ))}
        </ul>
      )}
    </PageShell>
  );
}
