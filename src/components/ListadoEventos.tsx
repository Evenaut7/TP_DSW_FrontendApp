import { useFetch } from "../reducers/UseFetch";

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

const EventosList = () => {
    const { data: eventos, loading, error } = useFetch<Evento[]>("http://localhost:3000/api/evento");

    if (loading) return <p>Cargando eventos...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <div>
            <h2>Lista de Eventos</h2>
            <ul>
                {eventos?.map(evento => (
                    <li key={evento.id}>
                        <h3>{evento.titulo}</h3>
                        <p>{evento.descripcion}</p>
                        <p>Desde: {new Date(evento.horaDesde).toLocaleString()}</p>
                        <p>Hasta: {new Date(evento.horaHasta).toLocaleString()}</p>
                        <p>Estado: {evento.estado}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default EventosList;