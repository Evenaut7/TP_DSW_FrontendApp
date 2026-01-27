// Funciones reutilizables para fetch
import { useEffect, useState } from 'react';
import { showNotification, classifyErrorByStatus, NotificationType } from './notifications';

// Leer URL base desde variables de entorno
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

// Validar en desarrollo que la variable esté configurada
if (import.meta.env.DEV && !import.meta.env.VITE_API_BASE_URL) {
    console.warn('VITE_API_BASE_URL no está configurado. Usando valor por defecto: http://localhost:3000');
}

// Log de configuración en desarrollo
if (import.meta.env.VITE_ENABLE_DEBUG === 'true') {
    console.log('API Base URL configurada:', API_BASE_URL);
}

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


    const data = await res.json().catch(() => null);

    if (!res.ok) {
        const errorMessage = data?.message || `Error: ${res.status} ${res.statusText}`;
        const errorType = classifyErrorByStatus(res.status);
        
        // Mostrar notificación automática
        showNotification(errorMessage, errorType, res.status);
        
        return {
            success: false,
            error: errorMessage,
        };
    }

    return {
        success: true,
        data: data?.data || data,
        message: data?.message,
        };
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Error de conexión';
        
        // Mostrar modal de error de red
        showNotification(
            'No se pudo conectar con el servidor. Por favor, verifica tu conexión.',
            NotificationType.NETWORK_ERROR
        );
        
        return {
        success: false,
        error: errorMessage,
        };
    }
}

// ==================== HOOKS PERSONALIZADOS ====================

export function useApiGet<T>(endpoint: string) {
    const [data, setData] = useState<T | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            const response = await apiGet<T>(endpoint);
            
            if (response.success && response.data) {
                setData(response.data as T);
                setError(null);
            } else {
                setError(response.error || 'Error al obtener datos');
            }
            setLoading(false);
        };

        fetchData();
    }, [endpoint]);

    return { data, loading, error };
}

export function useApiGetById<T>(endpoint: string, id: number | null) {
    const [data, setData] = useState<T | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (id === null) {
            setData(null);
            setLoading(false);
            return;
        }

        const fetchData = async () => {
            setLoading(true);
            const response = await apiGet<T>(`${endpoint}/${id}`);
            
            if (response.success && response.data) {
                setData(response.data as T);
                setError(null);
            } else {
                setError(response.error || 'Error al obtener el recurso');
            }
            setLoading(false);
        };

        fetchData();
    }, [endpoint, id]);

    return { data, loading, error };
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
// USUARIOS
export async function getCurrentUser() {
    return apiGet('/api/usuarios/currentUser');
}

export async function registerUser(data: { nombre: string; tipo: string; gmail: string; password: string }) {
    return apiPost('/api/usuarios/register', data);
}

export async function getUsuarios() {
    return apiGet('/api/usuarios');
}

export async function loginUser(gmail: string, password: string) {
    return apiPost('/api/usuarios/login', { gmail, password });
}

export async function logoutUser() {
    return apiPost('/api/usuarios/logout', {});
}

export async function checkIsAdmin() {
    return apiGet('/api/usuarios/is-admin');
}

export async function updateUser(userId: number, data: unknown) {
    return apiPut(`/api/usuarios/${userId}`, data);
}

// FAVORITOS
export async function addFavorito(pdiId: number) {
    return apiPost('/api/puntosDeInteres/favorito', { id: pdiId });
}

export async function removeFavorito(pdiId: number) {
    return apiDelete('/api/puntosDeInteres/favorito', { id: pdiId });
}

// TAGS
export async function getTags() {
    return apiGet('/api/tags');
}

export async function createTag(tag: unknown) {
    return apiPost('/api/tags', tag);
}

export async function updateTag(tagId: number, tag: unknown) {
    return apiPut(`/api/tags/${tagId}`, tag);
}

export async function deleteTag(tagId: number) {
    return apiDelete(`/api/tags/${tagId}`);
}

// PROVINCIAS
export async function getProvinciaById(id: number) {
    return apiGet(`/api/provincias/${id}`);
}

export async function getProvincias() {
    return apiGet('/api/provincias');
}

export async function createProvincia(provincia: unknown) {
    return apiPost('/api/provincias', provincia);
}
export async function updateProvincia(provinciaId: number, provincia: unknown) {
    return apiPut(`/api/provincias/${provinciaId}`, provincia);
}

export async function deleteProvincia(provinciaId: number) {
    return apiDelete(`/api/provincias/${provinciaId}`);
}

// LOCALIDADES
export async function getLocalidades() {
    return apiGet('/api/localidades');
}

export async function getLocalidadById(id: number) {
    return apiGet(`/api/localidades/${id}`);
}
export async function createLocalidad(data: unknown) {
    return apiPost('/api/localidades', data);
}

export async function updateLocalidad(id: number, data: unknown) {
    return apiPut(`/api/localidades/${id}`, data);
}

export async function deleteLocalidad(id: number) {
    return apiDelete(`/api/localidades/${id}`);
}

// PDI
export async function getPDIById(id: number) {
    return apiGet(`/api/puntosDeInteres/${id}`);
}

export async function createPDI(data: unknown) {
    return apiPost('/api/puntosDeInteres', data);
}

export async function updatePDI(id: number, data: unknown) {
    return apiPut(`/api/puntosDeInteres/${id}`, data);
}

export async function deletePDI(id: number) {
    return apiDelete(`/api/puntosDeInteres/${id}`);
}

export async function filterPDIs(filters: { localidad?: number; busqueda?: string; tags?: number[] }) {
    return apiPost('/api/puntosDeInteres/filtro', filters);
}

// EVENTOS
export async function getEventosByPDI(pdiId: number) {
    return apiGet(`/api/puntosDeInteres/${pdiId}/eventos`);
}

export async function createEvento(data: unknown) {
    return apiPost('/api/eventos', data);
}

export async function updateEvento(id: number, data: unknown) {
    return apiPut(`/api/eventos/${id}`, data);
}

export async function deleteEvento(id: number) {
    return apiDelete(`/api/eventos/${id}`);
}

// ==================== FUNCIÓN PARA SUBIR IMÁGENES ====================

/*
 Sube una imagen al servidor
 @param file - Archivo de imagen a subir
 @returns Respuesta con el nombre del archivo subido
*/
export async function uploadImage(file: File): Promise<ApiResponse<{ filename: string }>> {
    const formData = new FormData();
    formData.append('imagen', file);

    try {
        const url = `${API_BASE_URL}/api/imagenes`;
        const res = await fetch(url, {
            method: 'POST',
            body: formData,
            credentials: 'include',
        });

        const data = await res.json().catch(() => null);

        if (!res.ok) {
            return {
                success: false,
                error: data?.message || `Error al subir imagen: ${res.status}`,
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
            error: error instanceof Error ? error.message : 'Error al subir imagen',
        };
    }
}

// ==================== FUNCIÓN PARA OBTENER URL DE IMAGEN ====================

/*
 Construye la URL completa para una imagen pública
 @param filename - Nombre del archivo de imagen
 @returns URL completa de la imagen
*/
export function getImageUrl(filename: string): string {
    return `${API_BASE_URL}/public/${filename}`;
}

export { API_BASE_URL };