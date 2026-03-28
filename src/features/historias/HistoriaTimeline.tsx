import { useState, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { getImageUrl } from '@/utils/api';
import type { Historia } from '@/types';

function formatAnio(iso: string) {
  if (!iso) return '?';
  return new Date(iso).getFullYear().toString();
}

function formatFechaLarga(iso: string) {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('es-AR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

function getCardStyle(offset: number, isMobile: boolean): React.CSSProperties {
  const abs = Math.abs(offset);

  if (isMobile) {
    if (abs > 1) return { display: 'none' };
    // Card activa
    if (abs === 0) return {
      position: 'absolute',
      transform: 'translateX(0px) scale(1)',
      opacity: 1,
      zIndex: 10,
      transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
      pointerEvents: 'auto',
    };
    // Cards laterales en mobile: visibles pero pequeñas y recortadas
    return {
      position: 'absolute',
      transform: `translateX(${offset * 170}px) scale(0.72)`,
      opacity: 0.35,
      zIndex: 5,
      transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
      pointerEvents: 'none',
    };
  }

  if (abs > 2) return { display: 'none' };

  const translateX = offset * 260;
  const scale = abs === 0 ? 1 : abs === 1 ? 0.75 : 0.55;
  const translateZ = abs === 0 ? 0 : abs === 1 ? -100 : -200;
  const opacity = abs === 0 ? 1 : abs === 1 ? 0.55 : 0.25;
  const zIndex = abs === 0 ? 10 : abs === 1 ? 5 : 1;
  const rotateY = offset * -10;

  return {
    position: 'absolute',
    transform: `translateX(${translateX}px) translateZ(${translateZ}px) scale(${scale}) rotateY(${rotateY}deg)`,
    opacity,
    zIndex,
    transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
    pointerEvents: abs === 0 ? 'auto' : 'none',
  };
}

interface Props {
  historias: Historia[];
  pdiNombre: string;
  onClose: () => void;
}

export default function HistoriasTimeline({
  historias,
  pdiNombre,
  onClose,
}: Props) {
  const sorted = [...historias].sort(
    (a, b) =>
      new Date(a.fechaDesde).getTime() - new Date(b.fechaDesde).getTime(),
  );

  const [active, setActive] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 640);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') setActive((i) => Math.max(0, i - 1));
      if (e.key === 'ArrowRight')
        setActive((i) => Math.min(sorted.length - 1, i + 1));
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose, sorted.length]);

  const prev = () => setActive((i) => Math.max(0, i - 1));
  const next = () => setActive((i) => Math.min(sorted.length - 1, i + 1));

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center"
      style={{ backdropFilter: 'blur(16px)', background: 'rgba(0,0,0,0.65)' }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      {/* ── Header + botón cerrar en una fila, debajo del navbar ── */}
      <div className="absolute top-[120px] sm:top-8 left-0 right-0 z-20 flex items-center justify-between px-4 sm:px-6">
        <div className="w-10 flex-shrink-0" />
        <div className="flex flex-col items-center gap-0.5 pointer-events-none">
          <p className="text-xs font-bold uppercase tracking-widest text-white/50">
            Historias
          </p>
          <h2 className="text-lg sm:text-2xl font-extrabold text-white drop-shadow-lg truncate max-w-[200px] sm:max-w-xs">
            {pdiNombre}
          </h2>
        </div>
        <button
          onClick={onClose}
          className="p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors backdrop-blur-sm border border-white/20 flex-shrink-0"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* ── Escenario Desktop (3D carrusel) ── */}
      {!isMobile ? (
        <div
          className="relative flex items-center justify-center w-full"
          style={{ perspective: '1200px', height: '480px' }}
          onClick={(e) => e.stopPropagation()}
        >
          {sorted.map((h, i) => (
            <div key={h.id} style={getCardStyle(i - active, false)}>
              <HistoriaCard historia={h} />
            </div>
          ))}
        </div>
      ) : (
        /* ── Escenario Mobile (card centrada) ── */
        <div
          className="flex items-center justify-center w-full px-6 mt-16"
          onClick={(e) => e.stopPropagation()}
        >
          {sorted.map((h, i) => (
            <div key={h.id} style={getCardStyle(i - active, true)}>
              <HistoriaCard historia={h} />
            </div>
          ))}
        </div>
      )}

      {/* ── Navegación Desktop — lados ── */}
      {!isMobile && (
        <>
          <div className="absolute left-6 top-1/2 -translate-y-1/2 z-20">
            <button
              onClick={prev}
              disabled={active === 0}
              className="p-3 rounded-full bg-white/10 hover:bg-white/25 text-white border border-white/20 backdrop-blur-sm transition-all disabled:opacity-20 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
          </div>
          <div className="absolute right-6 top-1/2 -translate-y-1/2 z-20">
            <button
              onClick={next}
              disabled={active === sorted.length - 1}
              className="p-3 rounded-full bg-white/10 hover:bg-white/25 text-white border border-white/20 backdrop-blur-sm transition-all disabled:opacity-20 disabled:cursor-not-allowed"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>
        </>
      )}

      {/* ── Dots + contador + navegación mobile ── */}
      <div className="absolute bottom-8 flex flex-col items-center gap-3 z-20">
        {/* Botones de navegación en mobile — junto a los dots */}
        {isMobile && sorted.length > 1 && (
          <div className="flex items-center gap-4">
            <button
              onClick={prev}
              disabled={active === 0}
              className="p-2.5 rounded-full bg-white/10 hover:bg-white/25 text-white border border-white/20 backdrop-blur-sm transition-all disabled:opacity-20 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <div className="flex gap-1.5 items-center">
              {sorted.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActive(i)}
                  className={`rounded-full transition-all duration-300 ${
                    i === active
                      ? 'w-6 h-2 bg-white'
                      : 'w-2 h-2 bg-white/30 hover:bg-white/60'
                  }`}
                />
              ))}
            </div>

            <button
              onClick={next}
              disabled={active === sorted.length - 1}
              className="p-2.5 rounded-full bg-white/10 hover:bg-white/25 text-white border border-white/20 backdrop-blur-sm transition-all disabled:opacity-20 disabled:cursor-not-allowed"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* Dots desktop */}
        {!isMobile && sorted.length > 1 && (
          <div className="flex gap-1.5">
            {sorted.map((_, i) => (
              <button
                key={i}
                onClick={() => setActive(i)}
                className={`rounded-full transition-all duration-300 ${
                  i === active
                    ? 'w-6 h-2 bg-white'
                    : 'w-2 h-2 bg-white/30 hover:bg-white/60'
                }`}
              />
            ))}
          </div>
        )}

        <span className="text-xs text-white/40 tabular-nums font-medium">
          {active + 1} / {sorted.length}
        </span>
      </div>
    </div>
  );
}

