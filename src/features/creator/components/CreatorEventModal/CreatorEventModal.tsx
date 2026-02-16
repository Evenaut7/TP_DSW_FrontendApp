import { useState, useEffect, type FormEvent } from 'react';
import { X, Loader2 } from 'lucide-react';
import type { Evento, PDI, Tag } from '@/types';
import TagsSelector from '@/features/tags/components/TagsSelector/TagsSelector';

interface CreatorEventModalProps {
  show: boolean;
  pdi?: PDI;
  evento?: Evento | null;
  onClose: () => void;
  onSubmit: (data: EventoFormData) => Promise<boolean>;
  loading?: boolean;
  allTags?: Tag[];
}

export interface EventoFormData {
  titulo: string;
  descripcion: string;
  horaDesde: string;
  horaHasta: string;
  fecha?: string;
  tags?: number[];
}

export default function CreatorEventModal({
  show,
  pdi,
  evento,
  onClose,
  onSubmit,
  loading = false,
  allTags = [],
}: CreatorEventModalProps) {
  const [form, setForm] = useState<EventoFormData>({
    titulo: '',
    descripcion: '',
    horaDesde: '',
    horaHasta: '',
    fecha: new Date().toISOString().split('T')[0],
    tags: [],
  });

  const [submitting, setSubmitting] = useState(false);

  // Inicializar con evento existente
  useEffect(() => {
    if (evento && show) {
      setForm({
        titulo: evento.titulo,
        descripcion: evento.descripcion,
        horaDesde: evento.horaDesde,
        horaHasta: evento.horaHasta,
        fecha: new Date().toISOString().split('T')[0],
        tags: Array.isArray(evento.tags)
          ? evento.tags.map((t) => (typeof t === 'number' ? t : t.id || 0))
          : [],
      });
    } else if (show) {
      setForm({
        titulo: '',
        descripcion: '',
        horaDesde: '',
        horaHasta: '',
        fecha: new Date().toISOString().split('T')[0],
        tags: [],
      });
    }
  }, [evento, show]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value, type } = e.target;

    // Manejo especial para los tags (checkboxes)
    if (name === 'tags' && type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      const tagId = Number(value);
      setForm((prev) => {
        const currentTags = prev.tags || [];
        const newTags = checked
          ? [...currentTags, tagId]
          : currentTags.filter((id) => id !== tagId);
        return { ...prev, tags: newTags };
      });
      return;
    }

    setForm({
      ...form,
      [name]: value,
    });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    // Validaciones
    if (!form.titulo.trim()) {
      alert('Por favor ingresa un título');
      return;
    }

    if (!form.descripcion.trim()) {
      alert('Por favor ingresa una descripción');
      return;
    }

    if (!form.horaDesde || !form.horaHasta) {
      alert('Por favor selecciona horarios válidos');
      return;
    }

    if (form.horaDesde >= form.horaHasta) {
      alert('La hora de inicio debe ser anterior a la hora de fin');
      return;
    }

    setSubmitting(true);

    try {
      const success = await onSubmit(form);
      if (success) {
        onClose();
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 flex justify-between items-center p-6 border-b border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
              {evento ? 'Editar Evento' : 'Crear Evento'}
            </h2>
            {pdi && (
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                para {pdi.nombre}
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
            disabled={submitting}
          >
            <X className="w-6 h-6 text-slate-600 dark:text-slate-400" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Título */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-2">
              Título del Evento *
            </label>
            <input
              type="text"
              name="titulo"
              value={form.titulo}
              onChange={handleInputChange}
              placeholder="Nombre del evento"
              required
              disabled={submitting}
              className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-slate-100 dark:disabled:bg-slate-600"
            />
          </div>

          {/* Descripción */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-2">
              Descripción *
            </label>
            <textarea
              name="descripcion"
              value={form.descripcion}
              onChange={handleInputChange}
              placeholder="Describe el evento"
              rows={4}
              required
              disabled={submitting}
              className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-slate-100 dark:disabled:bg-slate-600"
            />
          </div>

          {/* Fecha */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-2">
              Fecha
            </label>
            <input
              type="date"
              name="fecha"
              value={form.fecha || ''}
              onChange={handleInputChange}
              disabled={submitting}
              className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-slate-100 dark:disabled:bg-slate-600"
            />
          </div>

          {/* Horarios */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-2">
                Hora Inicio *
              </label>
              <input
                type="time"
                name="horaDesde"
                value={form.horaDesde}
                onChange={handleInputChange}
                required
                disabled={submitting}
                className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-slate-100 dark:disabled:bg-slate-600"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-2">
                Hora Fin *
              </label>
              <input
                type="time"
                name="horaHasta"
                value={form.horaHasta}
                onChange={handleInputChange}
                required
                disabled={submitting}
                className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-slate-100 dark:disabled:bg-slate-600"
              />
            </div>
          </div>

          {/* Tags */}
          <TagsSelector
            tags={allTags}
            selected={form.tags || []}
            onChange={handleInputChange as any}
          />

          {/* Info box */}
          <div className="bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500 p-4 rounded">
            <p className="text-sm text-blue-900 dark:text-blue-200">
              💡 Los eventos serán visibles en el punto de interés "
              {pdi?.nombre}"
            </p>
          </div>

          {/* Actions */}
          <div className="flex gap-3 justify-end pt-4 border-t border-slate-200 dark:border-slate-700">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white rounded-lg font-medium hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors disabled:opacity-50"
              disabled={submitting}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-colors disabled:opacity-50 flex items-center gap-2"
              disabled={submitting || loading}
            >
              {submitting || loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Guardando...
                </>
              ) : (
                'Guardar Evento'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
