import 'bootstrap/dist/css/bootstrap.min.css';
import { Link } from 'react-router-dom';

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
    <div className="row">
      {pdis.map((pdi) => (
        <div className="col-md-4 mb-3" key={pdi.id}>
          <Link
            to={`/punto-de-interes/${pdi.id}`}
            className="text-decoration-none text-dark"
          >
            <div className="card h-100 shadow-sm hover-shadow">
              <img
                src={`/assets/PDI_imgPrueba/${pdi.imagen}`}
                className="card-img-top"
                alt={pdi.nombre}
                style={{ maxHeight: '200px', objectFit: 'cover' }}
              />
              <div className="card-body">
                <h5 className="card-title">{pdi.nombre}</h5>
                <p className="card-text">{pdi.descripcion}</p>
                <small className="text-muted">
                  📍 {pdi.calle} {pdi.altura}
                </small>
              </div>
            </div>
          </Link>
        </div>
      ))}
    </div>
  );
};

export default ListadoPDI;
