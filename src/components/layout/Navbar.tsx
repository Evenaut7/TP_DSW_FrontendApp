import { Link } from 'react-router-dom';
import '@/styles/Navbar.css';
import { useState, useEffect, useRef } from 'react';
import { useUser } from '@/features/user';
import { useAuthAdmin } from '@/features/auth';
import AuthModal from '@/features/auth/AuthModal';
import RegisterModal from '@/features/auth/RegisterModal';
import WelcomeModal from '@/features/auth/WelcomeModal';
import Sidebar from '@/components/layout/Sidebar';
import {
  Map,
  Notebook,
  Star,
  CircleUserRound,
  Settings,
  Menu,
  Sun,
  Sparkles,
  ChevronDown,
} from 'lucide-react';

// ── Dropdown genérico ─────────────────────────────────────────────────────────
function NavDropdown({
  label,
  icon,
  children,
}: {
  label: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Cerrar al hacer click fuera
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="navLetters flex items-center gap-1 bg-transparent border-0 cursor-pointer p-0"
      >
        {label}
        {icon}
        <ChevronDown
          className={`w-3 h-3 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-100 dark:border-slate-700 p-1.5 z-50">
          {children}
        </div>
      )}
    </div>
  );
}

// ── Item de dropdown ──────────────────────────────────────────────────────────
function DropdownLink({
  to,
  children,
  onClick,
}: {
  to?: string;
  children: React.ReactNode;
  onClick?: () => void;
}) {
  const cls =
    'flex items-center w-full text-left px-4 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors no-underline leading-tight';
  if (to)
    return (
      <Link to={to} className={cls}>
        {children}
      </Link>
    );
  return (
    <button className={cls} onClick={onClick}>
      {children}
    </button>
  );
}

// ── Navbar ────────────────────────────────────────────────────────────────────
const Navbar = () => {
  const [showRegister, setShowRegister] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const [width, setWidth] = useState(window.innerWidth);
  const [showWelcome, setShowWelcome] = useState(false);
  const [welcomeName, setWelcomeName] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, refreshUser, logout } = useUser();
  const { isAdmin } = useAuthAdmin();

  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <>
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {width > 950 ? (
        /* Desktop */
        <nav className="navbar fixed top-6 left-1/2 -translate-x-1/2 z-[100] w-[90%] max-w-[1100px]">
          <div className="px-4">
            <Link
              to="/"
              className="flex items-center gap-2 no-underline navLogo"
            >
              <Sun className="w-6 h-6" />
              <span className="navLogo-text">Discover</span>
            </Link>
          </div>

          {user ? (
            <div className="navRight gap-3">
              <Link className="fw-semibold navLetters" to="/map">
                Mapa <Map />
              </Link>
              <Link className="fw-semibold navLetters" to="/agenda">
                Agenda <Notebook />
              </Link>
              <Link className="fw-semibold navLetters" to="/favoritos">
                Favoritos <Star />
              </Link>

              {user.tipo === 'creador' && (
                <Link className="fw-semibold navLetters" to="/creator">
                  Mi Panel Creador <Sparkles />
                </Link>
              )}

              {isAdmin && (
                <NavDropdown
                  label="Gestión"
                  icon={<Settings className="w-4 h-4" />}
                >
                  <DropdownLink to="/provincias">
                    Gestión provincias
                  </DropdownLink>
                  <DropdownLink to="/tags">Gestión tags</DropdownLink>
                  <DropdownLink to="/usuarios">Gestión Usuarios</DropdownLink>
                </NavDropdown>
              )}

              <NavDropdown
                label={user.nombre ?? user.gmail ?? 'Usuario'}
                icon={<CircleUserRound className="w-4 h-4" />}
              >
                <DropdownLink to="/perfil">Perfil</DropdownLink>
                <DropdownLink
                  onClick={async () => {
                    await logout();
                  }}
                >
                  Cerrar sesión
                </DropdownLink>
              </NavDropdown>
            </div>
          ) : (
            <div className="navRight gap-3">
              <Link className="fw-semibold navLetters" to="/map">
                Mapa <Map />
              </Link>
              <div className="px-4">
                <button
                  onClick={() => setShowAuth(true)}
                  className="loginButton"
                >
                  Iniciar sesión
                </button>
              </div>
            </div>
          )}
        </nav>
      ) : (
        /* Mobile */
        <nav className="navbar fixed top-6 left-1/2 -translate-x-1/2 z-[100] w-[90%] max-w-[500px]">
          <div className="flex items-center justify-between w-full">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
              aria-label="Abrir menú"
            >
              <Menu className="w-6 h-6 text-white" />
            </button>
            <Link
              to="/"
              className="flex items-center gap-2 no-underline navLogo"
            >
              <Sun className="w-5 h-5" />
              <span className="navLogo-text">Discover</span>
            </Link>
            <div className="w-10" />
          </div>
        </nav>
      )}

      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onOpenAuth={() => setShowAuth(true)}
      />

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
  );
};

export default Navbar;
