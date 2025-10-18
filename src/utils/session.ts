export type User = {
    id?: number;
    nombre?: string;
    gmail?: string;
    localidad?: number;
    provincia?: number;
    puntosDeInteres?: number[];
    favoritos?: number[];
    agendaPDI?: number
} | null;

export async function getCurrentUser(): Promise<User> {
    try {
        const res = await fetch('http://localhost:3000/api/usuarios/currentUser', {
            credentials: 'include',
        });
        if (!res.ok) {
            return null;
        }
        const response = await res.json().catch(() => null);
        const user = response?.data ?? null;
        return user as User;
    } catch  {
        return null;
    }
}

export async function logout(): Promise<boolean> {
    try {
        const res = await fetch('http://localhost:3000/api/usuarios/logout', {
        method: 'POST',
        credentials: 'include',
        });
        if (!res.ok) return false;
        return res.ok;
    } catch {
        return false;
    }
}
