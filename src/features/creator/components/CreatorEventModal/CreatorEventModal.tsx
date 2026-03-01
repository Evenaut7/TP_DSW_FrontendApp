import { useState, useEffect, type FormEvent } from 'react';
import { X, Loader2 } from 'lucide-react';
import { z } from 'zod';
import type { Evento, PDI, Tag } from '@/types';
import TagsSelector from '@/features/tags/components/TagsSelector/TagsSelector';

// ── Zod v4 schema (espejo del backend) ────────────────────────────────────────
const eventoSchema = z
  .object({
    titulo: z
      .string()
      .min(1, 'El título no puede estar vacío')
      .max(255, 'Máximo 255 caracteres'),
    descripcion: z
      .string()
      .min(1, 'La descripción no puede estar vacía')
      .max(1024, 'Máximo 1024 caracteres'),
    fecha: z.string().min(1, 'La fecha es obligatoria'),
    horaDesde: z.string().min(1, 'La hora de inicio es obligatoria'),
    horaHasta: z.string().min(1, 'La hora de fin es obligatoria'),
    estado: z.enum(['Disponible', 'Cancelado']),
    tags: z.array(z.number().positive()).optional(),
  })
  .refine((data) => data.horaDesde < data.horaHasta, {
    message: 'La hora de inicio debe ser anterior a la hora de fin',
    path: ['horaHasta'],
  });

type EventoErrors = Partial<Record<keyof z.infer<typeof eventoSchema>, string>>;

// ── Tipos ─────────────────────────────────────────────────────────────────────
export interface EventoFormData {
  titulo: string;
  descripcion: string;
  horaDesde: string;
  horaHasta: string;
  fecha?: string;
  estado: string;
  tags?: number[];
}

interface CreatorEventModalProps {
  show: boolean;
  pdi?: PDI;
  evento?: Evento | null;
  onClose: () => void;
  onSubmit: (data: EventoFormData) => Promise<boolean>;
  loading?: boolean;
  allTags?: Tag[];
}

const ESTADOS = ['Disponible', 'Cancelado'];

// ── Input común ───────────────────────────────────────────────────────────────
const inputCls =
  'w-full px-4 py-2.5 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-primary focus:border-transparent transition-colors disabled:bg-slate-100 dark:disabled:bg-slate-600';

