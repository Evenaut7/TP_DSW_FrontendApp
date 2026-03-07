import { useEffect, useState } from 'react';
import { API_BASE_URL } from '@/utils/api';

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
  const [loadingPDIs, setLoading] = useState(false);

  const tagsKey = JSON.stringify(tags);
  const pdisIds = pdisIniciales.map((p) => p.id).join(',');

  useEffect(() => {
    if (busqueda.trim() === '' && tags.length === 0) {
      setPdis(pdisIniciales);
      setLoading(false);
    }
  }, [pdisIds]);

  useEffect(() => {
    if (!localidadId) return;

    if (busqueda.trim() === '' && tags.length === 0) {
      setPdis(pdisIniciales);
      setLoading(false);
      return;
    }

    setLoading(true);

    const timeout = setTimeout(async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/puntosDeInteres/filtro`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            localidad: localidadId,
            busqueda: busqueda.trim(),
            tags,
          }),
        });

        const json = await res.json();
        setPdis(Array.isArray(json.data) ? json.data : []);
      } catch (err) {
        console.error('Error en busqueda PDI:', err);
        setPdis([]);
      } finally {
        setLoading(false);
      }
    }, 400);

    return () => clearTimeout(timeout);
  }, [localidadId, busqueda, tagsKey, pdisIds]);

  return { pdis, loadingPDIs };
}
