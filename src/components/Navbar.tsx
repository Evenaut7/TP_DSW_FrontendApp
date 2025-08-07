import {Link} from "react-router-dom"
import "../styles/NotFoundPage.css"
import 'bootstrap/dist/css/bootstrap.min.css'
import "../styles/Navbar.css"
import usuario from '../assets/userStock.png'

const Navbar = () => {
  return (
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
        >
          <img src={usuario} height={'40px'}/>
        </button>
      </div>
    </nav>
  );
}

export default Navbar