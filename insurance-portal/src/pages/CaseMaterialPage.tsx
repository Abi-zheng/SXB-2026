import { useEffect, useMemo, useState } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import { ArrowLeft, FileText, Tag } from 'lucide-react';
import { getCase, getMaterialManifest } from '../api';
import { CaseInfoDocumentPreview } from '../components/CaseInfoDocumentPreview';
import { PageShell } from '../components/layout/PageShell';
import { PaginationBar } from '../components/layout/PaginationBar';
import { useClientPagination } from '../hooks/useClientPagination';
import type { CaseRecord } from '../types';
import type { MaterialManifest } from '../institution-types';
import {
  buildCaseInfoAnnotatedFields,
  fieldsForDocumentTab,
  resolveCaseDocuments,
  type CaseDocumentTab,
} from '../utils/structuredInfo';

const PAGE_SIZE = 8;

const TAB_LABEL: Record<CaseDocumentTab, string> = {
  complaint: '起诉状',
  preservation: '保全申请书',
};

export default function CaseMaterialPage() {
  const { id } = useParams<{ id: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const [record, setRecord] = useState<CaseRecord | null>(null);
  const [manifest, setManifest] = useState<MaterialManifest | null>(null);

  const view = searchParams.get('view') ?? 'evidence';
  const isCaseInfoView = view === 'case-info';
  const activeTab = (searchParams.get('tab') as CaseDocumentTab) || 'complaint';
  const highlightFile = searchParams.get('file') ?? '';
  const fieldLabel = searchParams.get('label') ?? '';
  const annotation = searchParams.get('annotation') ?? '';

  useEffect(() => {
    if (!id) return;
    getCase(id).then(setRecord).catch(() => setRecord(null));
    getMaterialManifest(id).then(setManifest).catch(() => setManifest(null));
  }, [id]);

  const files = useMemo(() => {
    if (manifest?.files.length) {
      return manifest.files.map((f) => ({
        id: f.id,
        name: f.display_name,
        source: f.source_name,
        category: f.category_label,
      }));
    }
    return (record?.classified_files ?? []).map((f, i) => ({
      id: String(i),
      name: f.name,
      source: f.name,
      category: f.category_label,
    }));
  }, [manifest, record]);

  const { page, setPage, totalPages, pageItems, total } = useClientPagination(files, PAGE_SIZE);

  const caseDocs = useMemo(
    () => (record ? resolveCaseDocuments(record) : { complaint: undefined, preservation: undefined }),
    [record]
  );

  const annotatedFields = useMemo(
    () => (record ? buildCaseInfoAnnotatedFields(record) : []),
    [record]
  );

  const tabFields = useMemo(
    () => fieldsForDocumentTab(annotatedFields, activeTab),
    [annotatedFields, activeTab]
  );

  const setTab = (tab: CaseDocumentTab) => {
    const next = new URLSearchParams(searchParams);
    next.set('view', 'case-info');
    next.set('tab', tab);
    setSearchParams(next, { replace: true });
  };

  if (!record) {
    return (
      <div className="flex flex-1 items-center justify-center py-16">
        <span className="h-7 w-7 animate-spin rounded-full border-2 border-slate-200 border-t-brand-600" />
      </div>
    );
  }

  const previewFileName =
    activeTab === 'complaint' ? caseDocs.complaint?.name : caseDocs.preservation?.name;

  return (
    <PageShell
      bottomInset="none"
      footer={
        !isCaseInfoView && total > 0 ? (
          <PaginationBar page={page} totalPages={totalPages} total={total} onPageChange={setPage} />
        ) : null
      }
      header={
        <>
          <Link
            to={`/cases/${record.id}`}
            className="inline-flex items-center gap-1 text-xs text-slate-500 active:text-brand-600"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            返回订单详情
          </Link>

          <div className="flex items-center gap-2">
            <span className="h-4 w-1 rounded-full bg-brand-600" aria-hidden="true" />
            <h1 className="text-lg font-bold text-slate-900">查看材料</h1>
          </div>

          {isCaseInfoView ? (
            <>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                切换起诉状 / 保全申请书预览，标注法院信息、申请人信息、被申请人信息对应位置
              </p>
              <div className="flex rounded-lg bg-slate-100 p-0.5">
                {(['complaint', 'preservation'] as const).map((tab) => (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => setTab(tab)}
                    className={`flex-1 rounded-md py-2 text-xs font-medium cursor-pointer ${
                      activeTab === tab ? 'bg-white text-brand-600 shadow-sm' : 'text-slate-500'
                    }`}
                  >
                    {TAB_LABEL[tab]}
                  </button>
                ))}
              </div>
            </>
          ) : (
            (fieldLabel || annotation) && (
              <div className="rounded-xl border border-brand-200 bg-brand-50 p-3 space-y-2">
                <p className="text-[10px] font-semibold text-brand-700">证据链</p>
                {fieldLabel && <p className="text-sm font-semibold text-brand-900">{fieldLabel}</p>}
                {annotation && (
                  <div className="flex gap-2 rounded-lg bg-white/80 px-2.5 py-2 text-xs text-brand-800 leading-relaxed">
                    <Tag className="h-4 w-4 shrink-0 mt-0.5" />
                    <span>{annotation}</span>
                  </div>
                )}
                {highlightFile && (
                  <p className="text-[11px] text-brand-700">
                    定位材料：<span className="font-mono font-medium">{highlightFile}</span>
                  </p>
                )}
              </div>
            )
          )}
        </>
      }
    >
      {isCaseInfoView ? (
        <section className="card p-4">
          {tabFields.length === 0 ? (
            <p className="text-xs text-slate-500 text-center py-8">
              当前文书暂无对应字段标注
              {previewFileName ? `（${previewFileName}）` : ''}
            </p>
          ) : (
            <CaseInfoDocumentPreview tab={activeTab} fileName={previewFileName} fields={tabFields} />
          )}
        </section>
      ) : (
        <section className="card p-4">
          <div className="flex items-center gap-2 mb-3">
            <FileText className="h-4 w-4 text-brand-600" />
            <h2 className="text-sm font-semibold text-slate-900">案件材料清单</h2>
          </div>
          {files.length === 0 ? (
            <p className="text-xs text-slate-500">暂无已分类材料</p>
          ) : (
            <ul className="space-y-2">
              {pageItems.map((f) => {
                const isHighlight =
                  !!highlightFile &&
                  (f.name === highlightFile ||
                    f.source === highlightFile ||
                    f.name.includes(highlightFile) ||
                    highlightFile.includes(f.name));
                return (
                  <li
                    key={f.id}
                    className={`rounded-xl border p-3 ${
                      isHighlight
                        ? 'border-brand-400 bg-brand-50 ring-2 ring-brand-200'
                        : 'border-slate-100 bg-slate-50/80'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-slate-900 truncate">{f.name}</p>
                        <p className="text-[10px] text-slate-500 mt-0.5">{f.category}</p>
                        {f.source !== f.name && (
                          <p className="text-[10px] text-slate-400 mt-0.5 truncate">来源：{f.source}</p>
                        )}
                      </div>
                      {isHighlight && (
                        <span className="shrink-0 rounded-md bg-brand-600 px-1.5 py-0.5 text-[9px] font-bold text-white">
                          当前定位
                        </span>
                      )}
                    </div>
                    {isHighlight && annotation && (
                      <p className="mt-2 border-t border-brand-200/60 pt-2 text-[11px] text-brand-800 leading-relaxed">
                        说明标注：{annotation}
                      </p>
                    )}
                  </li>
                );
              })}
            </ul>
          )}
        </section>
      )}
    </PageShell>
  );
}
