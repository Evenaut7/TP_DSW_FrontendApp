import React from 'react';
import { useApiGetById } from '@/utils/api';
import { Row, Col, Button } from 'react-bootstrap';
import EventCard from '@/features/eventos/components/EventCard/EventCard';
import type { Evento } from '@/types';

type ListadoEventosProps = {
  pdiId: number;
};

const ListadoEventos: React.FC<ListadoEventosProps> = ({ pdiId }) => {
  const { data, loading, error } = useApiGetById<{ eventos: Evento[] }>(
    '/api/puntosDeInteres',
    pdiId,
  );

  if (loading) return <p>Cargando eventos...</p>;
  if (error) return <p>{error}</p>;
  if (!data || data.eventos.length === 0)
    return <p>No hay eventos disponibles.</p>;

  return (
    <div className="eventos-container">
      <Row className="g-4">
        {data.eventos.map((evento) => (
          <Col key={evento.id} xs={12} md={6}>
            <EventCard evento={evento}>
              <Button className="flex-fill">Agendar</Button>
              <Button
                variant="outline-warning"
                className="favoriteBtn flex-fill"
              >
                <i className="bi bi-star"></i> Agregar a favoritos
              </Button>
            </EventCard>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default ListadoEventos;
