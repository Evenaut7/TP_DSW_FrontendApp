import { Link } from 'react-router-dom';
import Navbar from '@/components/layout/Navbar/Navbar';
import './';
import notFoundImage from '@/assets/';

const NotFoundPage = () => {
    return (
        <>
            <div className="not-found-background">
                <Navbar />
                <div className="not-found-container">
                    <div className="not-found-content">
                        <img 
                            src={notFoundImage} 
                            alt="Página no encontrada" 
                            className="not-found-image"
                        />
                        <h1 className="not-found-title">
                            Error 404
                        </h1>
                        <p className="not-found-message">
                            ¡Ups! La página que buscas no existe o ha sido movida.
                        </p>
                        <Link to="/">
                            <button className="btn btn-primary not-found-button">
                                Volver al Inicio
                            </button>
                        </Link>
                    </div>
                </div>
            </div>
        </>
    );
};

export default NotFoundPage;
