import Navbar from '@/components/layout/Navbar/Navbar';
import Estrellas from '@/components/ui/Rating/Estrellas';
import { useParams } from 'react-router-dom';
import {
  useApiGetById,
  addFavorito,
  removeFavorito,
  API_BASE_URL,
} from '@/utils/api';
import { useUser } from '@/features/user';
import { useTheme } from '@/context/ThemeContext';
import { useState, useEffect } from 'react';
import ResultModal from '@/components/modals/ResultModal/ResultModal';
import PantallaDeCarga from '@/components/ui/Loading/PantallaDeCarga';
import { ListadoDeTags } from '@/features/tags';
import { ListadoEventos } from '@/features/eventos';
import { Sun, Moon } from 'lucide-react';

interface Tag {
  id: number;
  nombre: string;
}

interface PDI {
  id: number;
  nombre: string;
  descripcion: string;
  imagen: string;
  calle: string;
  altura: number;
  promedio: number;
  valoraciones: any[];
  tags?: Tag[];
  localidad: { id: number; nombre: string };
  eventos?: {
    id: number;
    titulo: string;
    descripcion: string;
    horaDesde: string;
    horaHasta: string;
  }[];
}

const PDIPage = () => {
  const { id } = useParams<{ id: string }>();
  const pdiId = id ? parseInt(id) : null;
  const { user, refreshUser } = useUser();
  const { theme, toggleTheme } = useTheme();
  const [loadingFavorito, setLoadingFavorito] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const {
    data: pdi,
    loading,
    error,
  } = useApiGetById<PDI>('/api/puntosDeInteres', pdiId);
  const [localEsFavorito, setLocalEsFavorito] = useState(false);

  useEffect(() => {
    if (user && pdiId)
      setLocalEsFavorito(
        user.favoritos?.some((fav) => fav.id === pdiId) || false,
      );
  }, [user, pdiId]);

  const handleToggleFavorito = async () => {
    if (!pdiId || !user) return;
    setLoadingFavorito(true);
    if (localEsFavorito) {
      const result = await removeFavorito(pdiId);
      if (result.success) {
        await refreshUser();
        setLocalEsFavorito(false);
      } else {
        setErrorMessage(result.error || 'Error al quitar de favoritos');
        setShowErrorModal(true);
      }
    } else {
      const result = await addFavorito(pdiId);
      if (result.success) {
        await refreshUser();
        setLocalEsFavorito(true);
      } else {
        setErrorMessage(result.error || 'Error al agregar a favoritos');
        setShowErrorModal(true);
      }
    }
    setLoadingFavorito(false);
  };

  const scrollToEventos = () =>
    document.getElementById('eventos')?.scrollIntoView({ behavior: 'smooth' });

  if (loading) return <PantallaDeCarga mensaje={'PDI'} />;
  if (error) return <p>Error: {error}</p>;
  if (!pdi) return <p>No se encontró el PDI</p>;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-800 font-display transition-colors duration-300">
      <Navbar />

      <div className="relative w-full h-[60vh] overflow-hidden">
        <img
          src={`${API_BASE_URL}/public/${pdi.imagen}`}
          alt={pdi.nombre}
          className="w-full h-full object-cover"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent dark:from-slate-800 dark:via-black/30 dark:to-transparent" />
        <div className="absolute bottom-0 left-0 w-full px-5 md:px-16 pb-8">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-white drop-shadow-lg">
              {pdi.nombre}
            </h1>
            <p className="text-white/80 mt-2 text-sm md:text-base drop-shadow">
              📍 {pdi.calle} {pdi.altura}
            </p>
          </div>
        </div>
      </div>

      {/* ── Info del PDI ── */}
      <div className="bg-[#ffffff] dark:bg-slate-800">
        <div className="max-w-7xl mx-auto px-5 md:px-16 py-8 md:py-12">
          <div className="flex flex-col md:flex-row gap-8 md:gap-16">
            <div className="flex-1 space-y-5">
              <p className="text-slate-600 dark:text-slate-300 text-base md:text-lg leading-relaxed">
                {pdi.descripcion}
              </p>
              <Estrellas
                rating={pdi.promedio}
                reviews={pdi.valoraciones.length}
              />
              {pdi.tags && pdi.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {pdi.tags.map((tag) => (
                    <span
                      key={tag.id}
                      className="px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-300 text-sm font-medium"
                    >
                      #{tag.nombre}
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 md:grid-cols-1 gap-3 w-full md:w-52 flex-shrink-0">
              <button className="col-span-1 h-11 px-5 rounded-full bg-primary text-white font-semibold hover:bg-accent transition-colors text-sm">
                Conocer historias
              </button>

              <button
                onClick={handleToggleFavorito}
                disabled={loadingFavorito || !user}
                className={`col-span-1 h-11 px-5 rounded-full font-semibold border transition-all flex items-center justify-center gap-1.5 text-sm
                  ${
                    localEsFavorito
                      ? 'bg-yellow-400 border-yellow-400 text-white hover:bg-yellow-500'
                      : 'border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:border-yellow-400 hover:text-yellow-500 dark:hover:border-yellow-400 dark:hover:text-yellow-400'
                  }
                  disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                <span className="material-symbols-outlined text-base flex-shrink-0">
                  {localEsFavorito ? 'star' : 'star_border'}
                </span>
                {localEsFavorito ? 'En favoritos' : 'Favoritos'}
              </button>

              <button
                onClick={scrollToEventos}
                className="col-span-2 md:col-span-1 h-11 px-5 rounded-full border border-primary/30 bg-primary/5 dark:bg-primary/10 text-primary font-semibold flex items-center justify-center gap-2 hover:bg-primary/10 dark:hover:bg-primary/20 transition-colors group text-sm"
              >
                <span className="material-symbols-outlined text-base flex-shrink-0">
                  event
                </span>
                Ver eventos
                <span className="material-symbols-outlined text-base transition-transform group-hover:translate-y-0.5 flex-shrink-0">
                  expand_more
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ── Separador suave ── */}
      <div className="w-full h-8 bg-gradient-to-b from-white to-slate-100 dark:from-slate-800 dark:to-slate-900" />

      {/* ── Sección eventos ── */}
      <div
        id="eventos"
        className="w-full bg-slate-100 dark:bg-slate-900 py-10 md:py-16"
      >
        <div className="max-w-7xl mx-auto px-5 md:px-16 space-y-6">
          <div className="space-y-1">
            <h2 className="text-2xl md:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100">
              Próximos eventos
            </h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm md:text-base">
              Actividades y eventos programados en este lugar.
            </p>
          </div>
          <ListadoDeTags />
          <ListadoEventos pdiId={pdi.id} />
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

      <ResultModal
        show={showErrorModal}
        success={false}
        message={errorMessage}
        onClose={() => setShowErrorModal(false)}
      />
    </div>
  );
};

export default PDIPage;
