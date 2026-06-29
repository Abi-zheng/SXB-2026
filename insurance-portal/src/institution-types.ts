export interface BusinessScope {
  enabled: boolean;
  case_types: string[];
  court_keywords: string[];
  min_amount: number;
  max_amount: number;
}

export type InstitutionCertificationStatus = 'unverified' | 'verified';

export interface InstitutionCertification {
  enterprise_name: string;
  unified_social_credit_code: string;
  operating_region: string;
  enterprise_type: string;
  registered_capital_wan: string;
  business_license_image: string;
  legal_representative: string;
  legal_rep_id_number: string;
  legal_rep_phone: string;
  id_card_front_image: string;
  id_card_back_image: string;
  submitted_at: string;
}

export interface InstitutionCertificationPayload {
  enterprise_name: string;
  unified_social_credit_code: string;
  operating_region: string;
  enterprise_type: string;
  registered_capital_wan: string;
  business_license_image: string;
  legal_representative: string;
  legal_rep_id_number: string;
  legal_rep_phone: string;
  id_card_front_image: string;
  id_card_back_image: string;
}

export interface InstitutionProfile {
  id: string;
  phone: string;
  contact_name: string;
  institution_id: string;
  institution_name: string;
  institution_type: string;
  business_scope: BusinessScope;
  certification_status: InstitutionCertificationStatus;
  certification: InstitutionCertification | null;
  created_at: string;
}

export interface InstitutionLoginResponse {
  token: string;
  is_new: boolean;
  profile: InstitutionProfile;
}

export interface MaterialManifestFile {
  id: string;
  display_name: string;
  source_name: string;
  category: string;
  category_label: string;
  size: number;
  mime: string;
}

export interface MaterialManifest {
  case_id: string;
  case_number: string;
  client_name: string;
  files: MaterialManifestFile[];
}

export type AcceptanceSuggestion = 'accept' | 'supplement' | 'caution';

export interface IssueLetterPayload {
  policy_number: string;
  policy_file?: string;
  policy_file_name?: string;
  guarantee_letter_file?: string;
  guarantee_letter_file_name?: string;
  litigation_materials_file?: string;
  litigation_materials_file_name?: string;
  note?: string;
  material_handling: {
    color_print: boolean;
    mail_original: boolean;
  };
}

export interface DeclineCoveragePayload {
  note: string;
}

export const CASE_TYPE_OPTIONS = [
  '建设工程施工合同纠纷',
  '买卖合同纠纷',
  '借款合同纠纷',
  '劳动争议',
  '知识产权纠纷',
  '通用',
];

export const COURT_KEYWORD_PRESETS = ['湖南', '长沙', '岳麓', '天心', '芙蓉'];

/** SLA：提交后 24 小时内需完成初审 */
export const SLA_HOURS = 24;

export interface OrderHallItem {
  id: string;
  case_id: string;
  anonymized_label: string;
  court: string;
  case_type: string;
  claim_amount: string;
  material_completeness_percent: number;
  follow_up_reason: string;
  posted_at: string;
  assignment: 'open' | 'assigned_me' | 'assigned_other';
  in_my_scope: boolean;
}

export interface OrderHallBasicDetail {
  case_id: string;
  anonymized_label: string;
  court: string;
  case_type: string;
  claim_amount: string;
  material_completeness_percent: number;
  follow_up_reason: string;
  posted_at: string;
  assignment: OrderHallItem['assignment'];
  in_my_scope: boolean;
  preservation_type_label: string | null;
  view_only: true;
}

export interface OrderHallResponse {
  reminder_count: number;
  items: OrderHallItem[];
}
