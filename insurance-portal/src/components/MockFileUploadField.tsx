import { useRef } from 'react';
import { FileUp } from 'lucide-react';

export function MockFileUploadField({
  label,
  required,
  fileName,
  onChange,
  accept = 'image/*,.pdf,.zip',
}: {
  label: string;
  required?: boolean;
  fileName?: string;
  onChange: (file: { name: string; dataUrl?: string }) => void;
  accept?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File | undefined) => {
    if (!file) return;
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          onChange({ name: file.name, dataUrl: reader.result });
        }
      };
      reader.readAsDataURL(file);
      return;
    }
    onChange({ name: file.name });
  };

  return (
    <div>
      <p className="mb-1.5 text-xs text-slate-500">
        {required && (
          <span className="text-red-500" aria-hidden="true">
            *
          </span>
        )}
        {label}
      </p>
      {fileName ? (
        <div className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5">
          <span className="truncate text-xs font-medium text-slate-800">{fileName}</span>
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="shrink-0 text-[11px] text-brand-600 cursor-pointer"
          >
            重新上传
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="flex h-20 w-full flex-col items-center justify-center gap-1 rounded-lg border border-dashed border-slate-300 bg-slate-50 text-slate-400 active:bg-slate-100 cursor-pointer"
        >
          <FileUp className="h-5 w-5" />
          <span className="text-[11px]">点击上传</span>
        </button>
      )}
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="hidden"
        onChange={(e) => handleFile(e.target.files?.[0])}
      />
    </div>
  );
}
