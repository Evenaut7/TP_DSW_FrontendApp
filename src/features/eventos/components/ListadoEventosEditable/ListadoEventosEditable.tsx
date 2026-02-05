import React, { useEffect, useState } from 'react';
import { Row, Col, Modal, Button } from 'react-bootstrap';
import EventCard from '@/features/eventos/components/EventCard/EventCard';
import {
  useApiGetById,
  useApiGet,
  createEvento,
  updateEvento,
  deleteEvento,
} from '@/utils/api';
import { getPDIById } from '@/utils/api';
import EventoForm from './EventoForm.tsx';

import type { Evento, Tag } from '@/types';

type Props = {
  pdiId: number;
};

const ListadoEventosEditable: React.FC<Props> = ({ pdiId }) => {
  const { data, loading, error } = useApiGetById<{ eventos: Evento[] }>(
    '/api/puntosDeInteres',
    pdiId,
  );

  const { data: allTags } = useApiGet<Tag[]>('/api/tags');

  const [showModal, setShowModal] = useState(false);
  const [editEvento, setEditEvento] = useState<Evento | null>(null);
  const [events, setEvents] = useState<Evento[]>([]);
  const [form, setForm] = useState<Evento>({
    titulo: '',
    descripcion: '',
    horaDesde: '',
    horaHasta: '',
    estado: 'Disponible',
    tags: [],
    puntoDeInteres: pdiId,
  });

  const [showSuccess, setShowSuccess] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [eventoAEliminar, setEventoAEliminar] = useState<Evento | null>(null);

  useEffect(() => {
    if (editEvento) {
      const normalizedTags: number[] = Array.isArray(editEvento.tags)
        ? editEvento.tags.map((t: any) => (typeof t === 'number' ? t : t.id))
        : [];

      const toDatetimeLocal = (iso?: string) => {
        if (!iso) return '';
        const d = new Date(iso);
        const offsetMs = d.getTimezoneOffset() * 60000;
        return new Date(d.getTime() - offsetMs).toISOString().slice(0, 16);
      };

      setForm({
        ...editEvento,
        horaDesde: toDatetimeLocal(editEvento.horaDesde),
        horaHasta: toDatetimeLocal(editEvento.horaHasta),
        tags: normalizedTags,
      });
      setShowModal(true);
    }
  }, [editEvento]);

  // Inicializar/actualizar lista local de eventos cuando cambie la data del hook
  useEffect(() => {
    if (data && Array.isArray(data.eventos)) {
      setEvents(data.eventos);
    }
  }, [data]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value, checked, type } = e.target as HTMLInputElement;
    if (name === 'tags') {
      const id = Number(value);
      setForm((prev) => {
        const prevTags = Array.isArray(prev.tags) ? prev.tags : [];
        const normalized = checked
          ? [...prevTags, id]
          : prevTags.filter(
              (t: any) => (typeof t === 'number' ? t : t.id) !== id,
            );
        return { ...prev, tags: normalized };
      });
      return;
    }

    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const formatDatetimeLocalToSQL = (v?: string) => {
        if (!v) return undefined;
        const [date, time] = v.split('T');
        if (!time) return `${date} 00:00:00`;
        const timeWithSeconds =
          time.length === 5 ? `${time}:00` : time.split('.')[0];
        return `${date} ${timeWithSeconds}`;
      };

      const body = {
        titulo: form.titulo,
        descripcion: form.descripcion,
        horaDesde: formatDatetimeLocalToSQL(form.horaDesde),
        horaHasta: formatDatetimeLocalToSQL(form.horaHasta),
        estado: form.estado,
        tags: form.tags,
        puntoDeInteres: pdiId,
      };

      const result = form.id
        ? await updateEvento(form.id, body)
        : await createEvento(body);

      if (!result.success) {
        throw new Error(result.error || 'Error al guardar el evento');
      }

      // Refrescar lista de eventos desde el backend para actualizar la UI inmediatamente
      try {
        const refreshed = await getPDIById(pdiId);
        if (
          refreshed.success &&
          refreshed.data &&
          (refreshed.data as any).eventos
        ) {
          setEvents((refreshed.data as any).eventos);
        }
      } catch (refreshErr) {
        // no bloquear el flujo si falla el re-fetch
        console.warn('No se pudo refrescar eventos tras guardar:', refreshErr);
      }

      setShowModal(false);
      setShowSuccess(true);
    } catch (err) {
      alert(`❌ Error al guardar el evento: ${err}`);
    }
  };

  const handleSuccessClose = () => {
    setShowSuccess(false);
    setEditEvento(null);
  };

  const handleDelete = async () => {
    if (!eventoAEliminar || !eventoAEliminar.id) return;
    try {
      const result = await deleteEvento(eventoAEliminar.id);
      if (!result.success) {
        throw new Error(result.error || 'Error al eliminar el evento');
      }
      try {
        const refreshed = await getPDIById(pdiId);
        if (
          refreshed.success &&
          refreshed.data &&
          (refreshed.data as any).eventos
        ) {
          setEvents((refreshed.data as any).eventos);
        }
      } catch (refreshErr) {
        console.warn('No se pudo refrescar eventos tras eliminar:', refreshErr);
      }
      setShowDeleteModal(false);
      setEventoAEliminar(null);
    } catch (err) {
      alert(`❌ No se pudo eliminar el evento: ${err}`);
    }
  };

  if (loading) return <p>Cargando eventos...</p>;
  if (error) return <p>{error}</p>;
  if (!data) return <p>No hay eventos disponibles.</p>;

  return (
    <div className="eventos-container">
      <Row className="g-4">
        <Col xs={12} md={6}>
          <div
            className="evento-card placeholder-card"
            onClick={() => {
              setEditEvento(null);
              setForm({
                id: undefined,
                titulo: '',
                descripcion: '',
                horaDesde: '',
                horaHasta: '',
                estado: 'Disponible',
                tags: [],
                puntoDeInteres: pdiId,
              });
              setShowModal(true);
            }}
          >
            <div className="evento-fecha">
              <span className="evento-dia">+</span>
            </div>
            <div className="evento-info">
              <h3 className="evento-titulo">Agregar evento</h3>
            </div>
          </div>
        </Col>

        {events.map((evento) => (
          <Col key={evento.id} xs={12} md={6}>
            <EventCard evento={evento}>
              <Button
                variant="outline-primary"
                size="sm"
                onClick={() => setEditEvento(evento)}
              >
                Editar
              </Button>
              <Button
                variant="outline-danger"
                size="sm"
                className="ms-2"
                onClick={() => {
                  setEventoAEliminar(evento);
                  setShowDeleteModal(true);
                }}
              >
                Eliminar
              </Button>
            </EventCard>
          </Col>
        ))}
      </Row>

      {/* Modal Crear/Editar */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>
            {form.id ? 'Editar Evento' : 'Crear Evento'}
          </Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <EventoForm
            form={form}
            allTags={Array.isArray(allTags) ? allTags : []}
            onChange={handleChange}
            onSubmit={handleSubmit}
            onCancel={() => setShowModal(false)}
          />
        </Modal.Body>
      </Modal>

      {/* Modal de éxito */}
      <Modal show={showSuccess} onHide={handleSuccessClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>✅ Éxito</Modal.Title>
        </Modal.Header>
        <Modal.Body>Evento modificado correctamente.</Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={handleSuccessClose}>
            Aceptar
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal eliminar */}
      <Modal
        show={showDeleteModal}
        onHide={() => setShowDeleteModal(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>⚠️ Confirmar eliminación</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          ¿Estás seguro que deseas eliminar "{eventoAEliminar?.titulo}"?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancelar
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            Eliminar
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ListadoEventosEditable;
