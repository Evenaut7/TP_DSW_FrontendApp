import { useState } from 'react';
import { X, Check, MapPin, Loader2 } from 'lucide-react';
import { z } from 'zod';
import { uploadImage, createLocalidad } from '@/utils/api';
import { showSuccess, showValidationError } from '@/utils/notifications';

// ==================== SCHEMA ZOD (espejo del backend) ====================

const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png'];

const localidadFormSchema = z.object({
  nombre: z
    .string()
    .min(1, 'El nombre no puede estar vacío')
    .max(255, 'El nombre no puede superar los 255 caracteres'),

  descripcion: z
    .string()
    .max(1024, 'La descripción no puede superar los 1024 caracteres')
    .optional(),

  lat: z
    .number({ message: 'La latitud es inválida' })
    .min(-90, 'Latitud mínima: -90')
    .max(90, 'Latitud máxima: 90')
    .optional(),

  lng: z
    .number({ message: 'La longitud es inválida' })
    .min(-180, 'Longitud mínima: -180')
    .max(180, 'Longitud máxima: 180')
    .optional(),

  imagen: z
    .instanceof(File)
    .refine(
      (f) => ALLOWED_IMAGE_TYPES.includes(f.type),
      'Solo se permiten imágenes JPG o PNG',
    )
    .optional(),
});

type FormErrors = Partial<
  Record<keyof z.infer<typeof localidadFormSchema>, string>
>;

// ==================== PROPS ====================

interface Props {
  show: boolean;
  onHide: () => void;
  provinciaId: number;
  provinciaNombre: string;
  onLocalidadCreada?: () => void;
}

// ==================== ESTILOS ====================

const inputCls = (hasError?: boolean) =>
  `w-full px-3 py-2 rounded-lg border text-sm focus:outline-none transition-colors bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100 ${
    hasError
      ? 'border-red-400 dark:border-red-500 focus:border-red-400'
      : 'border-slate-200 dark:border-slate-600 focus:border-primary'
  }`;

const labelCls =
  'block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1';

// ==================== COMPONENTE ====================

