import { Link } from 'react-router-dom';
import { Sun } from 'lucide-react';
import '@/styles/homepage.css';

export default function Footer() {
  return (
    <footer className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 py-12 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Logo y descripción */}
          <div className="space-y-4">
            <div className="logo-discover">
              <Sun className="w-6 h-6" />
              <span className="logo-discover-text text-slate-900 dark:text-white">
                Discover
              </span>
            </div>
            <p className="footer-text">
              Proyecto académico desarrollado por estudiantes de la UTN (Universidad Tecnológica Nacional).
            </p>
          </div>

          <div className="space-y-4">
            <h4 className="footer-section-title">
              Proyecto Académico
            </h4>
            <p className="footer-text">
              Desarrollo de Software - UTN
            </p>
            <p className="footer-text">
              Año 2025
            </p>
          </div>

          <div className="space-y-4">
            <h4 className="footer-section-title">
              Ayúdanos a mejorar
            </h4>
            <p className="footer-text mb-4">
              Tu opinión es importante para nosotros
            </p>
            <Link to="/working-on-it" className="footer-button">
              <span className="material-symbols-outlined text-lg">feedback</span>
              Enviar sugerencia
            </Link>
          </div>
        </div>

        <div className="border-t border-slate-200 dark:border-slate-800 pt-8 text-center">
          <p className="text-slate-500 dark:text-slate-400 text-xs">
            © 2025 Discover Argentina - Proyecto Académico UTN. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
