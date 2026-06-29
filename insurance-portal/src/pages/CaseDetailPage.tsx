import { useCallback, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, FileCheck2, XCircle } from 'lucide-react';
import { getCase, submitDeclineCoverage, submitIssueLetter } from '../api';
import { DeclineCoverageSheet } from '../components/DeclineCoverageSheet';
import { IssueLetterSheet } from '../components/IssueLetterSheet';
import { MaterialActions } from '../components/MaterialActions';
import { StructuredCaseSections } from '../components/StructuredCaseSections';
import { PageShell } from '../components/layout/PageShell';
import {
  ORDER_STATUS_LABEL,
  getOrderStatus,
  orderStatusBadgeClass,
} from '../order-status';
import { getSlaInfo } from '../utils/caseHelpers';
import type { CaseRecord } from '../types';
import type { IssueLetterPayload } from '../institution-types';

function IssueResultCard({ record }: { record: CaseRecord }) {
  const issue = record.issue_letter;
  if (!issue) return null;

  const handling: string[] = [];
  if (issue.material_handling.color_print) handling.push('彩色打印');
  if (issue.material_handling.mail_original) handling.push('邮寄原件');

  return (
    <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 space-y-2">
      <p className="text-sm font-semibold text-emerald-800">出函成功</p>
      <dl className="grid grid-cols-2 gap-x-3 gap-y-2 text-xs">
        <div>
          <dt className="text-emerald-600/80">保单号</dt>
          <dd className="font-mono font-medium text-emerald-900 mt-0.5">{issue.policy_number}</dd>
        </div>
        {issue.policy_file_name && (
          <div>
            <dt className="text-emerald-600/80">保单</dt>
            <dd className="text-emerald-900 mt-0.5">{issue.policy_file_name}</dd>
          </div>
        )}
        {issue.guarantee_letter_file_name && (
          <div>
            <dt className="text-emerald-600/80">保函</dt>
            <dd className="text-emerald-900 mt-0.5">{issue.guarantee_letter_file_name}</dd>
          </div>
        )}
        {issue.litigation_materials_file_name && (
          <div className="col-span-2">
            <dt className="text-emerald-600/80">诉责材料</dt>
            <dd className="text-emerald-900 mt-0.5">{issue.litigation_materials_file_name}</dd>
          </div>
        )}
        {handling.length > 0 && (
          <div className="col-span-2">
            <dt className="text-emerald-600/80">材料处理</dt>
            <dd className="text-emerald-900 mt-0.5">{handling.join('、')}</dd>
          </div>
        )}
        {issue.note && (
          <div className="col-span-2">
            <dt className="text-emerald-600/80">审核备注</dt>
            <dd className="text-emerald-900 mt-0.5">{issue.note}</dd>
          </div>
        )}
      </dl>
      {record.letter_issued_at && (
        <p className="text-[10px] text-emerald-700">
          出函时间 {new Date(record.letter_issued_at).toLocaleString('zh-CN')}
        </p>
      )}
    </div>
  );
}

function DeclineResultCard({ record }: { record: CaseRecord }) {
  if (!record.review || record.review.decision !== 'rejected') return null;
  const orderStatus = getOrderStatus(record);
  if (orderStatus === 'issue_success') return null;

  return (
    <div className="rounded-2xl border border-orange-200 bg-orange-50 p-4">
      <p className="text-sm font-semibold text-orange-800">无法承保</p>
      <p className="mt-1 text-xs text-orange-900 leading-relaxed">{record.review.note}</p>
      <p className="mt-2 text-[10px] text-orange-700">
        {new Date(record.review.reviewed_at).toLocaleString('zh-CN')}
      </p>
    </div>
  );
}

