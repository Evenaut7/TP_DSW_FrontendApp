import { useEffect, useState } from "react";

export function useFetchById<T>(baseUrl: string, id: number | null) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id === null) return;

    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${baseUrl}/${id}`);
        if (!response.ok) throw new Error("Error al obtener el recurso");

        const json = await response.json();
        setData(json.data ?? json);
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('Error desconocido');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [baseUrl, id]);

  return { data, loading, error };
}