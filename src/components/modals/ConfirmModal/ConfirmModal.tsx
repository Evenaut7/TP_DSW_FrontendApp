import { Modal } from 'react-bootstrap';

type ConfirmModalProps = {
  show: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  message?: string;
  confirmText?: string;
  cancelText?: string;
};

function ConfirmModal({
  show,
  onConfirm,
  onCancel,
  message = '¿Estás seguro de que deseas guardar los cambios en tu perfil?',
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
}: ConfirmModalProps) {
  return (
    <Modal show={show} onHide={onCancel} centered>
      <Modal.Header closeButton>
        <Modal.Title>Confirmar cambios</Modal.Title>
      </Modal.Header>
      <Modal.Body>{message}</Modal.Body>
      <Modal.Footer>
        <button className="btn btn-secondary" onClick={onCancel}>
          {cancelText}
        </button>
        <button className="btn btn-primary" onClick={onConfirm}>
          {confirmText}
        </button>
      </Modal.Footer>
    </Modal>
  );
}

export default ConfirmModal;
