import { Link } from "react-router-dom"
import "../styles/NotFoundPage.css"
import 'bootstrap/dist/css/bootstrap.min.css'
import "../styles/Navbar.css"
import { useState, useEffect } from "react"
import { useUser } from '../hooks/useUser';
import AuthModal from "./AuthModal.tsx"
import RegisterModal from "./RegisterModal.tsx"
import WelcomeModal from "./WelcomeModal";
import { House, Map, Notebook,  Star, CircleUserRound } from "lucide-react";



const Navbar = () => {
  const [showRegister, setShowRegister] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const [width, setWidth] = useState(window.innerWidth)
  const [showWelcome, setShowWelcome] = useState(false);
  const [welcomeName, setWelcomeName] = useState('');
  const { user, refreshUser, logout } = useUser();

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
            {user ? (
              <div className="dropdown">
                <button className="fw-semibold dropdown-toggle navLetters" data-bs-toggle="dropdown" aria-expanded="false">
                  {user.nombre ?? user.gmail }
                </button>
                <ul className="dropdown-menu dropdown-menu-end">
                  <li><Link className="dropdown-item" to="/perfil">Perfil</Link></li>
                  <li><button className="dropdown-item" onClick={async () => { await logout(); }}>Cerrar sesión</button></li>
                </ul>
              </div>
            ) : (
              <Link className="fw-semibold navLetters" to="#" onClick={() => setShowAuth(true)}>
                <CircleUserRound />
                Usuario
              </Link>
            )}

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
            {user ? (
              <>
                <CircleUserRound />
                        <div className="dropdown">
                            <button className="btn btn-link dropdown-toggle navLetters" data-bs-toggle="dropdown">
                                {user.nombre ?? user.gmail ?? 'Usuario'}
                            </button>
                            <ul className="dropdown-menu dropdown-menu-end">
                                <li><Link className="dropdown-item" to="/perfil">Perfil</Link></li>
                                <li><button className="dropdown-item" onClick={async () => { await logout(); }}>Cerrar sesión</button></li>
                            </ul>
                        </div>
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
      onSuccess={async (name) => { 
        await refreshUser();
        setWelcomeName(name); 
        setShowWelcome(true); 
        setShowAuth(false); }}
        />
        <RegisterModal
            show={showRegister}
      onClose={() => setShowRegister(false)}
      onBackToLogin={() => setShowAuth(true)}
    onSuccess={async (name) => { 
        await refreshUser();
        setWelcomeName(name); 
        setShowWelcome(true); 
        setShowAuth(false); }}
        />

    <WelcomeModal show={showWelcome} onClose={() => setShowWelcome(false)} userName={welcomeName}/>

    </>
  );
}

export default Navbar