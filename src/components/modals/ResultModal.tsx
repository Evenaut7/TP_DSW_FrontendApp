type ResultModalProps = {
  show: boolean;
  success: boolean;
  message: string;
  onClose: () => void;
};

function ResultModal({ show, success, message, onClose }: ResultModalProps) {
  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white dark:bg-slate-800 rounded-2xl shadow-xl w-full max-w-md p-6 flex flex-col items-center gap-4">
        {/* Icon */}
        <div
          className={`w-16 h-16 rounded-full flex items-center justify-center text-3xl
            ${success
              ? 'bg-green-100 dark:bg-green-900/30'
              : 'bg-red-100 dark:bg-red-900/30'
            }`}
        >
          {success ? '✅' : '❌'}
        </div>

        {/* Title */}
        <h2
          className={`text-2xl font-bold
            ${success
              ? 'text-green-700 dark:text-green-400'
              : 'text-red-700 dark:text-red-400'
            }`}
        >
          {success ? '¡Éxito!' : 'Error'}
        </h2>

        {/* Message */}
        <p className="text-slate-600 dark:text-slate-300 text-center">
          {message}
        </p>

        {/* Button */}
        <button
          onClick={onClose}
          className={`mt-2 px-6 py-2.5 rounded-xl font-semibold text-white transition-colors
            ${success
              ? 'bg-green-500 hover:bg-green-600'
              : 'bg-red-500 hover:bg-red-600'
            }`}
        >
          Cerrar
        </button>
      </div>
    </div>
  );
}

export default ResultModal;