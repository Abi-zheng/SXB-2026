import { useEffect, useState } from 'react';
import { Download, Mail, Send, Loader2 } from 'lucide-react';
import {
  dispatchMaterials,
  downloadAllMaterials,
  downloadMaterialFile,
  emailMaterials,
  getMaterialManifest,
} from '../api';
import { PaginatedTableList } from './layout/PaginatedTableList';
import type { MaterialManifest, MaterialManifestFile } from '../institution-types';

export function MaterialActions({ caseId }: { caseId: string }) {
  const [manifest, setManifest] = useState<MaterialManifest | null>(null);
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    getMaterialManifest(caseId)
      .then(setManifest)
      .catch(() => setManifest(null));
  }, [caseId]);

  const run = async (action: string, fn: () => Promise<{ message: string } | void>) => {
    setLoading(action);
    setMessage('');
    try {
      const res = await fn();
      setMessage(typeof res === 'object' && res?.message ? res.message : '操作成功');
    } catch (e) {
      setMessage(e instanceof Error ? e.message : '操作失败');
    } finally {
      setLoading('');
    }
  };

  return (
    <section className="card p-4 space-y-3">
      <h2 className="text-sm font-semibold text-slate-900">材料管理</h2>
      <p className="text-[10px] text-slate-500">
        按「材料类型_案件号_客户名」自动命名（Mock 演示导出文本包）
      </p>

      <div className="grid grid-cols-3 gap-2">
        <button
          type="button"
          disabled={!!loading}
          onClick={() => run('all', async () => { downloadAllMaterials(caseId); })}
          className="flex flex-col items-center gap-1 rounded-xl bg-brand-50 py-3 text-[10px] font-medium text-brand-700 ring-1 ring-brand-100 active:bg-brand-100 cursor-pointer disabled:opacity-50"
        >
          {loading === 'all' ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
          一键下载
        </button>
        <button
          type="button"
          disabled={!!loading || !email.trim()}
          onClick={() => run('email', () => emailMaterials(caseId, email.trim()))}
          className="flex flex-col items-center gap-1 rounded-xl bg-slate-50 py-3 text-[10px] font-medium text-slate-700 ring-1 ring-slate-200 active:bg-slate-100 cursor-pointer disabled:opacity-50"
        >
          {loading === 'email' ? <Loader2 className="h-4 w-4 animate-spin" /> : <Mail className="h-4 w-4" />}
          邮件发送
        </button>
        <button
          type="button"
          disabled={!!loading}
          onClick={() => run('dispatch', () => dispatchMaterials(caseId, '电脑端'))}
          className="flex flex-col items-center gap-1 rounded-xl bg-slate-50 py-3 text-[10px] font-medium text-slate-700 ring-1 ring-slate-200 active:bg-slate-100 cursor-pointer disabled:opacity-50"
        >
          {loading === 'dispatch' ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
          投送电脑端
        </button>
      </div>

      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="收件邮箱（邮件发送）"
        className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs focus:border-brand-500 focus:outline-none"
      />

      {message && (
        <p className="text-[11px] text-emerald-700 bg-emerald-50 rounded-lg px-2 py-1.5">{message}</p>
      )}

      {manifest && manifest.files.length > 0 && (
        <PaginatedTableList<MaterialManifestFile>
          items={manifest.files}
          rowKey={(f) => f.id}
          pageSize={5}
          emptyMessage="暂无材料"
          columns={[
            {
              key: 'name',
              header: '材料名称',
              className: 'max-w-[140px]',
              render: (f) => (
                <div className="min-w-0">
                  <p className="truncate font-medium text-slate-800">{f.display_name}</p>
                  <p className="truncate text-[10px] text-slate-400">来源：{f.source_name}</p>
                </div>
              ),
            },
            {
              key: 'category',
              header: '类型',
              render: (f) => <span className="text-slate-500">{f.category_label}</span>,
            },
            {
              key: 'action',
              header: '操作',
              className: 'text-right w-12',
              render: (f) => (
                <button
                  type="button"
                  onClick={() => downloadMaterialFile(caseId, f.id)}
                  className="text-[10px] text-brand-600 font-medium cursor-pointer"
                >
                  下载
                </button>
              ),
            },
          ]}
        />
      )}
    </section>
  );
}
