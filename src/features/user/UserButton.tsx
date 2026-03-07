import { useNavigate } from "react-router-dom";
import React from "react";

type Props = {
    onLogout?: () => void;
    show?: boolean;
    onClose?: () => void;
    buttonClassName?: string;
};

function UserBotton({ onLogout, buttonClassName }: Props) {
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
            try {
                localStorage.clear();
            } catch {
                // ignore
            }
            navigate('/login');
        }
    }

    return (
        <div className="dropdown">
            <button
                className={`btn dropdown-toggle user-button ${buttonClassName ?? ''}`}
                type="button"
                id="userDropdown"
                data-bs-toggle="dropdown"
                aria-expanded="false"
            >
                <i className="bi bi-person-circle" />
                Usuario
            </button>

            <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="userDropdown">
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

export default UserBotton;