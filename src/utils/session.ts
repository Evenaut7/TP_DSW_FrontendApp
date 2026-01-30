import type { User, UpdateUserData } from '@/types';
import * as api from './api';

export type { User, UpdateUserData };

// Obtiene el usuario actualmente autenticado.
// Usuario actual o null si no está autenticado
export async function getCurrentUser(): Promise<User> {
    const response = await api.getCurrentUser();
    if (response.success && response.data) {
        return response.data as User;
    }
    return null;
}

export async function logout(): Promise<boolean> {
    const response = await api.logoutUser();
    return response.success;
}

export async function login(gmail: string, password: string): Promise<{ success: boolean; error?: string }> {
    const response = await api.loginUser(gmail, password);
    return {
        success: response.success,
        error: response.error,
    };
}

export async function updateUser(userId: number, data: UpdateUserData): Promise<{ success: boolean; error?: string }> {
    // Validar email
    if (data.gmail) {
        const emailRegex = /^[^\s@]+@[^\s@]+mail\.com$/;
        if (!emailRegex.test(data.gmail)) {
            return { success: false, error: 'El email debe tener formato válido y terminar en mail.com' };
        }
    }

    const response = await api.updateUser(userId, data);
    return {
        success: response.success,
        error: response.error,
    };
}

export async function addFavorito(pdiId: number): Promise<{ success: boolean; error?: string }> {
    const response = await api.addFavorito(pdiId);
    return {
        success: response.success,
        error: response.error,
    };
}

export async function removeFavorito(pdiId: number): Promise<{ success: boolean; error?: string }> {
    const response = await api.removeFavorito(pdiId);
    return {
        success: response.success,
        error: response.error,
    };
}
