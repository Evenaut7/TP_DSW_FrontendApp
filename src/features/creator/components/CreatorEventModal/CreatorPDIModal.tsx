import { useState, useEffect, type FormEvent, useRef } from 'react';
import { X, Loader2 } from 'lucide-react';
import type { PDI, Tag } from '@/types';
import { useProvinciasLocalidades } from '@/features/localidades';
import { getImageUrl, getTags } from '@/utils/api';
import MapSelector from '@/components/map/MapSelector';
import TagsSelector from '@/features/tags/components/TagsSelector/TagsSelector';
import { useGeocoding } from '@/components/map/hooks/useGeocoding';
import { useReverseGeocoding } from '@/components/map/hooks/useReverseGeocoding';

const EMPTY_INITIAL_DATA = {};

interface CreatorPDIModalProps {
  show: boolean;
  pdi?: PDI | null;
  onClose: () => void;
  onSubmit: (data: PDIFormData) => Promise<boolean>;
  loading?: boolean;
  usuarios?: any[];
  isAdmin?: boolean;
  initialData?: Partial<PDIFormData>;
}

export interface PDIFormData {
  nombre: string;
  descripcion: string;
  imagen?: File | string;
  privado: boolean;

  provincia: number;
  localidad: number;
  provinciaNombre?: string;
  localidadNombre?: string;

  calle: string;
  altura: number;

  lat?: number;
  lng?: number;

  tags: number[];
  usuarioId?: number;
}

