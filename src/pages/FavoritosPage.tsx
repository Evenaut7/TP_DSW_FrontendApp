import { useUser } from '../hooks/useUser';
import Navbar from '../components/Navbar';
import RedirectModal from '../components/RedirectModal';
import ListadoPDI from '../components/ListadoPDI';
import type { PDI } from '../utils/session';
import '../styles/FavoritosPage.css';

function FavoritosPage() {
    const { user } = useUser();

    // Obtener favoritos directamente del usuario (ya son objetos PDI completos)
    const favoritosPDIs: PDI[] = user?.favoritos || [];

    // Si no hay usuario, mostrar modal de redirección
    if (!user) {
        return (
            <>
                <div className="favoritos-background">
                    <Navbar />
                    <RedirectModal show={true} />
                </div>
            </>
        );
    }

    // Si no hay favoritos, mostrar modal personalizado
    if (favoritosPDIs.length === 0) {
        return (
            <>
                <div className="favoritos-background">
                    <Navbar />
                    <RedirectModal
                        show={true}
                        title="Sin Favoritos"
                        message="Todavía no tienes ningún punto de interés favorito!"
                        buttonText="Explorar localidades"
                        redirectTo="/"
                    />
                </div>
            </>
        );
    }

    return (
        <>
            <div className="favoritos-background">
                <Navbar />
                <div className="favoritos-container">
                    <h2 className="favoritos-title">Favoritos</h2>
                    <div className="favoritos-grid">
                        <ListadoPDI pdis={favoritosPDIs} />
                    </div>
                </div>
            </div>
        </>
    );
}

export default FavoritosPage;
