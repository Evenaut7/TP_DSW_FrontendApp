import { X, PartyPopper } from 'lucide-react';

type WelcomeModalProps = {
    show: boolean;
    onClose: () => void;
    userName: string;
};

function WelcomeModal({ show, onClose, userName }: WelcomeModalProps) {
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
            
            {/* Modal Card */}
            <div className="relative bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl rounded-3xl shadow-2xl max-w-md w-full border border-slate-200 dark:border-slate-800 animate-in zoom-in-95 duration-200">
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-6 right-6 p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    aria-label="Cerrar"
                >
                    <X className="w-5 h-5 text-slate-500 dark:text-slate-400" />
                </button>

                {/* Content */}
                <div className="p-8 text-center">
                    {/* Icon */}
                    <div className="flex justify-center mb-6">
                        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center shadow-lg animate-in zoom-in duration-500">
                            <PartyPopper className="w-10 h-10 text-white" />
                        </div>
                    </div>

                    {/* Title */}
                    <h2 className="text-4xl font-extrabold text-slate-900 dark:text-white mb-3">
                        ¡Bienvenido!
                    </h2>
                    
                    {/* Message */}
                    <p className="text-lg text-slate-600 dark:text-slate-300 mb-8">
                        Te damos la bienvenida <span className="font-bold text-primary">{userName}</span> 🎉
                    </p>

                    {/* Success Message */}
                    <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-4 mb-6">
                        <p className="text-sm text-green-700 dark:text-green-400">
                            Has iniciado sesión correctamente
                        </p>
                    </div>

                    {/* Close Button */}
                    <button
                        onClick={onClose}
                        className="w-full px-6 py-3 bg-primary hover:bg-primary/90 text-white rounded-xl font-semibold transition-all shadow-lg hover:shadow-xl"
                    >
                        Comenzar a explorar
                    </button>
                </div>
            </div>
        </div>
    );
}

export default WelcomeModal;
