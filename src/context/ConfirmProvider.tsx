import { useCallback, useState } from 'react';
import type { ReactNode } from 'react';
import ConfirmDialog from '@/components/modals/ConfirmDialog';
import { ConfirmContext } from './confirmContextValue';
import type { ConfirmFn, ConfirmOptions } from './confirmContextValue';

interface PendingConfirm {
  options: ConfirmOptions;
  resolve: (confirmed: boolean) => void;
}

export function ConfirmProvider({ children }: { children: ReactNode }) {
  const [pending, setPending] = useState<PendingConfirm | null>(null);

  const confirm = useCallback<ConfirmFn>(
    (options) =>
      new Promise<boolean>((resolve) => {
        // If a dialog is already open, the previous request is treated as cancelled.
        setPending((previous) => {
          previous?.resolve(false);
          return { options, resolve };
        });
      }),
    [],
  );

  const close = useCallback(
    (confirmed: boolean) => {
      pending?.resolve(confirmed);
      setPending(null);
    },
    [pending],
  );

  return (
    <ConfirmContext.Provider value={confirm}>
      {children}
      {pending && (
        <ConfirmDialog {...pending.options} onConfirm={() => close(true)} onCancel={() => close(false)} />
      )}
    </ConfirmContext.Provider>
  );
}
