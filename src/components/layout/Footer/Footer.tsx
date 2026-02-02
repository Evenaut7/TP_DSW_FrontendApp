import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 py-12 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Logo y descripción */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-2xl">explore</span>
              <span className="text-xl font-black tracking-tighter uppercase text-slate-900 dark:text-white">
                Discover
              </span>
            </div>
            <p className="text-slate-600 dark:text-slate-400 text-sm">
              Proyecto académico desarrollado por estudiantes de la UTN (Universidad Tecnológica Nacional).
            </p>
          </div>

          {/* Información del proyecto */}
          <div className="space-y-4">
            <h4 className="font-bold text-sm uppercase tracking-wider text-slate-900 dark:text-white">
              Proyecto Académico
            </h4>
            <p className="text-slate-600 dark:text-slate-400 text-sm">
              Desarrollo de Software - UTN
            </p>
            <p className="text-slate-600 dark:text-slate-400 text-sm">
              Año 2025
            </p>
          </div>

          {/* Feedback */}
          <div className="space-y-4">
            <h4 className="font-bold text-sm uppercase tracking-wider text-slate-900 dark:text-white">
              Ayúdanos a mejorar
            </h4>
            <p className="text-slate-600 dark:text-slate-400 text-sm mb-4">
              Tu opinión es importante para nosotros
            </p>
            <Link 
              to="/working-on-it"
              className="inline-flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg transition-all text-sm font-semibold"
            >
              <span className="material-symbols-outlined text-lg">feedback</span>
              Enviar sugerencia
            </Link>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-slate-200 dark:border-slate-800 pt-8 text-center">
          <p className="text-slate-500 dark:text-slate-400 text-xs">
            © 2024 Discover Argentina - Proyecto Académico UTN. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
