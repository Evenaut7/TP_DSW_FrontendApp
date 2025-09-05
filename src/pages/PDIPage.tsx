import Navbar from '../components/Navbar.tsx';
import Estrellas from '../components/Estrellas.tsx';
import { useParams } from 'react-router-dom';
import { useFetchById } from '../reducers/UseFetchByID.ts';
import '../styles/PDIPage.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import PantallaDeCarga from '../components/PantallaDeCarga.tsx';
import ListadoDeTags from '../components/ListadoDeTags.tsx';
import ListadoEventos from '../components/ListadoEventos.tsx';

interface PDI {
  id: number;
  nombre: string;
  descripcion: string;
  imagenes: string[];
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

  const {
    data: pdi,
    loading,
    error,
  } = useFetchById<PDI>('http://localhost:3000/api/puntosDeInteres', pdiId);

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
            src={`http://localhost:3000/public/${pdi.imagenes[0]}`}
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
            <button className="btn btn-outline-warning favoriteBtn">
              <i className="bi bi-star"></i> Agregar a favoritos
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
    </div>
  );
};

export default PDIPage;
