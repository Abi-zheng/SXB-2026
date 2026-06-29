import type { ReactNode } from 'react';

export function StickyFormFooter({
  children,
  className = '',
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`safe-bottom fixed bottom-0 left-1/2 z-50 w-full max-w-md -translate-x-1/2 border-t border-slate-200/80 bg-white/98 px-4 py-3 backdrop-blur-xl ${className}`}
    >
      {children}
    </div>
  );
}
