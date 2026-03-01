import React, { useState } from 'react';
import EventCard from '@/features/eventos/components/EventCard/EventCard';
import {
  useApiGetById,
  useApiGet,
  createEvento,
  updateEvento,
  deleteEvento,
  getPDIById,
} from '@/utils/api';
import CreatorEventModal, {
  type EventoFormData,
} from '@/features/creator/components/CreatorEventModal/CreatorEventModal';
import type { Evento, Tag } from '@/types';
import { Plus, Pencil, Trash2, X } from 'lucide-react';

type Props = { pdiId: number };

// ── Modal de confirmación de eliminación ──────────────────────────────────────
const DeleteModal = ({
  evento,
  onConfirm,
  onCancel,
}: {
  evento: Evento;
  onConfirm: () => void;
  onCancel: () => void;
}) => (
  <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
    <div
      className="absolute inset-0 bg-black/40 backdrop-blur-sm"
      onClick={onCancel}
    />
    <div className="relative bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-md">
      <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-700">
        <h3 className="font-bold text-slate-900 dark:text-slate-100 text-lg">
          Confirmar eliminación
        </h3>
        <button
          onClick={onCancel}
          className="p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-400 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
      <div className="px-6 py-5 space-y-5">
        <p className="text-slate-600 dark:text-slate-300">
          ¿Estás seguro que querés eliminar{' '}
          <span className="font-semibold">"{evento.titulo}"</span>?
        </p>
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 py-2.5 rounded-full border border-slate-300 dark:border-slate-600 text-slate-600 dark:text-slate-300 font-semibold hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors text-sm"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 py-2.5 rounded-full bg-red-500 text-white font-semibold hover:bg-red-600 transition-colors text-sm"
          >
            Eliminar
          </button>
        </div>
      </div>
    </div>
  </div>
);

// ── Componente principal ──────────────────────────────────────────────────────
const ListadoEventosEditable: React.FC<Props> = ({ pdiId }) => {
  const { data, loading, error } = useApiGetById<{ eventos: Evento[] }>(
    '/api/puntosDeInteres',
    pdiId,
  );
  const { data: allTags } = useApiGet<Tag[]>('/api/tags');

  const [events, setEvents] = React.useState<Evento[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Evento | null>(null);
  const [eventoAEliminar, setEventoAEliminar] = useState<Evento | null>(null);
  const [submitting, setSubmitting] = useState(false);

  React.useEffect(() => {
    if (data?.eventos) setEvents(data.eventos);
  }, [data]);

  // Refrescar lista desde el backend
  const refrescarEventos = async () => {
    try {
      const refreshed = await getPDIById(pdiId);
      if (refreshed.success && (refreshed.data as any)?.eventos) {
        setEvents((refreshed.data as any).eventos);
      }
    } catch (e) {
      console.warn('No se pudo refrescar eventos:', e);
    }
  };

  // Submit — mismo contrato que useCreatorEventsPage
  const handleEventSubmit = async (
    formData: EventoFormData,
  ): Promise<boolean> => {
    if (!formData.fecha) {
      return false;
    }
    setSubmitting(true);
    try {
      const formatTimestamp = (date: string, time: string) =>
        `${date} ${time}:00`;

      const payload = {
        ...formData,
        horaDesde: formatTimestamp(formData.fecha, formData.horaDesde),
        horaHasta: formatTimestamp(formData.fecha, formData.horaHasta),
        tags: formData.tags || [],
        puntoDeInteres: pdiId,
      };

      const result = editingEvent?.id
        ? await updateEvento(editingEvent.id, payload)
        : await createEvento(payload);

      if (!result.success) throw new Error(result.error || 'Error al guardar');

      await refrescarEventos();
      return true;
    } catch (err: any) {
      console.error('Error guardando evento:', err.message);
      return false;
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!eventoAEliminar?.id) return;
    try {
      const result = await deleteEvento(eventoAEliminar.id);
      if (!result.success) throw new Error(result.error || 'Error al eliminar');
      await refrescarEventos();
      setEventoAEliminar(null);
    } catch (err: any) {
      console.error('Error eliminando evento:', err.message);
    }
  };

  const handleOpenCreate = () => {
    setEditingEvent(null);
    setShowModal(true);
  };
  const handleOpenEdit = (evento: Evento) => {
    setEditingEvent(evento);
    setShowModal(true);
  };
  const handleCloseModal = () => {
    setShowModal(false);
    setEditingEvent(null);
  };

  if (loading)
    return (
      <p className="text-slate-400 dark:text-slate-500 text-sm">
        Cargando eventos...
      </p>
    );
  if (error) return <p className="text-red-500 text-sm">{error}</p>;

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Card agregar evento */}
        <button
          type="button"
          onClick={handleOpenCreate}
          className="flex items-stretch bg-white dark:bg-slate-700 rounded-xl border-2 border-dashed border-slate-200 dark:border-slate-600 hover:border-primary dark:hover:border-primary hover:shadow-md transition-all duration-300 group min-h-[100px]"
        >
          <div className="flex flex-col items-center justify-center bg-slate-100 dark:bg-slate-600 group-hover:bg-primary/10 dark:group-hover:bg-primary/20 text-slate-400 group-hover:text-primary px-4 py-5 w-20 flex-shrink-0 rounded-l-xl transition-colors">
            <Plus className="w-7 h-7" />
          </div>
          <div className="flex-1 flex items-center px-5 py-4">
            <span className="font-semibold text-slate-500 dark:text-slate-300 group-hover:text-primary transition-colors">
              Agregar evento
            </span>
          </div>
        </button>

        {/* Eventos existentes */}
        {events.map((evento) => (
          <EventCard key={evento.id} evento={evento}>
            <button
              type="button"
              onClick={() => handleOpenEdit(evento)}
              className="flex-1 flex items-center justify-center gap-1.5 px-4 py-2 rounded-full border border-primary/30 text-primary text-sm font-semibold hover:bg-primary/5 transition-colors"
            >
              <Pencil className="w-3.5 h-3.5" /> Editar
            </button>
            <button
              type="button"
              onClick={() => setEventoAEliminar(evento)}
              className="flex-1 flex items-center justify-center gap-1.5 px-4 py-2 rounded-full border border-red-200 dark:border-red-800 text-red-500 text-sm font-semibold hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" /> Eliminar
            </button>
          </EventCard>
        ))}
      </div>

      <CreatorEventModal
        show={showModal}
        evento={editingEvent}
        onClose={handleCloseModal}
        onSubmit={handleEventSubmit}
        loading={submitting}
        allTags={allTags || []}
      />

      {/* Modal eliminar */}
      {eventoAEliminar && (
        <DeleteModal
          evento={eventoAEliminar}
          onConfirm={handleDelete}
          onCancel={() => setEventoAEliminar(null)}
        />
      )}
    </>
  );
};

export default ListadoEventosEditable;
