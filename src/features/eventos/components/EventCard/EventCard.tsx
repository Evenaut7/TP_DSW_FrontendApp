// import React from 'react';
// import './EventCard.css';
// import type { Evento } from '@/types';

// type Props = {
//   evento: Evento;
//   children?: React.ReactNode; // acciones personalizables (botones)
//   className?: string;
// };

// const EventCard: React.FC<Props> = ({ evento, children, className }) => {
//   const fechaObj = evento.horaDesde ? new Date(evento.horaDesde) : null;
//   const dia = fechaObj ? fechaObj.getDate() : '';
//   const mes = fechaObj
//     ? fechaObj.toLocaleString('es-ES', { month: 'short' })
//     : '';

//   const horaInicio = fechaObj
//     ? fechaObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
//     : '';
//   const horaFin = evento.horaHasta
//     ? new Date(evento.horaHasta).toLocaleTimeString([], {
//         hour: '2-digit',
//         minute: '2-digit',
//       })
//     : '';

//   const estado = (evento as Evento).estado || 'Disponible';
//   const estadoClass =
//     estado === 'Agotado'
//       ? 'estado-agotado'
//       : estado === 'Cancelado'
//         ? 'estado-cancelado'
//         : 'estado-disponible';

//   return (
//     <div className={`evento-card ${className || ''}`}>
//       <div className="evento-fecha">
//         <span className="evento-dia">{dia}</span>
//         <span className="evento-mes">{mes}</span>
//       </div>

//       <div className="evento-info">
//         <h3 className="evento-titulo">
//           {evento.titulo}
//           <small className={`estado-text ${estadoClass} ms-2`}>{estado}</small>
//         </h3>

//         {horaInicio || horaFin ? (
//           <p className="evento-horario">
//             {horaInicio} {horaInicio && horaFin ? '-' : ''} {horaFin}
//           </p>
//         ) : null}

//         <p className="evento-descripcion">{evento.descripcion}</p>

//         {children ? (
//           <div className="evento-acciones d-flex gap-2">{children}</div>
//         ) : null}
//       </div>
//     </div>
//   );
// };

// export default EventCard;
import React from 'react';
import type { Evento } from '@/types';

type Props = {
  evento: Evento;
  children?: React.ReactNode;
  className?: string;
};

const EventCard: React.FC<Props> = ({ evento, children, className }) => {
  const fechaObj = evento.horaDesde ? new Date(evento.horaDesde) : null;
  const dia = fechaObj ? fechaObj.getDate() : '';
  const mes = fechaObj
    ? fechaObj.toLocaleString('es-ES', { month: 'short' })
    : '';
  const horaInicio = fechaObj
    ? fechaObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    : '';
  const horaFin = evento.horaHasta
    ? new Date(evento.horaHasta).toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      })
    : '';

  const estado = (evento as Evento).estado || 'Disponible';
  const estadoBadgeClasses =
    estado === 'Agotado'
      ? 'bg-slate-100 dark:bg-slate-600 text-slate-400 dark:text-slate-300'
      : estado === 'Cancelado'
        ? 'bg-red-50 dark:bg-red-900/40 text-red-500 dark:text-red-400'
        : 'bg-emerald-50 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400';

  return (
    <div
      className={`flex items-stretch bg-[#ffffff] dark:bg-slate-700 rounded-xl border border-slate-100 dark:border-slate-600 shadow-sm hover:shadow-md hover:shadow-primary/10 overflow-hidden transition-all duration-300 hover:-translate-y-1 ${className || ''}`}
    >
      {/* Columna fecha */}
      <div className="flex flex-col items-center justify-center bg-primary text-white px-4 py-5 w-20 flex-shrink-0">
        <span className="text-2xl font-bold leading-none">{dia}</span>
        <span className="text-xs uppercase tracking-wider mt-1">{mes}</span>
      </div>

      {/* Contenido */}
      <div className="flex-1 px-5 py-4 flex flex-col gap-2">
        <div className="flex items-start justify-between gap-2 flex-wrap">
          <h3 className="font-bold text-slate-900 dark:text-slate-100 text-base md:text-lg leading-snug">
            {evento.titulo}
          </h3>
          <span
            className={`text-xs font-semibold px-2 py-0.5 rounded-full flex-shrink-0 ${estadoBadgeClasses}`}
          >
            {estado}
          </span>
        </div>

        {(horaInicio || horaFin) && (
          <p className="text-slate-400 dark:text-slate-400 text-sm flex items-center gap-1">
            <span className="material-symbols-outlined text-sm">schedule</span>
            {horaInicio}
            {horaInicio && horaFin ? ' – ' : ''}
            {horaFin}
          </p>
        )}

        <p className="text-slate-500 dark:text-slate-300 text-sm leading-relaxed line-clamp-2">
          {evento.descripcion}
        </p>

        {children && (
          <div className="flex flex-wrap gap-2 mt-1">{children}</div>
        )}
      </div>
    </div>
  );
};

export default EventCard;
