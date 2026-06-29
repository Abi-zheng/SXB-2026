import { useMemo, type ReactNode } from 'react';
import { useClientPagination } from '../../hooks/useClientPagination';
import { PaginationBar } from './PaginationBar';

export function PaginatedCardList<T>({
  items,
  rowKey,
  renderItem,
  pageSize = 6,
  empty,
  footerExtra,
}: {
  items: T[];
  rowKey: (item: T) => string;
  renderItem: (item: T) => ReactNode;
  pageSize?: number;
  empty?: ReactNode;
  footerExtra?: ReactNode;
}) {
  const { page, setPage, totalPages, pageItems, total } = useClientPagination(items, pageSize);

  if (items.length === 0) {
    return empty ?? null;
  }

  return (
    <>
      <ul className="space-y-3">
        {pageItems.map((item) => (
          <li key={rowKey(item)}>{renderItem(item)}</li>
        ))}
      </ul>
      {(totalPages > 1 || footerExtra) && (
        <div className="mt-3 space-y-2">
          {footerExtra}
          {totalPages > 1 && (
            <PaginationBar page={page} totalPages={totalPages} total={total} onPageChange={setPage} />
          )}
        </div>
      )}
    </>
  );
}

export function useFilteredPagination<T>(
  items: T[],
  pageSize: number,
  filterFn: (item: T) => boolean
) {
  const filtered = useMemo(() => items.filter(filterFn), [items, filterFn]);
  return useClientPagination(filtered, pageSize);
}
