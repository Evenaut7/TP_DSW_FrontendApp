import Navbar from '@/components/layout/Navbar/Navbar';
import Estrellas from '@/components/ui/Rating/Estrellas';
import { useParams, Link } from 'react-router-dom';
import { useApiGetById, API_BASE_URL } from '@/utils/api';
import { useState } from 'react';
import PantallaDeCarga from '@/components/ui/Loading/PantallaDeCarga';
import ListadoDeTags from '@/features/tags/components/ListadoDeTags/ListadoDeTags';
import ListadoPDI from '@/features/pdi/components/ListadoPDI/ListadoPDI';
import { useBusquedaPDI } from '@/features/pdi/hooks/useBusquedaPDI';
import ListadoPDISkeleton from '@/features/pdi/components/ListadoPDISkeleton/ListadoPDISkeleton';
import { useTheme } from '@/context/ThemeContext';
import { Sun, Moon } from 'lucide-react';

interface PDI {
  id: number;
  nombre: string;
  descripcion: string;
  imagen: string;
  calle: string;
  altura: number;
}

interface Localidad {
  id: number;
  nombre: string;
  codUta: string;
  descripcion: string;
  latitud: number;
  longitud: number;
  imagen: string;
  provincia: {
    id: number;
    nombre: string;
    codUta: string;
  };
  puntosDeInteres?: PDI[];
}

const Localidad = () => {
  const { id } = useParams<{ id: string }>();
  const localidadId = id ? parseInt(id) : null;
  const { theme, toggleTheme } = useTheme();

  const {
    data: localidad,
    loading,
    error,
  } = useApiGetById<Localidad>('/api/localidades', localidadId);
  const [tagsSeleccionados, setTagsSeleccionados] = useState<number[]>([]);
  const [busqueda, setBusqueda] = useState('');
  const pdisIniciales = localidad?.puntosDeInteres ?? [];
  const { pdis, loadingPDIs } = useBusquedaPDI({
    localidadId,
    busqueda,
    tags: tagsSeleccionados,
    pdisIniciales,
  });

  if (loading) return <PantallaDeCarga mensaje="Localidad" />;
  if (error) return <p>Error: {error}</p>;
  if (!localidad) return <p>No se encontró la localidad</p>;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-800 font-display transition-colors duration-300">
      <Navbar />

      <div className="w-full bg-gradient-to-br from-sky-50 via-blue-100 to-slate-50 dark:from-slate-900 dark:via-primary/30 dark:to-slate-800 pt-24 pb-12 md:pt-32 md:pb-16">
        <div className="max-w-7xl mx-auto px-5 md:px-16">
          <div className="flex items-center gap-1.5 text-sm mb-8 flex-wrap text-slate-400 dark:text-white/60">
            <Link
              to="/"
              className="hover:text-primary dark:hover:text-white transition-colors"
            >
              Inicio
            </Link>
            <span className="material-symbols-outlined text-sm">
              chevron_right
            </span>
            <span>Argentina</span>
            <span className="material-symbols-outlined text-sm">
              chevron_right
            </span>
            <span className="text-slate-600 dark:text-white/80 font-medium">
              {localidad.provincia.nombre}
            </span>
            <span className="material-symbols-outlined text-sm">
              chevron_right
            </span>
            <span className="text-primary dark:text-white font-semibold">
              {localidad.nombre}
            </span>
          </div>

          <div className="flex flex-col md:flex-row md:items-center gap-8 md:gap-12">
            <div className="flex-1 space-y-5">
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-extrabold tracking-tight leading-none text-slate-900 dark:text-white">
                {localidad.nombre}
              </h1>
              <Estrellas rating={3} reviews={37} />
              <p className="text-slate-500 dark:text-white/75 text-base md:text-lg leading-relaxed max-w-lg">
                {localidad.descripcion}
              </p>
            </div>

            <div className="w-full md:w-80 lg:w-96 flex-shrink-0">
              <div className="relative rounded-2xl overflow-hidden shadow-xl shadow-slate-300/50 dark:shadow-black/40 aspect-[4/3] ring-1 ring-slate-200 dark:ring-white/10">
                <img
                  src={`${API_BASE_URL}/public/${localidad.imagen}`}
                  alt={localidad.nombre}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Separador suave ── */}
      <div className="w-full h-8 bg-gradient-to-b from-white to-slate-100 dark:from-slate-800 dark:to-slate-900" />

      {/* ── Seccion PDIs ── */}
      <div className="w-full bg-slate-100 dark:bg-slate-900 py-10 md:py-16">
        <div className="max-w-7xl mx-auto px-5 md:px-16 space-y-6">
          <div className="space-y-1">
            <h2 className="text-2xl md:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100">
              Puntos de Interes
            </h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm md:text-base">
              Lugares destacados en {localidad.nombre}.
            </p>
          </div>

          {/* Buscador */}
          <input
            className="w-full md:max-w-md px-4 py-3 rounded-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
            placeholder="Buscar un Punto de Interes..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />

          {/* Tags filtrables */}
          <ListadoDeTags onTagsChange={setTagsSeleccionados} />

          {/* Listado */}
          <div className="pt-2">
            {loadingPDIs ? <ListadoPDISkeleton /> : <ListadoPDI pdis={pdis} />}
          </div>
        </div>
      </div>

      <button
        onClick={toggleTheme}
        aria-label="Cambiar tema"
        className="fixed bottom-6 right-6 z-50 p-3 rounded-full shadow-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-600 dark:text-slate-200 hover:scale-110 transition-all duration-300"
      >
        {theme === 'dark' ? (
          <Sun className="w-5 h-5" />
        ) : (
          <Moon className="w-5 h-5" />
        )}
      </button>
    </div>
  );
};

export default Localidad;
