import { useState } from 'react';
import BotonCeleste from '../components/BotonCeleste';
import FormField from '../components/forms/FormField';
import Navbar from '../components/Navbar';
import { useProvinciaCRUD } from '../hooks/useProvinciaCRUD';
import type { Provincia } from '../hooks/useProvinciaCRUD';
import { Modal, Button } from 'react-bootstrap';
import ListadoLocalidadesModal from '../components/ListadoLocalidadesModale.tsx';

function CRUDProvincia() {
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
  } = useProvinciaCRUD();

  // Modal de localidades
  const [showLocalidadesModal, setShowLocalidadesModal] = useState(false);
  const [localidades, setLocalidades] = useState<
    { id?: number; nombre: string }[]
  >([]);
  const [provActual, setProvActual] = useState<Provincia | null>(null);

  const handleShowLocalidades = (prov: Provincia) => {
    setProvActual(prov);
    setLocalidades(prov.localidades || []);
    setShowLocalidadesModal(true);
  };

  return (
    <>
      <Navbar />
      <div
        className="container mt-4"
        style={{ border: 'none', backgroundColor: '#f8f9fa', padding: '1rem' }}
      >
        <h2>CRUD Provincias</h2>
        {error && <p style={{ color: '#555' }}>{error}</p>}

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
                          <BotonCeleste type="button" texto="📌 Localidades" />
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

      <Modal
        show={showLocalidadesModal}
        onHide={() => setShowLocalidadesModal(false)}
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title>Localidades de {provActual?.nombre}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <ListadoLocalidadesModal
            localidades={localidades}
            onAdd={async (loc) => {
              const res = await fetch(`http://localhost:3000/api/localidades`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...loc, provincia: provActual?.id }),
              });
              const data = await res.json();
              setLocalidades([...localidades, data.data]);
            }}
            onUpdate={async (loc) => {
              await fetch(`http://localhost:3000/api/localidades/${loc.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(loc),
              });
              setLocalidades(
                localidades.map((l) => (l.id === loc.id ? loc : l))
              );
            }}
            onDelete={async (id) => {
              if (!id) return;
              await fetch(`http://localhost:3000/api/localidades/${id}`, {
                method: 'DELETE',
              });
              setLocalidades(localidades.filter((l) => l.id !== id));
            }}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setShowLocalidadesModal(false)}
          >
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default CRUDProvincia;
