import { Modal } from 'react-bootstrap';

type ConfirmModalProps = {
    show: boolean;
    onConfirm: () => void;
    onCancel: () => void;
};

function ConfirmModal({ show, onConfirm, onCancel }: ConfirmModalProps) {
    return (
        <Modal show={show} onHide={onCancel} centered>
            <Modal.Header closeButton>
                <Modal.Title>Confirmar cambios</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                ¿Estás seguro de que deseas guardar los cambios en tu perfil?
            </Modal.Body>
            <Modal.Footer>
                <button className="btn btn-secondary" onClick={onCancel}>
                    Cancelar
                </button>
                <button className="btn btn-primary" onClick={onConfirm}>
                    Confirmar
                </button>
            </Modal.Footer>
        </Modal>
    );
}

export default ConfirmModal;
