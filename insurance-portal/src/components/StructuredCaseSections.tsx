import { Link } from 'react-router-dom';
import { ChevronRight, FileSearch } from 'lucide-react';
import type { CaseRecord } from '../types';
import {
  buildApplicantFields,
  buildCourtFields,
  buildEvidenceChainFields,
  buildRespondentFields,
  caseInfoMaterialsUrl,
  evidenceMaterialUrl,
  type StructuredFieldRow,
} from '../utils/structuredInfo';

function SimpleField({ row }: { row: StructuredFieldRow }) {
  return (
    <div className="rounded-xl bg-slate-50 px-3 py-2.5 ring-1 ring-slate-100">
      <dt className="text-[10px] text-slate-500">{row.label}</dt>
      <dd className="mt-0.5 text-sm font-medium text-slate-900 leading-snug">{row.value || '—'}</dd>
    </div>
  );
}

function InfoSection({ title, rows }: { title: string; rows: StructuredFieldRow[] }) {
  if (rows.length === 0) return null;
  return (
    <div>
      <h3 className="flex items-center gap-1.5 text-sm font-semibold text-slate-900 mb-2">
        <span className="h-1.5 w-1.5 rounded-full bg-brand-600 shrink-0" aria-hidden="true" />
        {title}
      </h3>
      <dl className="space-y-2">
        {rows.map((row) => (
          <SimpleField key={`${title}-${row.label}`} row={row} />
        ))}
      </dl>
    </div>
  );
}

function EvidenceFieldBlock({ caseId, row }: { caseId: string; row: StructuredFieldRow }) {
  return (
    <div className="rounded-xl bg-slate-50 p-3 ring-1 ring-slate-100">
      <dt className="text-[10px] text-slate-500">{row.label}</dt>
      <dd className="mt-0.5 text-sm font-medium text-slate-900 leading-snug">{row.value || '—'}</dd>
      {row.sourceFile && (
        <p className="mt-1.5 text-[10px] text-slate-500">材料位置：{row.sourceFile}</p>
      )}
      <Link
        to={evidenceMaterialUrl(caseId, {
          sourceFile: row.sourceFile,
          label: row.label,
          annotation: row.annotation,
        })}
        className="mt-2 inline-flex items-center gap-0.5 text-[11px] font-medium text-brand-600 active:text-brand-700"
      >
        <FileSearch className="h-3 w-3" />
        查看材料
        <ChevronRight className="h-3 w-3" />
      </Link>
    </div>
  );
}

export function StructuredCaseSections({ record }: { record: CaseRecord }) {
  const courtRows = buildCourtFields(record);
  const applicantRows = buildApplicantFields(record);
  const respondentRows = buildRespondentFields(record);
  const evidenceRows = buildEvidenceChainFields(record);
  const hasPartyInfo = courtRows.length + applicantRows.length + respondentRows.length > 0;

  return (
    <section className="card p-4 space-y-4">
      <div>
        <h2 className="text-sm font-semibold text-slate-900">案件信息</h2>
        <p className="mt-0.5 text-[10px] text-slate-500">各信息可跳转查看对应材料及说明标注</p>
      </div>

      <InfoSection title="法院信息" rows={courtRows} />
      <InfoSection title="申请人信息" rows={applicantRows} />
      <InfoSection title="被申请人信息" rows={respondentRows} />

      {hasPartyInfo && (
        <Link
          to={caseInfoMaterialsUrl(record.id)}
          className="flex w-full items-center justify-center gap-1.5 rounded-xl bg-brand-50 py-3 text-sm font-semibold text-brand-700 ring-1 ring-brand-200 active:bg-brand-100"
        >
          <FileSearch className="h-4 w-4" />
          查看材料
          <ChevronRight className="h-4 w-4" />
        </Link>
      )}

      {evidenceRows.length > 0 && (
        <div>
          <h3 className="flex items-center gap-1.5 text-sm font-semibold text-slate-900 mb-2">
            <span className="h-1.5 w-1.5 rounded-full bg-brand-600 shrink-0" aria-hidden="true" />
            证据链
          </h3>
          <dl className="space-y-2">
            {evidenceRows.map((row) => (
              <EvidenceFieldBlock key={`evidence-${row.label}`} caseId={record.id} row={row} />
            ))}
          </dl>
        </div>
      )}
    </section>
  );
}
