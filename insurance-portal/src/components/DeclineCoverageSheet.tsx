import { useState } from 'react';
import { BottomSheet } from './BottomSheet';

export function DeclineCoverageSheet({
  open,
  loading,
  onClose,
  onSubmit,
}: {
  open: boolean;
  loading: boolean;
  onClose: () => void;
  onSubmit: (note: string) => void;
}) {
  const [note, setNote] = useState('');

  const resetAndClose = () => {
    setNote('');
    onClose();
  };

  return (
    <BottomSheet open={open} onClose={resetAndClose} title="无法承保">
      <div className="space-y-4 pb-2">
        <div>
          <label className="mb-1 block text-xs text-slate-500">
            <span className="text-red-500" aria-hidden="true">
              *
            </span>
            审核备注
          </label>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="请说明无法承保原因"
            rows={4}
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
          />
        </div>

        <button
          type="button"
          disabled={loading || !note.trim()}
          onClick={() => onSubmit(note.trim())}
          className="sticky bottom-0 w-full rounded-xl bg-red-600 py-3 text-sm font-semibold text-white disabled:opacity-50 cursor-pointer"
        >
          {loading ? '提交中…' : '确认无法承保'}
        </button>
      </div>
    </BottomSheet>
  );
}
