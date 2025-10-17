import { useState, type FormEvent } from 'react';
import Modal from 'react-bootstrap/Modal';
import InputLabel from './InputLabel';
import BotonCeleste from './BotonCeleste';

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

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError(null);
        setLoading(true);
        try {
        const res = await fetch('http://localhost:3000/api/usuarios/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nombre: usuario, tipo: 'usuario', gmail, password }),
        });

        if (!res.ok) {
            const data = await res.json().catch(() => null);
            throw new Error(data?.message ?? `Error ${res.status}`);
        }

        const data = await res.json().catch(() => null);
        // En registro exitoso: cerrar modal y mostrar welcome
        const registeredName = data?.nombre || usuario;
        onClose();
        if (onSuccess) onSuccess(registeredName);
        } catch (err: unknown) {
        if (err instanceof Error) setError(err.message);
        else setError('Error desconocido');
        } finally {
        setLoading(false);
        }
    };

    return (
        <Modal
        size="lg"
        show={show}
        onHide={onClose}
        aria-labelledby="register-modal-title"
        centered
        >
        <form onSubmit={handleSubmit}>
            <Modal.Header closeButton>
            <Modal.Title id="register-modal-title">Crear cuenta</Modal.Title>
            </Modal.Header>
            <Modal.Body className="modal-body">
            <InputLabel label="Nombre de usuario" type="string" value={usuario} onChange={(e) => setUsuario(e.target.value)} required />
            <InputLabel label="Gmail" type="email" value={gmail} onChange={(e) => setGmail(e.target.value)} required />
            <InputLabel label="Contraseña minima 6 caracteres" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            {error && <p style={{ color: 'red', margin: 0 }}>{error}</p>}
            </Modal.Body>
            <Modal.Footer className="modal-footer">
            <button
                type="button"
                className="btn btn-link p-0"
                onClick={() => {
                onClose();
                if (onBackToLogin)
                    {
                        onBackToLogin();
                        setError(null);
                    }
                }}
            >
                Ya tengo cuenta
            </button>
            <BotonCeleste texto={loading ? 'Guardando...' : 'Registrarme'} type="submit" disabled={loading} />
            </Modal.Footer>
        </form>
        </Modal>
    );
}

export default RegisterModal;

