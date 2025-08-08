import Navbar from '../components/Navbar.tsx';
import ListadoLocalidades from '../components/ListadoLocalidades.tsx';
import PDI from '../components/PDI_Info.tsx';

const PuntoDeInteres = () => {
  return (
    <div>
      <Navbar />
      <PDI id={3} />
    </div>
  );
};

export default PuntoDeInteres;
