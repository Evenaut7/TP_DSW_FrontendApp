import { useState, useEffect } from 'react';
import { z } from 'zod';
import { uploadImage, API_BASE_URL } from '@/utils/api';
import { showSuccess } from '@/utils/notifications';
import type { Historia } from '@/types';

const API = '/api/historias';

async function deleteImage(filename: string) {
  if (!filename) return;
  try {
    await fetch(`${API_BASE_URL}/api/imagenes/${filename}`, {
      method: 'DELETE',
      credentials: 'include',
    });
  } catch {}
}

async function apiFetch(url: string, options?: RequestInit) {
  const res = await fetch(`${API_BASE_URL}${url}`, {
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.message || 'Error en la petición');
  return json;
}

// ── Schema de validación (espejo del backend) ─────────────────────────────────
const historiaSchema = z.object({
  titulo: z.string().min(1, 'El título no puede estar vacío').max(255, 'Máximo 255 caracteres'),
  descripcion: z.string().min(1, 'La descripción no puede estar vacía').max(1024, 'Máximo 1024 caracteres'),
  fechaDesde: z
    .string()
    .min(1, 'La fecha desde es obligatoria')
    .refine((d) => !isNaN(Date.parse(d)), 'Formato de fecha inválido'),
  fechaHasta: z
    .string()
    .refine((d) => !d || !isNaN(Date.parse(d)), 'Formato de fecha inválido')
    .optional(),
  // cross-field validation handled separately below

  imagen: z.string().min(1).max(255).optional(),
});

type HistoriaFormErrors = Partial<Record<keyof z.infer<typeof historiaSchema>, string>>;

interface FormState {
  titulo: string;
  descripcion: string;
  fechaDesde: string;
  fechaHasta: string;
  imagenFile: File | null;
  imagenActual: string;
}

const emptyForm = (): FormState => ({
  titulo: '',
  descripcion: '',
  fechaDesde: '',
  fechaHasta: '',
  imagenFile: null,
  imagenActual: '',
});

export function useHistoriaCRUD(pdiId: number, onSuccess: () => void) {
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState<HistoriaFormErrors>({});
  const [editingId, setEditingId] = useState<number | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<FormState>(emptyForm());

  // ── Auth / ownership ──────────────────────────────────────────────────────
  const [puedeEditar, setPuedeEditar] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    const check = async () => {
      setAuthLoading(true);
      try {
        // 1. ¿Es admin?
        const adminRes = await fetch(`${API_BASE_URL}/api/usuarios/is-admin`, { credentials: 'include' });
        const adminData = await adminRes.json();
        if (adminData?.isAdmin === true) {
          setPuedeEditar(true);
          return;
        }

        // 2. ¿Es creador y dueño del PDI?
        const creatorRes = await fetch(`${API_BASE_URL}/api/usuarios/is-creator`, { credentials: 'include' });
        const creatorData = await creatorRes.json();
        if (creatorData?.isCreator !== true) return;

        const ownerRes = await fetch(`${API_BASE_URL}/api/usuarios/is-pdiOwner/${pdiId}`, { credentials: 'include' });
        const ownerData = await ownerRes.json();
        if (ownerData?.isOwner === true) {
          setPuedeEditar(true);
        }
      } catch {
        setPuedeEditar(false);
      } finally {
        setAuthLoading(false);
      }
    };
    check();
  }, [pdiId]);

  // ── Form handlers ─────────────────────────────────────────────────────────
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, files } = e.target as HTMLInputElement;
    if (name === 'imagenFile' && files?.[0]) {
      setForm((f) => ({ ...f, imagenFile: files[0] }));
    } else {
      setForm((f) => ({ ...f, [name]: value }));
    }
  };

  const openCreate = () => {
    setEditingId(null);
    setForm(emptyForm());
    setError('');
    setFieldErrors({});
    setShowForm(true);
  };

  const openEdit = (h: Historia) => {
    setEditingId(h.id);
    setForm({
      titulo: h.titulo,
      descripcion: h.descripcion,
      fechaDesde: h.fechaDesde?.slice(0, 10) ?? '',
      fechaHasta: h.fechaHasta?.slice(0, 10) ?? '',
      imagenFile: null,
      imagenActual: h.imagen ?? '',
    });
    setError('');
    setFieldErrors({});
    setShowForm(true);
  };

  const cancel = () => {
    setShowForm(false);
    setEditingId(null);
    setForm(emptyForm());
    setError('');
    setFieldErrors({});
  };

  const submit = async () => {
    setError('');
    setFieldErrors({});

    const validation = historiaSchema.safeParse({
      titulo: form.titulo,
      descripcion: form.descripcion,
      fechaDesde: form.fechaDesde,
      fechaHasta: form.fechaHasta || undefined,
    });

    if (!validation.success) {
      const errs: HistoriaFormErrors = {};
      validation.error.issues.forEach((issue) => {
        const field = issue.path[0] as keyof HistoriaFormErrors;
        if (!errs[field]) errs[field] = issue.message;
      });
      setFieldErrors(errs);
      return;
    }

    // Validación cruzada: fechaHasta debe ser posterior a fechaDesde
    if (form.fechaHasta && form.fechaDesde) {
      if (new Date(form.fechaHasta) <= new Date(form.fechaDesde)) {
        setFieldErrors({ fechaHasta: 'La fecha hasta debe ser posterior a la fecha desde' });
        setError('La fecha hasta debe ser posterior a la fecha desde');
        return;
      }
    }

    // Validar tipo de imagen antes de subir
    if (form.imagenFile) {
      const allowedTypes = ['image/jpeg', 'image/png'];
      if (!allowedTypes.includes(form.imagenFile.type)) {
        setError('Solo se permiten imágenes en formato JPG o PNG');
        return;
      }
    }

    setSaving(true);
    try {
      let imagenNombre = form.imagenActual;
      if (form.imagenFile) {
        const up = await uploadImage(form.imagenFile, form.imagenActual || undefined);
        if (!up.success || !up.data) throw new Error(up.error || 'Error al subir imagen');
        imagenNombre = up.data.filename ?? '';
      }

      const body = {
        titulo: form.titulo.trim(),
        descripcion: form.descripcion.trim(),
        fechaDesde: form.fechaDesde,
        ...(form.fechaHasta ? { fechaHasta: form.fechaHasta } : {}),
        ...(imagenNombre ? { imagen: imagenNombre } : {}),
        puntoDeInteres: pdiId,
      };

      if (editingId) {
        await apiFetch(`${API}/${editingId}`, { method: 'PUT', body: JSON.stringify(body) });
      } else {
        await apiFetch(API, { method: 'POST', body: JSON.stringify(body) });
      }

      const msg = editingId ? 'Historia actualizada correctamente' : 'Historia creada correctamente';
      showSuccess(msg);
      cancel();
      onSuccess();
    } catch (e: any) {
      setError(e.message || 'Error al guardar');
    } finally {
      setSaving(false);
    }
  };

  const remove = async (id: number, imagen?: string) => {
    if (!confirm('¿Eliminar esta historia?')) return;
    try {
      if (imagen) await deleteImage(imagen);
      await apiFetch(`${API}/${id}`, { method: 'DELETE' });
      showSuccess('Historia eliminada correctamente');
      onSuccess();
    } catch (e: any) {
      setError(e.message || 'Error al eliminar');
    }
  };

  return {
    // auth
    puedeEditar,
    authLoading,
    // form
    form,
    saving,
    error,
    fieldErrors,
    editingId,
    showForm,
    handleChange,
    openCreate,
    openEdit,
    cancel,
    submit,
    remove,
  };
}
