import { useState, useEffect } from 'react';
import { useUser } from '@/features/user';
import { API_BASE_URL } from '@/utils/api';
import type { PDI } from '@/types';

export function useCreatorPDI() {
  const { user } = useUser();
  const [pdiList, setPdiList] = useState<PDI[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch PDIs del usuario creador logueado
  useEffect(() => {
    const fetchPDIs = async () => {
      if (!user?.id || user.tipo !== 'creador') {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await fetch(
          `${API_BASE_URL}/api/puntosDeInteres/usuarioPdis`,
          {
            credentials: 'include',
          },
        );

        if (!response.ok) throw new Error('Error fetching PDIs');

        const data = await response.json();
        setPdiList(data.data || []);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error desconocido');
        setPdiList([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPDIs();
  }, [user?.id, user?.tipo]);

  return {
    pdiList,
    loading,
    error,
    refetch: async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `${API_BASE_URL}/api/puntosDeInteres/usuarioPdis`,
          {
            credentials: 'include',
          },
        );
        if (!response.ok) throw new Error('Error fetching PDIs');
        const data = await response.json();
        setPdiList(data.data || []);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error desconocido');
      } finally {
        setLoading(false);
      }
    },
  };
}
