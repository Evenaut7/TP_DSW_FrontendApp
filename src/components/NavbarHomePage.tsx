
import "../styles/NotFoundPage.css"
import 'bootstrap/dist/css/bootstrap.min.css'
import "../styles/Navbar.css"
import { useState, useEffect } from "react"
import { House, Map, Notebook, CircleUserRound } from "lucide-react";
import AuthModal from "./AuthModal";
import RegisterModal from "./RegisterModal";
import { Link } from "react-router-dom";



const NavbarHomePage = () => {
    const [showAuth, setShowAuth] = useState(false);
    const [showRegister, setShowRegister] = useState(false);
    const [width, setWidth] = useState(window.innerWidth)
    //const [user, setUser] = useState(null)


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
                <Link className="fw-semibold navLetters" to="#" onClick={() => setShowAuth(true)}>
                <i className="bi bi-person-circle"> User</i>
                </Link>
                
                <button
                className="profileImage"
                type="button"
                onClick={() => setShowAuth(true)}
                >
                {/* <img src={usuario} height={'40px'} /> */}
                
                </button>

            
            </nav>
        ) : (
            <nav className="bottom-navbar-HomePage">
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
                <CircleUserRound />
                <Link to="#" onClick={() => setShowAuth(true)}>Usuario</Link>
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
