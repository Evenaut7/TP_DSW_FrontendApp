import { useEffect, useState } from "react";

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

interface ApiResponse {
    message: string;
    data: Evento[];
}

const ListadoEventos = () => {
    const [eventos, setEventos] = useState<Evento[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchEventos = async () => {
            try {
                const response = await fetch("http://localhost:3000/api/evento");
                if (!response.ok) throw new Error("Error al obtener eventos");

                const json: ApiResponse = await response.json();
                setEventos(json.data);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchEventos();
    }, []);

    if (loading) return <p>Cargando eventos...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <>
            {eventos.map(evento => (
                <ul key={evento.id}>
                    <h3>{evento.titulo}</h3>
                    <p>{evento.descripcion}</p>
                    <p>Desde: {new Date(evento.horaDesde).toLocaleString()}</p>
                    <p>Hasta: {new Date(evento.horaHasta).toLocaleString()}</p>
                    <p>Estado: {evento.estado}</p>
                </ul>
            ))}
        </>
    );
};

export default ListadoEventos