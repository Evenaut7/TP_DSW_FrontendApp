
import "../styles/NotFoundPage.css"
import 'bootstrap/dist/css/bootstrap.min.css'
import "../styles/Navbar.css"
import { useState, useEffect } from "react"
import { House, Map, Notebook, CircleUserRound } from "lucide-react";
import AuthModal from "./AuthModal";
import RegisterModal from "./RegisterModal";



const NavbarHomePage = () => {
    const [showAuth, setShowAuth] = useState(false);
    const [showRegister, setShowRegister] = useState(false);
    const [width, setWidth] = useState(window.innerWidth)
    //const [user, setUser] = useState(null)
    // const [show, setShow] = useState(false);
    // const handleClose = () => setShow(false);
    // const handleShow = () => setShow(true);

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
                <a className="fw-semibold navLetters" href="#">
                <i className="bi bi-geo-alt"> Mapa</i>
                </a>
                <a className="fw-semibold navLetters" href="#">
                <i className="bi bi-calendar-week"> Agenda</i> 
                </a>
                <a className="fw-semibold navLetters" href="#">
                <i className="bi bi-star-fill"> Favoritos</i>
                </a>
                <a className="fw-semibold navLetters" href="#" onClick={() => setShowAuth(true)}>
                <i className="bi bi-person-circle"> User</i>
                </a>
                
                <button
                className="profileImage"
                type="button"
                onClick={() => setShowAuth(true)}
                >
                {/* <img src={usuario} height={'40px'} /> */}
                
                </button>

            
            </nav>
        ) : (
            <nav className="bottom-navbar">
            <div>
                <House />
                <a href="/">Inicio</a>
            </div>
            <div>  
                <Map />
                <a href="#">Mapa</a>
            </div>
            <div>
                <Notebook />
                <a href="#">Agenda</a>
            </div>
            <div>
                <CircleUserRound />
                <a href="#" onClick={() => setShowAuth(true)}>Usuario</a>
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
        
        {/* <Offcanvas show={show} onHide={handleClose} responsive="lg">
                <Offcanvas.Header closeButton>
                <Offcanvas.Title>Offcanvas</Offcanvas.Title>
                </Offcanvas.Header>
                <Offcanvas.Body>
                Some text as placeholder. In real life you can have the elements you
                have chosen. Like, text, images, lists, etc.
                </Offcanvas.Body>
            </Offcanvas> */}

        </>
    );
}

export default NavbarHomePage
