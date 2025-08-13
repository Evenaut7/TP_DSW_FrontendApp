import Boton from "../components/BotonCeleste.tsx";
import InputLabel from "../components/InputLabel.tsx";
import '../styles/LogInPage.css';
import { Link } from "react-router-dom";

function LoginPage(){
    return (
        <div className="login-container">
            <header className="header-signup">
                <Link to="/">
                    <Boton texto="Registrarme" />
                </Link>
            </header>
            <div className="login-content">
                <h1 className="title">TRAVEL APP</h1>
                <div className="mb-3">
                    <InputLabel label="Email" />
                    <InputLabel label="Contraseña" />
                    <Boton texto="Continuar" />
                </div>
            </div>
        </div>
)}

export default LoginPage;