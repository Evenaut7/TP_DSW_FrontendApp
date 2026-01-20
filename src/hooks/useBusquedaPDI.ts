import { useEffect, useState } from 'react';

interface PDI {
  id: number;
  nombre: string;
  descripcion: string;
  imagen: string;
  calle: string;
  altura: number;
}

interface UseBusquedaPDIParams {
  localidadId: number | null;
  busqueda: string;
  tags: number[];
  pdisIniciales: PDI[];
}

export function useBusquedaPDI({
  localidadId,
  busqueda,
  tags,
  pdisIniciales,
}: UseBusquedaPDIParams) {
  const [pdis, setPdis] = useState<PDI[]>(pdisIniciales);
  // const [pdis, setPdis] = useState<PDI[]>([]);
  const [loadingPDIs, setLoading] = useState(false);

  useEffect(() => {
    if (!localidadId) return;

    // SIN filtros → mostramos los PDIs iniciales
    if (busqueda.trim() === '' && tags.length === 0) {
      setPdis(pdisIniciales);
      return;
    }

    setLoading(true);

    const timeout = setTimeout(async () => {
      try {
        const res = await fetch(
          'http://localhost:3000/api/puntosDeInteres/filtro',
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              localidad: localidadId,
              busqueda: busqueda.trim(),
              tags,
            }),
          }
        );

        const json = await res.json();
        setPdis(Array.isArray(json.data) ? json.data : []);
      } catch (err) {
        console.error('Error en búsqueda PDI:', err);
        setPdis([]);
      } finally {
        setLoading(false);
      }
    }, 400);

    return () => clearTimeout(timeout);
  }, [localidadId, busqueda, tags, pdisIniciales]);

  return { pdis, loadingPDIs };
}
