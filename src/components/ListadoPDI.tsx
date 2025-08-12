import 'bootstrap/dist/css/bootstrap.min.css';
import { Link } from 'react-router-dom';
import '../styles/ListadoPDI.css';

import img1 from '../assets/PDI_imgPrueba/img4.jpg'; // ejemplo, luego desde backend

interface PDIData {
  id: number;
  nombre: string;
  descripcion: string;
  imagen: string;
  calle: string;
  altura: number;
}

interface ListadoPDIProps {
  pdis: PDIData[];
}

const ListadoPDI = ({ pdis }: ListadoPDIProps) => {
  if (!pdis.length) return <p>No hay puntos de interés disponibles</p>;

  return (
    <div className="row g-4">
      {pdis.map((pdi) => (
        <div className="col-sm-6 col-md-4" key={pdi.id}>
          <Link
            to={`/punto-de-interes/${pdi.id}`}
            className="text-decoration-none text-dark"
          >
            <div className="card h-100 shadow-sm listado-pdi-card">
              <img
                src={img1} // luego cambiar por pdi.imagen
                className="card-img-top listado-pdi-img"
                alt={pdi.nombre}
              />
              <div className="card-body d-flex flex-column">
                <h5 className="card-title">{pdi.nombre}</h5>
                <small className="text-muted mb-2">
                  📍 {pdi.calle} {pdi.altura}
                </small>
                <p className="card-text flex-grow-1">{pdi.descripcion}</p>
                <button className="btn btn-primary mt-auto align-self-end">
                  Ver más
                </button>
              </div>
            </div>
          </Link>
        </div>
      ))}
    </div>
  );
};

export default ListadoPDI;
