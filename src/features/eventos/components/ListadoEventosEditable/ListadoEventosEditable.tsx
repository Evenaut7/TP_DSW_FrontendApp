import React, { useEffect, useState } from 'react';
import { Row, Col, Modal, Button, Form } from 'react-bootstrap';
import { useApiGetById, useApiGet, createEvento, updateEvento, deleteEvento } from '@/utils/api';
import FormField from './forms/FormField';
import TagsSelector from './forms/TagsSelector';

type Evento = {
  id?: number;
  titulo: string;
  descripcion: string;
  horaDesde: string;
  horaHasta: string;
  estado: string;
  tags: any[];
  puntoDeInteres: number;
};

type Tag = {
  id: number;
  nombre: string;
  tipo?: string;
};

type Props = {
  pdiId: number;
};

const ESTADOS = ['Disponible', 'Agotado', 'Cancelado'];

const ListadoEventosEditable: React.FC<Props> = ({ pdiId }) => {
  const { data, loading, error } = useApiGetById<{ eventos: Evento[] }>('/api/puntosDeInteres', pdiId);

  const { data: allTags } = useApiGet<Tag[]>('/api/tags');

  const [showModal, setShowModal] = useState(false);
  const [editEvento, setEditEvento] = useState<Evento | null>(null);
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

      setForm({
        ...editEvento,
        horaDesde: editEvento.horaDesde
          ? new Date(editEvento.horaDesde).toISOString().slice(0, 16)
          : '',
        horaHasta: editEvento.horaHasta
          ? new Date(editEvento.horaHasta).toISOString().slice(0, 16)
          : '',
        tags: normalizedTags,
      });
      setShowModal(true);
    }
  }, [editEvento]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, checked, type } = e.target as HTMLInputElement;
    if (name === 'tags') {
      const id = Number(value);
      setForm((prev) => ({
        ...prev,
        tags: checked ? [...prev.tags, id] : prev.tags.filter((t) => t !== id),
      }));
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
      const body = {
        ...form,
        tags: form.tags.map((t) => (typeof t === 'number' ? t : Number(t))),
        puntoDeInteres: pdiId,
      };

      const result = form.id 
        ? await updateEvento(form.id, body)
        : await createEvento(body);

      if (!result.success) {
        throw new Error(result.error || 'Error al guardar el evento');
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
    window.location.href = `/EditPDI/${pdiId}`;
  };

  const handleDelete = async () => {
    if (!eventoAEliminar || !eventoAEliminar.id) return;
    try {
      const result = await deleteEvento(eventoAEliminar.id);
      if (!result.success) {
        throw new Error(result.error || 'Error al eliminar el evento');
      }
      setShowDeleteModal(false);
      setEventoAEliminar(null);
      window.location.href = `/EditPDI/${pdiId}`;
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

        {data.eventos.map((evento) => {
          const fechaObj = new Date(evento.horaDesde);
          const dia = fechaObj.getDate();
          const mes = fechaObj.toLocaleString('es-ES', { month: 'short' });
          const horaInicio = fechaObj.toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          });
          const horaFin = new Date(evento.horaHasta).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          });

          return (
            <Col key={evento.id} xs={12} md={6}>
              <div className="evento-card">
                <div className="evento-fecha">
                  <span className="evento-dia">{dia}</span>
                  <span className="evento-mes">{mes}</span>
                </div>
                <div className="evento-info">
                  <h3 className="evento-titulo">{evento.titulo}</h3>
                  <p>{evento.descripcion}</p>
                  <p>
                    {horaInicio} - {horaFin}
                  </p>
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
                </div>
              </div>
            </Col>
          );
        })}
      </Row>

      {/* Modal Crear/Editar */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Form onSubmit={handleSubmit}>
          <Modal.Header closeButton>
            <Modal.Title>
              {form.id ? 'Editar Evento' : 'Crear Evento'}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <FormField
              label="Título"
              name="titulo"
              value={form.titulo}
              onChange={handleChange}
              required
            />
            <FormField
              label="Descripción"
              name="descripcion"
              value={form.descripcion}
              onChange={handleChange}
              as="textarea"
              required
            />
            <FormField
              label="Hora desde"
              name="horaDesde"
              type="datetime-local"
              value={form.horaDesde}
              onChange={handleChange}
              required
            />
            <FormField
              label="Hora hasta"
              name="horaHasta"
              type="datetime-local"
              value={form.horaHasta}
              onChange={handleChange}
              required
            />
            <Form.Select
              name="estado"
              value={form.estado}
              onChange={handleChange}
              className="mb-3"
              required
            >
              {ESTADOS.map((estado) => (
                <option key={estado} value={estado}>
                  {estado}
                </option>
              ))}
            </Form.Select>

            <TagsSelector
              tags={Array.isArray(allTags) ? allTags : []}
              selected={form.tags || []}
              onChange={handleChange}
            />
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Cancelar
            </Button>
            <Button variant="primary" type="submit">
              Guardar
            </Button>
          </Modal.Footer>
        </Form>
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
