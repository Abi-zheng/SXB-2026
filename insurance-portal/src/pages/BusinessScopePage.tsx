import { useEffect, useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { ArrowLeft, MapPin, Save, Shield } from 'lucide-react';
import { updateProfile } from '../api';
import { useAuth } from '../auth/AuthContext';
import { PageShell } from '../components/layout/PageShell';
import {
  CASE_TYPE_OPTIONS,
  COURT_KEYWORD_PRESETS,
  type BusinessScope,
} from '../institution-types';

export default function BusinessScopePage() {
  const { profile, refreshProfile } = useAuth();
  const [scope, setScope] = useState<BusinessScope | null>(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (profile) setScope({ ...profile.business_scope });
  }, [profile]);

  if (profile && profile.certification_status !== 'verified') {
    return <Navigate to="/mine/certification" replace />;
  }

  const toggleCaseType = (t: string) => {
    if (!scope) return;
    setScope({
      ...scope,
      case_types: scope.case_types.includes(t)
        ? scope.case_types.filter((x) => x !== t)
        : [...scope.case_types, t],
    });
  };

  const toggleCourtKeyword = (k: string) => {
    if (!scope) return;
    setScope({
      ...scope,
      court_keywords: scope.court_keywords.includes(k)
        ? scope.court_keywords.filter((x) => x !== k)
        : [...scope.court_keywords, k],
    });
  };

  const handleSave = async () => {
    if (!scope) return;
    setSaving(true);
    setError('');
    setMessage('');
    try {
      await updateProfile({ business_scope: scope });
      await refreshProfile();
      setMessage('已保存。不在范围内的订单将自动不做推送。');
    } catch (e) {
      setError(e instanceof Error ? e.message : '保存失败');
    } finally {
      setSaving(false);
    }
  };

  if (!profile || !scope) {
    return (
      <div className="flex flex-1 items-center justify-center py-16">
        <span className="h-7 w-7 animate-spin rounded-full border-2 border-slate-200 border-t-brand-600" />
      </div>
    );
  }

  return (
    <PageShell
      bottomInset="none"
      header={
        <>
          <Link
            to="/mine"
            className="inline-flex items-center gap-1 text-xs text-slate-500 active:text-brand-600"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            返回我的
          </Link>
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-brand-600" />
            <h1 className="text-lg font-bold text-slate-900">编辑业务范围</h1>
          </div>
        </>
      }
      stickyFooter={
        <button
          type="button"
          disabled={saving}
          onClick={handleSave}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-brand-600 py-3 text-sm font-semibold text-white disabled:opacity-50 cursor-pointer"
        >
          <Save className="h-4 w-4" />
          {saving ? '保存中…' : '保存'}
        </button>
      }
    >
      <section className="card p-4 space-y-4">
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={scope.enabled}
            onChange={(e) => setScope({ ...scope, enabled: e.target.checked })}
            className="rounded border-slate-300 text-brand-600"
          />
          <span className="text-slate-800">开启承接业务</span>
        </label>

        <div>
          <p className="text-xs font-medium text-slate-700 mb-2 flex items-center gap-1">
            <MapPin className="h-3.5 w-3.5" />
            服务法院区域
          </p>
          <div className="flex flex-wrap gap-1.5">
            {COURT_KEYWORD_PRESETS.map((k) => (
              <button
                key={k}
                type="button"
                onClick={() => toggleCourtKeyword(k)}
                className={`rounded-lg px-2.5 py-1 text-[11px] font-medium cursor-pointer ${
                  scope.court_keywords.includes(k)
                    ? 'bg-brand-600 text-white'
                    : 'bg-slate-100 text-slate-600'
                }`}
              >
                {k}
              </button>
            ))}
          </div>
        </div>

        <div>
          <p className="text-xs font-medium text-slate-700 mb-2">承接案由（不选=全部）</p>
          <div className="flex flex-wrap gap-1.5">
            {CASE_TYPE_OPTIONS.map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => toggleCaseType(t)}
                className={`rounded-lg px-2 py-1 text-[10px] font-medium cursor-pointer ${
                  scope.case_types.includes(t)
                    ? 'bg-brand-600 text-white'
                    : 'bg-slate-100 text-slate-600'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-[10px] text-slate-500">最低标的（元）</label>
            <input
              type="number"
              value={scope.min_amount}
              onChange={(e) =>
                setScope({ ...scope, min_amount: Number(e.target.value) || 0 })
              }
              className="mt-1 w-full rounded-lg border border-slate-200 px-2 py-1.5 text-xs"
            />
          </div>
          <div>
            <label className="text-[10px] text-slate-500">最高标的（元）</label>
            <input
              type="number"
              value={scope.max_amount}
              onChange={(e) =>
                setScope({ ...scope, max_amount: Number(e.target.value) || 0 })
              }
              className="mt-1 w-full rounded-lg border border-slate-200 px-2 py-1.5 text-xs"
            />
          </div>
        </div>

        {message && (
          <p className="text-xs text-emerald-700 bg-emerald-50 rounded-lg px-3 py-2">{message}</p>
        )}
        {error && (
          <p className="text-xs text-red-700 bg-red-50 rounded-lg px-3 py-2">{error}</p>
        )}
      </section>
    </PageShell>
  );
}
