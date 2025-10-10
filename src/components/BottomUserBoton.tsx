import React from "react";
import { useNavigate } from "react-router-dom";

    type Props = {
    onLogout?: () => void;
    buttonClassName?: string;
    };

    function BottomUserBoton({ onLogout, buttonClassName }: Props) {
    const navigate = useNavigate();

    const handleConfig = (e: React.MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault();
        navigate('/perfil/mi-perfil');
    }

    const handleLogout = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        if (onLogout) {
        onLogout();
        } else {
        try { localStorage.clear(); } catch { /* ignore storage errors */ }
        navigate('/login');
        }
    }

    return (
        <div className="dropdown bottom-user-dropdown">
        <button
            className={`btn dropdown-toggle bottom-user-button ${buttonClassName ?? ''}`}
            type="button"
            id="bottomUserDropdown"
            data-bs-toggle="dropdown"
            aria-expanded="false"
        >
            <span className="bottom-user-label">Usuario</span>
        </button>

        <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="bottomUserDropdown">
            <li>
            <a className="dropdown-item" href="#" onClick={handleConfig}>
                Configuración
            </a>
            </li>
            <li>
            <hr className="dropdown-divider" />
            </li>
            <li>
            <button className="dropdown-item btn btn-link text-start" onClick={handleLogout}>
                Cerrar sesión
            </button>
            </li>
        </ul>
        </div>
    );
};

export default BottomUserBoton;
