import type { CaseRecord, CoreRiskPoint, RiskLevel } from '../types';
import type { AcceptanceSuggestion } from '../institution-types';
import { SLA_HOURS } from '../institution-types';

export function parseClaimAmount(raw: string | undefined | null): number {
  if (!raw) return 0;
  const n = parseFloat(raw.replace(/[^\d.]/g, ''));
  return Number.isFinite(n) ? n : 0;
}

export function getPreservationAmount(c: CaseRecord): string {
  return c.court_info?.claim_amount ?? c.case_basic?.claim_amount ?? '—';
}

export function getRiskLevel(c: CaseRecord): RiskLevel {
  return (
    c.pre_review?.risk_level ??
    (c.risk_assessment?.dimensions.some((d) => d.detected && d.level === 'high')
      ? 'high'
      : c.risk_assessment?.dimensions.some((d) => d.detected && d.level === 'medium')
        ? 'medium'
        : 'low')
  );
}

export function getRiskAlerts(c: CaseRecord): string[] {
  const alerts: string[] = [];

  if (c.risk_signals?.length) {
    c.risk_signals.slice(0, 3).forEach((s) => alerts.push(s.description));
  }

  const preRisks = c.pre_review?.core_risk_points ?? [];
  preRisks.forEach((r) => {
    if (r.level === 'high' || r.level === 'medium') alerts.push(r.description);
  });

  if (c.material_verification && !c.material_verification.is_sufficient) {
    alerts.push('缺少关键诉讼材料');
  }

  if (c.case_info_card?.missing_count) {
    alerts.push(`信息卡有 ${c.case_info_card.missing_count} 项待补`);
  }

  if (c.case_info_card?.low_confidence_count) {
    alerts.push('部分字段识别置信度偏低');
  }

  const amountCard = parseClaimAmount(c.case_info_card?.fields.find((f) => f.key === 'claim_amount')?.value);
  const amountBasic = parseClaimAmount(c.case_basic?.claim_amount);
  if (amountCard > 0 && amountBasic > 0 && Math.abs(amountCard - amountBasic) / amountBasic > 0.05) {
    alerts.push('诉讼金额与信息卡金额不一致');
  }

  if (!c.case_basic?.plaintiff?.trim() || !c.case_basic?.defendant?.trim()) {
    alerts.push('申请主体信息不完整');
  }

  return [...new Set(alerts)].slice(0, 4);
}

export function getAcceptanceSuggestion(c: CaseRecord): AcceptanceSuggestion {
  const materialOk =
    (c.material_completeness?.is_sufficient ?? true) &&
    (c.material_verification?.is_sufficient ?? true);
  const pct = getMaterialPercent(c);

  if (!materialOk || pct < 80) return 'supplement';
  return 'accept';
}

export const ACCEPTANCE_LABEL: Record<
  AcceptanceSuggestion,
  { text: string; className: string }
> = {
  accept: { text: '建议受理', className: 'bg-emerald-50 text-emerald-700 ring-emerald-200' },
  supplement: { text: '需补件', className: 'bg-amber-50 text-amber-700 ring-amber-200' },
  caution: { text: '谨慎承接', className: 'bg-orange-50 text-orange-700 ring-orange-200' },
};

export function getMaterialPercent(c: CaseRecord): number {
  return (
    c.pre_review?.material_completeness_percent ??
    c.material_completeness?.total_percent ??
    c.material_verification?.completeness_percent ??
    0
  );
}

export interface SlaInfo {
  submittedAt: Date | null;
  deadline: Date | null;
  remainingMs: number;
  overdue: boolean;
  label: string;
}

export function getSlaInfo(c: CaseRecord): SlaInfo {
  if (!c.submitted_at) {
    return { submittedAt: null, deadline: null, remainingMs: 0, overdue: false, label: '—' };
  }
  const submittedAt = new Date(c.submitted_at);
  const deadline = new Date(submittedAt.getTime() + SLA_HOURS * 3600_000);
  const remainingMs = deadline.getTime() - Date.now();
  const overdue = remainingMs < 0;
  const abs = Math.abs(remainingMs);
  const hours = Math.floor(abs / 3600_000);
  const mins = Math.floor((abs % 3600_000) / 60_000);
  const label = overdue ? `超时 ${hours}h${mins}m` : `剩余 ${hours}h${mins}m`;
  return { submittedAt, deadline, remainingMs, overdue, label };
}

export function getCoreRisks(c: CaseRecord): CoreRiskPoint[] {
  if (c.pre_review?.core_risk_points?.length) return c.pre_review.core_risk_points;
  return (c.risk_assessment?.dimensions.filter((d) => d.detected) ?? [])
    .slice(0, 3)
    .map((d) => ({ label: d.label, level: d.level, description: d.description }));
}

export function formatAmountShort(raw: string | undefined): string {
  if (!raw) return '—';
  return raw;
}
