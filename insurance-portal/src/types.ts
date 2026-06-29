export type CaseStatus =
  | 'parsing'
  | 'draft'
  | 'submitted'
  | 'reviewing'
  | 'approved'
  | 'rejected'
  | 'need_materials';

export type RiskLevel = 'high' | 'medium' | 'low';
export type ReviewDecision = 'approved' | 'rejected' | 'need_materials';

export interface CaseBasic {
  plaintiff: string;
  defendant: string;
  case_type: string;
  court: string;
  claim_amount: string;
}

export interface RecognizedField {
  key: string;
  label: string;
  value: string;
  confidence: number;
  status: 'recognized' | 'low_confidence' | 'missing';
  source_file?: string;
}

export interface CaseInfoCard {
  fields: RecognizedField[];
  low_confidence_count: number;
  missing_count: number;
  needs_review: boolean;
  generated_at: string;
}

export interface CourtInfo {
  court_name: string;
  preservation_type: string;
  preservation_type_label: string;
  claim_amount: string;
  case_type: string;
  case_number?: string;
}

export interface NaturalPersonInfo {
  type: 'natural';
  name: string;
  id_number: string;
  phone?: string;
  address?: string;
  id_card_front?: string;
  id_card_back?: string;
}

export interface EnterpriseInfo {
  type: 'enterprise';
  name: string;
  credit_code: string;
  legal_person_name?: string;
  legal_person_id?: string;
  legal_person_phone?: string;
  address?: string;
  business_license?: string;
  legal_id_front?: string;
  legal_id_back?: string;
}

export type PartyInfo = NaturalPersonInfo | EnterpriseInfo;

export interface PartyStructure {
  applicant: PartyInfo;
  respondent: PartyInfo;
}

export interface ClassifiedFile {
  name: string;
  category: string;
  category_label: string;
  confidence: number;
  type: string;
  size: number;
}

export interface CaseSummaryCard {
  text: string;
  highlights: string[];
  generated_at: string;
}

export interface SupplementaryQuestion {
  id: string;
  question: string;
  answer_type: 'yes_no' | 'text';
  placeholder?: string;
  answer: string | null;
}

export interface FactChainNode {
  date: string;
  event: string;
}

export interface FactChain {
  contract_signed_at: string;
  performance_nodes: FactChainNode[];
  breach_nodes: FactChainNode[];
  lawsuit_filed_at: string;
}

export interface EvidenceItem {
  name: string;
  category: string;
  summary: string;
  related_fact: string;
}

export type RiskDimensionKey =
  | 'property_transfer'
  | 'malicious_debt_evasion'
  | 'execution_difficulty'
  | 'abnormal_transaction';

export interface RiskDimension {
  key: RiskDimensionKey;
  label: string;
  detected: boolean;
  level: RiskLevel;
  description: string;
}

export interface RiskAssessment {
  dimensions: RiskDimension[];
}

export interface CoreRiskPoint {
  label: string;
  level: RiskLevel;
  description: string;
}

export interface RiskSignal {
  type: string;
  level: RiskLevel;
  description: string;
}

export type TimelineStage = 'contract' | 'payment' | 'breach' | 'lawsuit';

export type TimelineAnomaly =
  | 'long_term_arrears'
  | 'capital_chain_break'
  | 'multi_party_transaction';

export interface CaseTimelineNode {
  stage: TimelineStage;
  stage_label: string;
  date: string;
  event: string;
  anomalies: TimelineAnomaly[];
}

export interface EvidenceChainItem {
  evidence_name: string;
  fact: string;
  claim: string;
}

export type FactNodeKey =
  | 'legal_relation'
  | 'performance'
  | 'breach'
  | 'loss_claim';

export interface FactNode {
  key: FactNodeKey;
  label: string;
  description: string;
  status: 'established' | 'partial' | 'missing';
  evidence_refs: string[];
  date?: string;
}

export interface EvidenceStructure {
  case_type: string;
  fact_nodes: FactNode[];
  case_specific_checks: Array<{
    label: string;
    status: 'present' | 'missing' | 'partial';
    note: string;
  }>;
  generated_at: string;
}

