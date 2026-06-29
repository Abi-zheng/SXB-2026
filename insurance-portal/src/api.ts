import type { CaseRecord, ReviewPayload } from './types';
import type {
  InstitutionLoginResponse,
  InstitutionProfile,
  MaterialManifest,
} from './institution-types';

const BASE = '/api';

let authToken: string | null = null;

export function setAuthToken(token: string | null) {
  authToken = token;
}

function authHeaders(extra?: HeadersInit): HeadersInit {
  return {
    ...(extra ?? {}),
    ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
  };
}

async function parseError(res: Response, fallback: string) {
  if (res.status === 502 || res.status === 504) {
    throw new Error('无法连接 Mock API，请在项目根目录执行 npm run dev');
  }
  const contentType = res.headers.get('content-type') ?? '';
  if (!contentType.includes('application/json')) {
    throw new Error(
      res.status === 404
        ? '接口不存在，请重启 Mock API（npm run dev）'
        : `${fallback}（HTTP ${res.status}）`
    );
  }
  const body = await res.json().catch(() => ({}));
  throw new Error((body as { error?: string }).error ?? fallback);
}

async function institutionFetch(input: RequestInfo, init?: RequestInit): Promise<Response> {
  try {
    return await fetch(input, init);
  } catch {
    throw new Error('无法连接 Mock API，请在项目根目录执行 npm run dev');
  }
}

export async function institutionWechatLogin(payload: {
  code: string;
  mode: 'login' | 'register';
  institution_category?: 'insurance' | 'bank' | 'guarantee';
}): Promise<InstitutionLoginResponse & { phone: string }> {
  const res = await institutionFetch(`${BASE}/institution/auth/wechat-phone`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) await parseError(res, '微信登录失败');
  return res.json();
}

export async function institutionLogin(payload: {
  phone: string;
  mode: 'login' | 'register';
  institution_category?: 'insurance' | 'bank' | 'guarantee';
}): Promise<InstitutionLoginResponse> {
  const res = await institutionFetch(`${BASE}/institution/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) await parseError(res, '登录失败');
  return res.json();
}

export async function fetchProfile(): Promise<InstitutionProfile> {
  const res = await fetch(`${BASE}/institution/profile`, {
    headers: authHeaders(),
  });
  if (!res.ok) await parseError(res, '获取账号信息失败');
  return res.json();
}

export async function updateProfile(
  payload: Partial<{
    contact_name: string;
    institution_name: string;
    business_scope: Partial<InstitutionProfile['business_scope']>;
  }>
): Promise<InstitutionProfile> {
  const res = await fetch(`${BASE}/institution/profile`, {
    method: 'PATCH',
    headers: authHeaders({ 'Content-Type': 'application/json' }),
    body: JSON.stringify(payload),
  });
  if (!res.ok) await parseError(res, '保存失败');
  return res.json();
}

export async function sendSmsCode(phone: string): Promise<{ ok: boolean; message: string }> {
  const res = await institutionFetch(`${BASE}/institution/auth/sms/send`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ phone }),
  });
  if (!res.ok) await parseError(res, '发送失败');
  return res.json();
}

export async function institutionPasswordLogin(payload: {
  phone: string;
  password: string;
  mode: 'login' | 'register';
  institution_category?: 'insurance' | 'bank' | 'guarantee';
}): Promise<InstitutionLoginResponse & { phone: string }> {
  const res = await institutionFetch(`${BASE}/institution/auth/password/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) await parseError(res, '登录失败');
  return res.json();
}

