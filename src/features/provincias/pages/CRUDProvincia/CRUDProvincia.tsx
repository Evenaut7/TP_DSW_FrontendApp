import { useState, useEffect } from 'react';
import BotonCeleste from '../components/BotonCeleste';
import FormField from '../components/forms/FormField';
import Navbar from '@/components/layout/Navbar/Navbar';
import { useProvinciaCRUD } from '../hooks/useProvinciaCRUD';
import type { Provincia } from '../hooks/useProvinciaCRUD';
import { Modal } from 'react-bootstrap';
import ListadoLocalidadesModal from '../components/ListadoLocalidadesModale.tsx';
import { useAuthAdmin } from '../hooks/useAuthAdmin';
import RedirectModal from '../components/RedirectModal';
import { useUser } from '../hooks/useUser';

function CRUDProvincia() {
  const { isAdmin, loading } = useAuthAdmin();
  const { user } = useUser();
  const [showRedirect, setShowRedirect] = useState(false);
  const provinciasHook = useProvinciaCRUD();

  const {
    provincias,
    editingId,
    editNombre,
    addingNew,
    nuevoNombre,
    error,
    setEditNombre,
    setAddingNew,
    setNuevoNombre,
    handleEdit,
    handleCancelEdit,
    handleUpdate,
    handleDelete,
    handleCreate,
  } = provinciasHook;

  const [showLocalidadesModal, setShowLocalidadesModal] = useState(false);
  const [provActual, setProvActual] = useState<Provincia | null>(null);

  const handleShowLocalidades = (prov: Provincia) => {
    setProvActual(prov);
    setShowLocalidadesModal(true);
  };

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
        <h2>CRUD Provincias</h2>
        {error && (
          <div style={{ color: 'red', marginBottom: '1rem' }}>{error}</div>
        )}

        <table className="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th className="text-end">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {provincias.map((prov, index) => (
              <tr
                key={prov.id}
                style={{
                  backgroundColor: index % 2 === 0 ? '#ffffff' : '#f0f0f0',
                }}
              >
                <td style={{ width: '50px' }}>{prov.id}</td>
                <td style={{ width: '300px' }}>
                  {editingId === prov.id ? (
                    <FormField
                      name={`nombre-${prov.id}`}
                      label=""
                      value={editNombre}
                      onChange={(e) => setEditNombre(e.target.value)}
                      required
                    />
                  ) : (
                    prov.nombre
                  )}
                </td>
                <td className="text-end">
                  <div className="d-flex justify-content-end gap-2 align-items-center">
                    {editingId === prov.id ? (
                      <>
                        <div onClick={() => handleUpdate(prov.id!)}>
                          <BotonCeleste type="button" texto="Guardar" />
                        </div>
                        <div onClick={handleCancelEdit}>
                          <BotonCeleste type="button" texto="Cancelar" />
                        </div>
                      </>
                    ) : (
                      <>
                        <div onClick={() => handleEdit(prov)}>
                          <BotonCeleste type="button" texto="✏️" />
                        </div>
                        <div onClick={() => handleDelete(prov.id)}>
                          <BotonCeleste type="button" texto="🗑️" />
                        </div>
                        <div onClick={() => handleShowLocalidades(prov)}>
                          <BotonCeleste
                            type="button"
                            texto={'📌'}
                            children={
                              <span className="d-none d-md-inline ms-1">
                                Localidades
                              </span>
                            }
                          />
                        </div>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}

            {/* Fila para agregar nueva */}
            <tr>
              <td colSpan={3}>
                {!addingNew ? (
                  <div onClick={() => setAddingNew(true)}>
                    <BotonCeleste type="button" texto="+" />
                  </div>
                ) : (
                  <div className="d-flex gap-2 align-items-center">
                    <FormField
                      name="nuevo-nombre"
                      label=""
                      value={nuevoNombre}
                      onChange={(e) => setNuevoNombre(e.target.value)}
                      required
                    />
                    <div onClick={handleCreate}>
                      <BotonCeleste type="button" texto="Agregar" />
                    </div>
                    <div
                      onClick={() => {
                        setAddingNew(false);
                        setNuevoNombre('');
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

      <Modal.Body>
        <ListadoLocalidadesModal
          show={showLocalidadesModal}
          onHide={() => setShowLocalidadesModal(false)}
          provinciaId={provActual?.id ?? 0}
        />
      </Modal.Body>
    </>
  );
}

export default CRUDProvincia;
