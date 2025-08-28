// import { useFetch } from '../reducers/UseFetch';
// import 'bootstrap/dist/css/bootstrap.min.css';
// import imagenEvento from '../assets/eventoStock.jpg';

// interface Evento {
//   id: number;
//   titulo: string;
//   descripcion: string;
//   horaDesde: string;
//   horaHasta: string;
//   estado: string;
//   puntoDeInteres: number;
//   tags: string[];
// }

// const LisatadoEventos = () => {
//   const { data: eventos } = useFetch<Evento[]>(
//     'http://localhost:3000/api/evento'
//   );

//   return (
//     <div className="row row-cols-1 row-cols-md-3 g-4">
//       {eventos?.map((evento) => (
//         <div key={evento.id} className="col">
//           <div className="card h-100">
//             <img src={imagenEvento} className="card-img-top" />
//             <div className="card-body">
//               <h5 className="card-title">{evento.titulo}</h5>
//               <p className="card-text">{evento.descripcion}</p>
//             </div>
//           </div>
//         </div>
//       ))}
//     </div>
//   );
// };

// export default LisatadoEventos;

// <--------------------- todo lo anterior lo comente, porque creo que lo habia hecho el colo---------------------->

import React from 'react';
import { Card, Button, Row, Col } from 'react-bootstrap';
import { Calendar, Clock } from 'react-bootstrap-icons';
import { useFetchById } from '../reducers/UseFetchByID';
import '../styles/ListadoEventos.css';

type Evento = {
  id: number;
  titulo: string;
  descripcion: string;
  horaDesde: string;
  horaHasta: string;
};

type ListadoEventosProps = {
  pdiId: number;
};

const ListadoEventos: React.FC<ListadoEventosProps> = ({ pdiId }) => {
  const { data, loading, error } = useFetchById<{ eventos: Evento[] }>(
    `http://localhost:3000/api/puntosDeInteres/`,
    pdiId
  );

  if (loading) return <p>Cargando eventos...</p>;
  if (error) return <p>{error}</p>;
  if (!data || data.eventos.length === 0)
    return <p>No hay eventos disponibles.</p>;

  return (
    <Row className="g-4 justify-content-center">
      {data.eventos.map((evento) => {
        const fecha = new Date(evento.horaDesde).toLocaleDateString();
        const horaInicio = new Date(evento.horaDesde).toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        });
        const horaFin = new Date(evento.horaHasta).toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        });

        return (
          <Col key={evento.id} xs={12} md={6} lg={6}>
            <Card className="evento-card">
              <Card.Body className="d-flex flex-column">
                <Card.Title>{evento.titulo}</Card.Title>
                <Card.Subtitle className="card-subtitle">
                  <Calendar /> {fecha} &nbsp; | &nbsp; <Clock /> {horaInicio} -{' '}
                  {horaFin}
                </Card.Subtitle>
                <Card.Text>{evento.descripcion}</Card.Text>
                <Button className="btn-guardar" size="sm">
                  Guardar
                </Button>
              </Card.Body>
            </Card>
          </Col>
        );
      })}
    </Row>
  );
};

export default ListadoEventos;
