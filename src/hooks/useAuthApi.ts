import { useAuth } from '@clerk/clerk-react';
import { useUser } from '../context/UserContext'; 
import type { UsuarioLocal } from '../context/types';

interface ApiResponse<T> {
    message: string;
    data: T;
}

export function useAuthApi() {
    const { getToken, isLoaded, isSignedIn } = useAuth();
    const { userLocal, setUserLocal, setIsLoadingUser } = useUser();
    const API_BASE_URL = 'http://localhost:3000/api'; 

    const authFetch = async <T>(endpoint: string, options: RequestInit = {}): Promise<T> => {
        if (!isLoaded || !isSignedIn) {
            // El componente que llama debería manejar esta excepción con un SignedOut/Redirect
            throw new Error("El usuario no ha iniciado sesión o el SDK no está listo.");
        }

        const token = await getToken({ template: 'api-access' }); // Aseguramos el token para la API
        if (!token) {
            throw new Error("No se pudo obtener el token de autenticación.");
        }

        const headers = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`, 
            ...options.headers,
        };

        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            ...options,
            headers,
        });

        // 401 Unauthorized del backend (por tu middleware 'protect')
        if (response.status === 401) {
             throw new Error("Acceso no autorizado (401). Token inválido o expirado.");
        }

        if (!response.ok) {
            const errorBody = await response.json().catch(() => ({ message: response.statusText }));
            throw new Error(`Error ${response.status}: ${errorBody.message || response.statusText}`);
        }

        return (await response.json()) as T;
    };

    const synchronizeUser = async (): Promise<UsuarioLocal> => {
        setIsLoadingUser(true);
        try {
            const response = await authFetch<ApiResponse<UsuarioLocal>>('/usuarios/me', {
                method: 'GET',
            });
            setUserLocal(response.data);
            return response.data;
        } catch (error) {
            setUserLocal(null); // Asegura que el estado local se limpia si falla
            throw error;
        } finally {
            setIsLoadingUser(false);
        }
    };

    return {
        isApiReady: isLoaded && isSignedIn,
        userLocal,
        authFetch,
        synchronizeUser,
    };
}