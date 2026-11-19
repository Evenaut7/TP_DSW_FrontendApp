import { useState, useEffect } from 'react';
import type { Provincia } from '@/types';
import * as api from '@/utils/api';
import { translateApiError } from '@/utils/errors';
import { showValidationError } from '@/utils/notifications';
import { useConfirm } from '@/context/useConfirm';

export type { Provincia };

export function useProvinciaCRUD() {
  const confirm = useConfirm();
  const [provincias, setProvincias] = useState<Provincia[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editNombre, setEditNombre] = useState('');
  const [addingNew, setAddingNew] = useState(false);
  const [nuevoNombre, setNuevoNombre] = useState('');

  const fetchProvincias = async () => {
    const response = await api.getProvincias();
    if (response.success && response.data) {
      setProvincias(response.data as Provincia[]);
    } else {
      showValidationError(translateApiError(response.error, { fallback: 'Error al cargar provincias' }));
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
      showValidationError('El nombre no puede estar vacío');
      return;
    }
    
    const response = await api.updateProvincia(id, { nombre: editNombre });
    if (response.success) {
      setEditingId(null);
      setEditNombre('');
      fetchProvincias();
    } else {
      showValidationError(translateApiError(response.error, { fallback: 'Error al actualizar la provincia' }));
    }
  };

  // Eliminar
  const handleDelete = async (id?: number) => {
    if (!id) return;
    const confirmed = await confirm({
      title: 'Eliminar provincia',
      message: '¿Estás seguro que querés eliminar esta provincia?',
      confirmText: 'Eliminar',
      variant: 'danger',
    });
    if (!confirmed) return;

    const response = await api.deleteProvincia(id);
    if (response.success) {
      fetchProvincias();
    } else {
      showValidationError(
        translateApiError(response.error, {
          fallback: 'No se pudo eliminar la provincia.',
          dependents: 'localidades asociadas',
        }),
      );
    }
  };

  // Agregar nueva
  const handleCreate = async () => {
    if (!nuevoNombre.trim()) {
      showValidationError('El nombre no puede estar vacío');
      return;
    }

    const response = await api.createProvincia({ nombre: nuevoNombre });
    if (response.success) {
      setNuevoNombre('');
      setAddingNew(false);
      fetchProvincias();
    } else {
      showValidationError(translateApiError(response.error, { fallback: 'Error al agregar la provincia' }));
    }
  };

  return {
    provincias,
    editingId,
    editNombre,
    addingNew,
    nuevoNombre,
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
