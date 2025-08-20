import { Link } from "react-router-dom"
import "../styles/NotFoundPage.css"
import 'bootstrap/dist/css/bootstrap.min.css'
import "../styles/Navbar.css"
import { useState, useEffect } from "react"
import Modal from 'react-bootstrap/Modal';
import BotonCel from "../components/BotonCeleste.tsx";
import InputLabel from "../components/InputLabel.tsx";
import { House, Map, Notebook, CircleUserRound, Star } from "lucide-react"


const Navbar = () => {
  const [lgShow, setLgShow] = useState(false);
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
      {width > 768 ? (
        <nav className="navbar">
          <div>
            <Link to={"/"}>
              <button className='navTitle'>
                ¿QUE HACEMOS?
              </button>
            </Link>
          </div>
          <div className="navRight gap-3">
            <a className="fw-semibold navLetters" href="#">
              Mapa
              <Map />
            </a>
            <a className="fw-semibold navLetters" href="#">
              Agenda
              <Notebook />
            </a>
            <a className="fw-semibold navLetters" href="#">
              Favoritos
              <Star />
            </a>

            <button
              className="profileImage"
              type="button"
              onClick={() => setLgShow(true)}
            >
              <CircleUserRound color="White" size={35}/>
            </button>

          </div>
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
            <Star />
            <a href="#">Favoritos</a>
          </div>
          <div>
            <CircleUserRound />
              <a href="#" onClick={() => setLgShow(true)}>Usuario</a>
          </div>
        </nav>
      )}

      <Modal
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
          <Link to={"/login"}>Create account</Link>
          <BotonCel texto="Sign in" />
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default Navbar