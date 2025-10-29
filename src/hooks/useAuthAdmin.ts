import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export function useAuthAdmin() {
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null); // null = sin saber aún
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAdmin = async () => {
      try {
        const res = await fetch('http://localhost:3000/api/usuarios/is-admin', {
          credentials: 'include', // envía cookie de sesión
        });
        const data = await res.json();

        if (res.ok && data.isAdmin) {
          setIsAdmin(true);
          setError(null);
        } else if (res.status === 401 && data.message === 'User is not admin') {
          setIsAdmin(false);
          setError('No tenés permisos para acceder a esta página');
        } else {
          // Usuario no logueado
          navigate('/'); //redirije al home, deberia redirigir al login
        }
      } catch (err) {
        console.error(err);
        setError('Error al verificar permisos');
      } finally {
        setLoading(false);
      }
    };

    checkAdmin();
  }, [navigate]);

  return { loading, isAdmin, error };
}
