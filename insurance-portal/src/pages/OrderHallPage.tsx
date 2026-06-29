import { useCallback, useEffect, useMemo, useState } from 'react';
import { Bell } from 'lucide-react';
import { fetchOrderHall } from '../api';
import { OrderHallCaseCard } from '../components/OrderHallCaseCard';
import { CollapsibleFilterBar } from '../components/layout/CollapsibleFilterBar';
import { PageShell } from '../components/layout/PageShell';
import { PaginationBar } from '../components/layout/PaginationBar';
import { useClientPagination } from '../hooks/useClientPagination';
import type { OrderHallItem } from '../institution-types';

type ScopeFilter = 'all' | 'in_scope' | 'out_scope';
type AssignmentFilter = 'all' | 'open' | 'assigned_me';

const PAGE_SIZE = 6;

const SCOPE_LABEL: Record<ScopeFilter, string> = {
  all: '全部范围',
  in_scope: '业务范围内',
  out_scope: '范围外',
};

const ASSIGNMENT_LABEL: Record<AssignmentFilter, string> = {
  all: '全部指派',
  open: '未指定机构',
  assigned_me: '指定本机构',
};

export default function OrderHallPage() {
  const [items, setItems] = useState<OrderHallItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [scopeFilter, setScopeFilter] = useState<ScopeFilter>('all');
  const [assignmentFilter, setAssignmentFilter] = useState<AssignmentFilter>('all');

  const load = useCallback(async () => {
    setError('');
    try {
      const data = await fetchOrderHall();
      setItems(data.items);
    } catch (e) {
      setError(e instanceof Error ? e.message : '加载失败');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    setLoading(true);
    load();
    const timer = setInterval(load, 6000);
    return () => clearInterval(timer);
  }, [load]);

  const filtered = useMemo(() => {
    return items.filter((item) => {
      if (scopeFilter === 'in_scope' && !item.in_my_scope) return false;
      if (scopeFilter === 'out_scope' && item.in_my_scope) return false;
      if (assignmentFilter === 'open' && item.assignment !== 'open') return false;
      if (assignmentFilter === 'assigned_me' && item.assignment !== 'assigned_me') return false;
      return true;
    });
  }, [items, scopeFilter, assignmentFilter]);

  const { page, setPage, totalPages, pageItems, total } = useClientPagination(filtered, PAGE_SIZE);

  const filterSummary = `${SCOPE_LABEL[scopeFilter]} · ${ASSIGNMENT_LABEL[assignmentFilter]}`;

  return (
    <PageShell
      bottomInset="nav"
      footer={
        total > 0 ? (
          <PaginationBar page={page} totalPages={totalPages} total={total} onPageChange={setPage} />
        ) : null
      }
      header={
        <div>
          <h1 className="text-lg font-bold text-slate-900">提醒中心</h1>
          <p className="mt-0.5 text-[11px] text-slate-500">跟进建议与材料完整度提醒</p>
        </div>
      }
      filter={
        <CollapsibleFilterBar summary={`筛选：${filterSummary}`}>
          <div className="space-y-2">
            <div>
              <p className="mb-1.5 text-[10px] font-medium text-slate-500">业务范围</p>
              <div className="flex flex-wrap gap-1">
                {(Object.keys(SCOPE_LABEL) as ScopeFilter[]).map((key) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setScopeFilter(key)}
                    className={`rounded-md px-2.5 py-1.5 text-[11px] font-medium cursor-pointer ${
                      scopeFilter === key ? 'bg-brand-600 text-white' : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {SCOPE_LABEL[key]}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <p className="mb-1.5 text-[10px] font-medium text-slate-500">指派状态</p>
              <div className="flex flex-wrap gap-1">
                {(Object.keys(ASSIGNMENT_LABEL) as AssignmentFilter[]).map((key) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setAssignmentFilter(key)}
                    className={`rounded-md px-2.5 py-1.5 text-[11px] font-medium cursor-pointer ${
                      assignmentFilter === key ? 'bg-brand-600 text-white' : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {ASSIGNMENT_LABEL[key]}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </CollapsibleFilterBar>
      }
    >
      {error && (
        <p className="mb-3 rounded-xl bg-red-50 px-3 py-2 text-xs text-red-700 ring-1 ring-red-200" role="alert">
          {error}
        </p>
      )}

      {loading && items.length === 0 ? (
        <div className="flex justify-center py-16">
          <span className="h-7 w-7 animate-spin rounded-full border-2 border-slate-200 border-t-brand-600" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="card flex flex-col items-center py-12 text-center">
          <Bell className="h-10 w-10 text-slate-300 mb-3" />
          <p className="text-sm font-medium text-slate-600">暂无符合条件的提醒</p>
          <p className="mt-1 text-[11px] text-slate-400">调整筛选条件或等待新提醒</p>
        </div>
      ) : (
        <ul className="space-y-3">
          {pageItems.map((item) => (
            <li key={item.id}>
              <OrderHallCaseCard item={item} />
            </li>
          ))}
        </ul>
      )}
    </PageShell>
  );
}