const CreateLocalidadModal: React.FC<Props> = ({
  show,
  onHide,
  provinciaId,
  provinciaNombre,
  onLocalidadCreada,
}) => {
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [imagen, setImagen] = useState<File | null>(null);
  const [lat, setLat] = useState<number | undefined>(undefined);
  const [lng, setLng] = useState<number | undefined>(undefined);
  const [geoLoading, setGeoLoading] = useState(false);
  const [geoError, setGeoError] = useState('');
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);

  const resetAll = () => {
    setNombre('');
    setDescripcion('');
    setImagen(null);
    setLat(undefined);
    setLng(undefined);
    setGeoError('');
    setErrors({});
  };

  const handleClose = () => {
    resetAll();
    onHide();
  };

  // ==================== GEOCODING ====================
  // Busca "Nombre de localidad, Nombre de provincia, Argentina"
  // para que Nominatim no confunda con calles o localidades homónimas de otra provincia

  const fetchCoords = async (localidadNombre: string) => {
    if (!localidadNombre.trim()) return;

    setGeoLoading(true);
    setGeoError('');

    const query = `${localidadNombre.trim()}, ${provinciaNombre}, Argentina`;

    try {
      const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
        query,
      )}&format=json&limit=1&countrycodes=ar`;

      const res = await fetch(url, { headers: { 'Accept-Language': 'es' } });
      const results = await res.json();

      if (!results.length) {
        setGeoError(
          'No se encontró la ubicación. Las coordenadas quedarán vacías.',
        );
        setLat(undefined);
        setLng(undefined);
        return;
      }

      const { lat: resLat, lon: resLng } = results[0];
      setLat(parseFloat(parseFloat(resLat).toFixed(6)));
      setLng(parseFloat(parseFloat(resLng).toFixed(6)));
      setErrors((prev) => ({ ...prev, lat: undefined, lng: undefined }));
    } catch {
      setGeoError('Error al consultar la ubicación.');
    } finally {
      setGeoLoading(false);
    }
  };

  // ==================== IMAGEN ====================

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;

    if (file && !ALLOWED_IMAGE_TYPES.includes(file.type)) {
      setErrors((prev) => ({
        ...prev,
        imagen: 'Solo se permiten imágenes JPG o PNG',
      }));
      setImagen(null);
      e.target.value = '';
      return;
    }

    setErrors((prev) => ({ ...prev, imagen: undefined }));
    setImagen(file);
  };

  // ==================== VALIDACIÓN Y SUBMIT ====================

  const validate = (): boolean => {
    const result = localidadFormSchema.safeParse({
      nombre,
      descripcion: descripcion.trim() || undefined,
      lat,
      lng,
      imagen: imagen ?? undefined,
    });

    if (result.success) {
      setErrors({});
      return true;
    }

    const fieldErrors: FormErrors = {};
    for (const issue of result.error.issues) {
      const key = issue.path[0] as keyof FormErrors;
      if (!fieldErrors[key]) fieldErrors[key] = issue.message;
    }
    setErrors(fieldErrors);
    return false;
  };

  const handleSubmit = async () => {
    if (!validate()) {
      showValidationError('Revisá los campos marcados en rojo');
      return;
    }

    setLoading(true);
    try {
      let imagenFilename: string | undefined = undefined;

      if (imagen) {
        const uploadResult = await uploadImage(imagen);
        if (uploadResult.success && uploadResult.data) {
          imagenFilename = uploadResult.data.filename ?? undefined;
        } else {
          throw new Error(uploadResult.error || 'Error al subir la imagen');
        }
      }

      const result = await createLocalidad({
        nombre: nombre.trim(),
        ...(descripcion.trim() && { descripcion: descripcion.trim() }),
        ...(lat !== undefined && { lat }),
        ...(lng !== undefined && { lng }),
        ...(imagenFilename && { imagen: imagenFilename }),
        provincia: provinciaId,
      });

      if (!result.success) {
        throw new Error(result.error || 'Error al crear la localidad');
      }

      showSuccess('Localidad creada correctamente');
      resetAll();
      onHide();
      onLocalidadCreada?.();
    } catch (err) {
      showValidationError(
        err instanceof Error ? err.message : 'Error desconocido',
      );
    } finally {
      setLoading(false);
    }
  };

  // ==================== RENDER ====================

  if (!show) return null;

  const coordsFound = lat !== undefined && lng !== undefined;

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={handleClose}
      />

      <div className="relative bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-md flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-700 shrink-0">
          <div>
            <h3 className="font-bold text-slate-900 dark:text-slate-100 text-lg">
              Nueva localidad
            </h3>
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
              {provinciaNombre}
            </p>
          </div>
          <button
            onClick={handleClose}
            className="p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-400 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="overflow-y-auto p-6 space-y-5">
          {/* Nombre */}
          <div>
            <label className={labelCls}>
              Nombre <span className="text-red-400">*</span>
            </label>
            <div className="relative">
              <input
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                onBlur={(e) => fetchCoords(e.target.value)}
                className={`${inputCls(!!errors.nombre)} ${geoLoading ? 'pr-9' : ''}`}
                placeholder="Ej: Rosario"
                autoFocus
              />
              {geoLoading && (
                <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 animate-spin text-slate-400" />
              )}
            </div>
            {errors.nombre && (
              <p className="mt-1 text-xs text-red-500 dark:text-red-400">
                {errors.nombre}
              </p>
            )}
            {geoError && !errors.nombre && (
              <p className="mt-1 text-xs text-amber-500 dark:text-amber-400">
                {geoError}
              </p>
            )}
          </div>

          {/* Descripción */}
          <div>
            <label className={labelCls}>Descripción</label>
            <textarea
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              className={`${inputCls(!!errors.descripcion)} resize-none`}
              rows={3}
              placeholder="Descripción opcional..."
            />
            {errors.descripcion && (
              <p className="mt-1 text-xs text-red-500 dark:text-red-400">
                {errors.descripcion}
              </p>
            )}
          </div>

          {/* Imagen */}
          <div>
            <label className={labelCls}>
              Imagen{' '}
              <span className="font-normal text-slate-400">(JPG o PNG)</span>
            </label>
            <input
              type="file"
              accept="image/jpeg,image/png"
              onChange={handleImageChange}
              className={`${inputCls(!!errors.imagen)} file:mr-3 file:py-1 file:px-3 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20 cursor-pointer`}
            />
            {errors.imagen && (
              <p className="mt-1 text-xs text-red-500 dark:text-red-400">
                {errors.imagen}
              </p>
            )}
          </div>

          {/* Coordenadas — solo lectura */}
          <div>
            <label className={labelCls}>
              <MapPin className="inline w-3.5 h-3.5 mr-1 -mt-0.5" />
              Coordenadas
              <span className="font-normal ml-1 text-slate-400">
                (se obtienen automáticamente)
              </span>
            </label>
            <div className="grid grid-cols-2 gap-3">
              <input
                readOnly
                value={lat !== undefined ? lat : ''}
                placeholder="Latitud"
                className={`${inputCls(!!errors.lat)} bg-slate-50 dark:bg-slate-700/50 cursor-not-allowed text-slate-500 dark:text-slate-400`}
              />
              <input
                readOnly
                value={lng !== undefined ? lng : ''}
                placeholder="Longitud"
                className={`${inputCls(!!errors.lng)} bg-slate-50 dark:bg-slate-700/50 cursor-not-allowed text-slate-500 dark:text-slate-400`}
              />
            </div>
            {coordsFound && (
              <div className="mt-2 flex items-center gap-2 px-3 py-2 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400 text-xs font-medium">
                <MapPin className="w-3.5 h-3.5 shrink-0" />
                Ubicación encontrada: {lat}, {lng}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-slate-100 dark:border-slate-700 shrink-0">
          <button
            onClick={handleClose}
            disabled={loading}
            className="flex items-center gap-1.5 px-4 py-2 rounded-full border border-slate-200 dark:border-slate-600 text-slate-500 dark:text-slate-400 text-sm font-semibold hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors disabled:opacity-50"
          >
            <X className="w-4 h-4" />
            Cancelar
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-primary text-white text-sm font-semibold hover:bg-accent transition-colors disabled:opacity-60"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Check className="w-4 h-4" />
            )}
            {loading ? 'Guardando...' : 'Guardar localidad'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateLocalidadModal;
