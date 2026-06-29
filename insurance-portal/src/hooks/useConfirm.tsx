import { useCallback, useState } from 'react';
import { ConfirmDialog } from '../components/ConfirmDialog';

export interface ConfirmOptions {
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  destructive?: boolean;
}

export function useConfirm() {
  const [pending, setPending] = useState<{
    options: ConfirmOptions;
    resolve: (confirmed: boolean) => void;
  } | null>(null);

  const ask = useCallback((options: ConfirmOptions) => {
    return new Promise<boolean>((resolve) => {
      setPending({ options, resolve });
    });
  }, []);

  const close = useCallback((confirmed: boolean) => {
    setPending((current) => {
      current?.resolve(confirmed);
      return null;
    });
  }, []);

  const dialog = (
    <ConfirmDialog
      open={!!pending}
      title={pending?.options.title ?? ''}
      message={pending?.options.message ?? ''}
      confirmLabel={pending?.options.confirmLabel}
      cancelLabel={pending?.options.cancelLabel}
      destructive={pending?.options.destructive}
      onConfirm={() => close(true)}
      onCancel={() => close(false)}
    />
  );

  return { ask, dialog };
}
