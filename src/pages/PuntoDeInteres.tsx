import ListadoDeTags from '../components/ListadoDeTags.tsx';
import Navbar from '../components/Navbar';
import PDI from '../components/PDI';
import { CalendarEvent } from 'react-bootstrap-icons';

const PuntoDeInteres = () => {
  return (
    <main className="punto-de-interes">
      <Navbar />
      <PDI />
      <h3 className="eventos-titulo">
        <CalendarEvent size={24} />
        Eventos más próximos
      </h3>
    </main>
  );
};

export default PuntoDeInteres;