const Field = ({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) => (
  <div className="flex flex-col gap-1">
    <label className="text-sm font-semibold text-slate-700 dark:text-slate-200">
      {label}
    </label>
    {children}
    {error && <p className="text-red-500 text-xs">{error}</p>}
  </div>
);

// ── Componente ────────────────────────────────────────────────────────────────
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
    estado: 'Disponible',
    fecha: new Date().toISOString().split('T')[0],
    tags: [],
  });
  const [errors, setErrors] = useState<EventoErrors>({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!show) return;
    if (evento) {
      const fromDate = new Date(evento.horaDesde);
      const toDateLocal = (d: Date) =>
        new Date(d.getTime() - d.getTimezoneOffset() * 60000)
          .toISOString()
          .split('T')[0];
      const toTime = (d: Date) => d.toTimeString().slice(0, 5);

      setForm({
        titulo: evento.titulo,
        descripcion: evento.descripcion,
        horaDesde: toTime(fromDate),
        horaHasta: toTime(new Date(evento.horaHasta)),
        fecha: toDateLocal(fromDate),
        estado: evento.estado || 'Disponible',
        tags: Array.isArray(evento.tags)
          ? evento.tags.map((t: any) => (typeof t === 'number' ? t : t.id || 0))
          : [],
      });
    } else {
      setForm({
        titulo: '',
        descripcion: '',
        horaDesde: '',
        horaHasta: '',
        estado: 'Disponible',
        fecha: new Date().toISOString().split('T')[0],
        tags: [],
      });
    }
    setErrors({});
  }, [evento, show]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value, type } = e.target;
    if (name === 'tags' && type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      const tagId = Number(value);
      setForm((prev) => ({
        ...prev,
        tags: checked
          ? [...(prev.tags || []), tagId]
          : (prev.tags || []).filter((id) => id !== tagId),
      }));
      return;
    }
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErrors({});

    // Validar con Zod
    const result = eventoSchema.safeParse(form);
    if (!result.success) {
      const fieldErrors: EventoErrors = {};
      result.error.issues.forEach((err) => {
        const field = err.path[0] as keyof EventoErrors;
        if (!fieldErrors[field]) fieldErrors[field] = err.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setSubmitting(true);
    try {
      const success = await onSubmit(form);
      if (success) onClose();
    } finally {
      setSubmitting(false);
    }
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      <div
        className="relative bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-2xl flex flex-col"
        style={{ maxHeight: 'calc(100vh - 80px)' }}
      >
        <div className="flex-shrink-0 flex justify-between items-center px-6 py-4 border-b border-slate-200 dark:border-slate-700">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            {evento ? 'Editar evento' : 'Crear evento'}
          </h2>
          <button
            onClick={onClose}
            disabled={submitting}
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-slate-500 dark:text-slate-400" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-4">
          <form id="evento-form" onSubmit={handleSubmit} className="space-y-4">
            <Field label="Título *" error={errors.titulo}>
              <input
                type="text"
                name="titulo"
                value={form.titulo}
                onChange={handleChange}
                placeholder="Nombre del evento"
                disabled={submitting}
                className={inputCls}
              />
            </Field>

            <Field label="Descripción *" error={errors.descripcion}>
              <textarea
                name="descripcion"
                value={form.descripcion}
                onChange={handleChange}
                placeholder="Describe el evento"
                rows={2}
                disabled={submitting}
                className={`${inputCls} resize-none`}
              />
            </Field>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field label="Estado" error={errors.estado}>
                <select
                  name="estado"
                  value={form.estado}
                  onChange={handleChange}
                  disabled={submitting}
                  className={inputCls}
                >
                  {ESTADOS.map((e) => (
                    <option key={e} value={e}>
                      {e}
                    </option>
                  ))}
                </select>
              </Field>

              <Field label="Fecha *" error={errors.fecha}>
                <input
                  type="date"
                  name="fecha"
                  value={form.fecha || ''}
                  onChange={handleChange}
                  disabled={submitting}
                  className={inputCls}
                />
              </Field>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Field label="Hora inicio *" error={errors.horaDesde}>
                <input
                  type="time"
                  name="horaDesde"
                  value={form.horaDesde}
                  onChange={handleChange}
                  disabled={submitting}
                  className={inputCls}
                />
              </Field>
              <Field label="Hora fin *" error={errors.horaHasta}>
                <input
                  type="time"
                  name="horaHasta"
                  value={form.horaHasta}
                  onChange={handleChange}
                  disabled={submitting}
                  className={inputCls}
                />
              </Field>
            </div>

            <TagsSelector
              tags={allTags.filter(
                (t): t is Tag & { id: number; nombre: string } =>
                  t.id != null && typeof t.nombre === 'string',
              )}
              selected={form.tags || []}
              onChange={handleChange as any}
            />

            {pdi && (
              <div className="bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500 px-4 py-3 rounded-r-lg text-sm text-blue-900 dark:text-blue-200">
                💡 Los eventos serán visibles en "{pdi.nombre}"
              </div>
            )}
          </form>
        </div>

        <div className="flex-shrink-0 flex gap-3 justify-end px-6 py-4 border-t border-slate-200 dark:border-slate-700">
          <button
            type="button"
            onClick={onClose}
            disabled={submitting}
            className="px-5 py-2 rounded-full border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 font-semibold hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors text-sm disabled:opacity-50"
          >
            Cancelar
          </button>
          <button
            type="submit"
            form="evento-form"
            disabled={submitting || loading}
            className="px-5 py-2 rounded-full bg-primary text-white font-semibold hover:bg-accent transition-colors text-sm disabled:opacity-50 flex items-center gap-2"
          >
            {(submitting || loading) && (
              <Loader2 className="w-4 h-4 animate-spin" />
            )}
            {submitting || loading ? 'Guardando...' : 'Guardar evento'}
          </button>
        </div>
      </div>
    </div>
  );
}
