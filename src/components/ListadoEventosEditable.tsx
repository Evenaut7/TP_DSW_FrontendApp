import React, { useEffect, useState } from 'react';
import { Row, Col, Modal, Button, Form } from 'react-bootstrap';
import { useFetchById } from '../reducers/UseFetchByID';
import FormField from './forms/FormField';

type Evento = {
  id?: number;
  titulo: string;
  descripcion: string;
  horaDesde: string;
  horaHasta: string;
  estado: string;
  tags: number[];
  puntoDeInteres: number;
};

type Props = {
  pdiId: number;
};

const ListadoEventosEditable: React.FC<Props> = ({ pdiId }) => {
  const fetchResult = useFetchById<{ eventos: Evento[] }>(
    `http://localhost:3000/api/puntosDeInteres/`,
    pdiId
  ) as unknown as {
    data: { eventos: Evento[] } | null;
    loading: boolean;
    error: string | null;
    reload?: () => void;
  };

  const { data, loading, error, reload } = fetchResult;

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

  useEffect(() => {
    if (editEvento) {
      setForm(editEvento);
      setShowModal(true);
    }
  }, [editEvento]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const method = form.id ? 'PATCH' : 'POST';
      const url = form.id
        ? `http://localhost:3000/api/eventos/${form.id}`
        : 'http://localhost:3000/api/eventos';

      const body = { ...form, puntoDeInteres: pdiId };

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const json = await res.json();
      if (!res.ok)
        throw new Error(json.message || 'Error al guardar el evento');

      setShowModal(false);
      setEditEvento(null);
      reload?.();
    } catch (err) {
      alert(`❌ Error al guardar el evento: ${err}`);
    }
  };

  if (loading) return <p>Cargando eventos...</p>;
  if (error) return <p>{error}</p>;
  if (!data) return <p>No hay eventos disponibles.</p>;

  return (
    <div className="eventos-container">
      <Row className="g-4">
        {/* Tarjeta para crear nuevo evento */}
        <Col xs={12} md={6}>
          <div
            className="evento-card placeholder-card"
            onClick={() => setShowModal(true)}
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
                </div>
              </div>
            </Col>
          );
        })}
      </Row>

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
            <FormField
              label="Estado"
              name="estado"
              value={form.estado}
              onChange={handleChange}
              required
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
    </div>
  );
};

export default ListadoEventosEditable;
