import type { CaseRecord, ClassifiedFile, PartyInfo } from '../types';

export interface StructuredFieldRow {
  label: string;
  value: string;
  sourceFile?: string;
  annotation: string;
}

export type CaseDocumentTab = 'complaint' | 'preservation';

export interface DocumentPlacement {
  doc: CaseDocumentTab;
  top: number;
  left: number;
  width: number;
  height?: number;
}

export interface AnnotatedCaseField extends StructuredFieldRow {
  fieldKey: string;
  section: 'court' | 'applicant' | 'respondent';
  sectionLabel: string;
  placements: DocumentPlacement[];
}

const SECTION_LABEL = {
  court: '法院信息',
  applicant: '申请人信息',
  respondent: '被申请人信息',
} as const;

const SECTION_MARKER_CLASS = {
  court: 'border-brand-500 bg-brand-500/12 text-brand-800',
  applicant: 'border-emerald-500 bg-emerald-500/12 text-emerald-800',
  respondent: 'border-amber-500 bg-amber-500/12 text-amber-800',
} as const;

export { SECTION_LABEL, SECTION_MARKER_CLASS };

function findFileByName(files: ClassifiedFile[], name?: string): string | undefined {
  if (!name) return undefined;
  const exact = files.find((f) => f.name === name);
  if (exact) return exact.name;
  const partial = files.find((f) => f.name.includes(name) || name.includes(f.name));
  return partial?.name;
}

export function resolveCaseDocuments(record: CaseRecord): {
  complaint?: ClassifiedFile;
  preservation?: ClassifiedFile;
} {
  const files = record.classified_files ?? [];
  const complaint =
    files.find((f) => f.category === 'complaint' || /起诉/.test(f.name)) ??
    files.find((f) => /起诉/.test(f.category_label));
  const preservation =
    files.find(
      (f) =>
        f.category === 'preservation' ||
        f.category === 'preservation_application' ||
        f.category === 'application' ||
        /保全/.test(f.name)
    ) ?? files.find((f) => /保全/.test(f.category_label));
  return { complaint, preservation };
}

function annotate(
  section: 'court' | 'applicant' | 'respondent',
  fieldKey: string,
  row: StructuredFieldRow,
  placements: DocumentPlacement[]
): AnnotatedCaseField {
  return {
    ...row,
    fieldKey,
    section,
    sectionLabel: SECTION_LABEL[section],
    placements,
  };
}

export function buildCourtFields(record: CaseRecord): StructuredFieldRow[] {
  const court = record.court_info;
  const basic = record.case_basic;

  return [
    {
      label: '法院名称',
      value: court?.court_name ?? basic?.court ?? record.selected_court ?? '—',
      annotation: '核对起诉状或保全申请书中的管辖法院信息',
    },
    {
      label: '案由',
      value: court?.case_type ?? basic?.case_type ?? '—',
      annotation: '案由以起诉状首页记载为准',
    },
    {
      label: '保全类型',
      value: court?.preservation_type_label ?? '—',
      annotation: '诉前/诉中保全以申请书及法院材料标注为准',
    },
    {
      label: '标的/保全金额',
      value: court?.claim_amount ?? basic?.claim_amount ?? '—',
      annotation: '金额应与起诉状诉请及保全申请书一致',
    },
    ...(court?.case_number
      ? [
          {
            label: '案号',
            value: court.case_number,
            annotation: '案号以法院受理材料或起诉状为准',
          },
        ]
      : []),
  ];
}

function partyRows(party: PartyInfo, role: '申请人' | '被申请人'): StructuredFieldRow[] {
  if (party.type === 'enterprise') {
    return [
      {
        label: '企业名称',
        value: party.name,
        annotation: `${role}主体名称，见起诉状当事人栏或保全申请书`,
      },
      {
        label: '统一社会信用代码',
        value: party.credit_code,
        annotation: '企业统一社会信用代码，见起诉状或保全申请书',
      },
      ...(party.legal_person_name
        ? [
            {
              label: '法定代表人',
              value: party.legal_person_name,
              annotation: '法定代表人姓名，见起诉状或保全申请书',
            },
          ]
        : []),
      ...(party.legal_person_phone
        ? [{ label: '联系电话', value: party.legal_person_phone, annotation: '联系方式，见起诉状或授权材料' }]
        : []),
      ...(party.address
        ? [{ label: '住所地', value: party.address, annotation: '住所地以起诉状或保全申请书为准' }]
        : []),
    ];
  }

  return [
    {
      label: '姓名',
      value: party.name,
      annotation: `${role}姓名，见起诉状或保全申请书`,
    },
    {
      label: '身份证号',
      value: party.id_number,
      annotation: '身份证号码，见起诉状或保全申请书',
    },
    ...(party.phone ? [{ label: '联系电话', value: party.phone, annotation: '见起诉状联系方式栏' }] : []),
    ...(party.address
      ? [{ label: '住所地', value: party.address, annotation: '住所地以起诉状或保全申请书为准' }]
      : []),
  ];
}

function fallbackApplicant(record: CaseRecord): StructuredFieldRow[] {
  return [
    {
      label: '姓名/名称',
      value: record.case_basic?.plaintiff ?? '—',
      annotation: '申请人见起诉状原告栏或保全申请书',
    },
  ];
}