export default function CaseDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [record, setRecord] = useState<CaseRecord | null>(null);
  const [acting, setActing] = useState(false);
  const [error, setError] = useState('');
  const [issueOpen, setIssueOpen] = useState(false);
  const [declineOpen, setDeclineOpen] = useState(false);

  const load = useCallback(async () => {
    if (!id) return;
    setRecord(await getCase(id));
  }, [id]);

  useEffect(() => {
    load();
  }, [load]);

  const handleIssue = async (payload: IssueLetterPayload) => {
    if (!id) return;
    setActing(true);
    setError('');
    try {
      setRecord(await submitIssueLetter(id, payload));
      setIssueOpen(false);
    } catch (e) {
      setError(e instanceof Error ? e.message : '出函失败');
    } finally {
      setActing(false);
    }
  };

  const handleDecline = async (note: string) => {
    if (!id) return;
    setActing(true);
    setError('');
    try {
      setRecord(await submitDeclineCoverage(id, { note }));
      setDeclineOpen(false);
    } catch (e) {
      setError(e instanceof Error ? e.message : '提交失败');
    } finally {
      setActing(false);
    }
  };

  if (!record) {
    return (
      <div className="flex flex-1 items-center justify-center py-16">
        <span className="h-7 w-7 animate-spin rounded-full border-2 border-slate-200 border-t-brand-600" />
      </div>
    );
  }

  const orderStatus = getOrderStatus(record);
  const statusLabel = ORDER_STATUS_LABEL[orderStatus];
  const statusClass = orderStatusBadgeClass(orderStatus);
  const canOperate = orderStatus === 'waiting_issue';
  const sla = getSlaInfo(record);

  return (
    <>
      <PageShell
        bottomInset="none"
        header={
          <>
            <Link
              to="/"
              className="inline-flex items-center gap-1 text-xs text-slate-500 active:text-brand-600"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              返回工作台
            </Link>

            {record.financial_institution && (
              <div className="rounded-xl border border-brand-200 bg-brand-50 px-3 py-2.5">
                <p className="text-xs font-semibold text-brand-800">用户端指定本机构承保</p>
                <p className="mt-0.5 text-[11px] text-brand-700">{record.financial_institution.name}</p>
                {record.submitted_at && (
                  <p className="mt-1 text-[10px] text-brand-600/80">
                    推送 {new Date(record.submitted_at).toLocaleString('zh-CN')}
                    {canOperate && (
                      <span className={sla.overdue ? ' text-red-600' : ''}> · {sla.label}</span>
                    )}
                  </p>
                )}
              </div>
            )}

            <div className="card p-4">
              <div className="flex items-center gap-2 mb-1">
                <span className={`rounded-md px-2 py-0.5 text-[10px] font-semibold ring-1 ${statusClass}`}>
                  {statusLabel}
                </span>
                <span className="text-[10px] text-slate-500">{record.case_basic?.case_type}</span>
              </div>
              <h1 className="text-base font-bold text-slate-900 leading-snug">
                {record.case_basic?.plaintiff} 诉 {record.case_basic?.defendant}
              </h1>
              <p className="mt-2 text-xl font-bold text-slate-900">{record.case_basic?.claim_amount}</p>
              <p className="mt-2 text-xs text-slate-500">
                {record.case_basic?.court ?? record.selected_court ?? record.court_info?.court_name}
              </p>
            </div>
          </>
        }
        stickyFooter={
          canOperate ? (
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                disabled={acting}
                onClick={() => setIssueOpen(true)}
                className="flex min-h-12 items-center justify-center gap-1.5 rounded-xl bg-emerald-600 text-sm font-semibold text-white active:bg-emerald-700 disabled:opacity-50 cursor-pointer"
              >
                <FileCheck2 className="h-4 w-4" />
                出函
              </button>
              <button
                type="button"
                disabled={acting}
                onClick={() => setDeclineOpen(true)}
                className="flex min-h-12 items-center justify-center gap-1.5 rounded-xl bg-red-600 text-sm font-semibold text-white active:bg-red-700 disabled:opacity-50 cursor-pointer"
              >
                <XCircle className="h-4 w-4" />
                无法承保
              </button>
            </div>
          ) : undefined
        }
      >
        <div className="space-y-3">
          {error && (
            <p className="rounded-xl bg-red-50 px-3 py-2 text-xs text-red-700 ring-1 ring-red-200" role="alert">
              {error}
            </p>
          )}

          <IssueResultCard record={record} />
          <DeclineResultCard record={record} />

          <StructuredCaseSections record={record} />
          <MaterialActions caseId={record.id} />

          {record.material_completeness && (
            <div className="card p-4">
              <p className="text-sm font-medium text-slate-900">
                材料完整度 {record.material_completeness.total_percent}%
              </p>
              {!record.material_completeness.is_sufficient && (
                <p className="mt-1 text-xs text-amber-700">
                  缺：{record.material_completeness.missing_labels.join('、')}
                </p>
              )}
            </div>
          )}
        </div>
      </PageShell>

      <IssueLetterSheet
        open={issueOpen}
        loading={acting}
        onClose={() => setIssueOpen(false)}
        onSubmit={handleIssue}
      />
      <DeclineCoverageSheet
        open={declineOpen}
        loading={acting}
        onClose={() => setDeclineOpen(false)}
        onSubmit={handleDecline}
      />
    </>
  );
}
