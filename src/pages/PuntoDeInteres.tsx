import Navbar from '../components/Navbar';
import PDI from '../components/PDI';
import ListadoEventos from '../components/ListadoEventos';
import { CalendarEvent } from 'react-bootstrap-icons';
import { useParams } from 'react-router-dom';

const PuntoDeInteres = () => {
  const { id } = useParams<{ id: string }>();
  const pdiId = id ? parseInt(id, 10) : null;

  return (
    <main className="punto-de-interes">
      <Navbar />
      <PDI />
      <h3 className="eventos-titulo">
        <CalendarEvent size={24} />
        Eventos más próximos
      </h3>
      {pdiId && <ListadoEventos pdiId={pdiId} />}{' '}
      {/* Forma alternativa para renderizar,diferente a la usada en ListadoPDI. Si quieren la podemos cambiar */}
    </main>
  );
};

export default PuntoDeInteres;
