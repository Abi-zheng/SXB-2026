import { Link, useLocation } from 'react-router-dom';
import { Bell, Building2, LayoutDashboard, UserRound } from 'lucide-react';
import { useOrderHallBadge } from '../hooks/useOrderHallBadge';

const TABS = [
  { to: '/', label: '工作台', icon: LayoutDashboard, match: (p: string) => p === '/' },
  {
    to: '/reminders',
    label: '提醒中心',
    icon: Bell,
    match: (p: string) => p === '/reminders' || p.startsWith('/reminders/'),
    badge: true,
  },
  { to: '/mine', label: '我的', icon: UserRound, match: (p: string) => p === '/mine' },
] as const;

export default function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const pathname = location.pathname;
  const isDetail =
    pathname.startsWith('/cases/') ||
    pathname.startsWith('/mine/scope') ||
    pathname.startsWith('/mine/certification') ||
    pathname.startsWith('/reminders/');
  const showNav = !isDetail;
  const badgeCount = useOrderHallBadge();

  return (
    <div className="app-shell">
      <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/95 backdrop-blur-xl">
        <div className="flex h-12 items-center gap-2.5 px-4">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-600">
            <Building2 className="h-4 w-4 text-white" aria-hidden="true" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-slate-900">诉讼保</p>
            <p className="truncate text-[10px] text-slate-500">机构端 · 移动端小程序</p>
          </div>
        </div>
      </header>

      <main className="flex min-h-0 flex-1 flex-col overflow-hidden">
        {children}
      </main>

      {showNav && (
        <nav
          className="safe-bottom fixed bottom-0 left-1/2 z-50 w-full max-w-md -translate-x-1/2 border-t border-slate-200/80 bg-white/98 backdrop-blur-xl"
          aria-label="主导航"
        >
          <div className="flex h-[52px]">
            {TABS.map(({ to, label, icon: Icon, match, ...rest }) => {
              const active = match(pathname);
              const showBadge = 'badge' in rest && rest.badge && badgeCount > 0;
              return (
                <Link
                  key={to}
                  to={to}
                  className={`relative flex flex-1 flex-col items-center justify-center gap-0.5 text-[10px] font-medium ${
                    active ? 'text-brand-600' : 'text-slate-400'
                  }`}
                >
                  <span className="relative">
                    <Icon className="h-[22px] w-[22px]" strokeWidth={active ? 2.25 : 1.75} />
                    {showBadge && (
                      <span className="absolute -right-1.5 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-violet-600 px-0.5 text-[9px] font-bold text-white">
                        {badgeCount > 9 ? '9+' : badgeCount}
                      </span>
                    )}
                  </span>
                  {label}
                </Link>
              );
            })}
          </div>
        </nav>
      )}
    </div>
  );
}

export function PageHeader({
  title,
  description,
}: {
  title: string;
  description?: string;
}) {
  return (
    <div className="mb-4">
      <p className="mb-1 text-[10px] font-medium uppercase tracking-wider text-brand-600">
        预审系统
      </p>
      <h1 className="text-lg font-bold text-slate-900">{title}</h1>
      {description && <p className="mt-0.5 text-xs text-slate-500">{description}</p>}
    </div>
  );
}
