import { AlertTriangle } from 'lucide-react';
import type { Evento } from '@/types';

interface DeleteEventConfirmationModalProps {
  evento: Evento;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function DeleteEventConfirmationModal({
  evento,
  onConfirm,
  onCancel,
}: DeleteEventConfirmationModalProps) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl max-w-sm w-full p-6">
        <div className="flex items-center gap-3 mb-4 text-red-600 dark:text-red-400">
          <AlertTriangle className="w-8 h-8" />
          <h3 className="text-lg font-bold">Eliminar Evento</h3>
        </div>
        <p className="text-slate-600 dark:text-slate-300 mb-6">
          ¿Estás seguro que deseas eliminar el evento "
          <strong>{evento.titulo}</strong>"?
        </p>
        <div className="flex justify-end gap-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg font-medium"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium"
          >
            Eliminar
          </button>
        </div>
      </div>
    </div>
  );
}
