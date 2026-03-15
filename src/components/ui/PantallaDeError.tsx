import Navbar from '@/components/layout/Navbar.tsx';

type Props = {
    mensaje: string;
    error: string;
};

function interpretarError(error: string): { titulo: string; descripcion: string } {
    const lower = error.toLowerCase();

    if (lower.includes('401') || lower.includes('no autenticado') || lower.includes('unauthorized'))
        return { titulo: 'No autenticado', descripcion: 'Debés iniciar sesión para acceder a este contenido.' };

    if (lower.includes('403') || lower.includes('acceso denegado') || lower.includes('forbidden'))
        return { titulo: 'Acceso denegado', descripcion: 'No tenés permisos para ver este contenido.' };

    if (lower.includes('404') || lower.includes('not found'))
        return { titulo: 'No encontrado', descripcion: 'El recurso que buscás no existe o fue eliminado.' };

    if (lower.includes('500') || lower.includes('internal server'))
        return { titulo: 'Error del servidor', descripcion: 'Ocurrió un problema en el servidor. Intentá de nuevo más tarde.' };

    if (lower.includes('failed to fetch') || lower.includes('network') || lower.includes('conexión'))
        return { titulo: 'Sin conexión', descripcion: 'No se pudo conectar con el servidor. Verificá tu conexión a internet.' };

    return { titulo: 'Error inesperado', descripcion: error };
}

const PantallaDeError: React.FC<Props> = ({ mensaje, error }) => {
    const { titulo, descripcion } = interpretarError(error);

    return (
        <>
            <Navbar />
            <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
                <div className="flex flex-col items-center gap-4 bg-white/90 backdrop-blur-sm border border-red-200 rounded-2xl shadow-xl px-12 py-10 max-w-md w-full mx-4">
                    <div className="w-14 h-14 rounded-full bg-red-100 flex items-center justify-center">
                        <span className="text-2xl">⚠️</span>
                    </div>
                    <h2 className="text-gray-800 font-semibold text-xl">{mensaje}</h2>
                    <div className="w-full bg-red-50 border border-red-100 rounded-lg px-4 py-3 flex flex-col gap-1">
                        <span className="text-red-600 font-medium text-sm">{titulo}</span>
                        <span className="text-gray-500 text-sm">{descripcion}</span>
                    </div>
                    <button
                        onClick={() => window.location.reload()}
                        className="mt-2 px-6 py-2 bg-red-500 hover:bg-red-600 text-white text-sm font-medium rounded-lg transition-colors"
                    >
                        Reintentar
                    </button>
                </div>
            </div>
        </>
    );
};

export default PantallaDeError;