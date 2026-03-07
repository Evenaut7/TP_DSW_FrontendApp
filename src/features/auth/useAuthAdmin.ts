import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '@/features/user';
import { checkIsAdmin } from '@/utils/api';

let adminCheckPromise: Promise<boolean> | null = null;
let lastUserId: string | number | null | undefined = null;

export function useAuthAdmin() {
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null); // null = sin saber aún
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { user } = useUser();

  useEffect(() => {
    let isMounted = true;

    const checkAdmin = async () => {
      
      if (!user) {  
        if (isMounted) {
          setIsAdmin(false);
          setLoading(false);
        }
        return;
      }

      const currentUserId = user.id || user.gmail;
      if (lastUserId !== currentUserId) {
        adminCheckPromise = null;
        lastUserId = currentUserId;
      }

      if (isMounted) setLoading(true);

      if (!adminCheckPromise) {
        adminCheckPromise = checkIsAdmin()
          .then((response) => {
            if (response.success && response.data) {
              // @ts-expect-error - data puede tener isAdmin
              return response.data.isAdmin === true;
            }
            return false;
          })
          .catch((err) => {
            console.error(err);
            return false;
          });
      }

      const result = await adminCheckPromise;

      if (isMounted) {
        setIsAdmin(result);
        setError(null);
        setLoading(false);
      }
    };

    checkAdmin();

    return () => {
      isMounted = false;
    };
  }, [navigate, user]); 

  return { loading, isAdmin, error };
}
