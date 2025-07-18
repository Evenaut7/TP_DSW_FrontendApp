import { useFetch } from "../reducers/UseFetch";
import 'bootstrap/dist/css/bootstrap.min.css'
import imagenlocalidad from "../assets/rosario.webp";
import {Link} from "react-router-dom"
interface Localidad {
    id: number;
    nombre: string;
    codUta: string;
    latitud: number;
    longitud: number;
    provincia: string;
    puntosDeInteres: string[];
    usuarios: string[];
}

const ListadoLocalidades = () => {
    const { data: localidades, loading, error } = useFetch<Localidad[]>("http://localhost:3000/api/localidades");

    if (loading) return <p>Cargando localidades...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <div className="row row-cols-1 row-cols-md-3 g-4">
            {localidades?.map(localidad => (
                <div key={localidad.id} className="col">
                    <Link to={`/localidad/${localidad.id}`}> 
                      <div className="card h-100">
                          <img src={imagenlocalidad} className="card-img-top" />
                          <div className="card-body">
                              <h5 className="card-title">{localidad.nombre}</h5>
                          </div>
                      </div>
                    </Link>   
                </div>
            ))}
        </div>
    );
};

export default ListadoLocalidades