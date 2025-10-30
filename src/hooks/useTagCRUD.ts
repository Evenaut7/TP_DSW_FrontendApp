import { useState, useEffect } from 'react';

export type TipoTag = 'Evento' | 'Punto de Interés' | 'Actividad';

export type Tag = {
    id?: number;
    nombre: string;
    tipo: TipoTag;
    };

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
        try {
        const res = await fetch('http://localhost:3000/api/tags');
        const data = await res.json();
        if (!res.ok) {
            setError(data?.message || `Error ${res.status}`);
            return;
        }
        setTags(data.data || []);
        } catch (err) {
        console.error(err);
        setError('Error al cargar tags');
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
        try {
        const res = await fetch(`http://localhost:3000/api/tags/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nombre: editNombre, tipo: editTipo }),
            credentials: 'include',
        });
        const data = await res.json();
        if (!res.ok) {
            setError(data?.message || `Error ${res.status}`);
            return;
        }
        setEditingId(null);
        setEditNombre('');
        setEditTipo('Evento');
        setError(null);
        fetchTags();
        } catch (err) {
        console.error(err);
        setError('Error al actualizar tag');
        }
    };

    // Eliminar
    const handleDelete = async (id?: number, nombre?: string) => {
        if (!id) return;
        if (!window.confirm(`¿Estás seguro que querés eliminar el tag "${nombre}"?`))
        return;

        try {
        const res = await fetch(`http://localhost:3000/api/tags/${id}`, {
            method: 'DELETE',
            credentials: 'include',
        });

        const data = await res.json();

        if (!res.ok) {
            setError(data?.message || 'No se pudo eliminar el tag');
            return;
        }

        setError(null);
        fetchTags();
        } catch (err) {
        console.error(err);
        setError('Error al eliminar tag');
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

        try {
        const res = await fetch('http://localhost:3000/api/tags', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nombre: nuevoNombre, tipo: nuevoTipo }),
            credentials: 'include',
        });

        const data = await res.json();

        if (!res.ok) {
            setError(data?.message || 'No se pudo agregar el tag');
            return;
        }

        setNuevoNombre('');
        setNuevoTipo('Evento');
        setAddingNew(false);
        setError(null);
        fetchTags();
        } catch (err) {
        console.error(err);
        setError('Error al agregar tag');
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
