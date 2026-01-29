import Modal from 'react-bootstrap/Modal';

type WelcomeModalProps = {
    show: boolean;
    onClose: () => void;
    userName: string;
};

function WelcomeModal({ show, onClose, userName}: WelcomeModalProps) {
    return (
        <Modal size="lg" show={show} onHide={onClose} centered>
        <Modal.Header closeButton>
            <Modal.Title>¡Bienvenido!</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <p>Te damos la bienvenida {userName} 🎉</p>
        </Modal.Body>
        </Modal>
    );
}

export default WelcomeModal;
