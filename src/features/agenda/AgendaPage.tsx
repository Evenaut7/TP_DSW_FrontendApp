import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  CalendarDays,
  MapPin,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Inbox,
  Sun,
  Moon,
} from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import EventCard from '@/features/eventos/EventCard';
import PantallaDeCarga from '@/components/ui/PantallaDeCarga';
import { getAgendaUsuario, removeEventoFromAgenda } from '@/utils/api';
import { showSuccess, showValidationError } from '@/utils/notifications';
import { useTheme } from '@/context/ThemeContext';
import type { Evento } from '@/types';

// ==================== HELPERS ====================

const MESES = [
  'Enero',
  'Febrero',
  'Marzo',
  'Abril',
  'Mayo',
  'Junio',
  'Julio',
  'Agosto',
  'Septiembre',
  'Octubre',
  'Noviembre',
  'Diciembre',
];

function agruparPorMes(eventos: Evento[]): Map<string, Evento[]> {
  const mapa = new Map<string, Evento[]>();
  for (const evento of eventos) {
    if (!evento.horaDesde) continue;
    const fecha = new Date(evento.horaDesde);
    const clave = `${fecha.getFullYear()}-${String(fecha.getMonth() + 1).padStart(2, '0')}`;
    if (!mapa.has(clave)) mapa.set(clave, []);
    mapa.get(clave)!.push(evento);
  }
  for (const [, lista] of mapa) {
    lista.sort(
      (a, b) =>
        new Date(a.horaDesde).getTime() - new Date(b.horaDesde).getTime(),
    );
  }
  return mapa;
}

function claveLabel(clave: string): string {
  const [anio, mes] = clave.split('-').map(Number);
  return `${MESES[mes - 1]} ${anio}`;
}

// ==================== COMPONENTE ====================

