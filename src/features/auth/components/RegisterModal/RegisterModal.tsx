import { useState, type FormEvent } from 'react';
import { login } from '@/utils/session';
import { API_BASE_URL } from '@/utils/api';
import { X, Mail, Lock, User, Loader2, Sparkles, Sun } from 'lucide-react';

type RegisterModalProps = {
    show: boolean;
    onClose: () => void;
    onBackToLogin?: () => void;
    onSuccess?: (userName: string) => void;
};

function RegisterModal({ show, onClose, onBackToLogin, onSuccess }: RegisterModalProps) {
    const [usuario, setUsuario] = useState('');
    const [gmail, setGmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [creator, setCreator] = useState(false);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError(null);
        setLoading(true);
        const tipo = creator ? 'creador' : 'usuario';   
        try {
            // 1. Registro
            const res = await fetch(`${API_BASE_URL}/api/usuarios/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ nombre: usuario, tipo, gmail, password }),
            });

            if (!res.ok) {
                const data = await res.json().catch(() => null);
                throw new Error(data?.message ?? `Error ${res.status}`);
            }

            const data = await res.json().catch(() => null);
            const registeredName = data?.nombre || usuario;

            const loginResult = await login(gmail, password);
            
            if (!loginResult.success) {
                setError('Registro exitoso, pero hubo un error al iniciar sesión. Por favor, inicia sesión manualmente.');
                return;
            }

            onClose();
            if (onSuccess) onSuccess(registeredName);
            
        } catch (err: unknown) {
            if (err instanceof Error) setError(err.message);
            else setError('Error desconocido');
        } finally {
            setLoading(false);
        }
    };

    const handleBackdropClick = (e: React.MouseEvent) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    if (!show) return null;

    return (
        <div 
            className="fixed inset-0 z-[300] flex items-center justify-center p-4 animate-in fade-in duration-200"
            onClick={handleBackdropClick}
        >
            {/* Backdrop */}
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
            
            {/* Modal Card - with max-height and scroll */}
            <div className="relative bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl rounded-3xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto border border-slate-200 dark:border-slate-800 animate-in zoom-in-95 duration-200">
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="sticky top-6 right-6 ml-auto mr-6 mt-6 p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors z-10 bg-white/80 dark:bg-slate-900/80 backdrop-blur"
                    aria-label="Cerrar"
                >
                    <X className="w-5 h-5 text-slate-500 dark:text-slate-400" />
                </button>

                {/* Content */}
                <div className="px-8 pb-8 pt-2">
                    {/* Logo/Icon */}
                    <div className="flex justify-center mb-6">
                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center shadow-lg">
                            <Sun className="w-8 h-8 text-white" />
                        </div>
                    </div>

                    {/* Title */}
                    <h2 className="text-3xl font-extrabold text-center text-slate-900 dark:text-white mb-2">
                        Crear cuenta
                    </h2>
                    <p className="text-center text-slate-500 dark:text-slate-400 mb-8">
                        Únete a la comunidad de Discover
                    </p>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Username Input */}
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                                Nombre de usuario
                            </label>
                            <div className="relative">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                <input
                                    type="text"
                                    value={usuario}
                                    onChange={(e) => setUsuario(e.target.value)}
                                    required
                                    className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                                    placeholder="Tu nombre"
                                />
                            </div>
                        </div>

                        {/* Email Input */}
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                                Correo electrónico
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                <input
                                    type="email"
                                    value={gmail}
                                    onChange={(e) => setGmail(e.target.value)}
                                    required
                                    className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                                    placeholder="tu@email.com"
                                />
                            </div>
                        </div>

                        {/* Password Input */}
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                                Contraseña
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    minLength={6}
                                    className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                                    placeholder="Mínimo 6 caracteres"
                                />
                            </div>
                        </div>

                        {/* Creator Checkbox */}
                        <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4 border border-slate-200 dark:border-slate-700">
                            <label className="flex items-start gap-3 cursor-pointer group">
                                <div className="relative flex items-center">
                                    <input
                                        type="checkbox"
                                        checked={creator}
                                        onChange={(e) => setCreator(e.target.checked)}
                                        className="w-5 h-5 rounded border-slate-300 dark:border-slate-600 text-primary focus:ring-2 focus:ring-primary focus:ring-offset-0 transition-all cursor-pointer"
                                    />
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                                            Creador de contenido
                                        </span>
                                        <Sparkles className="w-4 h-4 text-primary" />
                                    </div>
                                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                                        Podrás crear y compartir puntos de interés
                                    </p>
                                </div>
                            </label>
                        </div>

                        {/* Error Alert */}
                        {error && (
                            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4 animate-in slide-in-from-top-2 duration-200">
                                <div className="flex items-start gap-3">
                                    <span className="material-symbols-outlined text-red-600 dark:text-red-400 text-xl">error</span>
                                    <p className="text-sm text-red-600 dark:text-red-400 flex-1">{error}</p>
                                </div>
                            </div>
                        )}

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full px-6 py-3 bg-primary hover:bg-primary/90 disabled:bg-slate-300 disabled:cursor-not-allowed text-white rounded-xl font-semibold transition-all shadow-lg hover:shadow-xl disabled:shadow-none flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    <span>Creando cuenta...</span>
                                </>
                            ) : (
                                <span>Registrarme</span>
                            )}
                        </button>

                        {/* Divider */}
                        <div className="relative my-6">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-slate-200 dark:border-slate-700"></div>
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-4 bg-white dark:bg-slate-900 text-slate-500 dark:text-slate-400">
                                    ¿Ya tienes cuenta?
                                </span>
                            </div>
                        </div>

                        {/* Login Link */}
                        <button
                            type="button"
                            onClick={() => {
                                onClose();
                                setError(null);
                                if (onBackToLogin) onBackToLogin();
                            }}
                            className="w-full px-6 py-3 border-2 border-slate-300 dark:border-slate-700 hover:border-primary dark:hover:border-primary text-slate-700 dark:text-slate-300 hover:text-primary dark:hover:text-primary rounded-xl font-semibold transition-all"
                        >
                            Iniciar sesión
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default RegisterModal;
