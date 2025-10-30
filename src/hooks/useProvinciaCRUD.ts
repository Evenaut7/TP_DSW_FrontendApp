import { useState, useEffect } from 'react';
import type { Provincia } from '../types';
import * as api from '../utils/api';

export type { Provincia };

export function useProvinciaCRUD() {
  const [provincias, setProvincias] = useState<Provincia[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editNombre, setEditNombre] = useState('');
  const [addingNew, setAddingNew] = useState(false);
  const [nuevoNombre, setNuevoNombre] = useState('');
  const [error, setError] = useState<string | null>(null);

  const fetchProvincias = async () => {
    const response = await api.getProvincias();
    if (response.success && response.data) {
      setProvincias(response.data as Provincia[]);
    } else {
      setError(response.error || 'Error al cargar provincias');
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
    setError(null);
  };

  const handleUpdate = async (id: number) => {
    if (!editNombre.trim()) {
      setError('El nombre no puede estar vacío');
      return;
    }
    
    const response = await api.updateProvincia(id, { nombre: editNombre });
    if (response.success) {
      setEditingId(null);
      setEditNombre('');
      setError(null);
      fetchProvincias();
    } else {
      setError(response.error || 'Error al actualizar provincia');
    }
  };

  // Eliminar
  const handleDelete = async (id?: number) => {
    if (!id) return;
    if (!window.confirm('¿Estás seguro que querés eliminar esta provincia?'))
      return;

    const response = await api.deleteProvincia(id);
    if (response.success) {
      setError(null);
      fetchProvincias();
    } else {
      setError(response.error || 'No se pudo eliminar. Revisa dependencias.');
    }
  };

  // Agregar nueva
  const handleCreate = async () => {
    if (!nuevoNombre.trim()) {
      setError('El nombre no puede estar vacío');
      return;
    }

    const response = await api.createProvincia({ nombre: nuevoNombre });
    if (response.success) {
      setNuevoNombre('');
      setAddingNew(false);
      setError(null);
      fetchProvincias();
    } else {
      setError(response.error || 'Error al agregar provincia');
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
