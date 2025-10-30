import { useState, useEffect } from 'react';
import type { Tag, TipoTag } from '../types';
import * as api from '../utils/api';

export type { Tag, TipoTag };

export function useTagCRUD() {
    const [tags, setTags] = useState<Tag[]>([]);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [editNombre, setEditNombre] = useState('');
    const [editTipo, setEditTipo] = useState<TipoTag>('Evento');
    const [addingNew, setAddingNew] = useState(false);
    const [nuevoNombre, setNuevoNombre] = useState('');
    const [nuevoTipo, setNuevoTipo] = useState<TipoTag>('Evento');
    const [error, setError] = useState<string | null>(null);

    const fetchTags = async () => {
        const response = await api.getTags();
        if (response.success && response.data) {
            setTags(response.data as Tag[]);
        } else {
            setError(response.error || 'Error al cargar tags');
        }
    };

    useEffect(() => {
        fetchTags();
    }, []);

  // Editar
    const handleEdit = (tag: Tag) => {
        setEditingId(tag.id!);
        setEditNombre(tag.nombre);
        setEditTipo(tag.tipo);
    };

    const handleCancelEdit = () => {
        setEditingId(null);
        setEditNombre('');
        setEditTipo('Evento');
        setError(null);
    };

    const handleUpdate = async (id: number) => {
        if (!editNombre.trim()) {
            setError('El nombre no puede estar vacío');
            return;
        }
        if (!editTipo) {
            setError('Debe seleccionar un tipo');
            return;
        }
        
        const response = await api.updateTag(id, { nombre: editNombre, tipo: editTipo });
        if (response.success) {
            setEditingId(null);
            setEditNombre('');
            setEditTipo('Evento');
            setError(null);
            fetchTags();
        } else {
            setError(response.error || 'Error al actualizar tag');
        }
    };

    // Eliminar
    const handleDelete = async (id?: number, nombre?: string) => {
        if (!id) return;
        if (!window.confirm(`¿Estás seguro que querés eliminar el tag "${nombre}"?`))
            return;

        const response = await api.deleteTag(id);
        if (response.success) {
            setError(null);
            fetchTags();
        } else {
            setError(response.error || 'Error al eliminar tag');
        }
    };

    // Agregar nueva
    const handleCreate = async () => {
        if (!nuevoNombre.trim()) {
            setError('El nombre no puede estar vacío');
            return;
        }
        if (!nuevoTipo) {
            setError('Debe seleccionar un tipo');
            return;
        }

        const response = await api.createTag({ nombre: nuevoNombre, tipo: nuevoTipo });
        if (response.success) {
            setNuevoNombre('');
            setNuevoTipo('Evento');
            setAddingNew(false);
            setError(null);
            fetchTags();
        } else {
            setError(response.error || 'Error al agregar tag');
        }
    };

    return {
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
    };
}
