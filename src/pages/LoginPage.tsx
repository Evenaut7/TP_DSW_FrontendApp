import { useState, type FormEvent } from "react";
import Boton from "../components/BotonCeleste.tsx";
import InputLabel from "../components/InputLabel.tsx";
import '../styles/LogInPage.css';
import { Link, useNavigate } from "react-router-dom";
import BotonCeleste from "../components/BotonCeleste.tsx";

function LoginPage(){
    const [gmail, setGmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

    try {
        const res = await fetch('http://localhost:3000/api/usuarios/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            // si tu backend usa cookies para la sesión, añade: credentials: 'include'
            body: JSON.stringify({ gmail, password })
        });

        if (!res.ok) {
            const data = await res.json().catch(() => null);
            throw new Error(data?.message ?? `Error ${res.status}`);
        }

        const data = await res.json();
        // ejemplo: guardar token JWT en localStorage (o usar cookies según tu backend)
        if (data.token) {
            localStorage.setItem('token', data.token);
        }
        // redirigir a home u otra ruta protegida
        navigate('/');
        } catch (err: unknown) {
        if (err instanceof Error) setError(err.message);
        else setError('Error desconocido');
        } finally {
        setLoading(false);
        }
    };
    return (
        <div className="login-container">
            <header className="header-signup">
                <Link to="/signup">
                    <Boton texto="Registrarme" />
                </Link>
            </header>

            <form className="login-content" onSubmit={handleSubmit}>
                <h1 className="title">TRAVEL APP</h1>
                <div className="mb-3">
                    <InputLabel label="Gmail" type="email"
                        value={gmail}
                        onChange={(e) => setGmail(e.target.value)}
                        required />
                    <InputLabel label="Contraseña" type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required />
                    <BotonCeleste texto="Continuar" type="submit" disabled={loading}>
                        {loading ? 'Cargando...' : 'Continuar'}
                    </BotonCeleste>
                    {error && <p style={{ color: 'red' }}>{error}</p>}
                </div>
            </form>
        </div>
);
}

export default LoginPage;