export async function institutionSmsLogin(payload: {
  phone: string;
  code: string;
  mode: 'login' | 'register';
  institution_category?: 'insurance' | 'bank' | 'guarantee';
}): Promise<InstitutionLoginResponse & { phone: string }> {
  const res = await institutionFetch(`${BASE}/institution/auth/sms/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) await parseError(res, '登录失败');
  return res.json();
}

export async function submitInstitutionCertification(
  payload: import('./institution-types').InstitutionCertificationPayload
): Promise<{ ok: boolean; message: string; profile: InstitutionProfile }> {
  const res = await institutionFetch(`${BASE}/institution/certification/submit`, {
    method: 'POST',
    headers: authHeaders({ 'Content-Type': 'application/json' }),
    body: JSON.stringify(payload),
  });
  if (!res.ok) await parseError(res, '提交认证失败');
  return res.json();
}

export async function fetchDashboardStats(): Promise<import('./order-status').DashboardStats> {
  const res = await fetch(`${BASE}/institution/dashboard`, { headers: authHeaders() });
  if (!res.ok) await parseError(res, '获取工作台数据失败');
  return res.json();
}

export async function fetchOrderHall(): Promise<import('./institution-types').OrderHallResponse> {
  const res = await fetch(`${BASE}/institution/order-hall`, { headers: authHeaders() });
  if (!res.ok) await parseError(res, '获取提醒中心失败');
  return res.json();
}

export async function fetchOrderHallDetail(
  caseId: string
): Promise<import('./institution-types').OrderHallBasicDetail> {
  const res = await fetch(`${BASE}/institution/order-hall/${caseId}`, {
    headers: authHeaders(),
  });
  if (!res.ok) await parseError(res, '获取订单摘要失败');
  return res.json();
}

export async function listInstitutionCases(options?: {
  status?: string;
  orderTab?: import('./order-status').OrderListTab;
}): Promise<CaseRecord[]> {
  const params = new URLSearchParams();
  if (options?.status) params.set('status', options.status);
  if (options?.orderTab && options.orderTab !== 'all') {
    params.set('order_tab', options.orderTab);
  }
  const qs = params.toString();
  const url = qs
    ? `${BASE}/institution/cases?${qs}`
    : `${BASE}/institution/cases`;
  const res = await fetch(url, { headers: authHeaders() });
  if (!res.ok) await parseError(res, '获取列表失败');
  return res.json();
}

export async function getCase(id: string): Promise<CaseRecord> {
  const res = await fetch(`${BASE}/cases/${id}`);
  if (!res.ok) throw new Error('获取案件失败');
  return res.json();
}

export async function runPreReview(id: string): Promise<CaseRecord> {
  const res = await fetch(`${BASE}/cases/${id}/pre-review`, { method: 'POST' });
  if (!res.ok) throw new Error('预审失败');
  return res.json();
}

export async function submitReview(
  id: string,
  payload: ReviewPayload
): Promise<CaseRecord> {
  const res = await fetch(`${BASE}/cases/${id}/review`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error('提交决策失败');
  return res.json();
}

export async function submitIssueLetter(
  id: string,
  payload: import('./institution-types').IssueLetterPayload
): Promise<CaseRecord> {
  const res = await fetch(`${BASE}/cases/${id}/issue-letter`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) await parseError(res, '出函失败');
  return res.json();
}

export async function submitDeclineCoverage(
  id: string,
  payload: import('./institution-types').DeclineCoveragePayload
): Promise<CaseRecord> {
  const res = await fetch(`${BASE}/cases/${id}/decline-coverage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) await parseError(res, '提交失败');
  return res.json();
}

export async function getMaterialManifest(id: string): Promise<MaterialManifest> {
  const res = await fetch(`${BASE}/cases/${id}/materials/manifest`);
  if (!res.ok) throw new Error('获取材料清单失败');
  return res.json();
}

export function downloadAllMaterials(id: string) {
  window.open(`${BASE}/cases/${id}/materials/download-all`, '_blank');
}

export function downloadMaterialFile(caseId: string, fileId: string) {
  window.open(`${BASE}/cases/${caseId}/materials/download/${fileId}`, '_blank');
}

export async function emailMaterials(
  id: string,
  email: string
): Promise<{ ok: boolean; message: string }> {
  const res = await fetch(`${BASE}/cases/${id}/materials/email`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email }),
  });
  if (!res.ok) await parseError(res, '发送失败');
  return res.json();
}

export async function dispatchMaterials(
  id: string,
  target?: string
): Promise<{ ok: boolean; message: string }> {
  const res = await fetch(`${BASE}/cases/${id}/materials/dispatch`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ target }),
  });
  if (!res.ok) await parseError(res, '投送失败');
  return res.json();
}
