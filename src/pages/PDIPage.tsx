import Navbar from '../components/Navbar.tsx';
import Estrellas from '../components/Estrellas.tsx';
import { useParams } from 'react-router-dom';
import { useFetchById } from '../reducers/UseFetchByID.ts';
import { useUser } from '../hooks/useUser.ts';
import { addFavorito, removeFavorito } from '../utils/session.ts';
import { useState, useEffect } from 'react';
import ResultModal from '../components/ResultModal.tsx';
import '../styles/PDIPage.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import PantallaDeCarga from '../components/PantallaDeCarga.tsx';
import ListadoDeTags from '../components/ListadoDeTags.tsx';
import ListadoEventos from '../components/ListadoEventos.tsx';

interface PDI {
  id: number;
  nombre: string;
  descripcion: string;
  imagen: string;
  calle: string;
  altura: number;
  localidad: {
    id: number;
    nombre: string;
  };
  eventos?: {
    id: number;
    titulo: string;
    descripcion: string;
    horaDesde: string;
    horaHasta: string;
  }[];
}

const PDIPage = () => {
  const { id } = useParams<{ id: string }>();
  const pdiId = id ? parseInt(id) : null;
  const { user, refreshUser } = useUser();
  const [loadingFavorito, setLoadingFavorito] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const {
    data: pdi,
    loading,
    error,
  } = useFetchById<PDI>('http://localhost:3000/api/puntosDeInteres', pdiId);

  // Estado local para el favorito
  const [localEsFavorito, setLocalEsFavorito] = useState(false);

  // Actualizar el useEffect para sincronizar
  useEffect(() => {
    if (user && pdiId) {
      setLocalEsFavorito(user.favoritos?.some(fav => fav.id === pdiId) || false);
    }
  }, [user, pdiId]);

  const handleToggleFavorito = async () => {
    if (!pdiId || !user) return;
    
    setLoadingFavorito(true);
    
    if (localEsFavorito) {
      const result = await removeFavorito(pdiId);
      if (result.success) {
        await refreshUser();
        setLocalEsFavorito(false); // Actualización optimista
      } else {
        setErrorMessage(result.error || 'Error al quitar de favoritos');
        setShowErrorModal(true);
      }
    } else {
      const result = await addFavorito(pdiId);
      if (result.success) {
        await refreshUser();
        setLocalEsFavorito(true); // Actualización optimista
      } else {
        setErrorMessage(result.error || 'Error al agregar a favoritos');
        setShowErrorModal(true);
      }
    }
    
    setLoadingFavorito(false);
  };

  if (loading) return <PantallaDeCarga mensaje={'PDI'} />;
  if (error) return <p>Error: {error}</p>;
  if (!pdi) return <p>No se encontró el PDI</p>;

  return (
    <div className="backgroundPDI">
      <Navbar />
      {/* Contenido */}
      <div className="divPDI">
        {/* Hero con imagen + título */}
        <div className="heroPDI">
          <img
            src={`http://localhost:3000/public/${pdi.imagen}`}
            alt={pdi.nombre}
            className="heroImage"
          />
          <div className="heroOverlay">
            <h1 className="heroTitle">{pdi.nombre}</h1>
          </div>
        </div>

        <div className="descriptionPDI bg-light p-4 rounded ">
          {/* Dirección */}
          <p className="text-muted mb-3">
            📍 {pdi.calle} {pdi.altura}
          </p>

          <p className="mb-3">{pdi.descripcion}</p>

          <div className="underDescriptionPDI mb-3">
            <Estrellas rating={3} reviews={37} />
          </div>

          {/* Botones */}
          <div className="d-flex gap-3">
            <button className="btn btn-primary">Conocer historias</button>
            <button 
              className={`btn ${localEsFavorito ? 'btn-warning' : 'btn-outline-warning'} favoriteBtn`}
              onClick={handleToggleFavorito}
              disabled={loadingFavorito || !user}
            >
              <i className={`bi ${localEsFavorito ? 'bi-star-fill' : 'bi-star'}`}></i>{' '}
              {localEsFavorito ? 'En favoritos' : 'Agregar a favoritos'}
            </button>
          </div>
        </div>

        <div className="proximosEventosBanner">
          <h3>Próximos eventos</h3>
        </div>

        <ListadoDeTags />

        <div className="listadoEventos">
          <ListadoEventos pdiId={pdi.id} />
        </div>
      </div>

      <ResultModal
        show={showErrorModal}
        success={false}
        message={errorMessage}
        onClose={() => setShowErrorModal(false)}
      />
    </div>
  );
};

export default PDIPage;
