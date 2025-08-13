import BotonCel from "../components/BotonCeleste.tsx";
import InputLabel from "../components/InputLabel.tsx";
import BotonRojo from "../components/BotonRojo.tsx";
import { Link } from "react-router-dom";
import '../styles/SignUpPage.css'



function SignUpPage(){
    return (
        <div className="signup-container">
            <header className="header-login">
                <Link to="/home">
                    <BotonRojo texto="Home Page" />
                </Link>
                <Link to="/login">
                    <BotonCel texto="Log in" />
                </Link>
            </header>

            <div className="signup-content">
                <h1 className="title">TRAVEL APP</h1>
                <div className="signup-form">
                    <InputLabel label="Email" />
                    <BotonCel texto="Sign" />
                </div>
            </div>
        </div>
    );
}

export default SignUpPage;