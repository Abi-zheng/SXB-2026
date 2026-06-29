import type { CaseRecord } from './types';

export type OrderStatus =
  | 'waiting_signature'
  | 'partial_signature'
  | 'waiting_payment'
  | 'waiting_issue'
  | 'issue_success'
  | 'waiting_surrender'
  | 'surrender_processing'
  | 'surrender_success';

export type OrderListTab = 'all' | 'pending_review' | 'issued' | 'surrender';

export const ORDER_STATUS_LABEL: Record<OrderStatus, string> = {
  waiting_signature: '等待签章',
  partial_signature: '部分签章',
  waiting_payment: '等待支付',
  waiting_issue: '等待出函',
  issue_success: '出函成功',
  waiting_surrender: '等待退保',
  surrender_processing: '退保受理中',
  surrender_success: '退保成功',
};

export const ORDER_TAB_LABEL: Record<OrderListTab, string> = {
  all: '全部',
  pending_review: '待审核',
  issued: '已出函',
  surrender: '退保退款',
};

export const ORDER_TAB_STATUSES: Record<OrderListTab, OrderStatus[] | 'all'> = {
  all: 'all',
  pending_review: [
    'waiting_signature',
    'partial_signature',
    'waiting_payment',
    'waiting_issue',
  ],
  issued: ['issue_success'],
  surrender: ['waiting_surrender', 'surrender_processing', 'surrender_success'],
};

export function getOrderStatus(record: CaseRecord): OrderStatus {
  if (record.order_status) return record.order_status;
  switch (record.status) {
    case 'submitted':
      return 'waiting_signature';
    case 'reviewing':
    case 'need_materials':
      return 'partial_signature';
    case 'approved':
      return record.letter_issued_at ? 'issue_success' : 'waiting_issue';
    case 'rejected':
      return 'waiting_surrender';
    default:
      return 'waiting_signature';
  }
}

export function orderStatusBadgeClass(status: OrderStatus): string {
  if (status === 'issue_success' || status === 'surrender_success') {
    return 'bg-emerald-50 text-emerald-700 ring-emerald-100';
  }
  if (status === 'waiting_surrender' || status === 'surrender_processing') {
    return 'bg-orange-50 text-orange-700 ring-orange-100';
  }
  if (status === 'waiting_payment') return 'bg-amber-50 text-amber-700 ring-amber-100';
  return 'bg-brand-50 text-brand-700 ring-brand-100';
}

export interface DashboardStats {
  institution_name: string;
  avg_issue_hours: number;
  issued_count: number;
  total_orders: number;
  pending_review_count: number;
}
