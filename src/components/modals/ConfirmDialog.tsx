import { useEffect, useRef } from 'react';
import { AlertTriangle, HelpCircle } from 'lucide-react';
import type { ConfirmOptions } from '@/context/confirmContextValue';

interface ConfirmDialogProps extends ConfirmOptions {
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmDialog({
  title = 'Confirmar acción',
  message,
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  variant = 'default',
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  const cancelRef = useRef<HTMLButtonElement>(null);
  const isDanger = variant === 'danger';

  useEffect(() => {
    // Focus "Cancel" first: pressing Enter by accident must not run a destructive action.
    cancelRef.current?.focus();
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onCancel();
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [onCancel]);

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onCancel} />
      <div
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="confirm-dialog-title"
        className="relative bg-white dark:bg-slate-800 rounded-2xl shadow-xl max-w-md w-full p-6"
      >
        <div className="flex items-center gap-4 mb-4">
          <div className={`p-3 rounded-full ${isDanger ? 'bg-red-100 dark:bg-red-900/30' : 'bg-slate-100 dark:bg-slate-700'}`}>
            {isDanger ? (
              <AlertTriangle className="w-6 h-6 text-red-600 dark:text-red-400" />
            ) : (
              <HelpCircle className="w-6 h-6 text-slate-600 dark:text-slate-300" />
            )}
          </div>
          <h3 id="confirm-dialog-title" className="text-xl font-bold text-slate-900 dark:text-white">
            {title}
          </h3>
        </div>
        <div className="text-slate-600 dark:text-slate-300 mb-6">{message}</div>
        <div className="flex justify-end gap-3">
          <button
            ref={cancelRef}
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg font-medium"
          >
            {cancelText}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className={`px-4 py-2 text-white rounded-lg font-medium ${isDanger ? 'bg-red-600 hover:bg-red-700' : 'bg-primary hover:bg-accent'}`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