export default function AgendaPage() {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();

  const [eventos, setEventos] = useState<Evento[]>([]);
  const [loading, setLoading] = useState(true);
  // índice dentro de `claves` — navegamos por índice, no por string
  const [indiceMes, setIndiceMes] = useState(0);
  const [quitando, setQuitando] = useState<number | null>(null);

  const fetchAgenda = useCallback(async () => {
    setLoading(true);
    const res = await getAgendaUsuario();
    if (res.success && res.data) {
      setEventos(res.data as Evento[]);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchAgenda();
  }, [fetchAgenda]);

  const handleQuitarDeAgenda = async (eventoId: number) => {
    setQuitando(eventoId);
    try {
      const res = await removeEventoFromAgenda(eventoId);
      if (!res.success)
        throw new Error(res.error || 'Error al quitar el evento');
      setEventos((prev) => prev.filter((e) => e.id !== eventoId));
      showSuccess('Evento quitado de tu agenda');
    } catch (err) {
      showValidationError(
        err instanceof Error ? err.message : 'Error desconocido',
      );
    } finally {
      setQuitando(null);
    }
  };

  const handleVerPDI = (evento: Evento) => {
    const pdiId =
      typeof evento.puntoDeInteres === 'number'
        ? evento.puntoDeInteres
        : (evento.puntoDeInteres as any)?.id;
    if (pdiId) navigate(`/pdi/${pdiId}`);
  };

  // ==================== DATOS ====================

  const agrupados = agruparPorMes(eventos);

  // Solo los meses que tienen eventos, ordenados cronológicamente
  const claves = Array.from(agrupados.keys()).sort();

  // Cuando cambia la lista de claves, asegurarse de que el índice sea válido
  const indiceSeguro = Math.min(indiceMes, Math.max(0, claves.length - 1));
  const claveActiva = claves[indiceSeguro] ?? null;
  const eventosMesActivo = claveActiva
    ? (agrupados.get(claveActiva) ?? [])
    : [];

  const puedeIrAtras = indiceSeguro > 0;
  const puedeIrAdelante = indiceSeguro < claves.length - 1;

  // ==================== RENDER ====================

  if (loading) return <PantallaDeCarga />;

  return (
    <div className="min-h-screen bg-slate-200 dark:bg-slate-900">
      <Navbar />

      <div className="max-w-3xl mx-auto px-4 pt-32 pb-20 space-y-6">
        {/* Header */}
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <CalendarDays className="w-7 h-7 text-primary" />
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              Mi agenda
            </h1>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-500 pl-10">
            {eventos.length === 0
              ? 'No tenés eventos guardados'
              : `${eventos.length} evento${eventos.length !== 1 ? 's' : ''} guardado${eventos.length !== 1 ? 's' : ''}`}
          </p>
        </div>

        {eventos.length === 0 ? (
          /* Estado vacío */
          <div className="flex flex-col items-center justify-center gap-4 py-24 text-center">
            <div className="w-16 h-16 rounded-full bg-white dark:bg-slate-800 flex items-center justify-center shadow-sm">
              <Inbox className="w-8 h-8 text-slate-300 dark:text-slate-600" />
            </div>
            <div>
              <p className="font-semibold text-slate-500 dark:text-slate-400">
                Tu agenda está vacía
              </p>
              <p className="text-sm text-slate-400 dark:text-slate-500 mt-1">
                Explorá los puntos de interés y guardá eventos que te interesen.
              </p>
            </div>
            <button
              onClick={() => navigate('/')}
              className="mt-2 px-5 py-2.5 rounded-full bg-primary text-white text-sm font-semibold hover:bg-accent transition-colors"
            >
              Explorar
            </button>
          </div>
        ) : (
          <>
            {/* Navegador de meses */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
              {/* Header del navegador */}
              <div className="bg-slate-100 dark:bg-slate-700/50 border-b border-slate-200 dark:border-slate-700 px-4 py-3 flex items-center justify-between gap-4">
                <button
                  onClick={() => setIndiceMes((i) => i - 1)}
                  disabled={!puedeIrAtras}
                  className="p-2 rounded-full hover:bg-white dark:hover:bg-slate-600 text-slate-500 dark:text-slate-400 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>

                <div className="flex flex-col items-center gap-1.5">
                  <span className="text-base font-bold text-slate-900 dark:text-slate-100 tracking-wide">
                    {claveActiva ? claveLabel(claveActiva) : '—'}
                  </span>
                  {/* Dots — uno por cada mes con eventos */}
                  {claves.length > 1 && (
                    <div className="flex items-center gap-1">
                      {claves.map((clave, i) => (
                        <button
                          key={clave}
                          onClick={() => setIndiceMes(i)}
                          title={claveLabel(clave)}
                          className={`h-1.5 rounded-full transition-all duration-200 ${
                            i === indiceSeguro
                              ? 'bg-primary w-4'
                              : 'bg-slate-300 dark:bg-slate-600 w-1.5 hover:bg-primary/50'
                          }`}
                        />
                      ))}
                    </div>
                  )}
                </div>

                <button
                  onClick={() => setIndiceMes((i) => i + 1)}
                  disabled={!puedeIrAdelante}
                  className="p-2 rounded-full hover:bg-white dark:hover:bg-slate-600 text-slate-500 dark:text-slate-400 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>

              {/* Contador eventos del mes */}
              <div className="px-5 py-2.5">
                <span className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                  {eventosMesActivo.length} evento
                  {eventosMesActivo.length !== 1 ? 's' : ''}
                </span>
              </div>
            </div>

            {/* Lista de eventos */}
            <div className="space-y-4">
              {eventosMesActivo.map((evento) => (
                <EventCard key={evento.id} evento={evento}>
                  <div className="flex items-center gap-2 pt-2 border-t border-slate-100 dark:border-slate-600 w-full">
                    {evento.puntoDeInteres && (
                      <button
                        onClick={() => handleVerPDI(evento)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-slate-200 dark:border-slate-600 text-slate-500 dark:text-slate-400 text-xs font-semibold hover:border-primary hover:text-primary dark:hover:text-primary transition-colors"
                      >
                        <MapPin className="w-3.5 h-3.5" />
                        Ver lugar
                      </button>
                    )}
                    <button
                      onClick={() => handleQuitarDeAgenda(evento.id!)}
                      disabled={quitando === evento.id}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-slate-200 dark:border-slate-600 text-slate-500 dark:text-slate-400 text-xs font-semibold hover:border-red-300 hover:text-red-500 dark:hover:text-red-400 transition-colors disabled:opacity-50 ml-auto"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      {quitando === evento.id
                        ? 'Quitando...'
                        : 'Quitar de agenda'}
                    </button>
                  </div>
                </EventCard>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Dark mode toggle */}
      <button
        onClick={toggleTheme}
        className="fixed bottom-6 right-6 z-50 p-3 rounded-full shadow-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-600 dark:text-slate-200 hover:scale-110 transition-all duration-300"
      >
        {theme === 'dark' ? (
          <Sun className="w-5 h-5 text-amber-400" />
        ) : (
          <Moon className="w-5 h-5" />
        )}
      </button>
    </div>
  );
}
