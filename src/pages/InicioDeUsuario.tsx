import Boton from "../components/Boton.tsx";
import InputLabel from "../components/InputLabel.tsx";



function InicioDeUsuario(){
    return (
        <div>
            <Boton texto="Iniciar Sesión" />
            <h1>TRAVEL APP</h1>
            <div className="mb-3">
                <InputLabel label="Email" />
                <Boton texto="Registrarme" />
            </div>
            
        </div>
    );
}

export default InicioDeUsuario;