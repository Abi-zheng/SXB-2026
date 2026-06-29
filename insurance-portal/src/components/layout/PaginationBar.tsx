import { ChevronLeft, ChevronRight } from 'lucide-react';

export function PaginationBar({
  page,
  totalPages,
  total,
  onPageChange,
}: {
  page: number;
  totalPages: number;
  total: number;
  onPageChange: (page: number) => void;
}) {
  if (total === 0) return null;

  return (
    <div className="flex items-center justify-between gap-2">
      <p className="text-[10px] text-slate-500 tabular-nums">
        共 {total} 条 · 第 {page}/{totalPages} 页
      </p>
      <div className="flex items-center gap-1">
        <button
          type="button"
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
          aria-label="上一页"
          className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-600 ring-1 ring-slate-200 disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <button
          type="button"
          disabled={page >= totalPages}
          onClick={() => onPageChange(page + 1)}
          aria-label="下一页"
          className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-600 ring-1 ring-slate-200 disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
