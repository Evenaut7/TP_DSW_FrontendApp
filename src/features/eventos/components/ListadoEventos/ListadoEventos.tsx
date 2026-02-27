import React, { useState, useEffect } from 'react';
import { 
  useApiGetById, 
  addEventoToAgenda, 
  removeEventoFromAgenda, 
  checkEventoAgendado 
} from '@/utils/api';
import { useUser } from '@/features/user';
import EventCard from '@/features/eventos/components/EventCard/EventCard';
import ResultModal from '@/components/modals/ResultModal/ResultModal';
import type { Evento } from '@/types';

type ListadoEventosProps = {
  pdiId: number;
};

const ListadoEventos: React.FC<ListadoEventosProps> = ({ pdiId }) => {
  const { user } = useUser();
  const { data, loading, error } = useApiGetById<{ eventos: Evento[] }>(
    '/api/puntosDeInteres',
    pdiId,
  );

  const [eventosAgendados, setEventosAgendados] = useState<Set<number>>(new Set());
  const [loadingEventos, setLoadingEventos] = useState<Set<number>>(new Set());
  const [showModal, setShowModal] = useState(false);
  const [modalConfig, setModalConfig] = useState({
    success: true,
    message: '',
  });

  // Cargar estados de agenda al montar
  useEffect(() => {
    if (!user || !data?.eventos) return;

    const checkAgendados = async () => {
      const checks = await Promise.all(
        data.eventos.map(async (evento) => {
          try {
            const result = await checkEventoAgendado(evento.id);
            // ✅ CORRECCIÓN: Backend devuelve "estaAgendado", no "agendado"
            return { 
              id: evento.id, 
              agendado: result.success && result.data?.estaAgendado 
            };
          } catch {
            return { id: evento.id, agendado: false };
          }
        })
      );

      const agendados = new Set(
        checks.filter(c => c.agendado).map(c => c.id)
      );
      setEventosAgendados(agendados);
    };

    checkAgendados();
  }, [user, data]);

  const handleToggleAgenda = async (eventoId: number) => {
    if (!user) {
      setModalConfig({
        success: false,
        message: 'Debes iniciar sesión para agendar eventos',
      });
      setShowModal(true);
      return;
    }

    setLoadingEventos(prev => new Set(prev).add(eventoId));

    try {
      const isAgendado = eventosAgendados.has(eventoId);
      const result = isAgendado
        ? await removeEventoFromAgenda(eventoId)
        : await addEventoToAgenda(eventoId);

      if (result.success) {
        setEventosAgendados(prev => {
          const newSet = new Set(prev);
          if (isAgendado) {
            newSet.delete(eventoId);
          } else {
            newSet.add(eventoId);
          }
          return newSet;
        });

        setModalConfig({
          success: true,
          message: isAgendado
            ? 'Evento removido de tu agenda'
            : 'Evento agregado a tu agenda',
        });
        setShowModal(true);
      } else {
        setModalConfig({
          success: false,
          message: result.error || 'Error al actualizar la agenda',
        });
        setShowModal(true);
      }
    } catch (err) {
      setModalConfig({
        success: false,
        message: 'Error al procesar la solicitud',
      });
      setShowModal(true);
    } finally {
      setLoadingEventos(prev => {
        const newSet = new Set(prev);
        newSet.delete(eventoId);
        return newSet;
      });
    }
  };

  if (loading)
    return (
      <p className="text-slate-400 dark:text-slate-500 text-sm">
        Cargando eventos...
      </p>
    );

  if (error) return <p className="text-red-500 text-sm">{error}</p>;

  if (!data || data.eventos.length === 0)
    return (
      <p className="text-slate-400 dark:text-slate-500 text-sm">
        No hay eventos disponibles.
      </p>
    );

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {data.eventos.map((evento) => {
          const isAgendado = eventosAgendados.has(evento.id);
          const isLoading = loadingEventos.has(evento.id);

          return (
            <EventCard key={evento.id} evento={evento}>
              <button
                onClick={() => handleToggleAgenda(evento.id)}
                disabled={isLoading || !user}
                className={`flex-1 px-4 py-2 rounded-full text-sm font-semibold transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed
                  ${
                    isAgendado
                      ? 'bg-green-500 hover:bg-green-600 text-white'
                      : 'bg-primary hover:bg-accent text-white'
                  }`}
              >
                {isLoading ? (
                  <>
                    <span className="material-symbols-outlined text-base animate-spin">
                      progress_activity
                    </span>
                    Procesando...
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-base">
                      {isAgendado ? 'check_circle' : 'event'}
                    </span>
                    {isAgendado ? 'Agendado' : 'Agendar'}
                  </>
                )}
              </button>

              <button
                className="flex-1 px-4 py-2 rounded-full border border-slate-300 dark:border-slate-500 text-slate-700 dark:text-slate-300 text-sm font-semibold flex items-center justify-center gap-1 hover:border-yellow-400 hover:text-yellow-500 dark:hover:border-yellow-400 dark:hover:text-yellow-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={!user}
                title={!user ? 'Debes iniciar sesión' : 'Agregar a favoritos'}
              >
                <span className="material-symbols-outlined text-base">
                  star_border
                </span>
                Favoritos
              </button>
            </EventCard>
          );
        })}
      </div>

      <ResultModal
        show={showModal}
        success={modalConfig.success}
        message={modalConfig.message}
        onClose={() => setShowModal(false)}
      />
    </>
  );
};

export default ListadoEventos;