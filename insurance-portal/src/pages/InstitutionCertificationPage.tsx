import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { submitInstitutionCertification } from '../api';
import { useAuth } from '../auth/AuthContext';
import {
  CertificationReadOnlyView,
  CertificationSectionTitle,
  ImageUploadField,
} from '../components/CertificationFields';
import { PageShell } from '../components/layout/PageShell';
import type { InstitutionCertificationPayload } from '../institution-types';

const ENTERPRISE_TYPES = [
  '有限责任公司',
  '股份有限公司',
  '国有独资公司',
  '个人独资企业',
  '合伙企业',
  '保险机构',
  '银行',
  '担保公司',
  '其他',
];

const EMPTY_FORM: InstitutionCertificationPayload = {
  enterprise_name: '',
  unified_social_credit_code: '',
  operating_region: '',
  enterprise_type: '',
  registered_capital_wan: '',
  business_license_image: '',
  legal_representative: '',
  legal_rep_id_number: '',
  legal_rep_phone: '',
  id_card_front_image: '',
  id_card_back_image: '',
};

function FormLabel({ children }: { children: React.ReactNode }) {
  return <label className="mb-1 block text-xs text-slate-500">{children}</label>;
}

function TextInput({
  value,
  onChange,
  placeholder,
  inputMode,
  maxLength,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  inputMode?: 'text' | 'numeric' | 'tel';
  maxLength?: number;
}) {
  return (
    <input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      inputMode={inputMode}
      maxLength={maxLength}
      className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
    />
  );
}

export default function InstitutionCertificationPage() {
  const navigate = useNavigate();
  const { profile, refreshProfile } = useAuth();
  const [form, setForm] = useState<InstitutionCertificationPayload>(EMPTY_FORM);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  if (!profile) {
    return (
      <div className="flex justify-center py-16">
        <span className="h-7 w-7 animate-spin rounded-full border-2 border-slate-200 border-t-brand-600" />
      </div>
    );
  }

  const verified = profile.certification_status === 'verified' && profile.certification;

  const patch = (key: keyof InstitutionCertificationPayload, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      const res = await submitInstitutionCertification(form);
      await refreshProfile();
      setSuccess(res.message);
      setTimeout(() => navigate('/mine', { replace: true }), 800);
    } catch (e) {
      setError(e instanceof Error ? e.message : '提交失败');
    } finally {
      setLoading(false);
    }
  };

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
            <span className="h-4 w-1 rounded-full bg-brand-600" aria-hidden="true" />
            <h1 className="text-lg font-bold text-slate-900">基本信息</h1>
          </div>
        </>
      }
      stickyFooter={
        !verified ? (
          <button
            type="button"
            disabled={loading}
            onClick={handleSubmit}
            className="w-full rounded-xl bg-brand-600 py-3 text-sm font-semibold text-white disabled:opacity-50 cursor-pointer"
          >
            {loading ? '提交中…' : '提交认证'}
          </button>
        ) : undefined
      }
    >
      {verified ? (
        <CertificationReadOnlyView data={profile.certification!} />
      ) : (
        <div className="space-y-4">
          <CertificationSectionTitle>企业基本信息</CertificationSectionTitle>
          <div className="space-y-3 rounded-xl border border-slate-200 p-3">
            <div>
              <FormLabel>企业名称</FormLabel>
              <TextInput
                value={form.enterprise_name}
                onChange={(v) => patch('enterprise_name', v)}
                placeholder="请输入企业全称"
              />
            </div>
            <div>
              <FormLabel>统一社会信用代码</FormLabel>
              <TextInput
                value={form.unified_social_credit_code}
                onChange={(v) => patch('unified_social_credit_code', v.toUpperCase())}
                placeholder="18 位统一社会信用代码"
                maxLength={18}
              />
            </div>
            <div>
              <FormLabel>经营地区</FormLabel>
              <TextInput
                value={form.operating_region}
                onChange={(v) => patch('operating_region', v)}
                placeholder="如：湖南省长沙市"
              />
            </div>
            <div>
              <FormLabel>企业类型</FormLabel>
              <select
                value={form.enterprise_type}
                onChange={(e) => patch('enterprise_type', e.target.value)}
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none"
              >
                <option value="">请选择</option>
                {ENTERPRISE_TYPES.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <FormLabel>注册资本(万元)</FormLabel>
              <TextInput
                value={form.registered_capital_wan}
                onChange={(v) => patch('registered_capital_wan', v.replace(/[^\d.]/g, ''))}
                placeholder="请输入注册资本"
                inputMode="numeric"
              />
            </div>
            <ImageUploadField
              label="营业执照"
              value={form.business_license_image}
              onChange={(v) => patch('business_license_image', v)}
            />
          </div>

          <CertificationSectionTitle>企业法人信息</CertificationSectionTitle>
          <div className="space-y-3 rounded-xl border border-slate-200 p-3">
            <div>
              <FormLabel>法定代表人</FormLabel>
              <TextInput
                value={form.legal_representative}
                onChange={(v) => patch('legal_representative', v)}
                placeholder="请输入法定代表人姓名"
              />
            </div>
            <div>
              <FormLabel>法人身份证</FormLabel>
              <TextInput
                value={form.legal_rep_id_number}
                onChange={(v) => patch('legal_rep_id_number', v.toUpperCase())}
                placeholder="18 位身份证号码"
                maxLength={18}
              />
            </div>
            <div>
              <FormLabel>法人手机号</FormLabel>
              <TextInput
                value={form.legal_rep_phone}
                onChange={(v) => patch('legal_rep_phone', v.replace(/\D/g, '').slice(0, 11))}
                placeholder="11 位手机号"
                inputMode="tel"
                maxLength={11}
              />
            </div>
            <ImageUploadField
              label="身份证正面"
              value={form.id_card_front_image}
              onChange={(v) => patch('id_card_front_image', v)}
            />
            <ImageUploadField
              label="身份证反面"
              value={form.id_card_back_image}
              onChange={(v) => patch('id_card_back_image', v)}
            />
          </div>

          {error && (
            <p className="rounded-lg bg-red-50 px-3 py-2 text-xs text-red-700" role="alert">
              {error}
            </p>
          )}
          {success && (
            <p className="rounded-lg bg-emerald-50 px-3 py-2 text-xs text-emerald-700">{success}</p>
          )}
        </div>
      )}
    </PageShell>
  );
}
