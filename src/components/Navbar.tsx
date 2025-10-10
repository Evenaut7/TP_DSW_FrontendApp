import { Link } from "react-router-dom"
import "../styles/NotFoundPage.css"
import 'bootstrap/dist/css/bootstrap.min.css'
import "../styles/Navbar.css"
import { useState, useEffect } from "react"
import AuthModal from "./AuthModal.tsx"
import RegisterModal from "./RegisterModal.tsx"
import { House, Map, Notebook, CircleUserRound, Star } from "lucide-react";



const Navbar = () => {
  const [showRegister, setShowRegister] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
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
        <nav className="navbar">
          <div>
            <Link to={"/"}>
              <button className='navTitle'>
                ¿QUE HACEMOS?
              </button>
            </Link>
          </div>
          <div className="navRight gap-3">
            <Link className="fw-semibold navLetters" to={"/map"}>
              Mapa
              <Map />
            </Link>
            <Link className="fw-semibold navLetters" to={"/agenda"}>
              Agenda
              <Notebook />
            </Link>
            <Link className="fw-semibold navLetters" to={"/favoritos"}>
              Favoritos
              <Star />
            </Link>

            <button
              className="profileImage"
              type="button"
              onClick={() => setShowAuth(true)}
            >
              <CircleUserRound color="White" size={35}/>
            </button>

          </div>
        </nav>
      ) : (
        <nav className="bottom-navbar">
          <div>
            <House />
            <Link to={"/"}>Inicio</Link>
          </div>
          <div>  
            <Map />
            <Link to={"/map"}>Mapa</Link>
          </div>
          <div>
            <Notebook />
            <Link to={"/agenda"}>Agenda</Link>
          </div>
          <div>
            <Star />
            <Link to={"/favoritos"}>Favoritos</Link>
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

export default Navbar