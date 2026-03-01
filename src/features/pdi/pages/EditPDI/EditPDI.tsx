import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { z } from 'zod';
import Navbar from '@/components/layout/Navbar/Navbar';
import PantallaDeCarga from '@/components/ui/Loading/PantallaDeCarga';
import {
  useApiGet,
  getPDIById,
  uploadImage,
  updatePDI,
  getImageUrl,
} from '@/utils/api';
import { useUser } from '@/features/user';
import { useAuthAdmin } from '@/features/auth';
import { useTheme } from '@/context/ThemeContext';
import { ListadoEventosEditable } from '@/features/eventos';
import MapSelector from '@/components/map/MapSelector';
import { useGeocoding } from '@/components/map//hooks/useGeocoding';
import { useReverseGeocoding } from '@/components/map//hooks/useReverseGeocoding';
import { Sun, Moon, Pencil, Save, X, MapPin } from 'lucide-react';

// ── Zod v4 schema ─────────────────────────────────────────────────────────────
const pdiSchema = z.object({
  nombre: z
    .string()
    .min(1, 'El nombre no puede estar vacío')
    .max(255, 'Máximo 255 caracteres'),
  descripcion: z
    .string()
    .min(1, 'La descripción no puede estar vacía')
    .max(1024, 'Máximo 1024 caracteres'),
  calle: z
    .string()
    .min(1, 'La calle no puede estar vacía')
    .max(255, 'Máximo 255 caracteres'),
  altura: z
    .number({ error: 'La altura debe ser un número' })
    .int('Debe ser entero')
    .positive('Debe ser positivo'),
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
  localidad: z
    .number({ error: 'La localidad es obligatoria' })
    .int()
    .positive('Seleccioná una localidad'),
  usuario: z
    .number({ error: 'El usuario es obligatorio' })
    .int()
    .positive('Seleccioná un usuario'),
  imagen: z.string().min(1).max(255).optional(),
});

type PDIFormValues = z.infer<typeof pdiSchema>;
type FieldErrors = Partial<Record<keyof PDIFormValues, string>>;

interface Tag {
  id: number;
  nombre: string;
}
interface Provincia {
  id: number;
  nombre: string;
}
interface PDI {
  id: number;
  nombre: string;
  descripcion: string;
  imagen: string;
  calle: string;
  altura: number;
  privado: boolean;
  lat?: number;
  lng?: number;
  tags: Tag[];
  usuario: number;
  localidad: number;
}

