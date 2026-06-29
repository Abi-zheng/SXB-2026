import { useCallback, useState } from 'react';
import { ShieldCheck } from 'lucide-react';
import { BottomSheet } from './BottomSheet';
import { DEMO_ACCOUNTS } from '../demo-accounts';

/** 演示环境模拟微信「获取手机号」授权弹窗；正式环境可替换为 wx.getPhoneNumber */
export function WechatAuthSheet({
  open,
  mode,
  onClose,
  onAuthorized,
}: {
  open: boolean;
  mode: 'login' | 'register';
  onClose: () => void;
  onAuthorized: (code: string, phonePreview: string) => void;
}) {
  const [authorizing, setAuthorizing] = useState(false);

  const handleAllow = useCallback(async () => {
    setAuthorizing(true);
    await new Promise((r) => setTimeout(r, 600));
    if (mode === 'login') {
      onAuthorized(DEMO_ACCOUNTS.wechatCode, DEMO_ACCOUNTS.phone);
    } else {
      const tail = String(Date.now()).slice(-8);
      const phone = `139${tail}`.slice(0, 11);
      onAuthorized(`wx_phone:${phone}`, phone);
    }
    setAuthorizing(false);
    onClose();
  }, [mode, onAuthorized, onClose]);

  return (
    <BottomSheet open={open} onClose={onClose} title="微信授权">
      <div className="space-y-4 pb-2">
        <div className="flex items-center gap-3 rounded-2xl bg-[#07C160]/10 p-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#07C160] text-white text-lg font-bold">
            微
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-900">诉讼保机构端</p>
            <p className="text-xs text-slate-500">申请获取你的手机号</p>
          </div>
        </div>
        {mode === 'login' && (
          <p className="rounded-lg bg-slate-50 px-3 py-2 text-xs text-slate-700">
            演示绑定手机号：
            <span className="ml-1 font-mono font-semibold">{DEMO_ACCOUNTS.phone}</span>
          </p>
        )}
        <p className="text-xs leading-relaxed text-slate-500">
          {mode === 'login'
            ? '用于验证机构账号身份，快捷登录预审工作台。'
            : '用于创建机构账号并绑定手机号，完成一键注册。'}
        </p>
        <div className="flex gap-2 pt-1">
          <button
            type="button"
            onClick={onClose}
            disabled={authorizing}
            className="flex-1 rounded-xl border border-slate-200 py-3 text-sm font-medium text-slate-600 cursor-pointer"
          >
            拒绝
          </button>
          <button
            type="button"
            onClick={handleAllow}
            disabled={authorizing}
            className="flex-1 rounded-xl bg-[#07C160] py-3 text-sm font-semibold text-white active:bg-[#06ad56] disabled:opacity-60 cursor-pointer"
          >
            {authorizing ? '授权中…' : '允许'}
          </button>
        </div>
        <p className="text-[10px] text-center text-slate-400">
          演示环境模拟微信 getPhoneNumber；正式版将调用微信开放能力
        </p>
      </div>
    </BottomSheet>
  );
}

export function WechatPhoneButton({
  mode,
  loading,
  disabled,
  onClick,
}: {
  mode: 'login' | 'register';
  loading?: boolean;
  disabled?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      disabled={disabled || loading}
      onClick={onClick}
      className="flex w-full items-center justify-center gap-2.5 rounded-xl bg-[#07C160] py-3.5 text-sm font-semibold text-white shadow-sm active:bg-[#06ad56] disabled:opacity-50 cursor-pointer"
    >
      {loading ? (
        <>
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
          微信授权中…
        </>
      ) : (
        <>
          <ShieldCheck className="h-5 w-5" strokeWidth={2} />
          {mode === 'login' ? '微信手机号一键登录' : '微信手机号一键注册'}
        </>
      )}
    </button>
  );
}
