import { Link } from 'react-router-dom';
import Navbar from '@/components/layout/Navbar/Navbar';
import './';
import workingOnItImage from '@/assets/';

const WorkingOnItPage = () => {
    return (
        <>
            <div className="working-on-it-background">
                <Navbar />
                <div className="working-on-it-container">
                    <div className="working-on-it-content">
                        <img 
                            src={workingOnItImage} 
                            alt="Trabajando en ello" 
                            className="working-on-it-image"
                        />
                        <h1 className="working-on-it-title">
                            ¡Estamos trabajando en esto!
                        </h1>
                        <p className="working-on-it-message">
                            Esta sección está en construcción. Pronto estará disponible con nuevas funcionalidades.
                        </p>
                        <Link to="/">
                            <button className="btn btn-primary working-on-it-button">
                                Volver al Inicio
                            </button>
                        </Link>
                    </div>
                </div>
            </div>
        </>
    );
};

export default WorkingOnItPage;
