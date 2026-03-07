import { AlertTriangle } from 'lucide-react';
import type { PDI } from '@/types';

interface DeletePDIConfirmationModalProps {
  pdi: PDI;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function DeletePDIConfirmationModal({ pdi, onConfirm, onCancel }: DeletePDIConfirmationModalProps) {
  if (!pdi) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl max-w-md w-full p-6 transform transition-all">
        <div className="flex items-center gap-4 mb-4">
          <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded-full">
            <AlertTriangle className="w-6 h-6 text-red-600 dark:text-red-400" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">
            ¿Eliminar PDI?
          </h3>
        </div>

        <p className="text-slate-600 dark:text-slate-300 mb-6">
          ¿Estás seguro que deseas eliminar{' '}
          <strong>"{pdi.nombre}"</strong>? Esta acción no se puede
          deshacer y eliminará todos los eventos asociados.
        </p>

        <div className="flex justify-end gap-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg font-medium transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors"
          >
            Eliminar
          </button>
        </div>
      </div>
    </div>
  );
}
