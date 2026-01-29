import { Link } from "react-router-dom"
import './Navbar.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import { useState, useEffect } from "react"
import { useUser } from '@/features/user';
import { useAuthAdmin } from '@/features/auth';
import AuthModal from '@/features/auth/components/AuthModal/AuthModal';
import RegisterModal from '@/features/auth/components/RegisterModal/RegisterModal';
import WelcomeModal from '@/features/auth/components/WelcomeModal/WelcomeModal';
import { House, Map, Notebook,  Star, CircleUserRound, Settings } from "lucide-react";



const Navbar = () => {
  const [showRegister, setShowRegister] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const [width, setWidth] = useState(window.innerWidth)
  const [showWelcome, setShowWelcome] = useState(false);
  const [welcomeName, setWelcomeName] = useState('');
  const { user, refreshUser, logout } = useUser();
  const { isAdmin } = useAuthAdmin();

  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth)
    window.addEventListener('resize', handleResize)
    return () => {
      window.removeEventListener('resize', handleResize)
    }

  }, [])

  return (
    <>
      {width > 950 ? (
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
              <>
                {isAdmin && (
                  <div className="dropdown">
                    <button className="fw-semibold dropdown-toggle navLetters" data-bs-toggle="dropdown" aria-expanded="false">
                      Gestión
                      <Settings />
                    </button>
                    <ul className="dropdown-menu dropdown-menu-end">
                      <li><Link className="dropdown-item" to="/provincias">Gestión provincias</Link></li>
                      <li><Link className="dropdown-item" to="/tags">Gestión tags</Link></li>
                      <li><button className="dropdown-item" disabled>Gestión PDI (próximamente)</button></li>
                    </ul>
                  </div>
                )}
                <div className="dropdown">
                  <button className="fw-semibold dropdown-toggle navLetters" data-bs-toggle="dropdown" aria-expanded="false">
                    {user.nombre ?? user.gmail }
                    <CircleUserRound />
                  </button>
                  <ul className="dropdown-menu dropdown-menu-end">
                    <li><Link className="dropdown-item" to="/perfil">Perfil</Link></li>
                    <li><button className="dropdown-item" onClick={async () => { await logout(); }}>Cerrar sesión</button></li>
                  </ul>
                </div>
              </>
            ) : (
              <Link className="fw-semibold navLetters" to="#" onClick={() => setShowAuth(true)}>
                Usuario
                <CircleUserRound />
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
          {user && isAdmin && (
            <div>
              <div className="dropdown">
                <button className="btn btn-link dropdown-toggle navLetters" data-bs-toggle="dropdown" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: 0 }}>
                  <Settings />
                  Gestión
                </button>
                <ul className="dropdown-menu dropdown-menu-end">
                  <li><Link className="dropdown-item" to="/provincias">Gestión provincias</Link></li>
                  <li><Link className="dropdown-item" to="/tags">Gestión tags</Link></li>
                  <li><button className="dropdown-item" disabled>Gestión PDI (próximamente)</button></li>
                </ul>
              </div>
            </div>
          )}
          <div>
            {user ? (
              <div className="dropdown">
                <button className="btn btn-link dropdown-toggle navLetters" data-bs-toggle="dropdown" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: 0 }}>
                  <CircleUserRound />
                  {user.nombre ?? user.gmail ?? 'Usuario'}
                </button>
                <ul className="dropdown-menu dropdown-menu-end">
                  <li><Link className="dropdown-item" to="/perfil">Perfil</Link></li>
                  <li><button className="dropdown-item" onClick={async () => { await logout(); }}>Cerrar sesión</button></li>
                </ul>
              </div>
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