export type Localidad = {
    id: number;
    nombre: string;
    latitud?: number;
    longitud?: number;
    imagen?: string;
    descripcion?: string;
    provincia: {
        id: number;
        nombre: string;
    };
};

export type PDI = {
    id: number;
    nombre: string;
    descripcion: string;
    imagen: string;
    calle: string;
    altura: number;
    latitud?: number;
    longitud?: number;
    privado?: boolean;
    localidad: {
        id: number;
        nombre: string;
    };
    eventos?: {
        id: number;
        titulo: string;
        descripcion: string;
        horaDesde: string;
        horaHasta: string;
    }[];
};

export type UpdateUserData = {
    nombre?: string;
    gmail?: string;
    cuit?: string;
    localidad?: number;
};

export type User = {
    id?: number;
    nombre?: string;
    gmail?: string;
    cuit?: string;
    tipo?: "creador" | "usuario" | "admin";
    localidad?: Localidad | null;
    puntosDeInteres?: number[];
    favoritos?: PDI[];
    agendaPDI?: number[];
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

export async function login(gmail: string, password: string): Promise<{ success: boolean; error?: string }> {
    try {
        const res = await fetch('http://localhost:3000/api/usuarios/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ gmail, password }),
        });

        if (!res.ok) {
            const errorData = await res.json().catch(() => null);
            return { success: false, error: errorData?.message || 'Error al iniciar sesión' };
        }

        return { success: true };
    } catch {
        return { success: false, error: 'Error de conexión al iniciar sesión' };
    }
}

export async function updateUser(userId: number, data: UpdateUserData): Promise<{ success: boolean; error?: string }> {
    try {
        // Validar email
        if (data.gmail) {
            const emailRegex = /^[^\s@]+@[^\s@]+mail\.com$/;
            if (!emailRegex.test(data.gmail)) {
                return { success: false, error: 'El email debe tener formato válido y terminar en mail.com' };
            }
        }

        const res = await fetch(`http://localhost:3000/api/usuarios/${userId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify(data),
        });

        if (!res.ok) {
            const errorData = await res.json().catch(() => null);
            return { success: false, error: errorData?.message || 'Error al actualizar perfil' };
        }

        return { success: true };
    } catch {
        return { success: false, error: 'Error de conexión al actualizar perfil' };
    }
}

export async function addFavorito(pdiId: number): Promise<{ success: boolean; error?: string }> {
    try {
        const res = await fetch('http://localhost:3000/api/puntosDeInteres/favorito', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ id: pdiId }),
        });

        if (!res.ok) {
            const errorData = await res.json().catch(() => null);
            return { success: false, error: errorData?.message || 'Error al agregar favorito' };
        }

        return { success: true };
    } catch {
        return { success: false, error: 'Error de conexión al agregar favorito' };
    }
}

export async function removeFavorito(pdiId: number): Promise<{ success: boolean; error?: string }> {
    try {
        const res = await fetch('http://localhost:3000/api/puntosDeInteres/favorito', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ id: pdiId }),
        });

        if (!res.ok) {
            const errorData = await res.json().catch(() => null);
            return { success: false, error: errorData?.message || 'Error al quitar favorito' };
        }

        return { success: true };
    } catch {
        return { success: false, error: 'Error de conexión al quitar favorito' };
    }
}
