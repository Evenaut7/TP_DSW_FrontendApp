// Define la interfaz de tu Usuario local (completa con todas las propiedades que necesitas)
export interface UsuarioLocal {
    clerkUserId: string;
    gmail: string;
    nombreUsuario?: string;
    tipo?: string;
    localidad?: { id: number, provincia: number }; 
    puntosDeInteres?: number[];
    favoritos?: number[];
}

export interface UserContextType {
    userLocal: UsuarioLocal | null;
    setUserLocal: (user: UsuarioLocal | null) => void;
    isLoadingUser: boolean;
    setIsLoadingUser: (loading: boolean) => void;
}