// ── Tarjeta ───────────────────────────────────────────────────────────────────
function HistoriaCard({ historia }: { historia: Historia }) {
  return (
    <div
      className="w-80 bg-white dark:bg-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col border border-white/20"
      style={{ userSelect: 'none' }}
    >
      {/* Banda año */}
      <div className="relative bg-primary px-5 py-4 overflow-hidden flex-shrink-0">
        <span className="absolute right-2 top-1/2 -translate-y-1/2 text-7xl font-black text-white/10 leading-none select-none pointer-events-none">
          {formatAnio(historia.fechaDesde)}
        </span>
        <p className="text-3xl font-black text-white leading-none tracking-tight">
          {formatAnio(historia.fechaDesde)}
        </p>
        <p className="text-white/70 text-xs mt-1 font-medium">
          {formatFechaLarga(historia.fechaDesde)}
          {historia.fechaHasta && ` → ${formatFechaLarga(historia.fechaHasta)}`}
        </p>
      </div>

      {/* Título y descripción */}
      <div className="px-5 py-4 flex flex-col gap-2 flex-1">
        <h3 className="text-base font-extrabold text-slate-800 dark:text-white leading-snug">
          {historia.titulo}
        </h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
          {historia.descripcion}
        </p>
      </div>

      {/* Imagen opcional al fondo */}
      {historia.imagen && (
        <img
          src={getImageUrl(historia.imagen)}
          alt={historia.titulo}
          className="w-full h-36 object-cover flex-shrink-0"
          onError={(e) => {
            (e.target as HTMLImageElement).style.display = 'none';
          }}
        />
      )}
    </div>
  );
}