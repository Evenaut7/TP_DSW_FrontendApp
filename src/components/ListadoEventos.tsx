import { useFetch } from "../reducers/UseFetch";
import 'bootstrap/dist/css/bootstrap.min.css'
import imagenEvento from '../assets/eventoStock.jpg';

interface Evento {
    id: number;
    titulo: string;
    descripcion: string;
    horaDesde: string;
    horaHasta: string;
    estado: string;
    puntoDeInteres: number;
    tags: string[];
}

const LisatadoEventos = () => {
    const { data: eventos, loading, error } = useFetch<Evento[]>("http://localhost:3000/api/evento");

    if (loading) return <p>Cargando eventos...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <div className="row row-cols-1 row-cols-md-3 g-4">
            {eventos?.map(evento => (
                <div key={evento.id} className="col">
                    <div className="card h-100">
                        <img src={imagenEvento} className="card-img-top" />
                        <div className="card-body">
                            <h5 className="card-title">{evento.titulo}</h5>
                            <p className="card-text">{evento.descripcion}</p>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default LisatadoEventos;