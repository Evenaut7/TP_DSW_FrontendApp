// import React from 'react';
// import { useApiGetById } from '@/utils/api';
// import { Row, Col, Button } from 'react-bootstrap';
// import EventCard from '@/features/eventos/components/EventCard/EventCard';
// import type { Evento } from '@/types';

// type ListadoEventosProps = {
//   pdiId: number;
// };

// const ListadoEventos: React.FC<ListadoEventosProps> = ({ pdiId }) => {
//   const { data, loading, error } = useApiGetById<{ eventos: Evento[] }>(
//     '/api/puntosDeInteres',
//     pdiId,
//   );

//   if (loading) return <p>Cargando eventos...</p>;
//   if (error) return <p>{error}</p>;
//   if (!data || data.eventos.length === 0)
//     return <p>No hay eventos disponibles.</p>;

//   return (
//     <div className="eventos-container">
//       <Row className="g-4">
//         {data.eventos.map((evento) => (
//           <Col key={evento.id} xs={12} md={6}>
//             <EventCard evento={evento}>
//               <Button className="flex-fill">Agendar</Button>
//               <Button
//                 variant="outline-warning"
//                 className="favoriteBtn flex-fill"
//               >
//                 <i className="bi bi-star"></i> Agregar a favoritos
//               </Button>
//             </EventCard>
//           </Col>
//         ))}
//       </Row>
//     </div>
//   );
// };

// export default ListadoEventos;

import React from 'react';
import { useApiGetById } from '@/utils/api';
import EventCard from '@/features/eventos/components/EventCard/EventCard';
import type { Evento } from '@/types';

type ListadoEventosProps = {
  pdiId: number;
};

const ListadoEventos: React.FC<ListadoEventosProps> = ({ pdiId }) => {
  const { data, loading, error } = useApiGetById<{ eventos: Evento[] }>(
    '/api/puntosDeInteres',
    pdiId,
  );

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
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {data.eventos.map((evento) => (
        <EventCard key={evento.id} evento={evento}>
          <button className="flex-1 px-4 py-2 rounded-full bg-primary text-white text-sm font-semibold hover:bg-accent transition-colors">
            Agendar
          </button>
          <button className="flex-1 px-4 py-2 rounded-full border border-slate-300 dark:border-slate-500 text-slate-700 dark:text-slate-300 text-sm font-semibold flex items-center justify-center gap-1 hover:border-yellow-400 hover:text-yellow-500 dark:hover:border-yellow-400 dark:hover:text-yellow-400 transition-all">
            <span className="material-symbols-outlined text-base">
              star_border
            </span>
            Agregar a favoritos
          </button>
        </EventCard>
      ))}
    </div>
  );
};

export default ListadoEventos;
