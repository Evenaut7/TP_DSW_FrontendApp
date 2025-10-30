// Funciones reutilizables para fetch

const API_BASE_URL = 'http://localhost:3000';

// ==================== TIPOS ====================
type FetchOptions = {
    method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
    body?: unknown;
    headers?: Record<string, string>;
    credentials?: RequestCredentials;
};

type ApiResponse<T = unknown> = {
    success: boolean;
    data?: T;
    message?: string;
    error?: string;
};

// ==================== FUNCIÓN BASE ====================
async function apiFetch<T = unknown>(
    endpoint: string,
    options: FetchOptions = {}
    ): Promise<ApiResponse<T>> {
    const {
        method = 'GET',
        body,
        headers = {},
        credentials = 'include',
    } = options;

    const config: RequestInit = {
        method,
        credentials,
        headers: {
        'Content-Type': 'application/json',
        ...headers,
        },
    };

    if (body && method !== 'GET') {
        config.body = JSON.stringify(body);
    }

    try {
        const url = endpoint.startsWith('http') ? endpoint : `${API_BASE_URL}${endpoint}`;
        const res = await fetch(url, config);

    // Intentar parsear respuesta JSON
    const data = await res.json().catch(() => null);

    if (!res.ok) {
        return {
            success: false,
            error: data?.message || `Error: ${res.status} ${res.statusText}`,
        };
    }

    return {
        success: true,
        data: data?.data || data,
        message: data?.message,
        };
    } catch (error) {
        return {
        success: false,
        error: error instanceof Error ? error.message : 'Error de conexión',
        };
    }
}

// ==================== HELPERS ESPECÍFICOS ====================

//Realizar petición GET

export async function apiGet<T = unknown>(
    endpoint: string,
    headers?: Record<string, string>
    ): Promise<ApiResponse<T>> {
    return apiFetch<T>(endpoint, { method: 'GET', headers });
    }

//Realizar petición POST

export async function apiPost<T = unknown>(
    endpoint: string,
    body: unknown,
    headers?: Record<string, string>
    ): Promise<ApiResponse<T>> {
    return apiFetch<T>(endpoint, { method: 'POST', body, headers });
    }

//Realizar petición PUT

export async function apiPut<T = unknown>(
    endpoint: string,
    body: unknown,
    headers?: Record<string, string>
    ): Promise<ApiResponse<T>> {
    return apiFetch<T>(endpoint, { method: 'PUT', body, headers });
}

//Realizar petición DELETE
export async function apiDelete<T = unknown>(
    endpoint: string,
    body?: unknown,
    headers?: Record<string, string>
    ): Promise<ApiResponse<T>> {
    return apiFetch<T>(endpoint, { method: 'DELETE', body, headers });
}

// ==================== ENDPOINTS ESPECÍFICOS ====================

// Obtener usuario actual
export async function getCurrentUser() {
    return apiGet('/api/usuarios/currentUser');
}

// Login de usuario
export async function loginUser(gmail: string, password: string) {
    return apiPost('/api/usuarios/login', { gmail, password });
}

// Logout de usuario
export async function logoutUser() {
    return apiPost('/api/usuarios/logout', {});
}

// Verificar si es admin
export async function checkIsAdmin() {
    return apiGet('/api/usuarios/is-admin');
}

// Actualizar usuario
export async function updateUser(userId: number, data: unknown) {
    return apiPut(`/api/usuarios/${userId}`, data);
}

// Agregar favorito
export async function addFavorito(pdiId: number) {
    return apiPost('/api/puntosDeInteres/favorito', { id: pdiId });
}

// Remover favorito
export async function removeFavorito(pdiId: number) {
    return apiDelete('/api/puntosDeInteres/favorito', { id: pdiId });
}

// Obtener tags
export async function getTags() {
    return apiGet('/api/tags');
}

// Crear tag
export async function createTag(tag: unknown) {
    return apiPost('/api/tags', tag);
}

// Actualizar tag
export async function updateTag(tagId: number, tag: unknown) {
    return apiPut(`/api/tags/${tagId}`, tag);
}

// Eliminar tag
export async function deleteTag(tagId: number) {
    return apiDelete(`/api/tags/${tagId}`);
}

// Obtener provincias
export async function getProvincias() {
    return apiGet('/api/provincias');
}

// Crear provincia
export async function createProvincia(provincia: unknown) {
    return apiPost('/api/provincias', provincia);
}

// Actualizar provincia
export async function updateProvincia(provinciaId: number, provincia: unknown) {
    return apiPut(`/api/provincias/${provinciaId}`, provincia);
}

// Eliminar provincia
export async function deleteProvincia(provinciaId: number) {
    return apiDelete(`/api/provincias/${provinciaId}`);
}

// Obtener localidades
export async function getLocalidades() {
    return apiGet('/api/localidades');
}

export { API_BASE_URL };
