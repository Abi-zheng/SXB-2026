import { FileText } from 'lucide-react';
import type { CaseRecord } from '../types';

function findSourceFile(
  record: CaseRecord,
  fieldKey: string
): string | undefined {
  const cardField = record.case_info_card?.fields.find((f) => f.key === fieldKey);
  if (cardField?.source_file) return cardField.source_file;

  const categoryMap: Record<string, string[]> = {
    plaintiff: ['complaint', 'application'],
    defendant: ['complaint'],
    case_type: ['complaint'],
    court: ['complaint', 'application'],
    claim_amount: ['complaint', 'contract'],
  };
  const cats = categoryMap[fieldKey] ?? [];
  const matched = record.classified_files.find((f) => cats.includes(f.category));
  if (matched) return matched.name;

  return record.classified_files[0]?.name;
}

export function StructuredInfoPanel({ record }: { record: CaseRecord }) {
  const fields = record.case_info_card?.fields ?? [];
  const fallbackRows = record.case_basic
    ? [
        { key: 'plaintiff', label: '原告', value: record.case_basic.plaintiff },
        { key: 'defendant', label: '被告', value: record.case_basic.defendant },
        { key: 'case_type', label: '案由', value: record.case_basic.case_type },
        { key: 'court', label: '法院', value: record.case_basic.court },
        { key: 'claim_amount', label: '诉讼金额', value: record.case_basic.claim_amount },
      ]
    : [];

  const rows =
    fields.length > 0
      ? fields.map((f) => ({
          key: f.key,
          label: f.label,
          value: f.value,
          status: f.status,
          confidence: f.confidence,
        }))
      : fallbackRows.map((f) => ({
          ...f,
          status: 'recognized' as const,
          confidence: 1,
        }));

  return (
    <section className="card p-4">
      <div className="flex items-center gap-2 mb-3">
        <FileText className="h-4 w-4 text-brand-600" />
        <h2 className="text-sm font-semibold text-slate-900">结构化信息</h2>
      </div>
      <p className="text-[10px] text-slate-500 mb-3">
        点击字段可查看对应材料来源位置
      </p>
      <dl className="space-y-2">
        {rows.map((row) => {
          const source = findSourceFile(record, row.key);
          return (
            <div
              key={row.key}
              className="rounded-xl bg-slate-50 p-3 ring-1 ring-slate-100"
            >
              <div className="flex items-center justify-between gap-2">
                <dt className="text-[10px] text-slate-500">{row.label}</dt>
                {'status' in row && row.status !== 'recognized' && (
                  <span className="text-[10px] text-amber-600">
                    {row.status === 'missing' ? '缺失' : '低置信'}
                  </span>
                )}
              </div>
              <dd className="mt-0.5 text-sm font-medium text-slate-900">{row.value || '—'}</dd>
              {source && (
                <p className="mt-1.5 text-[10px] text-brand-600">
                  📎 材料位置：{source}
                  {'confidence' in row && row.confidence < 0.85 && (
                    <span className="text-slate-400 ml-1">
                      （置信度 {Math.round(row.confidence * 100)}%）
                    </span>
                  )}
                </p>
              )}
            </div>
          );
        })}
      </dl>

      {record.classified_files?.length > 0 && (
        <div className="mt-4 pt-3 border-t border-slate-100">
          <p className="text-[10px] font-medium text-slate-600 mb-2">已分类材料</p>
          <ul className="space-y-1">
            {record.classified_files.map((f) => (
              <li key={f.name} className="flex justify-between text-[11px]">
                <span className="text-slate-700 truncate">{f.name}</span>
                <span className="text-slate-400 shrink-0 ml-2">{f.category_label}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}
