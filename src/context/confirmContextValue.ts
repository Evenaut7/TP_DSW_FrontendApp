import { createContext } from 'react';
import type { ReactNode } from 'react';

export interface ConfirmOptions {
  title?: string;
  message: ReactNode;
  confirmText?: string;
  cancelText?: string;
  /** 'danger' paints the dialog red; use it for destructive actions such as deleting. */
  variant?: 'default' | 'danger';
}

/** Opens the confirmation dialog and resolves to true (confirmed) or false (cancelled). */
export type ConfirmFn = (options: ConfirmOptions) => Promise<boolean>;

export const ConfirmContext = createContext<ConfirmFn | undefined>(undefined);
