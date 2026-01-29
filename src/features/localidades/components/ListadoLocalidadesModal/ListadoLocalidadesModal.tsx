import React, { useEffect, useState } from 'react';
import { Modal, Card, Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import CreateLocalidadModal from './CreateLocalidadModal';
import { getProvinciaById, deleteLocalidad, getImageUrl } from '@/utils/api';
import './';

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
  const [showCreateModal, setShowCreateModal] = useState(false);
  const navigate = useNavigate();

  const fetchLocalidades = async () => {
    try {
      const response = await getProvinciaById(provinciaId);
      if (response.success && response.data) {
        // TypeScript: response.data es de tipo unknown, necesitamos hacer type assertion
        const provincia = response.data as { localidades?: Localidad[] };
        setLocalidades(provincia.localidades || []);
      } else {
        console.error('Error al obtener las localidades:', response.error);
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
    navigate(`/editLocalidad/${id}`);
  };

  const handleEliminar = async (id: number) => {
    if (!window.confirm('¿Seguro que querés eliminar esta localidad?')) return;

    try {
      const response = await deleteLocalidad(id);
      if (response.success) {
        setLocalidades((prev) => prev.filter((loc) => loc.id !== id));
      } else {
        console.error('Error al eliminar la localidad:', response.error);
      }
    } catch (error) {
      console.error('Error al eliminar la localidad:', error);
    }
  };

  const handleAbrirCrear = () => {
    onHide();
    setShowCreateModal(true);
  };

  const handleLocalidadCreada = async () => {
    setShowCreateModal(false);
    await fetchLocalidades();
    onHide();
    setTimeout(() => {
      const event = new CustomEvent('reopenListadoLocalidades');
      window.dispatchEvent(event);
    }, 200);
  };

  useEffect(() => {
    const reopenHandler = () => {
      const modal = document.getElementById('listadoLocalidadesTrigger');
      if (modal) modal.click();
    };
    window.addEventListener('reopenListadoLocalidades', reopenHandler);
    return () =>
      window.removeEventListener('reopenListadoLocalidades', reopenHandler);
  }, []);

  return (
    <>
      <Modal show={show} onHide={onHide} size="xl" centered>
        <Modal.Header closeButton>
          <Modal.Title>Localidades de la provincia</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row className="g-4">
            {localidades.map((loc) => (
              <Col key={loc.id} xs={12} md={6} lg={4}>
                <Card className="localidad-card shadow-sm border-0 h-100">
                  {loc.imagen && (
                    <Card.Img
                      variant="top"
                      src={getImageUrl(loc.imagen)}
                      alt={loc.nombre}
                      className="localidad-img"
                    />
                  )}
                  <Card.Body>
                    <Card.Title className="d-flex justify-content-between align-items-center">
                      <span className="fw-semibold">{loc.nombre}</span>
                      <div className="icon-group">
                        <i
                          className="bi bi-pencil-square text-primary fs-5 me-2 icon-action"
                          onClick={() => handleEditar(loc.id)}
                        ></i>
                        <i
                          className="bi bi-trash3 text-danger fs-5 icon-action"
                          onClick={() => handleEliminar(loc.id)}
                        ></i>
                      </div>
                    </Card.Title>
                  </Card.Body>
                </Card>
              </Col>
            ))}

            {/* Tarjeta para agregar nueva */}
            <Col xs={12} md={6} lg={4}>
              <Card
                className="add-localidad-card shadow-sm border-0 d-flex align-items-center justify-content-center text-center h-100"
                onClick={handleAbrirCrear}
              >
                <div>
                  <i className="bi bi-plus-circle fs-1 text-primary"></i>
                  <div className="fw-semibold mt-2">
                    Agregar nueva localidad
                  </div>
                </div>
              </Card>
            </Col>
          </Row>
        </Modal.Body>
      </Modal>

      {/* Modal de creación */}
      <CreateLocalidadModal
        show={showCreateModal}
        onHide={() => setShowCreateModal(false)}
        provinciaId={provinciaId}
        onLocalidadCreada={handleLocalidadCreada}
      />
    </>
  );
};

export default ListadoLocalidadesModal;
