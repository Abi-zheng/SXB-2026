import {
  SECTION_MARKER_CLASS,
  type AnnotatedCaseField,
  type CaseDocumentTab,
} from '../utils/structuredInfo';

const DOC_SKELETON: Record<
  CaseDocumentTab,
  { title: string; lines: string[] }
> = {
  complaint: {
    title: '民事起诉状',
    lines: [
      '原告（申请人）信息栏',
      '被告（被申请人）信息栏',
      '诉讼请求',
      '事实与理由',
    ],
  },
  preservation: {
    title: '财产保全申请书',
    lines: [
      '申请保全事项',
      '申请人基本情况',
      '被申请人基本情况',
      '保全理由及担保说明',
    ],
  },
};

export function CaseInfoDocumentPreview({
  tab,
  fileName,
  fields,
}: {
  tab: CaseDocumentTab;
  fileName?: string;
  fields: AnnotatedCaseField[];
}) {
  const skeleton = DOC_SKELETON[tab];

  return (
    <div className="space-y-3">
      <div className="relative mx-auto w-full max-w-sm overflow-hidden rounded-xl border border-slate-200 bg-white shadow-inner">
        <div className="aspect-[3/4] bg-gradient-to-b from-slate-50 to-white p-4">
          <div className="pointer-events-none space-y-2 text-[10px] text-slate-300 select-none">
            <p className="border-b border-slate-200 pb-2 text-center text-xs text-slate-400">
              {skeleton.title}
            </p>
            {skeleton.lines.map((line) => (
              <div key={line} className="rounded bg-slate-100/80 px-2 py-3">
                {line}
              </div>
            ))}
            <div className="h-16 rounded bg-slate-100/60" />
          </div>

          {fields.map((field) => {
            const placement = field.placements[0];
            if (!placement) return null;
            const markerClass = SECTION_MARKER_CLASS[field.section];
            return (
              <div
                key={field.fieldKey}
                className={`absolute rounded-md border-2 ${markerClass}`}
                style={{
                  top: `${placement.top}%`,
                  left: `${placement.left}%`,
                  width: `${placement.width}%`,
                  minHeight: `${placement.height ?? 5}%`,
                }}
              >
                <span className="absolute -top-4 left-0 max-w-[120px] truncate rounded bg-white/95 px-1 py-0.5 text-[8px] font-bold shadow-sm ring-1 ring-slate-200">
                  {field.sectionLabel} · {field.label}
                </span>
              </div>
            );
          })}
        </div>

        {fileName && (
          <div className="border-t border-slate-100 bg-slate-50 px-3 py-2 text-[10px] text-slate-500 truncate">
            预览：{fileName}
          </div>
        )}
      </div>

      <div className="flex flex-wrap gap-2 text-[10px]">
        {(['court', 'applicant', 'respondent'] as const).map((section) => (
          <span
            key={section}
            className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 ring-1 ${SECTION_MARKER_CLASS[section]}`}
          >
            <span className="h-1.5 w-1.5 rounded-full bg-current opacity-70" />
            {section === 'court' ? '法院信息' : section === 'applicant' ? '申请人信息' : '被申请人信息'}
          </span>
        ))}
      </div>

      <ul className="space-y-2">
        {fields.map((field) => (
          <li
            key={field.fieldKey}
            className={`rounded-xl border-l-4 bg-slate-50 px-3 py-2 ${SECTION_MARKER_CLASS[field.section].split(' ')[0]}`}
          >
            <p className="text-[10px] text-slate-500">
              {field.sectionLabel} · {field.label}
            </p>
            <p className="mt-0.5 text-sm font-medium text-slate-900">{field.value || '—'}</p>
            <p className="mt-1 text-[10px] text-slate-500 leading-relaxed">{field.annotation}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
