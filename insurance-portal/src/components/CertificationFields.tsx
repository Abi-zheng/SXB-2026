import { useRef, useState } from 'react';
import { ImagePlus } from 'lucide-react';
import { BottomSheet } from './BottomSheet';

export function ImageUploadField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (dataUrl: string) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [previewOpen, setPreviewOpen] = useState(false);

  const handleFile = (file: File | undefined) => {
    if (!file || !file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') onChange(reader.result);
    };
    reader.readAsDataURL(file);
  };

  return (
    <>
      <div>
        <p className="text-xs text-slate-500 mb-1.5">{label}</p>
        {value ? (
          <div className="overflow-hidden rounded-lg border border-slate-200 bg-slate-50">
            <img src={value} alt={label} className="h-28 w-full object-cover" />
            <div className="flex border-t border-slate-200">
              <button
                type="button"
                onClick={() => setPreviewOpen(true)}
                className="flex-1 py-2 text-[11px] text-slate-600 active:bg-slate-100 cursor-pointer"
              >
                点击查看大图
              </button>
              <button
                type="button"
                onClick={() => inputRef.current?.click()}
                className="flex-1 border-l border-slate-200 py-2 text-[11px] text-brand-600 active:bg-brand-50 cursor-pointer"
              >
                重新上传
              </button>
            </div>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="flex h-28 w-full flex-col items-center justify-center gap-1 rounded-lg border border-dashed border-slate-300 bg-slate-50 text-slate-400 active:bg-slate-100 cursor-pointer"
          >
            <ImagePlus className="h-6 w-6" />
            <span className="text-[11px]">点击上传</span>
          </button>
        )}
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => handleFile(e.target.files?.[0])}
        />
      </div>

      <BottomSheet open={previewOpen} onClose={() => setPreviewOpen(false)} title={label}>
        {value && (
          <img src={value} alt={label} className="w-full rounded-lg border border-slate-200" />
        )}
      </BottomSheet>
    </>
  );
}

function FieldRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-[7.5rem_1fr] gap-2 border-b border-slate-100 py-2.5 text-xs last:border-0">
      <dt className="text-slate-500 shrink-0">{label}</dt>
      <dd className="min-w-0 text-slate-900">{children}</dd>
    </div>
  );
}

export function CertificationSectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="flex items-center gap-1.5 text-sm font-semibold text-slate-800 mt-4 mb-1 first:mt-0">
      <span className="h-1.5 w-1.5 rounded-full bg-brand-600 shrink-0" aria-hidden="true" />
      {children}
    </h3>
  );
}

export function CertificationReadOnlyView({
  data,
}: {
  data: import('../institution-types').InstitutionCertification;
}) {
  const [preview, setPreview] = useState<{ title: string; src: string } | null>(null);

  const imageField = (label: string, src: string) => (
    <div className="py-2.5 border-b border-slate-100 last:border-0">
      <p className="text-xs text-slate-500 mb-1.5">{label}</p>
      <div className="overflow-hidden rounded-lg border border-slate-200 bg-slate-50">
        <img src={src} alt={label} className="h-28 w-full object-cover" />
        <button
          type="button"
          onClick={() => setPreview({ title: label, src })}
          className="w-full py-2 text-[11px] text-slate-600 border-t border-slate-200 active:bg-slate-100 cursor-pointer"
        >
          点击查看大图
        </button>
      </div>
    </div>
  );

  return (
    <>
      <CertificationSectionTitle>企业基本信息</CertificationSectionTitle>
      <dl className="rounded-xl border border-slate-200 px-3">
        <FieldRow label="企业名称">{data.enterprise_name}</FieldRow>
        <FieldRow label="统一社会信用代码">{data.unified_social_credit_code}</FieldRow>
        <FieldRow label="经营地区">{data.operating_region}</FieldRow>
        <FieldRow label="企业类型">{data.enterprise_type}</FieldRow>
        <FieldRow label="注册资本(万元)">{data.registered_capital_wan}</FieldRow>
        {imageField('营业执照', data.business_license_image)}
      </dl>

      <CertificationSectionTitle>企业法人信息</CertificationSectionTitle>
      <dl className="rounded-xl border border-slate-200 px-3">
        <FieldRow label="法定代表人">{data.legal_representative}</FieldRow>
        <FieldRow label="法人身份证">{data.legal_rep_id_number}</FieldRow>
        <FieldRow label="法人手机号">{data.legal_rep_phone}</FieldRow>
        {imageField('身份证正面', data.id_card_front_image)}
        {imageField('身份证反面', data.id_card_back_image)}
      </dl>

      <BottomSheet
        open={!!preview}
        onClose={() => setPreview(null)}
        title={preview?.title ?? ''}
      >
        {preview && (
          <img src={preview.src} alt={preview.title} className="w-full rounded-lg border border-slate-200" />
        )}
      </BottomSheet>
    </>
  );
}