export interface TimelineEvent {
  date: string;
  event: string;
}

export interface UploadedFile {
  name: string;
  type: string;
  size: number;
}

export interface PreReview {
  summary: string;
  risk_score: number;
  risk_level: RiskLevel;
  core_risk_points: CoreRiskPoint[];
  recommendations: string[];
  material_completeness_percent?: number;
  evidence_quality?: {
    grade_a: number;
    grade_b: number;
    grade_c: number;
    overall_grade: 'A' | 'B' | 'C';
    summary: string;
  };
  generated_at: string;
}

export interface ReviewRecord {
  decision: ReviewDecision;
  note: string;
  reviewed_at: string;
}

export interface IssueLetterRecord {
  policy_number: string;
  policy_file?: string;
  policy_file_name?: string;
  guarantee_letter_file?: string;
  guarantee_letter_file_name?: string;
  litigation_materials_file?: string;
  litigation_materials_file_name?: string;
  note: string;
  material_handling: {
    color_print: boolean;
    mail_original: boolean;
  };
  issued_at: string;
}

export interface MaterialVerification {
  case_type: string;
  rule_set_name: string;
  is_sufficient: boolean;
  completeness_percent: number;
  missing_required_count: number;
  supplement_list: Array<{
    requirement: { label: string; description: string };
    status: string;
    note?: string;
  }>;
  summary: string;
}

export interface MaterialDiagnosis {
  upload_mode_label: string;
  can_submit: boolean;
  completeness_score: number;
  summary: string;
}

export interface MaterialCompletenessAssessment {
  total_percent: number;
  is_sufficient: boolean;
  missing_labels: string[];
  summary: string;
}

export interface CaseRecord {
  id: string;
  status: CaseStatus;
  files: UploadedFile[];
  classified_files: ClassifiedFile[];
  material_completeness: MaterialCompletenessAssessment | null;
  material_verification: MaterialVerification | null;
  material_diagnosis: MaterialDiagnosis | null;
  court_info: CourtInfo | null;
  party_structure: PartyStructure | null;
  case_info_card: CaseInfoCard | null;
  case_basic: CaseBasic | null;
  case_summary: CaseSummaryCard | null;
  fact_chain: FactChain | null;
  case_timeline: CaseTimelineNode[];
  claims: string[];
  timeline: TimelineEvent[];
  evidence_list: EvidenceItem[];
  evidence_structure: EvidenceStructure | null;
  evidence_chain: EvidenceChainItem[];
  risk_assessment: RiskAssessment | null;
  risk_signals: RiskSignal[];
  supplementary_questions: SupplementaryQuestion[];
  pre_review: PreReview | null;
  review: ReviewRecord | null;
  parse_progress: number;
  created_at: string;
  updated_at: string;
  submitted_at: string | null;
  financial_institution: FinancialInstitution | null;
  guarantee_order: GuaranteeOrder | null;
  institution_ready?: boolean;
  institution_pushed?: boolean;
  institution_push_reason?: string | null;
  letter_issued_at?: string | null;
  issue_letter?: IssueLetterRecord | null;
  selected_court?: string | null;
  order_status?: import('./order-status').OrderStatus;
}

export interface FinancialInstitution {
  id: string;
  name: string;
  type: string;
  logo?: string;
}

export interface GuaranteeOrder {
  id: string;
  case_id: string;
  status: 'created' | 'institution_selected' | 'submitted';
  created_at: string;
}

export interface ReviewPayload {
  decision: ReviewDecision;
  note?: string;
}

export const ANOMALY_LABEL: Record<TimelineAnomaly, string> = {
  long_term_arrears: '长期拖欠',
  capital_chain_break: '资金断裂',
  multi_party_transaction: '多主体交易',
};

export const RISK_LEVEL_LABEL: Record<RiskLevel, string> = {
  high: '高风险',
  medium: '中风险',
  low: '低风险',
};
