//import { Link } from "react-router-dom"
import "../styles/NotFoundPage.css"
import 'bootstrap/dist/css/bootstrap.min.css'
import "../styles/Navbar.css"
// import usuario from '../assets/userStock.png'
import { useState, useEffect } from "react"
//import Modal from 'react-bootstrap/Modal';
//import InputLabel from "../components/InputLabel.tsx";
import { House, Map, Notebook, CircleUserRound } from "lucide-react";
import { SignedIn, SignedOut, SignUpButton, UserButton } from "@clerk/clerk-react"



const NavbarHomePage = () => {
    // const [lgShow, setLgShow] = useState(false);
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
            <nav className="navbarHomePage">
                <a className="item-navbarHomePage" href="#">
                <i className="bi bi-geo-alt"/> 
                <p>Localidades</p>
                </a>
                <a className="item-navbarHomePage" href="#">
                <i className="bi bi-calendar-week"/> 
                <p>Agenda</p>
                </a>
                <a className="item-navbarHomePage" href="#">
                <i className="bi bi-star-fill"/> 
                <p>Favoritos</p>
                </a>
                <SignedOut>
                    {/* <a className="item-navbarHomePage" href="#" onClick={() => setLgShow(true)}> */}
                    <div className="item-navbarHomePage">
                    <i className="bi bi-person-circle"/>
                    <SignUpButton mode="modal"/>
                    </div>
                </SignedOut>
                <SignedIn>
                    <div className="item-navbarHomePage">
                    <UserButton />
                    <p>Usuario</p>
                    </div>
                </SignedIn>
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
                <SignedOut>
                    
                    <CircleUserRound />
                    <SignUpButton mode="modal"/>
            
                </SignedOut>
                <SignedIn>
                    <UserButton />
                    <p>Usuario</p>
                </SignedIn>
            </div>
            </nav>
        )}

        {/* <Modal
            size="lg"
            show={lgShow}
            onHide={() => setLgShow(false)}
            aria-labelledby="contained-modal-title-vcenter"
            centered
        >
            <Modal.Header closeButton>
            <Modal.Title id="contained-modal-title-vcenter">
                Sign Up for Travel App
            </Modal.Title>
            </Modal.Header>
            <Modal.Body className="modal-body">
            <InputLabel label="Email" />
            <InputLabel label="Password" />
            </Modal.Body>
            <Modal.Footer className="modal-footer">
            <Link to={"/signup"}>Create account</Link>
            <BotonCel texto="Sign in" /> 
            <SignInButton mode="modal"/>
            </Modal.Footer>
        </Modal>
         */}
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