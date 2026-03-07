import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '@/features/user';
import { checkIsAdmin } from '@/utils/api';

export function useAuthAdmin() {
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null); // null = sin saber aún
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { user } = useUser();

  useEffect(() => {
    const checkAdmin = async () => {
      
      if (!user) {  // Si no hay usuario, no es admin
        setIsAdmin(false);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await checkIsAdmin();

        if (response.success && response.data) {
          // @ts-expect-error - data puede tener isAdmin
          setIsAdmin(response.data.isAdmin === true);
          setError(null);
        } else if (response.error === 'User is not admin') {
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
  }, [navigate, user]); // Ahora depende del user

  return { loading, isAdmin, error };
}
