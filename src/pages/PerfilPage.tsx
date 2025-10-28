import { useState, useEffect } from 'react';
import type { FormEvent } from 'react';
import { useUser } from '../hooks/useUser';
import { useProvinciasLocalidades } from '../hooks/useProvinciasLocalidades';
import { updateUser } from '../utils/session';
import Navbar from '../components/Navbar';
import ConfirmModal from '../components/ConfirmModal';
import ResultModal from '../components/ResultModal';
import InputLabel from '../components/InputLabel';
import '../styles/PerfilPage.css';

function PerfilPage() {
    const { user, refreshUser } = useUser();
    const { provincias, getLocalidadesByProvincia, loading: loadingUbicaciones } = useProvinciasLocalidades();
    
    const [nombre, setNombre] = useState('');
    const [gmail, setGmail] = useState('');
    const [cuit, setCuit] = useState('');
    const [provinciaId, setProvinciaId] = useState<number | undefined>(undefined);
    const [localidadId, setLocalidadId] = useState<number | undefined>(undefined);
    
    const [showConfirm, setShowConfirm] = useState(false);
    const [showResult, setShowResult] = useState(false);
    const [resultSuccess, setResultSuccess] = useState(false);
    const [resultMessage, setResultMessage] = useState('');
    const [saving, setSaving] = useState(false);

    // Cargar datos del usuario al montar
    useEffect(() => {
        if (user) {
            setNombre(user.nombre || '');
            setGmail(user.gmail || '');
            setCuit(user.cuit || '');
            setProvinciaId(user.provincia);
            setLocalidadId(user.localidad);
        }
    }, [user]);

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        setShowConfirm(true);
    };

    const handleConfirmSave = async () => {
        setShowConfirm(false);
        setSaving(true);

        if (!user?.id) {
            setResultSuccess(false);
            setResultMessage('No se pudo identificar el usuario');
            setShowResult(true);
            setSaving(false);
            return;
        }

        const result = await updateUser(user.id, {
            nombre,
            gmail,
            cuit,
            provincia: provinciaId,
            localidad: localidadId,
        });

        setSaving(false);

        if (result.success) {
            setResultSuccess(true);
            setResultMessage('Perfil actualizado correctamente');
            await refreshUser(); // Actualizar contexto
        } else {
            setResultSuccess(false);
            setResultMessage(result.error || 'Error al actualizar perfil');
        }

        setShowResult(true);
    };

    const handleProvinciaChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newProvinciaId = parseInt(e.target.value);
        setProvinciaId(newProvinciaId);
        setLocalidadId(undefined); // Reset localidad cuando cambia provincia
    };

    if (!user) {
        return (
            <>
                <Navbar />
                <div className="perfil-container">
                    <p className="text-center">Debes iniciar sesión para ver tu perfil</p>
                </div>
            </>
        );
    }

    return (
        <>
            <Navbar />
            <div className="perfil-container">
                <div className="perfil-card">
                    <h2 className="perfil-title">Editar Perfil</h2>
                    <form onSubmit={handleSubmit}>
                        <InputLabel
                            label="Nombre"
                            type="text"
                            value={nombre}
                            onChange={(e) => setNombre(e.target.value)}
                            required
                        />
                        
                        <InputLabel
                            label="Email"
                            type="email"
                            value={gmail}
                            onChange={(e) => setGmail(e.target.value)}
                            required
                        />

                        <InputLabel
                            label="CUIT"
                            type="text"
                            value={cuit}
                            onChange={(e) => setCuit(e.target.value)}
                        />

                        <div className="form-group">
                            <label htmlFor="provincia">Provincia</label>
                            <select
                                id="provincia"
                                className="form-select"
                                value={provinciaId || ''}
                                onChange={handleProvinciaChange}
                                disabled={loadingUbicaciones}
                            >
                                <option value="">Seleccionar provincia</option>
                                {provincias.map((prov) => (
                                    <option key={prov.id} value={prov.id}>
                                        {prov.nombre}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="form-group">
                            <label htmlFor="localidad">Localidad</label>
                            <select
                                id="localidad"
                                className="form-select"
                                value={localidadId || ''}
                                onChange={(e) => setLocalidadId(parseInt(e.target.value))}
                                disabled={!provinciaId || loadingUbicaciones}
                            >
                                <option value="">Seleccionar localidad</option>
                                {getLocalidadesByProvincia(provinciaId).map((loc) => (
                                    <option key={loc.id} value={loc.id}>
                                        {loc.nombre}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="perfil-actions">
                            <button type="submit" className="btn-guardar" disabled={saving}>
                                {saving ? 'Guardando...' : 'Guardar cambios'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            <ConfirmModal
                show={showConfirm}
                onConfirm={handleConfirmSave}
                onCancel={() => setShowConfirm(false)}
            />

            <ResultModal
                show={showResult}
                success={resultSuccess}
                message={resultMessage}
                onClose={() => setShowResult(false)}
            />
        </>
    );
}

export default PerfilPage;
