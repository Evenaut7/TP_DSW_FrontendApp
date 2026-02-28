import { Link } from 'react-router-dom';
import { API_BASE_URL } from '@/utils/api';

interface PDIData {
  id: number;
  nombre: string;
  descripcion: string;
  imagen: string;
  calle: string;
  altura: number;
}

interface ListadoPDIProps {
  pdis: PDIData[];
}

const ListadoPDI = ({ pdis }: ListadoPDIProps) => {
  if (!pdis.length)
    return (
      <p className="text-slate-400 dark:text-slate-500 text-sm">
        No hay puntos de interés disponibles.
      </p>
    );

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
      {pdis.map((pdi) => (
        <Link key={pdi.id} to={`/pdi/${pdi.id}`} className="group no-underline">
          <div className="flex flex-col bg-[#ffffff] dark:bg-slate-700 rounded-xl border border-slate-100 dark:border-slate-600 shadow-sm overflow-hidden transition-all duration-300 group-hover:-translate-y-1.5 group-hover:shadow-lg group-hover:shadow-primary/10 h-full">
            {/* Imagen */}
            <div className="relative w-full h-44 overflow-hidden flex-shrink-0">
              <img
                src={`${API_BASE_URL}/public/${pdi.imagen}`}
                alt={pdi.nombre}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>

            {/* Contenido */}
            <div className="flex flex-col flex-1 p-4 gap-2">
              <h5 className="font-bold text-slate-900 dark:text-slate-100 text-base leading-snug">
                {pdi.nombre}
              </h5>
              <p className="text-slate-400 dark:text-slate-400 text-xs flex items-center gap-1">
                <span className="material-symbols-outlined text-sm">
                  location_on
                </span>
                {pdi.calle} {pdi.altura}
              </p>
              <p className="text-slate-500 dark:text-slate-300 text-sm leading-relaxed line-clamp-3 flex-1">
                {pdi.descripcion}
              </p>
              <div className="pt-1 mt-auto">
                <span className="inline-flex items-center gap-1 text-primary text-sm font-semibold group-hover:gap-2 transition-all">
                  Ver más
                  <span className="material-symbols-outlined text-base">
                    arrow_forward
                  </span>
                </span>
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default ListadoPDI;
