import { useApiGet, API_BASE_URL } from '@/utils/api';
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
    const { data: localidades, loading, error } = useApiGet<Localidad[]>('/api/localidades');

    if (loading) return <p>Cargando localidades...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <div className="contenedor-localidades">
            {localidades?.map(localidad => (
                <div key={localidad.id} className="col">
                    <Link to={`/localidad/${localidad.id}`}> 
                        <div className="localidadCard">
                        <img src={`${API_BASE_URL}/public/${localidad.imagen}`} className="card-img" />
                        <h5 className="cardTitle">{localidad.nombre}</h5>
                        </div>
                    </Link>   
                </div>
            ))}
        </div>
    );
};

export default ListadoLocalidades