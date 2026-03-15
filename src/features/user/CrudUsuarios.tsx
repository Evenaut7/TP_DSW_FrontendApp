import { useState, useEffect } from 'react';
import { Trash2, X, Users } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import { useAuthAdmin } from '@/features/auth';
import RedirectModal from '@/components/modals/RedirectModal';
import { useUser } from '@/features/user';
import PantallaDeCarga from '@/components/ui/PantallaDeCarga';
import PantallaDeError from '@/components/ui/PantallaDeError';
import { useApiGet, apiDelete } from '@/utils/api';

interface Usuario {
    id: number;
    nombre: string;
    gmail: string;
    tipo: string;
}

function ConfirmDeleteModal({
    usuario,
    onConfirm,
    onCancel,
    loading,
}: {
    usuario: Usuario;
    onConfirm: () => void;
    onCancel: () => void;
    loading: boolean;
}) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-700 p-8 max-w-sm w-full mx-4 flex flex-col items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                    <Trash2 className="w-6 h-6 text-red-500" />
                </div>
                <div className="text-center">
                    <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                        ¿Eliminar usuario?
                    </h2>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                        Estás por eliminar a{' '}
                        <span className="font-semibold text-slate-700 dark:text-slate-200">
                            {usuario.nombre}
                        </span>
                        . Esta acción no se puede deshacer.
                    </p>
                </div>
                <div className="flex gap-3 w-full">
                    <button
                        onClick={onCancel}
                        disabled={loading}
                        className="flex-1 px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-300 text-sm font-semibold hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors disabled:opacity-50"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={onConfirm}
                        disabled={loading}
                        className="flex-1 px-4 py-2 rounded-xl bg-red-500 hover:bg-red-600 text-white text-sm font-semibold transition-colors disabled:opacity-50"
                    >
                        {loading ? 'Eliminando...' : 'Sí, eliminar'}
                    </button>
                </div>
            </div>
        </div>
    );
}

const CrudUsuarios = () => {
    const { isAdmin, loading: loadingAuth } = useAuthAdmin();
    const { user } = useUser();
    const [showRedirect, setShowRedirect] = useState(false);
    const [deletingId, setDeletingId] = useState<number | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [confirmUsuario, setConfirmUsuario] = useState<Usuario | null>(null);

    const {
        data: usuarios,
        loading: loadingUsuarios,
        error: errorUsuarios,
    } = useApiGet<Usuario[]>('/api/usuarios');

    const [listaUsuarios, setListaUsuarios] = useState<Usuario[]>([]);

    useEffect(() => {
        if (usuarios) setListaUsuarios(usuarios);
    }, [usuarios]);

    useEffect(() => {
        if (!loadingAuth && (!user || isAdmin === false)) {
            setShowRedirect(true);
        }
    }, [user, isAdmin, loadingAuth]);

    const handleDelete = async (id: number) => {
        setDeletingId(id);
        setError(null);
        const res = await apiDelete(`/api/usuarios/${id}`);
        if (res.success) {
            setListaUsuarios((prev) => prev.filter((u) => u.id !== id));
        } else {
            setError(res.error || 'Error al eliminar el usuario');
        }
        setDeletingId(null);
        setConfirmUsuario(null);
    };

    if (loadingAuth || loadingUsuarios)
        return <PantallaDeCarga mensaje="usuarios" />;

    if (errorUsuarios)
        return <PantallaDeError mensaje="Error al cargar usuarios" error={errorUsuarios} />;

    if (!user || isAdmin === false || showRedirect) {
        return (
            <>
                <Navbar />
                <RedirectModal show={true} />
            </>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
            <Navbar />

            {confirmUsuario && (
                <ConfirmDeleteModal
                    usuario={confirmUsuario}
                    onConfirm={() => handleDelete(confirmUsuario.id)}
                    onCancel={() => setConfirmUsuario(null)}
                    loading={deletingId === confirmUsuario.id}
                />
            )}

            <div className="max-w-4xl mx-auto px-4 pt-32 pb-16 space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                            Usuarios
                        </h1>
                        <p className="text-sm text-slate-400 dark:text-slate-500 mt-1">
                            {listaUsuarios.length} usuarios registrados
                        </p>
                    </div>
                    <Users className="w-8 h-8 text-slate-300 dark:text-slate-600" />
                </div>

                {error && (
                    <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 text-sm">
                        <X className="w-4 h-4 shrink-0" />
                        {error}
                    </div>
                )}

                <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-slate-100 dark:border-slate-700">
                                <th className="text-left px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-500 w-16">
                                    ID
                                </th>
                                <th className="text-left px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-500">
                                    Nombre
                                </th>
                                <th className="text-left px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-500">
                                    Email
                                </th>
                                <th className="text-left px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-500">
                                    Tipo
                                </th>
                                <th className="text-right px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-500">
                                    Acciones
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                            {listaUsuarios.map((u) => (
                                <tr
                                    key={u.id}
                                    className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
                                >
                                    <td className="px-6 py-4 text-slate-400 dark:text-slate-500 font-mono text-xs">
                                        {u.id}
                                    </td>
                                    <td className="px-6 py-4 text-slate-800 dark:text-slate-100 font-medium">
                                        {u.nombre}
                                    </td>
                                    <td className="px-6 py-4 text-slate-500 dark:text-slate-400">
                                        {u.gmail}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                      ${u.tipo === 'admin'
                                                ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400'
                                                : u.tipo === 'creador'
                                                    ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                                                    : 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300'
                                            }`}>
                                            {u.tipo}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center justify-end">
                                            <button
                                                onClick={() => setConfirmUsuario(u)}
                                                className="p-2 rounded-full hover:bg-red-50 dark:hover:bg-red-900/20 text-slate-400 hover:text-red-500 transition-colors"
                                                title="Eliminar"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default CrudUsuarios;