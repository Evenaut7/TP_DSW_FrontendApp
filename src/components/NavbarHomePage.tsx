import "../styles/NotFoundPage.css"
import 'bootstrap/dist/css/bootstrap.min.css'
import "../styles/Navbar.css"
import { useState, useEffect } from "react"
import { CircleUserRound, House, Map, Notebook, Star } from "lucide-react";
import AuthModal from "./AuthModal";
import RegisterModal from "./RegisterModal";
import { Link } from "react-router-dom";
import UserBotton from "./UserBotton";
import BottomUserBoton from "./BottomUserBoton";



function NavbarHomePage() {
    const [showAuth, setShowAuth] = useState(false);
    const [showRegister, setShowRegister] = useState(false);
    const [width, setWidth] = useState(window.innerWidth)

    const validarToken = () => {
        const token = localStorage.getItem('token');
        if (token) {
        //Aquí puedes agregar lógica para validar el token si es necesario
            return true; // Token existe
        } else {
            return false; // Token no existe
        }
    }

    useEffect(() => {
        const handleResize = () => setWidth(window.innerWidth)
        window.addEventListener('resize', handleResize)
        return () => {
        window.removeEventListener('resize', handleResize)
        }

    }, [])

    return (
        <>
        {width > 768 ? (
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
                <>{validarToken() ? (
                    <UserBotton buttonClassName="profileImage" onLogout={() => setShowAuth(false)} />
                ) : (
                    <Link to="#" onClick={() => setShowAuth(true)}>
                    <CircleUserRound />
                        Usuario
                    </Link>
                )}</>
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
            <div>
                {validarToken() ? (
                    <>
                        <BottomUserBoton buttonClassName="profileImage" onLogout={() => setShowAuth(false)} />
                    </>
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
        />
        <RegisterModal
            show={showRegister}
            onClose={() => setShowRegister(false)}
            onBackToLogin={() => setShowAuth(true)}
        />

        </>
    );
}

export default NavbarHomePage
