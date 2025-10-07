import React, { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { useAuth } from '@clerk/clerk-react';
import { useAuthApi } from '../hooks/useAuthApi';
import { useUser } from '../context/UserContext';

const MainLayout: React.FC = () => {
    const { isLoaded, isSignedIn } = useAuth();
    const { userLocal, isLoadingUser } = useUser();
    const { synchronizeUser } = useAuthApi();

    useEffect(() => {
        // Dispara la sincronización UNA VEZ que Clerk está cargado y el usuario está logueado
        if (isLoaded && isSignedIn && !userLocal && !isLoadingUser) {
            synchronizeUser()
                .catch(error => {
                    // Si falla el lazy upsert (ej: error 500 del backend), mostrar error o redirigir
                    console.error("Error al sincronizar el usuario con la DB:", error);
                    // Opcional: podrías forzar un signOut() de Clerk aquí.
                });
        }
    }, [isLoaded, isSignedIn, userLocal, isLoadingUser, synchronizeUser]);

    // Muestra pantalla de carga mientras Clerk carga o mientras esperamos la sincronización del usuario local
    if (!isLoaded || (isSignedIn && !userLocal && !isLoadingUser)) {
        return <p>Cargando aplicación y sesión...</p>; 
    }

    // Renderiza la página hija (HomePage, Localidad, etc.)
    return <Outlet />; 
};

export default MainLayout;