import { API_BASE_URL } from '@/utils/api';
import { Trash2, Edit, Calendar, BookOpen } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type { PDI } from '@/types';

interface PDIListItemProps {
  pdi: PDI;
  onEdit?: (pdi: PDI) => void;
  onDelete?: (pdi: PDI) => void;
  onAddEvent?: (pdi: PDI) => void;
}

export default function PDIListItem({
  pdi,
  onEdit,
  onDelete,
  onAddEvent,
}: PDIListItemProps) {
  const navigate = useNavigate();

  if (!onEdit || !onDelete) {
    console.warn('PDIListItem: Missing callbacks', {
      onEdit: !!onEdit,
      onDelete: !!onDelete,
      pdi: pdi.nombre,
    });
  }

  return (
    <div className="group bg-white dark:bg-slate-800 rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-300 border border-slate-200 dark:border-slate-700 flex flex-col h-full">
      {/* Image */}
      <div className="relative overflow-hidden bg-slate-100 dark:bg-slate-700 h-40">
        <img
          src={`${API_BASE_URL}/public/${pdi.imagen}`}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          alt={pdi.nombre}
        />
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col flex-grow">
        <h3 className="font-bold text-slate-900 dark:text-white text-lg mb-1 line-clamp-2">
          {pdi.nombre}
        </h3>
        <div className="flex items-center gap-1 text-sm text-slate-500 dark:text-slate-400 mb-3">
          <span>📍</span>
          <span className="truncate">
            {pdi.calle} {pdi.altura}
          </span>
        </div>
        <p className="text-sm text-slate-600 dark:text-slate-300 mb-4 flex-grow line-clamp-2">
          {pdi.descripcion}
        </p>

        {/* Buttons */}
        <div className="grid grid-cols-2 gap-2 pt-3 border-t border-slate-200 dark:border-slate-700 w-full">
          {onAddEvent && (
            <button
              onClick={() => onAddEvent(pdi)}
              className="flex items-center justify-center gap-1.5 px-3 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors text-sm font-medium"
            >
              <Calendar className="w-4 h-4" />
              <span className="hidden sm:inline">Eventos</span>
            </button>
          )}

          <button
            onClick={() => navigate(`/pdi/${pdi.id}/historias`)}
            className="flex items-center justify-center gap-1.5 px-3 py-2 bg-primary text-white rounded-md hover:bg-accent transition-colors text-sm font-medium"
          >
            <BookOpen className="w-4 h-4" />
            <span className="hidden sm:inline">Historias</span>
          </button>

          {onEdit && (
            <button
              onClick={() => onEdit(pdi)}
              className="flex items-center justify-center gap-1.5 px-3 py-2 bg-slate-500 text-white rounded-md hover:bg-slate-600 transition-colors text-sm font-medium"
            >
              <Edit className="w-4 h-4" />
              <span className="hidden sm:inline">Editar</span>
            </button>
          )}
          {onDelete && (
            <button
              onClick={() => onDelete(pdi)}
              className="flex items-center justify-center gap-1.5 px-3 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors text-sm font-medium"
            >
              <Trash2 className="w-4 h-4" />
              <span className="hidden sm:inline">Eliminar</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
