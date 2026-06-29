import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Building2, Landmark, Shield, Wallet } from 'lucide-react';
import { useAuth } from '../auth/AuthContext';
import { DemoAccountCard } from '../components/DemoAccountCard';
import { LegalSheet } from '../components/LegalSheet';
import { WechatPhoneButton } from '../components/WechatPhoneAuth';
import { DEMO_ACCOUNTS } from '../demo-accounts';
import { sendSmsCode } from '../api';
import { StickyFormFooter } from '../components/layout/StickyFormFooter';

type AuthMode = 'login' | 'register';
type AuthMethod = 'wechat' | 'sms' | 'password';
type InstitutionCategory = 'insurance' | 'bank' | 'guarantee';

const CATEGORY_OPTIONS = [
  { key: 'insurance' as const, label: '保险', icon: Shield },
  { key: 'bank' as const, label: '银行', icon: Landmark },
  { key: 'guarantee' as const, label: '担保', icon: Wallet },
];

const METHOD_OPTIONS: { key: AuthMethod; label: string }[] = [
  { key: 'wechat', label: '微信快捷' },
  { key: 'sms', label: '验证码' },
  { key: 'password', label: '账号密码' },
];

export default function LoginPage() {
  const navigate = useNavigate();
  const { loginViaWechat, loginViaSms, loginViaPassword } = useAuth();
  const [mode, setMode] = useState<AuthMode>('login');
  const [method, setMethod] = useState<AuthMethod>('password');
  const [category, setCategory] = useState<InstitutionCategory>('insurance');
  const [phone, setPhone] = useState<string>(DEMO_ACCOUNTS.phone);
  const [code, setCode] = useState<string>(DEMO_ACCOUNTS.smsCode);
  const [password, setPassword] = useState<string>(DEMO_ACCOUNTS.password);
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  const [smsHint, setSmsHint] = useState('');
  const [countdown, setCountdown] = useState(0);
  const [error, setError] = useState('');
  const [legal, setLegal] = useState<'terms' | 'privacy' | null>(null);

  useEffect(() => {
    if (countdown <= 0) return;
    const t = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [countdown]);

  useEffect(() => {
    if (mode !== 'login') {
      if (method === 'sms') {
        setPhone('');
        setCode('');
      }
      if (method === 'password') {
        setPhone('');
        setPassword('');
      }
      return;
    }
    if (method === 'sms') {
      setPhone(DEMO_ACCOUNTS.phone);
      setCode(DEMO_ACCOUNTS.smsCode);
    } else if (method === 'password') {
      setPhone(DEMO_ACCOUNTS.phone);
      setPassword(DEMO_ACCOUNTS.password);
    }
  }, [mode, method]);

  const finishAuth = async (fn: () => Promise<unknown>) => {
    setLoading(true);
    setError('');
    try {
      await fn();
      navigate('/', { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : '操作失败');
    } finally {
      setLoading(false);
    }
  };

  const handleWechatClick = () => {
    if (mode === 'register') {
      const tail = String(Date.now()).slice(-8);
      const p = `139${tail}`.slice(0, 11);
      void finishAuth(() =>
        loginViaWechat({
          code: `wx_phone:${p}`,
          mode: 'register',
          institution_category: category,
        })
      );
      return;
    }
    void finishAuth(() =>
      loginViaWechat({ code: DEMO_ACCOUNTS.wechatCode, mode: 'login' })
    );
  };

  const handleSendSms = async () => {
    if (phone.length !== 11) {
      setError('请输入 11 位手机号');
      return;
    }
    setError('');
    try {
      const res = await sendSmsCode(phone);
      setSmsHint(res.message);
      setCountdown(60);
    } catch (e) {
      setError(e instanceof Error ? e.message : '发送失败');
    }
  };

  const handleSmsSubmit = () => {
    if (phone.length !== 11) {
      setError('请输入 11 位手机号');
      return;
    }
    if (!code.trim()) {
      setError('请输入验证码');
      return;
    }
    if (mode === 'register' && phone === DEMO_ACCOUNTS.phone) {
      setError('演示账号已注册，请切换到「登录」');
      return;
    }
    void finishAuth(() =>
      loginViaSms({
        phone,
        code: code.trim(),
        mode,
        institution_category: mode === 'register' ? category : undefined,
      })
    );
  };

  const handlePasswordSubmit = () => {
    if (phone.length !== 11) {
      setError('请输入 11 位手机号');
      return;
    }
    if (!password.trim()) {
      setError('请输入密码');
      return;
    }
    if (mode === 'register') {
      if (password.length < 6) {
        setError('密码至少 6 位');
        return;
      }
      if (password !== passwordConfirm) {
        setError('两次输入的密码不一致');
        return;
      }
      if (phone === DEMO_ACCOUNTS.phone) {
        setError('演示账号已注册，请切换到「登录」');
        return;
      }
    }
    void finishAuth(() =>
      loginViaPassword({
        phone,
        password: password.trim(),
        mode,
        institution_category: mode === 'register' ? category : undefined,
      })
    );
  };

  const handleQuickDemoLogin = () => {
    setMode('login');
    setMethod('password');
    setPhone(DEMO_ACCOUNTS.phone);
    setPassword(DEMO_ACCOUNTS.password);
    void finishAuth(() =>
      loginViaPassword({
        phone: DEMO_ACCOUNTS.phone,
        password: DEMO_ACCOUNTS.password,
        mode: 'login',
      })
    );
  };

  const submitLabel =
    method === 'sms'
      ? loading
        ? '处理中…'
        : mode === 'login'
          ? '验证码登录'
          : '验证码注册'
      : method === 'password'
        ? loading
          ? '处理中…'
          : mode === 'login'
            ? '账号密码登录'
            : '账号密码注册'
        : '';

  const handleStickySubmit = () => {
    if (method === 'sms') handleSmsSubmit();
    else if (method === 'password') handlePasswordSubmit();
    else handleWechatClick();
  };

  return (
    <div className="app-shell h-[100dvh] bg-gradient-to-b from-brand-50 to-slate-50">
      <div className="partition-shell">
        <div className="shrink-0 space-y-3 px-5 pt-8 pb-3">
          <div className="text-center">
            <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-600 shadow-lg shadow-brand-600/25">
              <Building2 className="h-7 w-7 text-white" />
            </div>
            <h1 className="text-xl font-bold text-slate-900">诉讼保 · 机构端</h1>
            <p className="mt-1 text-sm text-slate-500">移动端（小程序）预审工作台</p>
          </div>

          <div className="flex rounded-xl bg-slate-100 p-1">
            {(['login', 'register'] as const).map((key) => (
              <button
                key={key}
                type="button"
                onClick={() => { setMode(key); setError(''); }}
                className={`flex-1 rounded-lg py-2.5 text-sm font-semibold cursor-pointer ${
                  mode === key ? 'bg-white text-brand-600 shadow-sm' : 'text-slate-500'
                }`}
              >
                {key === 'login' ? '登录' : '注册'}
              </button>
            ))}
          </div>

          <div className="flex rounded-lg bg-slate-100 p-0.5">
            {METHOD_OPTIONS.map(({ key, label }) => (
              <button
                key={key}
                type="button"
                onClick={() => setMethod(key)}
                className={`flex-1 rounded-md py-2 text-[11px] font-medium cursor-pointer ${
                  method === key ? 'bg-white text-brand-600 shadow-sm' : 'text-slate-500'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <div className="scroll-region px-5 pb-[calc(5.5rem+env(safe-area-inset-bottom))]">
          <div className="card space-y-4 p-5">
            <DemoAccountCard onQuickLogin={handleQuickDemoLogin} loading={loading} />
            {mode === 'register' && (
              <div>
                <label className="text-xs font-medium text-slate-600">机构类型</label>
                <div className="mt-2 grid grid-cols-3 gap-2">
                  {CATEGORY_OPTIONS.map(({ key, label, icon: Icon }) => (
                    <button
                      key={key}
                      type="button"
                      onClick={() => setCategory(key)}
                      className={`flex flex-col items-center gap-1 rounded-xl border py-3 text-xs font-medium cursor-pointer ${
                        category === key
                          ? 'border-brand-500 bg-brand-50 text-brand-700'
                          : 'border-slate-200 text-slate-600'
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                      {label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {method === 'sms' ? (
              <div className="space-y-3">
                <input
                  type="tel"
                  inputMode="numeric"
                  maxLength={11}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 11))}
                  placeholder="手机号"
                  className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                />
                <div className="flex gap-2">
                  <input
                    type="text"
                    inputMode="numeric"
                    maxLength={6}
                    value={code}
                    onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    placeholder="验证码"
                    className="flex-1 rounded-xl border border-slate-200 px-3 py-2.5 text-sm focus:border-brand-500 focus:outline-none"
                  />
                  <button
                    type="button"
                    disabled={countdown > 0 || phone.length !== 11}
                    onClick={handleSendSms}
                    className="shrink-0 rounded-xl border border-brand-200 bg-brand-50 px-3 text-xs font-medium text-brand-700 disabled:opacity-50 cursor-pointer"
                  >
                    {countdown > 0 ? `${countdown}s` : '获取验证码'}
                  </button>
                </div>
                {smsHint && <p className="text-[10px] text-slate-500">{smsHint}</p>}
              </div>
            ) : method === 'password' ? (
              <div className="space-y-3">
                <input
                  type="tel"
                  inputMode="numeric"
                  maxLength={11}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 11))}
                  placeholder="账号（手机号）"
                  className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="密码"
                  autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                  className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                />
                {mode === 'register' && (
                  <input
                    type="password"
                    value={passwordConfirm}
                    onChange={(e) => setPasswordConfirm(e.target.value)}
                    placeholder="确认密码"
                    autoComplete="new-password"
                    className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                  />
                )}
              </div>
            ) : (
              <p className="text-center text-xs text-slate-500">点击下方按钮使用微信快捷{mode === 'login' ? '登录' : '注册'}</p>
            )}

            {error && (
              <p className="rounded-lg bg-red-50 px-3 py-2 text-xs text-red-700">{error}</p>
            )}
          </div>
        </div>
      </div>

      <StickyFormFooter>
        {method === 'wechat' ? (
          <WechatPhoneButton mode={mode} loading={loading} onClick={handleWechatClick} />
        ) : (
          <button
            type="button"
            disabled={loading}
            onClick={handleStickySubmit}
            className="w-full rounded-xl bg-brand-600 py-3 text-sm font-semibold text-white disabled:opacity-50 cursor-pointer"
          >
            {submitLabel}
          </button>
        )}
        <p className="mt-2 text-center text-[11px] text-slate-400">
          {mode === 'login' ? '登录' : '注册'}即表示同意{' '}
          <button type="button" onClick={() => setLegal('terms')} className="text-brand-600 cursor-pointer">
            《用户协议》
          </button>{' '}
          和{' '}
          <button type="button" onClick={() => setLegal('privacy')} className="text-brand-600 cursor-pointer">
            《隐私政策》
          </button>
        </p>
      </StickyFormFooter>

      <LegalSheet type={legal} onClose={() => setLegal(null)} />
    </div>
  );
}
