import "../styles/NotFoundPage.css"
import 'bootstrap/dist/css/bootstrap.min.css'
import "../styles/Navbar.css"
import { useState, useEffect } from "react"
import { useUser } from '../hooks/useUser';
import { useAuthAdmin } from '../hooks/useAuthAdmin';
import { CircleUserRound, House, Map, Notebook, Star, Settings } from "lucide-react";
import AuthModal from "./AuthModal";
import RegisterModal from "./RegisterModal";
import WelcomeModal from "./WelcomeModal";
import { Link } from "react-router-dom";



function NavbarHomePage() {
    const [showAuth, setShowAuth] = useState(false);
    const [showRegister, setShowRegister] = useState(false);
    const [showWelcome, setShowWelcome] = useState(false);
    const [welcomeName, setWelcomeName] = useState('');
    const { user, refreshUser, logout } = useUser();
    const { isAdmin } = useAuthAdmin();
    const [width, setWidth] = useState(window.innerWidth)

    useEffect(() => {
        const handleResize = () => setWidth(window.innerWidth)
        window.addEventListener('resize', handleResize)
        return () => {
        window.removeEventListener('resize', handleResize)
        }

    }, [])

    return (
        <>
        {width > 950 ? (
            <nav className="navHomePage">
                <Link className="fw-semibold navLetters" to={"/map"}>
                <i className="bi bi-geo-alt"> Mapa</i>
                </Link>
                <Link className="fw-semibold navLetters" to={"/agenda"}>
                <i className="bi bi-calendar-week"> Agenda</i> 
                </Link>
                <Link className="fw-semibold navLetters" to={"/favoritos"}>
                <i className="bi bi-star-fill"> Favoritos</i>
                </Link>
                {user && isAdmin && (
                    <div className="dropdown">
                        <button className="btn btn-link dropdown-toggle navLetters" data-bs-toggle="dropdown">
                            Gestión
                            <Settings />
                        </button>
                        <ul className="dropdown-menu dropdown-menu-end">
                            <li><Link className="dropdown-item" to="/provincias">Gestión provincias</Link></li>
                            <li><Link className="dropdown-item" to="/tags">Gestión tags</Link></li>
                            <li><button className="dropdown-item" disabled>Gestión PDI (próximamente)</button></li>
                        </ul>
                    </div>
                )}
                {user ? (
                    <div className="dropdown">
                        <button className="btn btn-link dropdown-toggle navLetters" data-bs-toggle="dropdown">
                            {user.nombre ?? user.gmail}
                            <CircleUserRound />
                        </button>
                        <ul className="dropdown-menu dropdown-menu-end">
                            <li><Link className="dropdown-item" to="/perfil">Perfil</Link></li>
                            <li><button className="dropdown-item" onClick={async () => { await logout(); }}>Cerrar sesión</button></li>
                        </ul>
                    </div>
                ) : (
                    <Link className="fw-semibold navLetters" to="#" onClick={() => setShowAuth(true)}>
                        Usuario
                        <CircleUserRound />
                    </Link>
                )}
            </nav>
        ) : (
            <nav className="bottom-navbar">
            <div>
                <House />
                <Link to="/">Inicio</Link>
            </div>
            <div>  
                <Map />
                <Link to={"/map"}>Mapa</Link>
            </div>
            <div>
                <Notebook />
                <Link to="/agenda">Agenda</Link>
            </div>
            <div>
                <Star />
                <Link to="/favoritos">Favoritos</Link>
            </div>
            {user && isAdmin && (
                <div>
                    <div className="dropdown">
                        <button className="btn btn-link dropdown-toggle navLetters" data-bs-toggle="dropdown" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: 0 }}>
                            <Settings />
                            Gestión
                        </button>
                        <ul className="dropdown-menu dropdown-menu-end">
                            <li><Link className="dropdown-item" to="/provincias">Gestión provincias</Link></li>
                            <li><Link className="dropdown-item" to="/tags">Gestión tags</Link></li>
                            <li><button className="dropdown-item" disabled>Gestión PDI (próximamente)</button></li>
                        </ul>
                    </div>
                </div>
            )}
            <div>
                {user ? (
                    <div className="dropdown">
                        <button className="btn btn-link dropdown-toggle navLetters" data-bs-toggle="dropdown" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: 0 }}>
                            <CircleUserRound />
                            {user.nombre ?? user.gmail }
                        </button>
                        <ul className="dropdown-menu dropdown-menu-end">
                            <li><Link className="dropdown-item" to="/perfil">Perfil</Link></li>
                            <li><button className="dropdown-item" onClick={async () => { await logout(); }}>Cerrar sesión</button></li>
                        </ul>
                    </div>
                ) : (
                    <>
                        <CircleUserRound />
                        <Link to="#" onClick={() => setShowAuth(true)}>Usuario</Link>
                    </>
                )}
            </div>
            </nav>
        )}

        <AuthModal
            show={showAuth}
            onClose={() => setShowAuth(false)}
            onOpenRegister={() => setShowRegister(true)}
                onSuccess={async (name) => { 
                await refreshUser();
                setWelcomeName(name); 
                setShowWelcome(true); 
                setShowAuth(false); 
            }}
        />
        <RegisterModal
            show={showRegister}
            onClose={() => setShowRegister(false)}
            onBackToLogin={() => setShowAuth(true)}
            onSuccess={async (name) => { 
                await refreshUser();
                setWelcomeName(name); 
                setShowWelcome(true); 
                setShowRegister(false); }}
        />

        <WelcomeModal show={showWelcome} onClose={() => setShowWelcome(false)} userName={welcomeName} />

        </>
    );
}

export default NavbarHomePage
