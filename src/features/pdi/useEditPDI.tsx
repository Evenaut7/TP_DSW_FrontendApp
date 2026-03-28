import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { useApiGet, getPDIById, uploadImage, updatePDI, getImageUrl, API_BASE_URL } from '@/utils/api';
import { useUser } from '@/features/user';
import { useAuthAdmin } from '@/features/auth';
import { useTheme } from '@/context/ThemeContext';
import type { Tag, Provincia, PDI } from '@/types';

interface PDIEditable extends Omit<PDI, 'tags' | 'privado'> {
  usuario: number;
  tags: Tag[];
  privado: boolean;
}

// ── Zod schema ────────────────────────────────────────────────────────────────
export const pdiSchema = z.object({
  nombre: z.string().min(1, 'El nombre no puede estar vacío').max(255, 'Máximo 255 caracteres'),
  descripcion: z.string().min(1, 'La descripción no puede estar vacía').max(1024, 'Máximo 1024 caracteres'),
  calle: z.string().min(1, 'La calle no puede estar vacía').max(255, 'Máximo 255 caracteres'),
  altura: z.number({ error: 'La altura debe ser un número' }).int('Debe ser entero').positive('Debe ser positivo'),
  lat: z
    .number({ error: 'Debe ser un número' })
    .refine((v) => v >= -90 && v <= 90, 'Entre -90 y 90')
    .optional(),
  lng: z
    .number({ error: 'Debe ser un número' })
    .refine((v) => v >= -180 && v <= 180, 'Entre -180 y 180')
    .optional(),
  privado: z.boolean(),
  tags: z.array(z.number().int().positive()).optional(),
  localidad: z.number({ error: 'La localidad es obligatoria' }).int().positive('Seleccioná una localidad'),
  usuario: z.number({ error: 'El usuario es obligatorio' }).int().positive('Seleccioná un usuario'),
  imagen: z.string().min(1).max(255).optional(),
});

export type PDIFormValues = z.infer<typeof pdiSchema>;
export type FieldErrors = Partial<Record<keyof PDIFormValues, string>>;

