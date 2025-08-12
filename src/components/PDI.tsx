// src/components/PDI.tsx
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/PuntoDeInteres.css';
import { useParams } from 'react-router-dom';
import { useFetchById } from '../reducers/UseFetchByID';
import Container from 'react-bootstrap/Container';
import StarRating from './Estrellas';
import { GeoAltFill } from 'react-bootstrap-icons';
import PantallaDeCarga from './PantallaDeCarga';

type PDIData = {
  id: number;
  nombre: string;
  descripcion: string;
  imagen: string;
  calle: string;
  altura: number;
  localidad: number;
};

// solo de prueba, las imágenes deberían venir del PDI
import img1 from '../assets/PDI_imgPrueba/img1.jpg';
import img2 from '../assets/PDI_imgPrueba/img2.jpg';
import img3 from '../assets/PDI_imgPrueba/img3.jpg';
import img4 from '../assets/PDI_imgPrueba/img4.jpg';

const images = [img1, img2, img3, img4];

const PDI = () => {
  const { id } = useParams<{ id: string }>();
  const pdiId = id ? parseInt(id, 10) : null;

  const {
    data: pdi,
    loading,
    error,
  } = useFetchById<PDIData>('http://localhost:3000/api/puntosDeInteres', pdiId);

  if (loading) return <PantallaDeCarga mensaje="Punto de interés" />;
  if (error) return <p>{error}</p>;
  if (!pdi) return <p>No se encontró el PDI</p>;

  return (
    <section className="pdi-section py-4">
      <Container className="my-4 d-flex justify-content-center">
        <div className="w-100">
          <div className="row g-0 align-items-center">
            {/* Info del PDI */}
            <div className="col-md-6 p-4">
              <h5 className="fw-bold nombrePDI">{pdi.nombre}</h5>
              <p className="mb-2">
                <GeoAltFill style={{ marginRight: '5px', color: '#d9534f' }} />
                {pdi.calle} {pdi.altura}, {pdi.localidad}
              </p>
              <p>{pdi.descripcion}</p>
              <div className="d-flex justify-content-between align-items-center mt-3">
                <StarRating rating={4} reviews={20} />
                <button
                  className="btn"
                  style={{ backgroundColor: '#74acdf', color: '#fff' }}
                >
                  Ver más
                </button>
              </div>
            </div>

            {/* Carrusel con las 4 imágenes de prueba */}
            <div className="col-md-6">
              <div
                id="carouselExample"
                className="carousel slide"
                data-bs-ride="carousel"
                data-bs-interval="2000"
              >
                <div className="carousel-inner">
                  {images.map((url, i) => (
                    <div
                      className={`carousel-item ${i === 0 ? 'active' : ''}`}
                      key={url}
                    >
                      <img
                        src={url}
                        className="d-block w-100 img-fluid"
                        alt={`Imagen ${i + 1}`}
                        style={{ maxHeight: '300px', objectFit: 'cover' }}
                      />
                    </div>
                  ))}
                </div>

                <button
                  className="carousel-control-prev"
                  type="button"
                  data-bs-target="#carouselExample"
                  data-bs-slide="prev"
                >
                  <span
                    className="carousel-control-prev-icon"
                    aria-hidden="true"
                  ></span>
                  <span className="visually-hidden">Anterior</span>
                </button>

                <button
                  className="carousel-control-next"
                  type="button"
                  data-bs-target="#carouselExample"
                  data-bs-slide="next"
                >
                  <span
                    className="carousel-control-next-icon"
                    aria-hidden="true"
                  ></span>
                  <span className="visually-hidden">Siguiente</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
};

export default PDI;
