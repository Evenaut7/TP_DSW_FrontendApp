import { Link } from 'react-router-dom';
import { X, Map, Notebook, Star, Settings, CircleUserRound, House } from 'lucide-react';
import { useUser } from '@/features/user';
import { useAuthAdmin } from '@/features/auth';
import { logout } from '@/utils/session';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const { user } = useUser();
  const { isAdmin } = useAuthAdmin();

  const handleLinkClick = () => {
    onClose(); // Auto-close on link click
  };

  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-[200] transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full w-[280px] bg-white dark:bg-slate-900 shadow-2xl z-[201] transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-2xl">explore</span>
            <span className="text-xl font-black tracking-tighter uppercase text-slate-900 dark:text-white">
              Discover
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
            aria-label="Cerrar menú"
          >
            <X className="w-5 h-5 text-slate-600 dark:text-slate-400" />
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="p-4 space-y-2">
          <Link
            to="/"
            onClick={handleLinkClick}
            className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-slate-700 dark:text-slate-300"
          >
            <House className="w-5 h-5" />
            <span className="font-semibold">Inicio</span>
          </Link>

          <Link
            to="/map"
            onClick={handleLinkClick}
            className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-slate-700 dark:text-slate-300"
          >
            <Map className="w-5 h-5" />
            <span className="font-semibold">Mapa</span>
          </Link>

          <Link
            to="/agenda"
            onClick={handleLinkClick}
            className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-slate-700 dark:text-slate-300"
          >
            <Notebook className="w-5 h-5" />
            <span className="font-semibold">Agenda</span>
          </Link>

          <Link
            to="/favoritos"
            onClick={handleLinkClick}
            className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-slate-700 dark:text-slate-300"
          >
            <Star className="w-5 h-5" />
            <span className="font-semibold">Favoritos</span>
          </Link>

          {/* Admin Section */}
          {user && isAdmin && (
            <>
              <div className="border-t border-slate-200 dark:border-slate-800 my-4" />
              <div className="px-4 py-2 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Administración
              </div>
              <Link
                to="/provincias"
                onClick={handleLinkClick}
                className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-slate-700 dark:text-slate-300"
              >
                <Settings className="w-5 h-5" />
                <span className="font-semibold">Gestión Provincias</span>
              </Link>
              <Link
                to="/tags"
                onClick={handleLinkClick}
                className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-slate-700 dark:text-slate-300"
              >
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
                className="block px-4 py-2 text-sm text-slate-600 dark:text-slate-400 hover:text-primary transition-colors"
              >
                Ver perfil
              </Link>
              <button
                onClick={async () => {
                  await logout();
                  handleLinkClick();
                }}
                className="block w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:text-red-700 transition-colors"
              >
                Cerrar sesión
              </button>
            </div>
          ) : (
            <Link
              to="#"
              onClick={handleLinkClick}
              className="flex items-center gap-3 px-4 py-3 rounded-lg bg-primary hover:bg-primary/90 transition-colors text-white font-semibold"
            >
              <CircleUserRound className="w-5 h-5" />
              <span>Iniciar sesión</span>
            </Link>
          )}
        </div>
      </div>
    </>
  );
}
