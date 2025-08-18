import { useFetch } from "../reducers/UseFetch";
import 'bootstrap/dist/css/bootstrap.min.css'
import {Link} from "react-router-dom"
import "../styles/ListadoLocalidades.css"

interface Localidad {
    id: number;
    nombre: string;
    codUta: string;
    latitud: number;
    longitud: number;
    imagen: string;
    provincia: string;
    puntosDeInteres: string[];
    usuarios: string[];
}

const ListadoLocalidades = () => {
    const { data: localidades, loading, error } = useFetch<Localidad[]>("http://localhost:3000/api/localidades");

    if (loading) return <p>Cargando localidades...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <div className="row row-cols-1 row-cols-md-4 g-3">
            {localidades?.map(localidad => (
                <div key={localidad.id} className="col">
                    <Link to={`/localidad/${localidad.id}`}> 
                        <div className="localidadCard card h-100 ">
                        <img src={`http://localhost:3000/public/${localidad.imagen}`} className="card-img" />
                        <h5 className="cardTitle">{localidad.nombre}</h5>
                        </div>
                    </Link>   
                </div>
            ))}
        </div>
    );
};

export default ListadoLocalidades