function fallbackRespondent(record: CaseRecord): StructuredFieldRow[] {
  return [
    {
      label: '姓名/名称',
      value: record.case_basic?.defendant ?? '—',
      annotation: '被申请人见起诉状被告栏或保全申请书',
    },
  ];
}

export function buildApplicantFields(record: CaseRecord): StructuredFieldRow[] {
  if (record.party_structure?.applicant) {
    return partyRows(record.party_structure.applicant, '申请人');
  }
  return fallbackApplicant(record);
}

export function buildRespondentFields(record: CaseRecord): StructuredFieldRow[] {
  if (record.party_structure?.respondent) {
    return partyRows(record.party_structure.respondent, '被申请人');
  }
  return fallbackRespondent(record);
}

/** 法院 / 当事人字段在起诉状与保全申请书上的标注位置（预览 Mock） */
export function buildCaseInfoAnnotatedFields(record: CaseRecord): AnnotatedCaseField[] {
  const court = buildCourtFields(record);
  const applicant = buildApplicantFields(record);
  const respondent = buildRespondentFields(record);

  const result: AnnotatedCaseField[] = [];

  court.forEach((row, i) => {
    const key = `court-${i}`;
    const placements: DocumentPlacement[] = [];
    if (row.label === '法院名称') {
      placements.push(
        { doc: 'complaint', top: 6, left: 22, width: 56, height: 7 },
        { doc: 'preservation', top: 8, left: 20, width: 60, height: 7 }
      );
    } else if (row.label === '案由') {
      placements.push({ doc: 'complaint', top: 16, left: 28, width: 44, height: 6 });
    } else if (row.label === '保全类型') {
      placements.push({ doc: 'preservation', top: 18, left: 12, width: 76, height: 6 });
    } else if (row.label === '标的/保全金额') {
      placements.push(
        { doc: 'complaint', top: 58, left: 10, width: 80, height: 8 },
        { doc: 'preservation', top: 32, left: 10, width: 80, height: 8 }
      );
    } else if (row.label === '案号') {
      placements.push({ doc: 'complaint', top: 4, left: 62, width: 32, height: 5 });
    }
    if (placements.length) result.push(annotate('court', key, row, placements));
  });

  applicant.forEach((row, i) => {
    const key = `applicant-${i}`;
    const baseTop = 26 + i * 5;
    result.push(
      annotate('applicant', key, row, [
        { doc: 'complaint', top: Math.min(baseTop, 48), left: 8, width: 42, height: 5 },
        { doc: 'preservation', top: 44 + i * 5, left: 10, width: 80, height: 5 },
      ])
    );
  });

  respondent.forEach((row, i) => {
    const key = `respondent-${i}`;
    const baseTop = 26 + i * 5;
    result.push(
      annotate('respondent', key, row, [
        { doc: 'complaint', top: Math.min(baseTop, 48), left: 52, width: 40, height: 5 },
        { doc: 'preservation', top: 62 + i * 5, left: 10, width: 80, height: 5 },
      ])
    );
  });

  return result;
}

export function fieldsForDocumentTab(
  fields: AnnotatedCaseField[],
  tab: CaseDocumentTab
): AnnotatedCaseField[] {
  return fields
    .map((f) => ({
      ...f,
      placements: f.placements.filter((p) => p.doc === tab),
    }))
    .filter((f) => f.placements.length > 0);
}

export function buildEvidenceChainFields(record: CaseRecord): StructuredFieldRow[] {
  const files = record.classified_files ?? [];
  const chain = record.evidence_chain ?? [];
  if (chain.length === 0) {
    return record.evidence_list.slice(0, 4).map((e) => ({
      label: e.name,
      value: `${e.related_fact} → ${e.category}`,
      sourceFile: findFileByName(files, e.name) ?? files.find((f) => f.name.includes(e.name.slice(0, 4)))?.name,
      annotation: e.summary || '证据与案件事实的对应关系',
    }));
  }

  return chain.map((item) => {
    const sourceFile =
      findFileByName(files, item.evidence_name) ??
      record.evidence_list.find(
        (e) => item.evidence_name.includes(e.name) || e.name.includes(item.evidence_name.slice(0, 4))
      )?.name;
    return {
      label: item.evidence_name,
      value: `事实：${item.fact} · 诉请：${item.claim}`,
      sourceFile,
      annotation: sourceFile
        ? '定位至该证据扫描件并核对标注说明'
        : '该环节证据尚缺，请提示用户补传',
    };
  });
}

export function caseInfoMaterialsUrl(caseId: string, tab: CaseDocumentTab = 'complaint'): string {
  const params = new URLSearchParams();
  params.set('view', 'case-info');
  params.set('tab', tab);
  return `/cases/${caseId}/materials?${params.toString()}`;
}

export function evidenceMaterialUrl(
  caseId: string,
  opts: { sourceFile?: string; label: string; annotation: string }
): string {
  const params = new URLSearchParams();
  params.set('view', 'evidence');
  params.set('label', opts.label);
  params.set('annotation', opts.annotation);
  if (opts.sourceFile) params.set('file', opts.sourceFile);
  return `/cases/${caseId}/materials?${params.toString()}`;
}
