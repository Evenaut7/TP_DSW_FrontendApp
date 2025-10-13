import React, { useEffect, useState } from 'react';
import { Modal, Card, Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

interface Localidad {
  id: number;
  nombre: string;
  imagen?: string;
  latitud?: number;
  longitud?: number;
}

interface Props {
  show: boolean;
  onHide: () => void;
  provinciaId: number;
}

const ListadoLocalidadesModal: React.FC<Props> = ({
  show,
  onHide,
  provinciaId,
}) => {
  const [localidades, setLocalidades] = useState<Localidad[]>([]);
  const navigate = useNavigate();

  const fetchLocalidades = async () => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/provincias/${provinciaId}`
      );

      if (response.ok) {
        const data = await response.json();
        setLocalidades(data.data.localidades || []);
      } else {
        console.error('Error al obtener las localidades');
      }
    } catch (error) {
      console.error('Error al obtener las localidades:', error);
    }
  };

  useEffect(() => {
    if (show) fetchLocalidades();
  }, [show]);

  const handleEditar = (id: number) => {
    onHide();
    navigate(`/CRUDlocalidad/${id}`);
  };

  const handleCrear = () => {
    onHide();
    navigate(`/localidades/nueva?provinciaId=${provinciaId}`);
  };

  return (
    <Modal show={show} onHide={onHide} size="xl" centered>
      <Modal.Header closeButton>
        <Modal.Title>Localidades de la provincia</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Row className="g-4">
          {localidades.map((loc) => (
            <Col key={loc.id} xs={12} md={6} lg={4}>
              <Card
                className="shadow-sm border-0 localidad-card h-100"
                style={{
                  borderRadius: '14px',
                  transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                  cursor: 'pointer',
                }}
                onClick={() => handleEditar(loc.id)}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.boxShadow =
                    '0 4px 12px rgba(0,0,0,0.15)')
                }
                onMouseLeave={(e) => (e.currentTarget.style.boxShadow = 'none')}
              >
                {loc.imagen && (
                  <Card.Img
                    variant="top"
                    src={`http://localhost:3000/public/${loc.imagen}`}
                    alt={loc.nombre}
                    style={{
                      height: '160px',
                      objectFit: 'cover',
                      borderTopLeftRadius: '14px',
                      borderTopRightRadius: '14px',
                    }}
                  />
                )}
                <Card.Body>
                  <Card.Title className="d-flex justify-content-between align-items-center">
                    <span className="fw-semibold">{loc.nombre}</span>
                    <i className="bi bi-pencil-square text-primary fs-5"></i>
                  </Card.Title>
                </Card.Body>
              </Card>
            </Col>
          ))}

          {/* Tarjeta para agregar nueva */}
          <Col xs={12} md={6} lg={4}>
            <Card
              className="shadow-sm border-0 d-flex align-items-center justify-content-center text-center h-100"
              style={{
                borderRadius: '14px',
                background: '#f8f9fa',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
              onClick={handleCrear}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background = '#e9ecef')
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.background = '#f8f9fa')
              }
            >
              <div>
                <i className="bi bi-plus-circle fs-1 text-primary"></i>
                <div className="fw-semibold mt-2">Agregar nueva localidad</div>
              </div>
            </Card>
          </Col>
        </Row>
      </Modal.Body>
    </Modal>
  );
};

export default ListadoLocalidadesModal;
