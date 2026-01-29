import React from 'react';
import { useApiGetById } from '@/utils/api';
import './';
import { Row, Col } from 'react-bootstrap';

type Evento = {
  id: number;
  titulo: string;
  descripcion: string;
  horaDesde: string;
  horaHasta: string;
};

type ListadoEventosProps = {
  pdiId: number;
};

const ListadoEventos: React.FC<ListadoEventosProps> = ({ pdiId }) => {
  const { data, loading, error } = useApiGetById<{ eventos: Evento[] }>(
    '/api/puntosDeInteres',
    pdiId
  );

  if (loading) return <p>Cargando eventos...</p>;
  if (error) return <p>{error}</p>;
  if (!data || data.eventos.length === 0)
    return <p>No hay eventos disponibles.</p>;

  return (
    <div className="eventos-container">
      <Row className="g-4">
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
              <div key={evento.id} className="evento-card">
                {/* Fecha a la izquierda */}
                <div className="evento-fecha">
                  <span className="evento-dia">{dia}</span>
                  <span className="evento-mes">{mes}</span>
                </div>

                {/* Info a la derecha */}
                <div className="evento-info">
                  <h3 className="evento-titulo">{evento.titulo}</h3>
                  <p className="evento-horario">
                    {horaInicio} - {horaFin}
                  </p>
                  <p className="evento-descripcion">{evento.descripcion}</p>

                  {/* Botones */}
                  <div className="evento-acciones d-flex gap-2">
                    <button className="btn btn-primary flex-fill">
                      Agendar
                    </button>
                    <button className="btn btn-outline-warning favoriteBtn flex-fill">
                      <i className="bi bi-star"></i> Agregar a favoritos
                    </button>
                  </div>
                </div>
              </div>
            </Col>
          );
        })}
      </Row>
    </div>
  );
};

export default ListadoEventos;
