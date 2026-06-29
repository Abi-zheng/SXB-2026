import type { ReactNode } from 'react';
import { StickyFormFooter } from './StickyFormFooter';

export type PageBottomInset = 'nav' | 'sticky' | 'none';

const SCROLL_PB: Record<PageBottomInset, string> = {
  nav: 'pb-3',
  sticky: 'pb-[calc(5.5rem+env(safe-area-inset-bottom))]',
  none: 'pb-4',
};

const SHELL_PB: Record<PageBottomInset, string> = {
  nav: 'pb-[calc(3.25rem+env(safe-area-inset-bottom))]',
  sticky: '',
  none: '',
};

export function PageShell({
  header,
  filter,
  footer,
  stickyFooter,
  bottomInset = 'nav',
  children,
  className = '',
}: {
  header?: ReactNode;
  filter?: ReactNode;
  footer?: ReactNode;
  stickyFooter?: ReactNode;
  bottomInset?: PageBottomInset;
  children: ReactNode;
  className?: string;
}) {
  const inset = stickyFooter ? 'sticky' : bottomInset;
  const scrollPb = SCROLL_PB[inset];
  const shellPb = stickyFooter ? '' : SHELL_PB[bottomInset];

  return (
    <div className={`partition-shell animate-fade-in ${shellPb} ${className}`}>
      {(header || filter) && (
        <div className="shrink-0 space-y-3 border-b border-slate-200/60 bg-slate-50 px-4 pt-4 pb-3">
          {header}
          {filter}
        </div>
      )}

      <div className={`scroll-region px-4 pt-3 ${scrollPb}`}>{children}</div>

      {footer && (
        <div className="shrink-0 border-t border-slate-200/80 bg-white/95 px-4 py-2.5 safe-bottom">
          {footer}
        </div>
      )}

      {stickyFooter && <StickyFormFooter>{stickyFooter}</StickyFormFooter>}
    </div>
  );
}