// ── Hook ──────────────────────────────────────────────────────────────────────
export function useEditPDI() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const pdiId = id ? parseInt(id) : null;

  const { user, loading: userLoading } = useUser();
  const { isAdmin } = useAuthAdmin();
  const { theme, toggleTheme } = useTheme();

  const { data: allTags } = useApiGet<Tag[]>('/api/tags');
  const { data: usuarios } = useApiGet<any[]>('/api/usuarios');
  const { data: provincias } = useApiGet<Provincia[]>('/api/provincias');
  const { data: todasLocalidades } = useApiGet<any[]>('/api/localidades');

  const [form, setForm] = useState<PDIFormValues>({
    nombre: '',
    descripcion: '',
    calle: '',
    altura: 0,
    privado: false,
    tags: [],
    localidad: 0,
    usuario: 0,
  });
  const [errors, setErrors] = useState<FieldErrors>({});
  const [provinciaSeleccionada, setProvinciaSeleccionada] = useState(0);
  const [imagenFile, setImagenFile] = useState<File | null>(null);
  const [imagenActual, setImagenActual] = useState('');
  const [latitud, setLatitud] = useState<number | undefined>();
  const [longitud, setLongitud] = useState<number | undefined>();
  const [saving, setSaving] = useState(false);
  const [cargando, setCargando] = useState(true);
  const [saveError, setSaveError] = useState('');
  const [showUbicacionModal, setShowUbicacionModal] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const [puedeEditar, setPuedeEditar] = useState(false);
  const [checkingAccess, setCheckingAccess] = useState(true);

  useEffect(() => {
    if (!pdiId) return;
    const check = async () => {
      setCheckingAccess(true);
      try {
        const res = await fetch(`${API_BASE_URL}/api/puntosDeInteres/canEdit/${pdiId}`, { credentials: 'include' });
        // 200 = admin o dueño del PDI, cualquier otro = no tiene acceso
        setPuedeEditar(res.ok);
      } catch {
        setPuedeEditar(false);
      } finally {
        setCheckingAccess(false);
      }
    };
    check();
  }, [pdiId]);

  // ── Cargar PDI al montar ──────────────────────────────────────────────────
  useEffect(() => {
    const fetchPDI = async () => {
      if (!pdiId) return;
      try {
        const res = await getPDIById(pdiId);
        if (!res.success || !res.data) throw new Error(res.error);
        const d = res.data as PDIEditable;
        setForm({
          nombre: d.nombre,
          descripcion: d.descripcion,
          calle: d.calle,
          altura: d.altura,
          privado: d.privado ?? false,
          tags: d.tags.map((t) => t.id).filter((id): id is number => id !== undefined),
          localidad: typeof d.localidad === 'object' ? d.localidad.id : d.localidad,
          usuario: d.usuario,
        });
        setLatitud(d.lat);
        setLongitud(d.lng);
        setImagenActual(d.imagen);
      } catch (e: any) {
        setSaveError(e.message || 'Error al cargar el PDI');
      } finally {
        setCargando(false);
      }
    };
    fetchPDI();
  }, [pdiId]);

  useEffect(() => {
    if (!form.localidad || !todasLocalidades?.length) return;
    const loc = todasLocalidades.find((l) => l.id === form.localidad);
    if (!loc) return;
    const provId = loc.provincia?.id ?? (typeof loc.provincia === 'number' ? loc.provincia : 0);
    if (provId) setProvinciaSeleccionada(provId);
  }, [form.localidad, todasLocalidades]);

  // ── Handlers ─────────────────────────────────────────────────────────────
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setForm((f) => ({
      ...f,
      [name]: type === 'number' ? (value === '' ? 0 : Number(value)) : value,
    }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleTagToggle = (tagId: number | undefined) => {
    if (tagId === undefined) return;
    setForm((f) => ({
      ...f,
      tags: f.tags?.includes(tagId) ? f.tags.filter((t) => t !== tagId) : [...(f.tags || []), tagId],
    }));
  };

  const handlePrivadoToggle = (valor: boolean) => setForm((f) => ({ ...f, privado: valor }));
  const handleImagenChange = (file: File) => setImagenFile(file);

  const handleUbicacionConfirm = (data: {
    calle: string;
    altura: number;
    localidad: number;
    provincia: number;
    lat?: number;
    lng?: number;
  }) => {
    setForm((f) => ({ ...f, calle: data.calle, altura: data.altura, localidad: data.localidad }));
    setProvinciaSeleccionada(data.provincia);
    setLatitud(data.lat);
    setLongitud(data.lng);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaveError('');
    setErrors({});
    setSubmitted(true);

    const result = pdiSchema.safeParse({ ...form, lat: latitud, lng: longitud });
    if (!result.success) {
      const fieldErrors: FieldErrors = {};
      result.error.issues.forEach((err) => {
        const field = err.path[0] as keyof PDIFormValues;
        if (!fieldErrors[field]) fieldErrors[field] = err.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setSaving(true);
    try {
      let imagenUrl = imagenActual;
      if (imagenFile instanceof File) {
        const up = await uploadImage(imagenFile, imagenActual || undefined);
        if (!up.success || !up.data) throw new Error(up.error || 'Error al subir imagen');
        imagenUrl = up.data.nombreArchivo || up.data.filename || '';
      }
      const payload = { ...result.data, imagen: imagenUrl, lat: latitud, lng: longitud };
      const res = await updatePDI(pdiId!, payload);
      if (!res.success) throw new Error(res.error || 'Error al actualizar');
      navigate(`/pdi/${pdiId}`);
    } catch (e: any) {
      setSaveError(e.message || 'Error al guardar');
    } finally {
      setSaving(false);
    }
  };

  // ── Valores derivados ─────────────────────────────────────────────────────
  const previewUrl = imagenFile ? URL.createObjectURL(imagenFile) : getImageUrl(imagenActual);
  const localidadNombre = todasLocalidades?.find((l) => l.id === form.localidad)?.nombre;

  return {
    pdiId,
    navigate,
    user,
    userLoading,
    isAdmin,
    puedeEditar,
    cargando: cargando || checkingAccess,
    theme,
    toggleTheme,
    allTags,
    usuarios,
    provincias,
    todasLocalidades,
    form,
    errors,
    provinciaSeleccionada,
    saving,
    saveError,
    submitted,
    previewUrl,
    latitud,
    longitud,
    localidadNombre,
    showUbicacionModal,
    setShowUbicacionModal,
    handleChange,
    handleTagToggle,
    handlePrivadoToggle,
    handleImagenChange,
    handleUbicacionConfirm,
    handleSubmit,
  };
}
