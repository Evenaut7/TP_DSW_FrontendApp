import { useState, type FormEvent } from 'react';
import Modal from 'react-bootstrap/Modal';
import InputLabel from './InputLabel';
import BotonCeleste from './BotonCeleste';
import { login } from '../utils/session';
import { API_BASE_URL } from '../utils/api';

type AuthModalProps = {
    show: boolean;
    onClose: () => void;
    onOpenRegister: () => void;
    onSuccess?: (userName: string) => void;
};

function AuthModal({ show, onClose, onOpenRegister, onSuccess }: AuthModalProps) {
    const [gmail, setGmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError(null);
        setLoading(true);
        
        try {
            const result = await login(gmail, password);
            
            if (result.success) {
                // Login exitoso: obtener datos del usuario para el mensaje de bienvenida
                const res = await fetch(`${API_BASE_URL}/api/usuarios/currentUser`, {
                    credentials: 'include',
                });
                
                if (res.ok) {
                    const data = await res.json();
                    const userName = data?.data?.nombre || gmail;
                    onClose();
                    if (onSuccess) onSuccess(userName);
                } else {
                    // Login exitoso pero no se pudo obtener el usuario
                    onClose();
                    if (onSuccess) onSuccess(gmail);
                }
            } else {
                setError(result.error || 'Error al iniciar sesión');
            }
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
        aria-labelledby="auth-modal-title"
        centered
        >
        <form onSubmit={handleSubmit}>
            <Modal.Header closeButton>
            <Modal.Title id="auth-modal-title">Iniciar sesión</Modal.Title>
            </Modal.Header>
            <Modal.Body className="modal-body">
            <InputLabel label="Gmail" type="email" value={gmail} onChange={(e) => setGmail(e.target.value)} required />
            <InputLabel label="Contraseña" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            {error && <p style={{ color: 'red', margin: 0 }}>{error}</p>}
            </Modal.Body>
            <Modal.Footer className="modal-footer">
            <button
                type="button"
                className="btn btn-link p-0"
                onClick={() => {
                onClose();
                onOpenRegister();
                }}
            >
                Crear cuenta
            </button>
            <BotonCeleste texto={loading ? 'Cargando...' : 'Ingresar'} type="submit" disabled={loading} />
            </Modal.Footer>
        </form>
        </Modal>
    );
}

export default AuthModal;