// ── Field wrapper ─────────────────────────────────────────────────────────────
const Field = ({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) => (
  <div className="flex flex-col gap-1">
    <label className="text-xs font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-500">
      {label}
    </label>
    {children}
    {error && <p className="text-red-500 text-xs">{error}</p>}
  </div>
);

// ── Clases inputs edit-in-place ───────────────────────────────────────────────
const editCls =
  'w-full px-3 py-2 rounded-lg border border-transparent hover:border-slate-200 dark:hover:border-slate-600 focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none bg-transparent hover:bg-slate-50 dark:hover:bg-slate-700/50 text-slate-800 dark:text-slate-100 text-sm transition-all';
const editClsSelect = `${editCls} cursor-pointer`;

// ── Modal de ubicación ────────────────────────────────────────────────────────
interface UbicacionModalProps {
  show: boolean;
  onClose: () => void;
  provincias: Provincia[];
  todasLocalidades: any[];
  calle: string;
  altura: number;
  latitud?: number;
  longitud?: number;
  provinciaSeleccionada: number;
  localidad: number;
  onConfirm: (data: {
    calle: string;
    altura: number;
    localidad: number;
    provincia: number;
    lat?: number;
    lng?: number;
  }) => void;
}

const UbicacionModal: React.FC<UbicacionModalProps> = ({
  show,
  onClose,
  provincias,
  todasLocalidades,
  calle: calleInit,
  altura: alturaInit,
  latitud: latInit,
  longitud: lngInit,
  provinciaSeleccionada: provInit,
  localidad: locInit,
  onConfirm,
}) => {
  const [calle, setCalle] = useState(calleInit);
  const [altura, setAltura] = useState(alturaInit);
  const [provincia, setProvincia] = useState(provInit);
  const [localidad, setLocalidad] = useState(locInit);
  const [lat, setLat] = useState(latInit);
  const [lng, setLng] = useState(lngInit);
  const [manualOverride, setManualOverride] = useState(false);

  // Sync cuando abre el modal
  useEffect(() => {
    if (show) {
      setCalle(calleInit);
      setAltura(alturaInit);
      setProvincia(provInit);
      setLocalidad(locInit);
      setLat(latInit);
      setLng(lngInit);
      setManualOverride(false);
    }
  }, [show]);

  const localidadesFiltradas =
    provincia === 0
      ? todasLocalidades
      : todasLocalidades.filter(
          (l) => l.provincia?.id === provincia || l.provincia === provincia,
        );

  const localidadNombre = todasLocalidades.find(
    (l) => l.id === localidad,
  )?.nombre;
  const provinciaNombre = provincias.find((p) => p.id === provincia)?.nombre;

  useGeocoding({
    calle,
    altura,
    localidad: localidadNombre,
    provincia: provinciaNombre,
    manualOverride,
    onCoordinates: (newLat, newLng) => {
      setLat(newLat);
      setLng(newLng);
    },
  });

  useReverseGeocoding({
    lat,
    lng,
    enabled: manualOverride,
    onAddress: ({ calle: c, altura: a }) => {
      if (c) setCalle(c);
      if (a) setAltura(a);
    },
  });

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-700">
          <h3 className="font-bold text-slate-900 dark:text-slate-100 text-lg flex items-center gap-2">
            <MapPin className="w-5 h-5 text-primary" /> Cambiar ubicación
          </h3>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-400 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="px-6 py-5 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Field label="Provincia">
              <select
                value={provincia}
                onChange={(e) => {
                  setProvincia(Number(e.target.value));
                  setManualOverride(false);
                }}
                className={`w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100 text-sm focus:outline-none focus:border-primary`}
              >
                <option value={0}>Seleccioná una provincia</option>
                {provincias.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.nombre}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Localidad">
              <select
                value={localidad}
                onChange={(e) => {
                  setLocalidad(Number(e.target.value));
                  setManualOverride(false);
                }}
                className={`w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100 text-sm focus:outline-none focus:border-primary`}
              >
                <option value={0}>Seleccioná una localidad</option>
                {localidadesFiltradas.map((l) => (
                  <option key={l.id} value={l.id}>
                    {l.nombre}
                  </option>
                ))}
              </select>
            </Field>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Calle">
              <input
                value={calle}
                onChange={(e) => {
                  setCalle(e.target.value);
                  setManualOverride(false);
                }}
                className={`w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100 text-sm focus:outline-none focus:border-primary`}
                placeholder="Nombre de la calle"
              />
            </Field>
            <Field label="Altura">
              <input
                type="number"
                value={altura || ''}
                onChange={(e) => {
                  setAltura(Number(e.target.value));
                  setManualOverride(false);
                }}
                className={`w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100 text-sm focus:outline-none focus:border-primary`}
                placeholder="Número"
              />
            </Field>
          </div>
          <p className="text-xs text-slate-400 dark:text-slate-500">
            Las coordenadas se calculan desde la dirección, o hacé click en el
            mapa para ajustar manualmente.
          </p>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Latitud (auto)">
              <input
                value={lat?.toFixed(6) ?? '—'}
                readOnly
                className="w-full px-3 py-2 rounded-lg border border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-700 text-slate-400 text-sm cursor-not-allowed"
              />
            </Field>
            <Field label="Longitud (auto)">
              <input
                value={lng?.toFixed(6) ?? '—'}
                readOnly
                className="w-full px-3 py-2 rounded-lg border border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-700 text-slate-400 text-sm cursor-not-allowed"
              />
            </Field>
          </div>
          <div className="rounded-xl overflow-hidden border border-slate-100 dark:border-slate-600">
            <MapSelector
              latitud={lat}
              longitud={lng}
              setLatitud={setLat}
              setLongitud={setLng}
              setManualOverride={setManualOverride}
            />
          </div>
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-full border border-slate-300 dark:border-slate-600 text-slate-600 dark:text-slate-300 font-semibold hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors text-sm"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={() => {
                onConfirm({ calle, altura, localidad, provincia, lat, lng });
                onClose();
              }}
              className="flex-1 py-2.5 rounded-full bg-primary text-white font-semibold hover:bg-accent transition-colors text-sm"
            >
              Confirmar ubicación
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ── Page ──────────────────────────────────────────────────────────────────────
const EditPDI = () => {
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

  // Cargar PDI
  useEffect(() => {
    const fetchPDI = async () => {
      if (!pdiId) return;
      try {
        const res = await getPDIById(pdiId);
        if (!res.success || !res.data) throw new Error(res.error);
        const d = res.data as PDI;
        setForm({
          nombre: d.nombre,
          descripcion: d.descripcion,
          calle: d.calle,
          altura: d.altura,
          privado: d.privado,
          tags: d.tags.map((t) => t.id),
          localidad: d.localidad,
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
    if (!form.localidad || !todasLocalidades) return;
    const loc = todasLocalidades.find((l) => l.id === form.localidad);
    if (loc?.provincia?.id) setProvinciaSeleccionada(loc.provincia.id);
    else if (typeof loc?.provincia === 'number')
      setProvinciaSeleccionada(loc.provincia);
  }, [form.localidad, todasLocalidades]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value, type } = e.target;
    setForm((f) => ({
      ...f,
      [name]: type === 'number' ? (value === '' ? 0 : Number(value)) : value,
    }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleTagToggle = (tagId: number) => {
    setForm((f) => ({
      ...f,
      tags: f.tags?.includes(tagId)
        ? f.tags.filter((t) => t !== tagId)
        : [...(f.tags || []), tagId],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaveError('');
    const result = pdiSchema.safeParse({
      ...form,
      lat: latitud,
      lng: longitud,
    });
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
        const up = await uploadImage(imagenFile);
        if (!up.success || !up.data)
          throw new Error(up.error || 'Error al subir imagen');
        imagenUrl = up.data.nombreArchivo || up.data.filename || '';
      }
      const payload = {
        ...result.data,
        imagen: imagenUrl,
        lat: latitud,
        lng: longitud,
      };
      const res = await updatePDI(pdiId!, payload);
      if (!res.success) throw new Error(res.error || 'Error al actualizar');
      navigate(`/pdi/${pdiId}`);
    } catch (e: any) {
      setSaveError(e.message || 'Error al guardar');
    } finally {
      setSaving(false);
    }
  };

  if (cargando || userLoading)
    return <PantallaDeCarga mensaje="Cargando PDI..." />;
  if (!user || (user.tipo !== 'admin' && user.tipo !== 'creador'))
    return (
      <p className="text-center mt-8 text-slate-500">
        No tenés acceso a esta página.
      </p>
    );

  const previewUrl = imagenFile
    ? URL.createObjectURL(imagenFile)
    : getImageUrl(imagenActual);
  const localidadNombre = todasLocalidades?.find(
    (l) => l.id === form.localidad,
  )?.nombre;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-800 font-display transition-colors duration-300">
      <Navbar />

      {/* ── Hero ── */}
      <div className="relative w-full h-[50vh] overflow-hidden">
        <img
          src={previewUrl}
          alt={form.nombre}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent dark:from-slate-800 dark:via-black/30 dark:to-transparent" />
        <div className="absolute bottom-0 left-0 w-full px-5 md:px-16 pb-6">
          <div className="max-w-7xl mx-auto">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400 text-amber-900 text-xs font-bold mb-4">
              <Pencil className="w-3 h-3" /> MODO EDICIÓN
            </span>

            <div className="relative group/nombre">
              <input
                name="nombre"
                value={form.nombre}
                onChange={handleChange}
                className="w-full bg-transparent text-white text-3xl md:text-5xl font-extrabold tracking-tight drop-shadow-lg
                  border-b-2 border-transparent group-hover/nombre:border-white/40 focus:border-white
                  focus:outline-none transition-all placeholder:text-white/50"
                placeholder="Nombre del PDI"
              />
              <Pencil className="absolute right-0 bottom-2 w-4 h-4 text-white/40 group-hover/nombre:text-white/70 transition-colors pointer-events-none" />
            </div>
            {errors.nombre && (
              <p className="text-red-400 text-xs mt-1">{errors.nombre}</p>
            )}

            <button
              type="button"
              onClick={() => setShowUbicacionModal(true)}
              className="mt-2 flex items-center gap-1.5 text-white/70 hover:text-white text-sm transition-colors group/dir"
            >
              <MapPin className="w-4 h-4" />
              <span>
                {form.calle} {form.altura}
                {localidadNombre ? `, ${localidadNombre}` : ''}
              </span>
              <Pencil className="w-3 h-3 opacity-0 group-hover/dir:opacity-100 transition-opacity" />
            </button>
          </div>
        </div>

        {/* Cambiar foto */}
        <label className="absolute top-6 right-6 cursor-pointer flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 hover:bg-white/30 text-white text-sm font-semibold backdrop-blur-sm transition-colors">
          <Pencil className="w-4 h-4" />
          Cambiar foto
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => setImagenFile(e.target.files?.[0] || null)}
          />
        </label>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="bg-white dark:bg-slate-800">
          <div className="max-w-7xl mx-auto px-5 md:px-16 py-8 md:py-12 space-y-10">
            {saveError && (
              <div className="flex items-center gap-2 px-4 py-3 rounded-lg bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-sm">
                <X className="w-4 h-4 flex-shrink-0" /> {saveError}
              </div>
            )}

            <section className="space-y-4">
              <h2 className="text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 border-b border-slate-100 dark:border-slate-700 pb-2">
                Descripción
              </h2>
              <Field label="" error={errors.descripcion}>
                <textarea
                  name="descripcion"
                  value={form.descripcion}
                  onChange={handleChange}
                  rows={4}
                  className={`${editCls} resize-none leading-relaxed`}
                  placeholder="Descripción del PDI"
                />
              </Field>
            </section>

            <section className="space-y-5">
              <h2 className="text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 border-b border-slate-100 dark:border-slate-700 pb-2">
                Clasificación
              </h2>

              <Field label="Tags" error={errors.tags}>
                <div className="flex flex-wrap gap-2 mt-1">
                  {allTags?.map((tag) => (
                    <button
                      key={tag.id}
                      type="button"
                      onClick={() => handleTagToggle(tag.id)}
                      className={`px-3 py-1 rounded-full text-sm font-medium border transition-all
                        ${
                          form.tags?.includes(tag.id)
                            ? 'bg-primary border-primary text-white'
                            : 'border-slate-200 dark:border-slate-600 text-slate-500 dark:text-slate-300 hover:border-primary hover:text-primary'
                        }`}
                    >
                      #{tag.nombre}
                    </button>
                  ))}
                </div>
              </Field>

              <Field label="Tipo de propietario" error={errors.privado}>
                <div className="flex gap-3 mt-1">
                  {[
                    { val: false, label: 'Estatal', color: 'emerald' },
                    { val: true, label: 'Privado', color: 'amber' },
                  ].map((opt) => (
                    <button
                      key={String(opt.val)}
                      type="button"
                      onClick={() =>
                        setForm((f) => ({ ...f, privado: opt.val }))
                      }
                      className={`px-4 py-2 rounded-full text-sm font-semibold border transition-all
                        ${
                          form.privado === opt.val
                            ? opt.color === 'emerald'
                              ? 'bg-emerald-500 border-emerald-500 text-white'
                              : 'bg-amber-400 border-amber-400 text-amber-900'
                            : 'border-slate-200 dark:border-slate-600 text-slate-500 dark:text-slate-400 hover:border-slate-300'
                        }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </Field>
            </section>

            <section className="space-y-4">
              <h2 className="text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 border-b border-slate-100 dark:border-slate-700 pb-2">
                Asignación
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {isAdmin && (
                  <Field label="Usuario propietario" error={errors.usuario}>
                    <select
                      name="usuario"
                      value={form.usuario}
                      onChange={handleChange}
                      className={editClsSelect}
                    >
                      <option value={0}>Seleccioná un usuario</option>
                      {usuarios?.map((u) => (
                        <option key={u.id} value={u.id}>
                          {u.nombre || u.gmail}
                        </option>
                      ))}
                    </select>
                  </Field>
                )}
              </div>
            </section>

            <div className="flex flex-wrap gap-3 pt-2 border-t border-slate-100 dark:border-slate-700">
              <button
                type="submit"
                disabled={saving}
                className="flex items-center gap-2 px-6 py-3 rounded-full bg-primary text-white font-semibold hover:bg-accent transition-colors disabled:opacity-50 text-sm"
              >
                <Save className="w-4 h-4" />
                {saving ? 'Guardando...' : 'Guardar cambios'}
              </button>
              <button
                type="button"
                onClick={() => navigate(`/pdi/${pdiId}`)}
                className="flex items-center gap-2 px-6 py-3 rounded-full border border-slate-300 dark:border-slate-600 text-slate-600 dark:text-slate-300 font-semibold hover:border-red-400 hover:text-red-500 transition-all text-sm"
              >
                <X className="w-4 h-4" />
                Cancelar
              </button>
            </div>
          </div>
        </div>
      </form>

      <div className="w-full h-8 bg-gradient-to-b from-white to-slate-100 dark:from-slate-800 dark:to-slate-900" />

      <div className="w-full bg-slate-100 dark:bg-slate-900 py-10 md:py-16">
        <div className="max-w-7xl mx-auto px-5 md:px-16 space-y-6">
          <div className="space-y-1">
            <h2 className="text-2xl md:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100">
              Eventos
            </h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm">
              Gestioná los eventos asociados a este lugar.
            </p>
          </div>
          <ListadoEventosEditable pdiId={pdiId!} />
        </div>
      </div>

      {/* ── Modal ubicación ── */}
      {provincias && todasLocalidades && (
        <UbicacionModal
          show={showUbicacionModal}
          onClose={() => setShowUbicacionModal(false)}
          provincias={provincias}
          todasLocalidades={todasLocalidades}
          calle={form.calle}
          altura={form.altura}
          latitud={latitud}
          longitud={longitud}
          provinciaSeleccionada={provinciaSeleccionada}
          localidad={form.localidad}
          onConfirm={({ calle, altura, localidad, provincia, lat, lng }) => {
            setForm((f) => ({ ...f, calle, altura, localidad }));
            setProvinciaSeleccionada(provincia);
            setLatitud(lat);
            setLongitud(lng);
          }}
        />
      )}

      {/* ── Dark mode toggle ── */}
      <button
        onClick={toggleTheme}
        aria-label="Cambiar tema"
        className="fixed bottom-6 right-6 z-50 p-3 rounded-full shadow-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-600 dark:text-slate-200 hover:scale-110 transition-all duration-300"
      >
        {theme === 'dark' ? (
          <Sun className="w-5 h-5" />
        ) : (
          <Moon className="w-5 h-5" />
        )}
      </button>
    </div>
  );
};

export default EditPDI;
