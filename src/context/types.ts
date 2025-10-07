
export interface ApiResponse<T> {
    message: string;
    data: T;
}
export type UsuarioLocal = {
    clerkUserId: string;
    gmail: string;
    nombreUsuario?: string;
    tipo?: string;
    localidad?: { id: number, provincia: number }; 
    puntosDeInteres?: number[];
    favoritos?: number[];
}
export type UserContextType = {
    userLocal: UsuarioLocal | null;
    setUserLocal: (user: UsuarioLocal | null) => void;
    isLoadingUser: boolean;
    setIsLoadingUser: (loading: boolean) => void;
}