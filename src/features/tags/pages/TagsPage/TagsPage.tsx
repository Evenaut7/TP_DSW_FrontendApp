import Navbar from '@/components/layout/Navbar/Navbar';
import BotonCeleste from '@/components/ui/Button/BotonCeleste';
import { useTagCRUD, type TipoTag } from '@/features/tags';
import { useAuthAdmin } from '@/features/auth';
import RedirectModal from '@/components/modals/RedirectModal/RedirectModal';
import { useUser } from '@/features/user';
import { useState, useEffect } from 'react';

function TagsPage() {
    const { isAdmin, loading } = useAuthAdmin();
    const { user } = useUser();
    const [showRedirect, setShowRedirect] = useState(false);
    const {
        tags,
        editingId,
        editNombre,
        editTipo,
        addingNew,
        nuevoNombre,
        nuevoTipo,
        error,
        setEditNombre,
        setEditTipo,
        setAddingNew,
        setNuevoNombre,
        setNuevoTipo,
        handleEdit,
        handleCancelEdit,
        handleUpdate,
        handleDelete,
        handleCreate,
    } = useTagCRUD();

    const tiposDisponibles: TipoTag[] = ['Evento', 'Punto de Interés', 'Actividad'];

    // Detectar cuando el usuario cierra sesión o deja de ser admin
    useEffect(() => {
        if (!loading && (!user || isAdmin === false)) {
            setShowRedirect(true);
        }
    }, [user, isAdmin, loading]);

    if (loading) return <p>Cargando...</p>;

    if (!user || isAdmin === false || showRedirect) {
        return (
            <>
                <Navbar />
                <RedirectModal show={true} />
            </>
        );
    }
    return (
        <>
        <Navbar />
        <div
            className="container mt-4"
            style={{ border: 'none', backgroundColor: '#f8f9fa', padding: '1rem' }}
        >
            <h2>Gestión de Tags</h2>
            {error && (
            <div style={{ color: 'red', marginBottom: '1rem' }}>{error}</div>
            )}

            <table className="table">
            <thead>
                <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Tipo</th>
                <th className="text-end">Acciones</th>
                </tr>
            </thead>
            <tbody>
                {tags.map((tag, index) => (
                <tr
                    key={tag.id}
                    style={{
                    backgroundColor: index % 2 === 0 ? '#ffffff' : '#f0f0f0',
                    }}
                >
                    <td style={{ width: '50px' }}>{tag.id}</td>
                    <td style={{ width: '250px' }}>
                    {editingId === tag.id ? (
                        <input
                        type="text"
                        className="form-control"
                        value={editNombre}
                        onChange={(e) => setEditNombre(e.target.value)}
                        required
                        />
                    ) : (
                        tag.nombre
                    )}
                    </td>
                    <td style={{ width: '200px' }}>
                    {editingId === tag.id ? (
                        <select
                        className="form-select"
                        value={editTipo}
                        onChange={(e) => setEditTipo(e.target.value as TipoTag)}
                        required
                        >
                        {tiposDisponibles.map((tipo) => (
                            <option key={tipo} value={tipo}>
                            {tipo}
                            </option>
                        ))}
                        </select>
                    ) : (
                        tag.tipo
                    )}
                    </td>
                    <td className="text-end">
                    <div className="d-flex justify-content-end gap-2 align-items-center">
                        {editingId === tag.id ? (
                        <>
                            <div onClick={() => handleUpdate(tag.id!)}>
                            <BotonCeleste type="button" texto="Guardar" />
                            </div>
                            <div onClick={handleCancelEdit}>
                            <BotonCeleste type="button" texto="Cancelar" />
                            </div>
                        </>
                        ) : (
                        <>
                            <div onClick={() => handleEdit(tag)}>
                            <BotonCeleste type="button" texto="✏️" />
                            </div>
                            <div onClick={() => handleDelete(tag.id, tag.nombre)}>
                            <BotonCeleste type="button" texto="🗑️" />
                            </div>
                        </>
                        )}
                    </div>
                    </td>
                </tr>
                ))}

                {/* Fila para agregar nueva */}
                <tr>
                <td colSpan={4}>
                    {!addingNew ? (
                    <div onClick={() => setAddingNew(true)}>
                        <BotonCeleste type="button" texto="+ Agregar Tag" />
                    </div>
                    ) : (
                    <div className="d-flex gap-2 align-items-center">
                        <input
                        type="text"
                        className="form-control"
                        placeholder="Nombre del tag"
                        value={nuevoNombre}
                        onChange={(e) => setNuevoNombre(e.target.value)}
                        required
                        style={{ maxWidth: '250px' }}
                        />
                        <select
                        className="form-select"
                        style={{ width: '200px' }}
                        value={nuevoTipo}
                        onChange={(e) => setNuevoTipo(e.target.value as TipoTag)}
                        required
                        >
                        {tiposDisponibles.map((tipo) => (
                            <option key={tipo} value={tipo}>
                            {tipo}
                            </option>
                        ))}
                        </select>
                        <div onClick={handleCreate}>
                        <BotonCeleste type="button" texto="Agregar" />
                        </div>
                        <div
                        onClick={() => {
                            setAddingNew(false);
                            setNuevoNombre('');
                            setNuevoTipo('Evento');
                        }}
                        >
                        <BotonCeleste type="button" texto="Cancelar" />
                        </div>
                    </div>
                    )}
                </td>
                </tr>
            </tbody>
            </table>
        </div>
        </>
    );
    }

export default TagsPage;
