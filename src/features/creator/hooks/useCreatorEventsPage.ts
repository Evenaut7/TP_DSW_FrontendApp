import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useUser } from '@/features/user';
import {
  useApiGet,
  useApiGetById,
  createEvento,
  updateEvento,
  deleteEvento,
} from '@/utils/api';
import type { Evento, PDI, Tag } from '@/types';
import type { EventoFormData } from '@/features/creator/components/CreatorEventModal/CreatorEventModal';

export function useCreatorEventsPage() {
  const { id } = useParams<{ id: string }>();
  const pdiId = id ? parseInt(id) : null;
  const navigate = useNavigate();
  const { user, loading: userLoading } = useUser();

  // Fetch Data
  const {
    data: pdiData,
    loading: pdiLoading,
    error: pdiError,
    refetch: refetchPdi,
  } = useApiGetById<PDI & { usuario: number }>('/api/puntosDeInteres', pdiId);
  const { data: allTags } = useApiGet<Tag[]>('/api/tags');

  // UI State
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Evento | null>(null);
  const [eventToDelete, setEventToDelete] = useState<Evento | null>(null);

  const events = pdiData?.eventos ?? [];

  // Modal Handlers
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

  // API Logic
  const handleEventSubmit = async (formData: EventoFormData) => {
    if (!pdiId || !formData.fecha) {
      // Esto no debería ocurrir si el formulario se gestiona correctamente, pero es una buena salvaguarda.
      alert('La fecha es un campo obligatorio.');
      return false;
    }
    setSubmitting(true);

    try {
      const formatTimestamp = (date: string, timeStr: string) =>
        `${date} ${timeStr}:00`;

      const payload = {
        ...formData,
        horaDesde: formatTimestamp(formData.fecha, formData.horaDesde),
        horaHasta: formatTimestamp(formData.fecha, formData.horaHasta),
        tags: formData.tags || [],
        puntoDeInteres: pdiId,
      };

      let result;
      if (editingEvent) {
        if (editingEvent.id == null) {
          throw new Error('El evento que se intenta editar no tiene un ID.');
        }
        result = await updateEvento(editingEvent.id, payload);
      } else {
        result = await createEvento(payload);
      }

      if (!result.success) {
        throw new Error(result.error || 'Error al guardar el evento');
      }

      await refetchPdi();
      return true; // Indica éxito para que el modal se cierre
    } catch (err: any) {
      alert(err.message);
      return false; // Indica fallo
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (eventToDelete == null || eventToDelete.id == null) {
      return;
    }

    try {
      const res = await deleteEvento(eventToDelete.id);
      if (!res.success) throw new Error(res.error);
      await refetchPdi();
      setEventToDelete(null);
    } catch (err: any) {
      alert(err.message);
    }
  };

  return {
    pdiId,
    pdiData,
    pdiLoading: pdiLoading || userLoading,
    pdiError,
    events,
    allTags,
    user,
    navigate,
    showModal,
    submitting,
    editingEvent,
    eventToDelete,
    setEventToDelete,
    handleOpenCreate,
    handleOpenEdit,
    handleCloseModal,
    handleEventSubmit,
    handleDeleteConfirm,
  };
}
