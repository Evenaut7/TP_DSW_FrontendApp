import { Modal } from 'react-bootstrap';

type ResultModalProps = {
    show: boolean;
    success: boolean;
    message: string;
    onClose: () => void;
};

function ResultModal({ show, success, message, onClose }: ResultModalProps) {
    return (
        <Modal show={show} onHide={onClose} centered>
            <Modal.Header closeButton>
                <Modal.Title>{success ? '¡Éxito!' : 'Error'}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {success ? (
                    <div className="text-success">
                        <i className="bi bi-check-circle-fill me-2"></i>
                        {message}
                    </div>
                ) : (
                    <div className="text-danger">
                        <i className="bi bi-exclamation-triangle-fill me-2"></i>
                        {message}
                    </div>
                )}
            </Modal.Body>
            <Modal.Footer>
                <button className="btn btn-primary" onClick={onClose}>
                    Cerrar
                </button>
            </Modal.Footer>
        </Modal>
    );
}

export default ResultModal;
