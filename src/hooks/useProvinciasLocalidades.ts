import { useState, useEffect } from 'react';

export type Localidad = {
    id: number;
    nombre: string;
    provincia: number;
};

export type Provincia = {
    id: number;
    nombre: string;
    localidades?: Localidad[];
};

export function useProvinciasLocalidades() {
    const [provincias, setProvincias] = useState<Provincia[]>([]);
    const [localidades, setLocalidades] = useState<Localidad[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                
                const resProvincias = await fetch('http://localhost:3000/api/provincias');
                if (!resProvincias.ok) throw new Error('Error al cargar provincias');
                const dataProvincias = await resProvincias.json();
                const provinciasData = dataProvincias.data || [];
                

                const resLocalidades = await fetch('http://localhost:3000/api/localidades');
                if (!resLocalidades.ok) throw new Error('Error al cargar localidades');
                const dataLocalidades = await resLocalidades.json();
                const localidadesData = dataLocalidades.data || [];
                
                setProvincias(provinciasData);
                setLocalidades(localidadesData);
                setError(null);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Error desconocido');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const getLocalidadesByProvincia = (provinciaId: number | undefined): Localidad[] => {
        if (!provinciaId) return [];
        return localidades.filter(loc => loc.provincia === provinciaId);
    };

    return { provincias, localidades, loading, error, getLocalidadesByProvincia };
}