export default function CreatorPDIModal({
  show,
  pdi,
  onClose,
  onSubmit,
  loading = false,
  usuarios = [],
  isAdmin = false,
  initialData = EMPTY_INITIAL_DATA,
}: CreatorPDIModalProps) {
  const { provincias, getLocalidadesByProvincia } = useProvinciasLocalidades();

  const getLocalidadesByProvinciaRef = useRef(getLocalidadesByProvincia);
  useEffect(() => {
    getLocalidadesByProvinciaRef.current = getLocalidadesByProvincia;
  }, [getLocalidadesByProvincia]);

  const [step, setStep] = useState<1 | 2>(1);
  const [localidades, setLocalidades] = useState<any[]>([]);
  const [imagePreview, setImagePreview] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [manualOverride, setManualOverride] = useState(false);
  const [allTags, setAllTags] = useState<Tag[]>([]);

  const initialForm: PDIFormData = {
    nombre: '',
    descripcion: '',
    privado: false,
    provincia: 0,
    localidad: 0,
    calle: '',
    altura: 0,
    lat: undefined,
    lng: undefined,
    tags: [],
    usuarioId: undefined,
  };

  const [form, setForm] = useState<PDIFormData>(initialForm);

  // =============================
  // LOAD TAGS
  // =============================

  useEffect(() => {
    if (!show) return;

    const fetchTags = async () => {
      try {
        const response = await getTags();
        const tags = response?.data ?? response ?? [];
        setAllTags(Array.isArray(tags) ? tags : []);
      } catch (error) {
        console.error('Error loading tags:', error);
        setAllTags([]);
      }
    };

    fetchTags();
  }, [show]);

  // =============================
  // INIT FORM (EDIT MODE)
  // =============================

  useEffect(() => {
    if (!show) return;

    const init = async () => {
      if (!pdi) {
        // Separamos la localidad para setearla después de cargar la lista.
        const { localidad: initialLocalidad, ...restOfInitialData } =
          initialData;
        const baseForm = { ...initialForm, ...restOfInitialData };

        setForm(baseForm); // Seteamos el form sin la localidad
        setImagePreview('');

        if (baseForm.provincia) {
          const locs = await getLocalidadesByProvinciaRef.current(
            baseForm.provincia,
          );
          setLocalidades(locs);
          // Ahora que tenemos las localidades, seteamos el valor correcto.
          setForm((prev) => ({ ...prev, localidad: initialLocalidad || 0 }));
        } else {
          setLocalidades([]);
        }
        return;
      }

      const provinciaId = pdi.localidad?.provincia?.id || 0;

      if (provinciaId) {
        const locs = await getLocalidadesByProvinciaRef.current(provinciaId);
        setLocalidades(locs);
      }

      setForm({
        nombre: pdi.nombre,
        descripcion: pdi.descripcion,
        imagen: pdi.imagen,
        privado: pdi.privado ?? false,
        provincia: provinciaId,
        provinciaNombre: pdi.localidad?.provincia?.nombre,
        localidad: pdi.localidad?.id || 0,
        localidadNombre: pdi.localidad?.nombre,
        calle: pdi.calle,
        altura: pdi.altura,
        lat: pdi.lat,
        lng: pdi.lng,
        tags:
          pdi.tags
            ?.map((t) => t.id)
            .filter((id): id is number => typeof id === 'number') ?? [],
        usuarioId: (pdi as any).usuario?.id ?? (pdi as any).usuario,
      });

      if (typeof pdi.imagen === 'string') {
        setImagePreview(getImageUrl(pdi.imagen));
      }
    };

    init();
    setStep(1);
  }, [pdi, show, initialData]);

  // =============================
  // GEOCODING
  // =============================

  useGeocoding({
    calle: form.calle,
    altura: form.altura,
    localidad: form.localidadNombre,
    provincia: form.provinciaNombre,
    manualOverride,
    onCoordinates: (lat, lng) => {
      setForm((prev) => ({ ...prev, lat, lng }));
    },
  });

  useReverseGeocoding({
    lat: form.lat,
    lng: form.lng,
    enabled: manualOverride,
    onAddress: ({ calle, altura, localidad, provincia }) => {
      setForm((prev) => ({
        ...prev,
        calle: calle ?? prev.calle,
        altura: altura ?? prev.altura,
        localidadNombre: localidad ?? prev.localidadNombre,
        provinciaNombre: provincia ?? prev.provinciaNombre,
      }));
    },
  });

  useEffect(() => {
    setManualOverride(false);
  }, [form.calle, form.altura, form.localidad, form.provincia]);

  // =============================
  // HANDLERS
  // =============================

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value, type, checked } = e.target as HTMLInputElement;

    if (name === 'tags' && type === 'checkbox') {
      const tagId = Number(value);

      setForm((prev) => ({
        ...prev,
        tags: checked
          ? [...prev.tags, tagId]
          : prev.tags.filter((id) => id !== tagId),
      }));
      return;
    }

    if (name === 'usuarioId') {
      setForm((prev) => ({
        ...prev,
        usuarioId: value ? Number(value) : undefined,
      }));
      return;
    }

    if (type === 'checkbox') {
      setForm((prev) => ({ ...prev, [name]: checked }));
      return;
    }

    if (type === 'number') {
      setForm((prev) => ({ ...prev, [name]: value ? Number(value) : 0 }));
      return;
    }

    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleProvinciaChange = async (
    e: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    const provinciaId = Number(e.target.value);
    const provinciaObj = provincias.find((p) => p.id === provinciaId);

    setForm((prev) => ({
      ...prev,
      provincia: provinciaId,
      provinciaNombre: provinciaObj?.nombre,
      localidad: 0,
      localidadNombre: undefined,
    }));

    if (provinciaId) {
      const locs = await getLocalidadesByProvincia(provinciaId);
      setLocalidades(locs);
    } else {
      setLocalidades([]);
    }
  };

  const handleLocalidadChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const localidadId = Number(e.target.value);
    const localidadObj = localidades.find((l) => l.id === localidadId);

    setForm((prev) => ({
      ...prev,
      localidad: localidadId,
      localidadNombre: localidadObj?.nombre,
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setForm((prev) => ({ ...prev, imagen: file }));

    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const success = await onSubmit(form);
      if (success) onClose();
    } finally {
      setSubmitting(false);
    }
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-start justify-center z-50 p-6 overflow-y-auto">
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-5xl">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-bold">
            {pdi ? 'Editar Punto de Interés' : 'Crear Punto de Interés'}
          </h2>
          <button onClick={onClose}>
            <X />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* STEP INDICATOR */}
          <div className="flex gap-4 text-sm font-medium">
            <span className={step === 1 ? 'text-blue-600' : 'text-gray-400'}>
              Paso 1 - Información
            </span>
            <span className={step === 2 ? 'text-blue-600' : 'text-gray-400'}>
              Paso 2 - Ubicación
            </span>
          </div>

          {step === 1 && (
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Nombre
                  </label>
                  <input
                    name="nombre"
                    value={form.nombre}
                    onChange={handleChange}
                    required
                    className="w-full border p-2 rounded"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Descripción
                  </label>
                  <textarea
                    name="descripcion"
                    value={form.descripcion}
                    onChange={handleChange}
                    required
                    className="w-full border p-2 rounded"
                  />
                </div>

                <label className="flex gap-2 items-center">
                  <input
                    type="checkbox"
                    name="privado"
                    checked={form.privado}
                    onChange={handleChange}
                  />
                  PDI Privado
                </label>

                {isAdmin && usuarios && usuarios.length > 0 && !pdi && (
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Usuario Creador
                    </label>
                    <select
                      name="usuarioId"
                      value={form.usuarioId ?? ''}
                      onChange={handleChange}
                      className="w-full border p-2 rounded"
                      required
                    >
                      <option value="" disabled>
                        Seleccione un usuario
                      </option>
                      {usuarios.map((user) => (
                        <option key={user.id} value={user.id}>
                          {user.nombre} ({user.gmail})
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                <TagsSelector
                  tags={allTags}
                  selected={form.tags}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Imagen</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  required={!pdi}
                />
                {imagePreview && (
                  <img src={imagePreview} className="mt-4 rounded max-h-64" />
                )}
              </div>

              <div className="md:col-span-2 flex justify-end">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="bg-blue-500 text-white px-6 py-2 rounded"
                >
                  Siguiente →
                </button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <select
                  value={form.provincia}
                  onChange={handleProvinciaChange}
                  required
                  className="border p-2 rounded"
                >
                  <option value="">Seleccionar provincia</option>
                  {provincias.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.nombre}
                    </option>
                  ))}
                </select>

                <select
                  value={form.localidad}
                  onChange={handleLocalidadChange}
                  required
                  className="border p-2 rounded"
                >
                  <option value="">Seleccionar localidad</option>
                  {localidades.map((l) => (
                    <option key={l.id} value={l.id}>
                      {l.nombre}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <input
                  type="text"
                  name="calle"
                  value={form.calle}
                  onChange={handleChange}
                  required
                  placeholder="Calle"
                  className="border p-2 rounded"
                />

                <input
                  type="number"
                  name="altura"
                  value={form.altura}
                  onChange={handleChange}
                  required
                  placeholder="Altura"
                  className="border p-2 rounded"
                />
              </div>

              <MapSelector
                latitud={form.lat}
                longitud={form.lng}
                setLatitud={(lat) => {
                  setManualOverride(true);
                  setForm((prev) => ({ ...prev, lat }));
                }}
                setLongitud={(lng) => {
                  setManualOverride(true);
                  setForm((prev) => ({ ...prev, lng }));
                }}
                setManualOverride={setManualOverride}
              />

              <div className="flex justify-between pt-4">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="bg-gray-300 px-6 py-2 rounded"
                >
                  ← Volver
                </button>

                <button
                  type="submit"
                  disabled={submitting || loading}
                  className="bg-blue-600 text-white px-6 py-2 rounded flex gap-2 items-center"
                >
                  {submitting && <Loader2 className="animate-spin" />}
                  Guardar
                </button>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
