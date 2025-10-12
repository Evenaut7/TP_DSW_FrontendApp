import { useState } from 'react';
import BotonCeleste from './BotonCeleste';
import '../styles/ListadoLocalidades.css';

interface Localidad {
  id?: number;
  nombre: string;
  codUta?: string;
  latitud?: number;
  longitud?: number;
  imagen?: string;
  provincia?: string;
}

interface ListadoLocalidadesModalProps {
  localidades: Localidad[];
  onAdd: (loc: Localidad) => void;
  onUpdate: (loc: Localidad) => void;
  onDelete: (id?: number) => void;
}

const ListadoLocalidadesModal = ({
  localidades,
  onAdd,
  onUpdate,
  onDelete,
}: ListadoLocalidadesModalProps) => {
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editNombre, setEditNombre] = useState<string>('');
  const [newNombre, setNewNombre] = useState<string>('');

  return (
    <div className="contenedor-localidades">
      {localidades.map((loc) => (
        <div key={loc.id} className="col">
          <div className="localidadCard card h-100 position-relative">
            {editingId === loc.id ? (
              <div className="d-flex flex-column align-items-center p-2">
                <input
                  type="text"
                  value={editNombre}
                  onChange={(e) => setEditNombre(e.target.value)}
                  className="mb-2 form-control"
                />
                <div className="d-flex gap-1">
                  <div
                    onClick={() => {
                      onUpdate({ ...loc, nombre: editNombre });
                      setEditingId(null);
                    }}
                    style={{ cursor: 'pointer' }}
                  >
                    <BotonCeleste type="button" texto="💾" />
                  </div>
                  <div
                    onClick={() => setEditingId(null)}
                    style={{ cursor: 'pointer' }}
                  >
                    <BotonCeleste type="button" texto="❌" />
                  </div>
                </div>
              </div>
            ) : (
              <>
                {loc.imagen && (
                  <img
                    src={`http://localhost:3000/public/${loc.imagen}`}
                    className="card-img"
                    alt={loc.nombre}
                  />
                )}
                <h5 className="cardTitle">{loc.nombre}</h5>
                <div
                  className="d-flex justify-content-end gap-1 position-absolute"
                  style={{ top: 5, right: 5 }}
                >
                  <div
                    onClick={() => {
                      setEditingId(loc.id!);
                      setEditNombre(loc.nombre);
                    }}
                    style={{ cursor: 'pointer' }}
                  >
                    <BotonCeleste type="button" texto="✏️" />
                  </div>
                  <div
                    onClick={() => onDelete(loc.id)}
                    style={{ cursor: 'pointer' }}
                  >
                    <BotonCeleste type="button" texto="🗑️" />
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      ))}

      {/* Tarjeta para agregar nueva localidad */}
      <div className="col">
        <div
          className="localidadCard card h-100 d-flex align-items-center justify-content-center"
          style={{ cursor: 'pointer' }}
        >
          {newNombre ? (
            <div className="d-flex flex-column align-items-center p-2">
              <input
                type="text"
                value={newNombre}
                onChange={(e) => setNewNombre(e.target.value)}
                placeholder="Nombre localidad"
                className="mb-2 form-control"
              />
              <div className="d-flex gap-1">
                <div
                  onClick={() => {
                    onAdd({ nombre: newNombre });
                    setNewNombre('');
                  }}
                  style={{ cursor: 'pointer' }}
                >
                  <BotonCeleste type="button" texto="💾" />
                </div>
                <div
                  onClick={() => setNewNombre('')}
                  style={{ cursor: 'pointer' }}
                >
                  <BotonCeleste type="button" texto="❌" />
                </div>
              </div>
            </div>
          ) : (
            <h1 onClick={() => setNewNombre('')}>+</h1>
          )}
        </div>
      </div>
    </div>
  );
};

export default ListadoLocalidadesModal;
