import { Modal } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

interface RedirectModalProps {
    show: boolean;
    redirectTo?: string;
    title?: string;
    message?: string;
    buttonText?: string;
    onClose?: () => void;
}

export default function RedirectModal({
    show,
    redirectTo = '/',
    title = 'Acceso Restringido',
    message = 'Debes iniciar sesión para ver tu perfil',
    buttonText = 'Ir a Página Principal',
    onClose,
    }: RedirectModalProps) {
    const navigate = useNavigate();

    const handleRedirect = () => {
        if (onClose) {
        onClose();
        }
        navigate(redirectTo);
    };

    useEffect(() => {
        if (!show && onClose) {
        onClose();
        }
    }, [show, onClose]);

    return (
        <Modal show={show} onHide={handleRedirect} centered backdrop="static">
        <Modal.Body className="text-center p-4">
            <div className="mb-3">
            <i
                className="bi bi-lock-fill"
                style={{ fontSize: '3rem', color: '#dc3545' }}
            ></i>
            </div>
            <h5 className="mb-3">{title}</h5>
            <p className="text-muted mb-4">{message}</p>
            <button
            className="btn btn-primary px-4"
            onClick={handleRedirect}
            style={{
                backgroundColor: '#007bff',
                border: 'none',
                borderRadius: '5px',
            }}
            >
            {buttonText}
            </button>
        </Modal.Body>
        </Modal>
    );
}
