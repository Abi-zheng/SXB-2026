import { useState, type ReactNode } from 'react';
import { ChevronDown, SlidersHorizontal } from 'lucide-react';

export function CollapsibleFilterBar({
  summary,
  defaultOpen = false,
  actions,
  children,
}: {
  summary: string;
  defaultOpen?: boolean;
  actions?: ReactNode;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="rounded-xl bg-white ring-1 ring-slate-200/80 overflow-hidden">
      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="flex min-h-10 flex-1 items-center gap-2 px-3 py-2 text-left cursor-pointer"
        >
          <SlidersHorizontal className="h-4 w-4 shrink-0 text-slate-400" aria-hidden="true" />
          <span className="flex-1 truncate text-xs text-slate-600">
            {open ? '收起筛选' : summary}
          </span>
          <ChevronDown
            className={`h-4 w-4 shrink-0 text-slate-400 transition-transform ${open ? 'rotate-180' : ''}`}
            aria-hidden="true"
          />
        </button>
        {actions}
      </div>
      {open && <div className="border-t border-slate-100 px-3 py-3 space-y-2">{children}</div>}
    </div>
  );
}
