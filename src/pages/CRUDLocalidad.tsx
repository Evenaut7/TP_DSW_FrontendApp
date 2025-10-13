import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import FormField from '../components/forms/FormField';
import BotonCeleste from '../components/BotonCeleste';

interface Localidad {
  id?: number;
  nombre: string;
  latitud?: number;
  longitud?: number;
  imagen?: string;
  provincia?: { id: number; nombre: string };
}

export default function CRUDLocalidadPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [localidad, setLocalidad] = useState<Localidad | null>(null);
  const [editNombre, setEditNombre] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!id) return;
    const fetchLocalidad = async () => {
      try {
        const res = await fetch(`http://localhost:3000/api/localidades/${id}`, {
          credentials: 'include',
        });
        const data = await res.json();
        setLocalidad(data.data);
        setEditNombre(data.data.nombre);
      } catch (err: any) {
        setError('Error cargando la localidad');
      } finally {
        setLoading(false);
      }
    };
    fetchLocalidad();
  }, [id]);

  const handleUpdate = async () => {
    if (!localidad?.id) return;
    try {
      const res = await fetch(
        `http://localhost:3000/api/localidades/${localidad.id}`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...localidad, nombre: editNombre }),
          credentials: 'include',
        }
      );
      if (!res.ok) throw new Error('Error al actualizar');
      alert('Localidad actualizada correctamente');
      navigate(-1); // vuelve a la página anterior
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleDelete = async () => {
    if (!localidad?.id) return;
    if (!confirm('¿Seguro que querés eliminar esta localidad?')) return;
    try {
      const res = await fetch(
        `http://localhost:3000/api/localidades/${localidad.id}`,
        {
          method: 'DELETE',
          credentials: 'include',
        }
      );
      if (!res.ok) throw new Error('Error al eliminar');
      alert('Localidad eliminada correctamente');
      navigate(-1);
    } catch (err: any) {
      setError(err.message);
    }
  };

  if (loading) return <p>Cargando...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;
  if (!localidad) return <p>No se encontró la localidad</p>;

  return (
    <>
      <Navbar />
      <div className="container mt-4">
        <h2>Editar Localidad: {localidad.nombre}</h2>
        <div className="mb-3">
          <FormField
            name="nombre"
            label="Nombre"
            value={editNombre}
            onChange={(e) => setEditNombre(e.target.value)}
            required
          />
        </div>

        <div className="d-flex gap-2">
          <div onClick={handleUpdate}>
            <BotonCeleste type="button" texto="Guardar Cambios" />
          </div>
          <div onClick={handleDelete}>
            <BotonCeleste type="button" texto="Eliminar Localidad" />
          </div>
          <div onClick={() => navigate(-1)}>
            <BotonCeleste type="button" texto="Volver" />
          </div>
        </div>
      </div>
    </>
  );
}
