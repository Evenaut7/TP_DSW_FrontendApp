import { Link } from "react-router-dom"
import './Navbar.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import { useState, useEffect } from "react"
import { useUser } from '@/features/user';
import { useAuthAdmin } from '@/features/auth';
import AuthModal from '@/features/auth/components/AuthModal/AuthModal';
import RegisterModal from '@/features/auth/components/RegisterModal/RegisterModal';
import WelcomeModal from '@/features/auth/components/WelcomeModal/WelcomeModal';
import Sidebar from '@/components/layout/Sidebar';
import { Map, Notebook, Star, CircleUserRound, Settings, Menu } from "lucide-react";



const Navbar = () => {
  const [showRegister, setShowRegister] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const [width, setWidth] = useState(window.innerWidth)
  const [showWelcome, setShowWelcome] = useState(false);
  const [welcomeName, setWelcomeName] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);
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
      {/* Sidebar for mobile */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {width > 950 ? (
        /* Desktop Navbar - Floating glassmorphism */
        <nav className="navbar fixed top-6 left-1/2 -translate-x-1/2 z-[100] w-[90%] max-w-[1100px]">
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
        /* Mobile Navbar - Matching glassmorphism effect */
        <nav className="navbar fixed top-6 left-1/2 -translate-x-1/2 z-[100] w-[90%] max-w-[500px]">
          <div className="flex items-center justify-between w-full">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
              aria-label="Abrir menú"
            >
              <Menu className="w-6 h-6 text-white" />
            </button>
            
            <Link to="/" className="flex items-center gap-2">
              <span className="material-symbols-outlined text-white text-xl">explore</span>
              <span className="text-lg font-black tracking-tighter uppercase text-white">
                Discover
              </span>
            </Link>

            <div className="w-10" /> {/* Spacer for centering */}
          </div>
        </nav>
      )}

      {/* Modals */}
      <AuthModal
        show={showAuth}
        onClose={() => setShowAuth(false)}
        onOpenRegister={() => {
          setShowAuth(false);
          setShowRegister(true);
        }}
        onSuccess={async (name: string) => {
          await refreshUser();
          setWelcomeName(name);
          setShowWelcome(true);
          setShowAuth(false);
        }}
      />

      <RegisterModal
        show={showRegister}
        onClose={() => setShowRegister(false)}
        onBackToLogin={() => {
          setShowRegister(false);
          setShowAuth(true);
        }}
        onSuccess={async (name: string) => {
          await refreshUser();
          setWelcomeName(name);
          setShowWelcome(true);
          setShowRegister(false);
        }}
      />

      <WelcomeModal
        show={showWelcome}
        onClose={() => setShowWelcome(false)}
        userName={welcomeName}
      />
    </>
  )
}

export default Navbar