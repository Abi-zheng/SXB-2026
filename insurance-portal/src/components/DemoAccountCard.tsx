import { DEMO_ACCOUNTS } from '../demo-accounts';

const ROWS = [
  { label: '账号', value: DEMO_ACCOUNTS.phone },
  { label: '密码', value: DEMO_ACCOUNTS.password },
  { label: '验证码', value: DEMO_ACCOUNTS.smsCode },
  { label: '微信 code', value: DEMO_ACCOUNTS.wechatCode },
  {
    label: '机构',
    value: `${DEMO_ACCOUNTS.institutionName}（${DEMO_ACCOUNTS.institutionId}）`,
  },
] as const;

export function DemoAccountCard({
  onQuickLogin,
  loading,
}: {
  onQuickLogin?: () => void;
  loading?: boolean;
}) {
  return (
    <div className="rounded-xl border border-amber-200 bg-amber-50/80 px-3 py-2.5">
      <p className="text-[10px] font-semibold text-amber-800 mb-1.5">演示账号（明文 · 请用「登录」）</p>
      <dl className="space-y-1">
        {ROWS.map(({ label, value }) => (
          <div key={label} className="flex gap-2 text-[11px] leading-snug">
            <dt className="shrink-0 text-amber-700/80">{label}</dt>
            <dd className="font-mono font-medium text-amber-950 break-all">{value}</dd>
          </div>
        ))}
      </dl>
      {onQuickLogin && (
        <button
          type="button"
          disabled={loading}
          onClick={onQuickLogin}
          className="mt-2.5 w-full rounded-lg bg-amber-600 py-2 text-xs font-semibold text-white active:bg-amber-700 disabled:opacity-50 cursor-pointer"
        >
          {loading ? '登录中…' : '一键演示登录（账号密码）'}
        </button>
      )}
    </div>
  );
}
