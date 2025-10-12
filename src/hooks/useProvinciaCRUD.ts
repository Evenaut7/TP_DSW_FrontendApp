// src/hooks/useProvinciaCRUD.ts
import { useState, useEffect } from 'react';

export type Provincia = {
  id?: number;
  nombre: string;
  localidades?: { id?: number; nombre: string }[];
};

export function useProvinciaCRUD() {
  const [provincias, setProvincias] = useState<Provincia[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editNombre, setEditNombre] = useState('');
  const [addingNew, setAddingNew] = useState(false);
  const [nuevoNombre, setNuevoNombre] = useState('');
  const [error, setError] = useState<string | null>(null);

  const fetchProvincias = async () => {
    try {
      const res = await fetch('http://localhost:3000/api/provincias', {
        credentials: 'include',
      });
      const data = await res.json();
      setProvincias(data.data || []);
    } catch (err) {
      console.error(err);
      setError('Error al cargar provincias');
    }
  };

  useEffect(() => {
    fetchProvincias();
  }, []);

  // Editar
  const handleEdit = (prov: Provincia) => {
    setEditingId(prov.id!);
    setEditNombre(prov.nombre);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditNombre('');
  };

  const handleUpdate = async (id: number) => {
    if (!editNombre.trim()) {
      setError('El nombre no puede estar vacío');
      return;
    }
    try {
      const res = await fetch(`http://localhost:3000/api/provincias/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre: editNombre }),
        credentials: 'include',
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data?.message || `Error ${res.status}`);
        return;
      }
      setEditingId(null);
      setEditNombre('');
      setError(null);
      fetchProvincias();
    } catch (err) {
      console.error(err);
      setError('Error al actualizar provincia');
    }
  };

  // Eliminar
  const handleDelete = async (id?: number) => {
    if (!id) return;
    try {
      const res = await fetch(`http://localhost:3000/api/provincias/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      if (!res.ok) {
        const data = await res.json();
        setError(
          data?.message || 'No se pudo eliminar. Revisa si tiene localidades.'
        );
        return;
      }
      fetchProvincias();
    } catch (err) {
      console.error(err);
      setError('Error al eliminar provincia');
    }
  };

  // Agregar nueva
  const handleCreate = async () => {
    if (!nuevoNombre.trim()) {
      setError('El nombre no puede estar vacío');
      return;
    }
    try {
      const res = await fetch('http://localhost:3000/api/provincias', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre: nuevoNombre }),
        credentials: 'include',
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data?.message || `Error ${res.status}`);
        return;
      }
      setNuevoNombre('');
      setAddingNew(false);
      setError(null);
      fetchProvincias();
    } catch (err) {
      console.error(err);
      setError('Error al agregar provincia');
    }
  };

  return {
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
  };
}
