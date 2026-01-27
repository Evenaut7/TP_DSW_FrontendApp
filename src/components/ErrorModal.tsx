import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/ErrorModal.css';

interface ErrorModalProps {
  message: string;
  statusCode?: number;
  onClose: () => void;
}

function ErrorModal({ message, statusCode, onClose }: ErrorModalProps) {
  const navigate = useNavigate();

  const handleClose = () => {
    onClose();
    navigate('/');
  };

  return (
    <div className="error-modal-overlay" onClick={handleClose}>
      <div className="error-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="error-modal-icon">❌</div>
        <h2 className="error-modal-title">Error de Conexión</h2>
        {statusCode && (
          <p className="error-modal-status">Código de estado: {statusCode}</p>
        )}
        <p className="error-modal-message">{message}</p>
        <button className="error-modal-button" onClick={handleClose}>
          Cerrar
        </button>
      </div>
    </div>
  );
}

export default function ErrorModalManager() {
  const [error, setError] = useState<{ message: string; statusCode?: number } | null>(null);

  useEffect(() => {
    const handleShowError = (event: Event) => {
      const customEvent = event as CustomEvent<{ message: string; statusCode?: number }>;
      setError(customEvent.detail);
    };

    window.addEventListener('show-error-modal', handleShowError);

    return () => {
      window.removeEventListener('show-error-modal', handleShowError);
    };
  }, []);

  if (!error) return null;

  return <ErrorModal {...error} onClose={() => setError(null)} />;
}
