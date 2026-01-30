import toast from 'react-hot-toast';

// ==================== TIPOS DE NOTIFICACIONES ====================

export const NotificationType = {
  NETWORK_ERROR: 'network_error',
  VALIDATION_ERROR: 'validation_error',
  AUTH_ERROR: 'auth_error',
  SUCCESS: 'success',
} as const;

export type NotificationTypeValue = typeof NotificationType[keyof typeof NotificationType];

// ==================== CONFIGURACIÓN ====================

const TOAST_DURATION = 4000;

const toastConfig = {
  duration: TOAST_DURATION,
  position: 'top-right' as const,
};

// ==================== FUNCIONES DE NOTIFICACIÓN ====================

// Muestra un error de red/API con modal bloqueante
export function showNetworkError(message: string, statusCode?: number) {
  // El modal se manejará mediante un evento personalizado
  const event = new CustomEvent('show-error-modal', {
    detail: { message, statusCode },
  });
  window.dispatchEvent(event);
}

// Muestra un error de validación con toast temporal
export function showValidationError(message: string) {
  toast.error(message, {
    ...toastConfig,
    icon: '⚠️',
    style: {
      background: '#ef4444',
      color: '#fff',
      fontWeight: '500',
    },
  });
}

// Muestra un error de autenticación/autorización con toast temporal
export function showAuthError(message: string) {
  toast.error(message, {
    ...toastConfig,
    icon: '🔒',
    style: {
      background: '#dc2626',
      color: '#fff',
      fontWeight: '500',
    },
  });
}

// Muestra un mensaje de éxito con banner superior
export function showSuccess(message: string) {
  toast.success(message, {
    duration: TOAST_DURATION,
    position: 'top-center' as const,
    icon: '✅',
    style: {
      background: '#10b981',
      color: '#fff',
      fontWeight: '600',
      fontSize: '16px',
      padding: '16px 24px',
      borderRadius: '8px',
      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
    },
  });
}

// Muestra notificación según el tipo de error
export function showNotification(
  message: string,
  type: NotificationTypeValue,
  statusCode?: number
) {
  switch (type) {
    case NotificationType.NETWORK_ERROR:
      showNetworkError(message, statusCode);
      break;
    case NotificationType.VALIDATION_ERROR:
      showValidationError(message);
      break;
    case NotificationType.AUTH_ERROR:
      showAuthError(message);
      break;
    case NotificationType.SUCCESS:
      showSuccess(message);
      break;
  }
}

// Clasifica el error según el código de estado HTTP
export function classifyErrorByStatus(statusCode?: number): NotificationTypeValue {
  if (!statusCode) return NotificationType.NETWORK_ERROR;

  if (statusCode === 401 || statusCode === 403) {
    return NotificationType.AUTH_ERROR;
  }

  if (statusCode === 400 || statusCode === 422) {
    return NotificationType.VALIDATION_ERROR;
  }

  // 500+, timeout, network errors
  return NotificationType.NETWORK_ERROR;
}
