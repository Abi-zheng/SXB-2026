import { BottomSheet } from './BottomSheet';

const TERMS = `诉讼保机构端用户协议（演示版）

1. 本系统为诉讼保全担保业务预审演示平台，仅供合作金融机构内部使用。
2. 机构用户应确保登录手机号为本机构授权人员所有，并对账号下的操作负责。
3. 案件信息、材料内容属于敏感业务数据，不得擅自复制、传播或用于约定范围外的用途。
4. 预审决策应依据真实材料及内控制度作出，系统 AI 建议仅供参考。
5. 平台有权在演示环境重置数据，正式版将另行签订服务协议。`;

const PRIVACY = `诉讼保机构端隐私政策（演示版）

1. 我们收集的信息：机构注册手机号、机构类型、联系人及业务操作日志。
2. 使用目的：账号识别、案件推送、预审记录及系统安全审计。
3. 信息存储：演示环境数据存于本地 Mock 服务，重启后可能清空；正式环境将加密存储。
4. 信息共享：未经法律要求或您的授权，不会向第三方出售或共享业务数据。
5. 您的权利：可联系平台查询、更正或申请删除演示账号数据。`;

export function LegalSheet({
  type,
  onClose,
}: {
  type: 'terms' | 'privacy' | null;
  onClose: () => void;
}) {
  return (
    <BottomSheet
      open={type !== null}
      onClose={onClose}
      title={type === 'terms' ? '用户协议' : '隐私政策'}
    >
      <div className="max-h-[60vh] overflow-y-auto text-sm leading-relaxed text-slate-600 whitespace-pre-line">
        {type === 'terms' ? TERMS : PRIVACY}
      </div>
    </BottomSheet>
  );
}
