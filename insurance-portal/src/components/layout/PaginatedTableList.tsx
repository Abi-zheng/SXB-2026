import type { ReactNode } from 'react';
import { useClientPagination } from '../../hooks/useClientPagination';
import { PaginationBar } from './PaginationBar';

export interface TableColumn<T> {
  key: string;
  header: string;
  className?: string;
  render: (row: T) => ReactNode;
}

export function PaginatedTableList<T>({
  items,
  columns,
  rowKey,
  pageSize = 8,
  emptyMessage = '暂无数据',
}: {
  items: T[];
  columns: TableColumn<T>[];
  rowKey: (row: T) => string;
  pageSize?: number;
  emptyMessage?: string;
}) {
  const { page, setPage, totalPages, pageItems, total } = useClientPagination(items, pageSize);

  if (items.length === 0) {
    return <p className="py-6 text-center text-xs text-slate-500">{emptyMessage}</p>;
  }

  return (
    <div className="space-y-2">
      <div className="overflow-hidden rounded-xl ring-1 ring-slate-100">
        <table className="w-full text-left text-[11px]">
          <thead className="bg-slate-50 text-[10px] text-slate-500">
            <tr>
              {columns.map((col) => (
                <th key={col.key} className={`px-3 py-2 font-medium ${col.className ?? ''}`}>
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 bg-white">
            {pageItems.map((row) => (
              <tr key={rowKey(row)} className="align-top">
                {columns.map((col) => (
                  <td key={col.key} className={`px-3 py-2.5 ${col.className ?? ''}`}>
                    {col.render(row)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {totalPages > 1 && (
        <PaginationBar page={page} totalPages={totalPages} total={total} onPageChange={setPage} />
      )}
    </div>
  );
}
