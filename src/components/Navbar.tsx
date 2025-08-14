import {Link} from "react-router-dom"
import "../styles/NotFoundPage.css"
import 'bootstrap/dist/css/bootstrap.min.css'
import "../styles/Navbar.css"
import usuario from '../assets/userStock.png'
import { useState } from "react"
import Modal from 'react-bootstrap/Modal';
import BotonCel from "../components/BotonCeleste.tsx";
import InputLabel from "../components/InputLabel.tsx";

const Navbar = () => {
  const [lgShow, setLgShow] = useState(false);
  return (
    <>
    <nav className="navbar">
      <div>
      <Link to ={"/"}>
        <button className='navTitle'>
          ¿QUE HACEMOS?
        </button>  
      </Link>
      </div>  
      <div className="navRight gap-3">
        <a className="fw-semibold navLetters" href="#">
          Mapa
        </a>
        <a className="fw-semibold navLetters" href="#">
          Agenda
        </a>
        <a className="fw-semibold navLetters" href="#">
          Favoritos
        </a>

          <button
            className="profileImage"
            type="button"
            onClick={() =>  setLgShow(true)}
          >
          <img src={usuario} height={'40px'}/>
        </button>

      </div>
    </nav>
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
          <InputLabel label="Username" />
          <InputLabel label="Location" />
        </Modal.Body>
        <Modal.Footer className="modal-footer">
          <Link to={"/login"}>I already have an account</Link>
          <BotonCel texto="Create account > " />
        </Modal.Footer>
        </Modal>
    </>
  );
}

export default Navbar