import "../styles/HomePage.css"
import 'bootstrap/dist/css/bootstrap.min.css'
import Navbar from "../components/Navbar.tsx";
import ListadoLocalidades from "../components/ListadoLocalidades.tsx"


const HomePage = () => {
  return (
    <>
      <Navbar/>
        <div className='homeTopDiv' >
          <div className='homeTitleDiv'>
            <h1 className="homeTitle text-center">¿Adónde Quisieras Ir?</h1> 
          </div>
          <div className="input-group w-75 pb-5 pt-5">
            <input type="text" className="form-control rounded-5 border border-2" placeholder="Busca Una Localidad" aria-label="Recipient’s username" aria-describedby="button-addon2"/>
          </div> 
        </div>
        <div className='homeBottomDiv'>
          <ListadoLocalidades/>
        </div>
    </>    
  );
}

export default HomePage