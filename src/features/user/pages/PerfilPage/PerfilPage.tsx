import { useState, useEffect } from 'react';
import type { FormEvent } from 'react';
import { useUser } from '@/features/user';
import { useProvinciasLocalidades } from '@/features/localidades';
import { updateUser } from '@/utils/session';
import Navbar from '@/components/layout/Navbar/Navbar';
import ConfirmModal from '@/components/modals/ConfirmModal/ConfirmModal';
import ResultModal from '@/components/modals/ResultModal/ResultModal';
import RedirectModal from '@/components/modals/RedirectModal/RedirectModal';
import InputLabel from '@/components/ui/Input/InputLabel';
import './PerfilPage.css';

function PerfilPage() {
    const { user, refreshUser } = useUser();
    const { provincias, getLocalidadesByProvincia, loading: loadingUbicaciones } = useProvinciasLocalidades();
    
    const [nombre, setNombre] = useState('');
    const [gmail, setGmail] = useState('');
    const [cuit, setCuit] = useState('');
    const [provinciaId, setProvinciaId] = useState<number>(0);
    const [localidadId, setLocalidadId] = useState<number>(0);
    
    const [showConfirm, setShowConfirm] = useState(false);
    const [showResult, setShowResult] = useState(false);
    const [resultSuccess, setResultSuccess] = useState(false);
    const [resultMessage, setResultMessage] = useState('');
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (user && !loadingUbicaciones) {
            setNombre(user.nombre || '');
            setGmail(user.gmail || '');
            setCuit(user.cuit || '');
            
            if (user.localidad) {
                const localidadDelUsuario = user.localidad.id;
                const provinciaDelUsuario = user.localidad.provincia.id;
                setLocalidadId(localidadDelUsuario);
                setProvinciaId(provinciaDelUsuario);
            } else {
                setProvinciaId(0);
                setLocalidadId(0);
            }
        }
    }, [user, loadingUbicaciones]);

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
            localidad: localidadId === 0 ? undefined : localidadId,
        });

        setSaving(false);

        if (result.success) {
            setResultSuccess(true);
            setResultMessage('Perfil actualizado correctamente');
            await refreshUser(); 
        } else {
            setResultSuccess(false);
            setResultMessage(result.error || 'Error al actualizar perfil');
        }

        setShowResult(true);
    };

    const handleProvinciaChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newProvinciaId = parseInt(e.target.value) || 0;
        setProvinciaId(newProvinciaId);
        setLocalidadId(0); 
    };

    const handleLocalidadChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newLocalidadId = parseInt(e.target.value) || 0;
        setLocalidadId(newLocalidadId);
    };

    if (!user) {
        return (
            <>
                <div className="background">
                    <Navbar />
                    <RedirectModal show={true} />
                </div>
            </>
        );
    }

    return (
        <>
        <div className="background">
            <Navbar />
            <div className="perfil-container">
                <div className="perfil-card">
                    <h2 className="perfil-title">Editar Perfil</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label htmlFor="input-nombre">Nombre</label>
                            <InputLabel
                                label="Nombre"
                                type="text"
                                value={nombre}
                                onChange={(e) => setNombre(e.target.value)}
                                required
                            />
                        </div>
                        
                        <div className="form-group">
                            <label htmlFor="input-email">Email</label>
                            <InputLabel
                                label="Email"
                                type="email"
                                value={gmail}
                                onChange={(e) => setGmail(e.target.value)}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="input-cuit">CUIT</label>
                            <InputLabel
                                label="CUIT"
                                type="text"
                                value={cuit}
                                onChange={(e) => setCuit(e.target.value)}
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="provincia">Provincia</label>
                            <select
                                id="provincia"
                                className="form-select"
                                value={provinciaId}
                                onChange={handleProvinciaChange}
                                disabled={loadingUbicaciones}
                            >
                                <option value={0}>Seleccionar provincia</option>
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
                                value={localidadId}
                                onChange={handleLocalidadChange}
                                disabled={provinciaId === 0 || loadingUbicaciones}
                            >
                                <option value={0}>Seleccionar localidad</option>
                                {getLocalidadesByProvincia(provinciaId === 0 ? undefined : provinciaId).map((loc) => (
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
        </div>
        </>
    );
}

export default PerfilPage;
