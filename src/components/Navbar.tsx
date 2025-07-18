import {Link} from "react-router-dom"
import "../styles/NotFoundPage.css"
import 'bootstrap/dist/css/bootstrap.min.css'
import "../styles/Navbar.css"
import usuario from '../assets/userStock.png'

const Navbar = () => {
  return (
    <nav className="navbar navbar-expand-lg px-3 py-1 navbar">
      <div className="container-fluid">
        <Link to ={"/"}>
          <button className='btn navTitle'>
            ¿QUE HACEMOS?
          </button>  
        </Link>  
        <div className="d-flex align-items-center gap-3">
          <a className="nav-link fw-semibold navLetters" href="#">
            Mapa
          </a>
          <a className="nav-link fw-semibold navLetters" href="#">
            Agenda
          </a>
          <a className="nav-link fw-semibold navLetters" href="#">
            Favoritos
          </a>
          <button
            className="btn p-1 d-inline-blockh-auto d-inline-block"
            type="button"
          >
            <img src={usuario} height={'40px'}/>
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar