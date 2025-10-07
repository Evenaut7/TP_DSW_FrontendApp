import React from 'react';
import type { ReactNode } from 'react';
import { SignedIn, SignedOut, RedirectToSignIn } from '@clerk/clerk-react';

interface ProtectedRouteProps {
    children: ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
    return (
        <>
            <SignedIn>
                {/* Si está logueado, renderiza el contenido (ej: CreatePuntoDeInteres) */}
                {children}
            </SignedIn>
            <SignedOut>
                {/* Si no está logueado, lo redirige a la URL de inicio de sesión configurada en ClerkProvider (/login) */}
                <RedirectToSignIn />
            </SignedOut>
        </>
    );
};

export default ProtectedRoute;