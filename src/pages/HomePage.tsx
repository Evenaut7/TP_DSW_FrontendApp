import '../styles/HomePage.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import NavbarHomePage from '../components/NavbarHomePage.tsx';
import ListadoLocalidades from '../components/ListadoLocalidades.tsx';

const HomePage = () => {
  return (
    <>
      <div className="homeTopDiv">
      <NavbarHomePage />
        <div className="homeTitleDiv">
          <h1 className="homeTitle text-center">¿Adónde Quisieras Ir?</h1>
        </div>
        <div className="searchBoxHomeDiv">
          <input
            type="text"
            className="searchBoxHome"
            placeholder="Busca Una Localidad"
          />
        </div>
      </div>
        <ListadoLocalidades />
    </>
  );
};

export default HomePage;
