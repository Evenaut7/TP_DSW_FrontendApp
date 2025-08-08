import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/PuntoDeInteres.css';
import { useEffect, useState } from 'react';
import Container from 'react-bootstrap/Container';
import StarRating from './Estrellas.tsx';
import { GeoAltFill } from 'react-bootstrap-icons';

{
  /* agregagar use fetch desde reducers, use paramas */
}

type PDIProps = {
  id: number;
};

type PDIData = {
  id: number;
  nombre: string;
  descripcion: string;
  imagen: string;
  calle: string;
  altura: number;
  localidad: number;
  // agregar otros campos según sea necesario
};

const PDI = ({ id }: PDIProps) => {
  const [pdi, setPdi] = useState<PDIData | null>(null);

  useEffect(() => {
    fetch(`http://localhost:3000/api/puntosDeInteres/${id}`)
      .then((res) => res.json())
      .then((data) => setPdi(data.data))
      .catch((err) => console.error('Error al cargar el PDI:', err));
  }, [id]);

  const imageModules = import.meta.glob(
    '../assets/PDI_imgPrueba/*.{jpg,jpeg,png}',
    { eager: true }
  ) as Record<string, { default: string }>;

  const images = Object.values(imageModules).map((mod) => mod.default);

  if (!pdi) return <p>Cargando punto de interés...</p>;

  return (
    <section className="pdi-section py-4">
      <Container className="my-4 d-flex justify-content-center">
        <div className="w-100">
          <div className="row g-0 align-items-center">
            <div className="col-md-6 p-4">
              <h5 className="fw-bold nombrePDI">{pdi.nombre}</h5>
              <p className="mb-2">
                <GeoAltFill style={{ marginRight: '5px', color: '#d9534f' }} />
                {pdi.calle} {pdi.altura}, {pdi.localidad}{' '}
                {/* esto deberia mandar a la localidad en caso que se quiera */}
              </p>
              <p>{pdi.descripcion}</p>
              <StarRating rating={4} reviews={20} />
            </div>

            {/* Carrusel de imágenes */}
            <div className="col-md-6">
              <div
                id="carouselExample"
                className="carousel slide"
                data-bs-ride="carousel"
                data-bs-interval="2000"
              >
                <div className="carousel-inner">
                  {images.map((img, i) => (
                    <div
                      className={`carousel-item ${i === 0 ? 'active' : ''}`}
                      key={i}
                    >
                      <img
                        src={img}
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
