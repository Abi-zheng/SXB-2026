import { Link } from 'react-router-dom';
import {
  BadgeCheck,
  Building2,
  ChevronRight,
  LogOut,
  Shield,
  UserRound,
} from 'lucide-react';
import { PageShell } from '../components/layout/PageShell';
import { useAuth } from '../auth/AuthContext';
import { useConfirm } from '../hooks/useConfirm';

export default function ProfilePage() {
  const { profile, logout } = useAuth();
  const { ask, dialog } = useConfirm();

  const handleLogout = async () => {
    const confirmed = await ask({
      title: '退出登录',
      message: '确定要退出当前账号吗？',
      confirmLabel: '退出',
      destructive: true,
    });
    if (confirmed) logout();
  };

  if (!profile) {
    return (
      <div className="flex flex-1 items-center justify-center py-16">
        <span className="h-7 w-7 animate-spin rounded-full border-2 border-slate-200 border-t-brand-600" />
      </div>
    );
  }

  const verified = profile.certification_status === 'verified';
  const cert = profile.certification;

  return (
    <PageShell
      bottomInset="nav"
      header={
        <div>
          <p className="mb-1 text-[10px] font-medium uppercase tracking-wider text-brand-600">预审系统</p>
          <h1 className="text-lg font-bold text-slate-900">我的</h1>
          <p className="mt-0.5 text-xs text-slate-500">
            {verified ? '机构 · 业务范围' : '完成认证后开通机构服务'}
          </p>
        </div>
      }
    >
      <div className="space-y-4">
        <section className="card overflow-hidden">
          <div className="bg-gradient-to-r from-brand-600 to-brand-500 px-4 py-4">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/20">
                <UserRound className="h-5 w-5 text-white" />
              </div>
              <div className="text-white min-w-0">
                <p className="text-sm font-bold truncate">
                  {verified && cert ? cert.enterprise_name : profile.contact_name}
                </p>
                <p className="text-[11px] text-white/80">{profile.phone}</p>
              </div>
            </div>
          </div>
        </section>

        <Link
          to="/mine/certification"
          className="card flex items-center gap-3 px-4 py-3.5 active:bg-slate-50"
        >
          <div
            className={`flex h-9 w-9 items-center justify-center rounded-lg ${
              verified ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
            }`}
          >
            <BadgeCheck className="h-4 w-4" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium text-slate-900">机构认证</p>
            <p className="text-[11px] text-slate-500">
              {verified ? '已认证 · 查看基本信息' : '未认证 · 提交企业资料'}
            </p>
          </div>
          <span
            className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold ${
              verified
                ? 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200'
                : 'bg-amber-50 text-amber-700 ring-1 ring-amber-200'
            }`}
          >
            {verified ? '已认证' : '未认证'}
          </span>
          <ChevronRight className="h-4 w-4 text-slate-300 shrink-0" />
        </Link>

        {verified && cert && (
          <section className="card p-4">
            <div className="flex items-center gap-2 mb-3">
              <Building2 className="h-4 w-4 text-brand-600" />
              <h2 className="text-sm font-bold text-slate-900">机构信息</h2>
            </div>
            <dl className="space-y-2 text-xs">
              <div>
                <dt className="text-slate-400">企业名称</dt>
                <dd className="font-medium text-slate-900 mt-0.5">{cert.enterprise_name}</dd>
              </div>
              <div>
                <dt className="text-slate-400">统一社会信用代码</dt>
                <dd className="font-mono text-slate-700 mt-0.5">{cert.unified_social_credit_code}</dd>
              </div>
              <div>
                <dt className="text-slate-400">经营地区</dt>
                <dd className="text-slate-800 mt-0.5">{cert.operating_region}</dd>
              </div>
              <div>
                <dt className="text-slate-400">企业类型</dt>
                <dd className="text-slate-800 mt-0.5">{cert.enterprise_type}</dd>
              </div>
              <div>
                <dt className="text-slate-400">注册资本</dt>
                <dd className="text-slate-800 mt-0.5">{cert.registered_capital_wan} 万元</dd>
              </div>
              <div>
                <dt className="text-slate-400">法定代表人</dt>
                <dd className="text-slate-800 mt-0.5">{cert.legal_representative}</dd>
              </div>
            </dl>
          </section>
        )}

        {verified && (
          <Link
            to="/mine/scope"
            className="card flex items-center gap-3 px-4 py-3.5 active:bg-slate-50"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-50 text-brand-600">
              <Shield className="h-4 w-4" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-slate-900">业务范围</p>
              <p className="text-[11px] text-slate-500 truncate">
                {profile.business_scope.enabled
                  ? `已开启 · ${profile.business_scope.court_keywords.join('、') || '全国'}`
                  : '已暂停承接'}
              </p>
            </div>
            <ChevronRight className="h-4 w-4 text-slate-300 shrink-0" />
          </Link>
        )}

        <button
          type="button"
          onClick={handleLogout}
          className="card flex w-full items-center justify-between px-4 py-3 text-sm text-red-600 active:bg-red-50 cursor-pointer"
        >
          <span className="flex items-center gap-2">
            <LogOut className="h-4 w-4" />
            退出登录
          </span>
          <ChevronRight className="h-4 w-4 text-red-300" />
        </button>
      </div>

      {dialog}
    </PageShell>
  );
}
