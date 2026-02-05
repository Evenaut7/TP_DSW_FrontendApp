import { Link } from 'react-router-dom';
import { X, Map, Notebook, Star, Settings, CircleUserRound, House, Sun } from 'lucide-react';
import { useUser } from '@/features/user';
import { useAuthAdmin } from '@/features/auth';
import '@/styles/homepage.css';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenAuth?: () => void;
}

export default function Sidebar({ isOpen, onClose, onOpenAuth }: SidebarProps) {
  const { user, logout } = useUser();
  const { isAdmin } = useAuthAdmin();

  const handleLinkClick = () => {
    onClose(); // Auto-close on link click
  };

  return (
    <>
      {/* Overlay */}
      <div
        className={`overlay ${isOpen ? 'overlay-visible' : 'overlay-hidden'}`}
        onClick={onClose}
      />

      {/* Sidebar */}
      <div className={`sidebar-container ${isOpen ? 'open' : ''}`}>
        {/* Header */}
        <div className="sidebar-header">
          <div className="logo-discover">
            <Sun className="w-6 h-6" />
            <span className="logo-discover-text text-slate-900 dark:text-white">
              Discover
            </span>
          </div>
          <button
            onClick={onClose}
            className="icon-button"
            aria-label="Cerrar menú"
          >
            <X className="w-5 h-5 text-slate-600 dark:text-slate-400" />
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="p-4 space-y-2">
          <Link to="/" onClick={handleLinkClick} className="sidebar-link">
            <House className="w-5 h-5" />
            <span className="font-semibold">Inicio</span>
          </Link>

          <Link to="/map" onClick={handleLinkClick} className="sidebar-link">
            <Map className="w-5 h-5" />
            <span className="font-semibold">Mapa</span>
          </Link>

          {/* Opciones solo para usuarios autenticados */}
          {user && (
            <>
              <Link to="/agenda" onClick={handleLinkClick} className="sidebar-link">
                <Notebook className="w-5 h-5" />
                <span className="font-semibold">Agenda</span>
              </Link>

              <Link to="/favoritos" onClick={handleLinkClick} className="sidebar-link">
                <Star className="w-5 h-5" />
                <span className="font-semibold">Favoritos</span>
              </Link>
            </>
          )}

          {/* Admin Section */}
          {user && isAdmin && (
            <>
              <div className="border-t border-slate-200 dark:border-slate-800 my-4" />
              <div className="px-4 py-2 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Administración
              </div>
              <Link to="/provincias" onClick={handleLinkClick} className="sidebar-link">
                <Settings className="w-5 h-5" />
                <span className="font-semibold">Gestión Provincias</span>
              </Link>
              <Link to="/tags" onClick={handleLinkClick} className="sidebar-link">
                <Settings className="w-5 h-5" />
                <span className="font-semibold">Gestión Tags</span>
              </Link>
            </>
          )}
        </nav>

        {/* User Section */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950">
          {user ? (
            <div className="space-y-2">
              <div className="flex items-center gap-3 px-4 py-2 text-slate-700 dark:text-slate-300">
                <CircleUserRound className="w-5 h-5" />
                <span className="font-semibold text-sm">{user.nombre ?? user.gmail}</span>
              </div>
              <Link
                to="/perfil"
                onClick={handleLinkClick}
                className="sidebar-admin-link"
              >
                Ver perfil
              </Link>
              <button
                onClick={async () => {
                  await logout();
                  handleLinkClick();
                }}
                className="block w-full text-left px-4 py-2 text-sm text-danger transition-colors"
              >
                Cerrar sesión
              </button>
            </div>
          ) : (
            <button
              onClick={() => {
                if (onOpenAuth) {
                  onOpenAuth();
                  handleLinkClick();
                }
              }}
              className="loginButton w-full flex items-center justify-center gap-3"
            >
              <CircleUserRound className="w-5 h-5" />
              <span>Iniciar sesión</span>
            </button>
          )}
        </div>
      </div>
    </>
  );
}
