import React from 'react';
import './EventCard.css';
import type { Evento } from '@/types';

type Props = {
  evento: Evento;
  children?: React.ReactNode; // acciones personalizables (botones)
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
  const estadoClass =
    estado === 'Agotado'
      ? 'estado-agotado'
      : estado === 'Cancelado'
        ? 'estado-cancelado'
        : 'estado-disponible';

  return (
    <div className={`evento-card ${className || ''}`}>
      <div className="evento-fecha">
        <span className="evento-dia">{dia}</span>
        <span className="evento-mes">{mes}</span>
      </div>

      <div className="evento-info">
        <h3 className="evento-titulo">
          {evento.titulo}
          <small className={`estado-text ${estadoClass} ms-2`}>{estado}</small>
        </h3>

        {horaInicio || horaFin ? (
          <p className="evento-horario">
            {horaInicio} {horaInicio && horaFin ? '-' : ''} {horaFin}
          </p>
        ) : null}

        <p className="evento-descripcion">{evento.descripcion}</p>

        {children ? (
          <div className="evento-acciones d-flex gap-2">{children}</div>
        ) : null}
      </div>
    </div>
  );
};

export default EventCard;
