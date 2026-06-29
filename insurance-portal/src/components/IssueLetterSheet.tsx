import { useEffect, useState } from 'react';
import { BottomSheet } from './BottomSheet';
import { MockFileUploadField } from './MockFileUploadField';
import type { IssueLetterPayload } from '../institution-types';

const EMPTY: IssueLetterPayload = {
  policy_number: '',
  material_handling: { color_print: false, mail_original: false },
};

function RequiredLabel({ children }: { children: React.ReactNode }) {
  return (
    <label className="mb-1 block text-xs text-slate-500">
      <span className="text-red-500" aria-hidden="true">
        *
      </span>
      {children}
    </label>
  );
}

export function IssueLetterSheet({
  open,
  loading,
  onClose,
  onSubmit,
}: {
  open: boolean;
  loading: boolean;
  onClose: () => void;
  onSubmit: (payload: IssueLetterPayload) => void;
}) {
  const [form, setForm] = useState<IssueLetterPayload>(EMPTY);

  useEffect(() => {
    if (!open) setForm(EMPTY);
  }, [open]);

  const resetAndClose = () => {
    setForm(EMPTY);
    onClose();
  };

  const canSubmit = form.policy_number.trim() && !!form.policy_file_name;

  const handleSubmit = () => {
    if (!canSubmit) return;
    onSubmit(form);
  };

  return (
    <BottomSheet open={open} onClose={resetAndClose} title="出函">
      <div className="space-y-4 pb-2">
        <div>
          <RequiredLabel>保单号</RequiredLabel>
          <input
            value={form.policy_number}
            onChange={(e) => setForm({ ...form, policy_number: e.target.value })}
            placeholder="请输入保单号"
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
          />
        </div>

        <MockFileUploadField
          label="保单"
          required
          fileName={form.policy_file_name}
          onChange={({ name, dataUrl }) =>
            setForm({ ...form, policy_file_name: name, policy_file: dataUrl })
          }
        />

        <MockFileUploadField
          label="保函"
          fileName={form.guarantee_letter_file_name}
          onChange={({ name, dataUrl }) =>
            setForm({ ...form, guarantee_letter_file_name: name, guarantee_letter_file: dataUrl })
          }
        />

        <MockFileUploadField
          label="诉责材料"
          fileName={form.litigation_materials_file_name}
          onChange={({ name, dataUrl }) =>
            setForm({
              ...form,
              litigation_materials_file_name: name,
              litigation_materials_file: dataUrl,
            })
          }
        />

        <div>
          <label className="mb-1 block text-xs text-slate-500">审核备注</label>
          <textarea
            value={form.note ?? ''}
            onChange={(e) => setForm({ ...form, note: e.target.value })}
            placeholder="选填"
            rows={2}
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
          />
        </div>

        <div>
          <p className="mb-2 text-xs font-medium text-slate-700">材料处理</p>
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm text-slate-800">
              <input
                type="checkbox"
                checked={form.material_handling.color_print}
                onChange={(e) =>
                  setForm({
                    ...form,
                    material_handling: {
                      ...form.material_handling,
                      color_print: e.target.checked,
                    },
                  })
                }
                className="rounded border-slate-300 text-brand-600"
              />
              彩色打印
            </label>
            <label className="flex items-center gap-2 text-sm text-slate-800">
              <input
                type="checkbox"
                checked={form.material_handling.mail_original}
                onChange={(e) =>
                  setForm({
                    ...form,
                    material_handling: {
                      ...form.material_handling,
                      mail_original: e.target.checked,
                    },
                  })
                }
                className="rounded border-slate-300 text-brand-600"
              />
              邮寄原件
            </label>
          </div>
        </div>

        <button
          type="button"
          disabled={loading || !canSubmit}
          onClick={handleSubmit}
          className="sticky bottom-0 w-full rounded-xl bg-emerald-600 py-3 text-sm font-semibold text-white disabled:opacity-50 cursor-pointer"
        >
          {loading ? '提交中…' : '确认出函'}
        </button>
      </div>
    </BottomSheet>
  );
}
