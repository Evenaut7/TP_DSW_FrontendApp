import { useState, useEffect, type FormEvent } from 'react';
import { X, Loader2 } from 'lucide-react';
import type { PDI } from '@/types';
import { useProvinciasLocalidades } from '@/features/localidades';

interface CreatorPDIModalProps {
  show: boolean;
  pdi?: PDI | null;
  onClose: () => void;
  onSubmit: (data: PDIFormData) => Promise<boolean>;
  loading?: boolean;
}

export interface PDIFormData {
  nombre: string;
  descripcion: string;
  imagen?: File | string;
  calle: string;
  altura: number;
  localidad: number;
  privado: boolean;
}

export default function CreatorPDIModal({
  show,
  pdi,
  onClose,
  onSubmit,
  loading = false,
}: CreatorPDIModalProps) {
  const {
    provincias,
    getLocalidadesByProvincia,
    loading: loadingUbicaciones,
  } = useProvinciasLocalidades();
  const [localidades, setLocalidades] = useState<any[]>([]);
  const [selectedProvincia, setSelectedProvincia] = useState<number>(0);

  const [form, setForm] = useState<PDIFormData>({
    nombre: '',
    descripcion: '',
    calle: '',
    altura: 0,
    localidad: 0,
    privado: false,
  });

  const [imagePreview, setImagePreview] = useState<string>('');
  const [submitting, setSubmitting] = useState(false);

  // Inicializar con PDI existente
  useEffect(() => {
    if (pdi && show) {
      setForm({
        nombre: pdi.nombre,
        descripcion: pdi.descripcion,
        imagen: pdi.imagen,
        calle: pdi.calle,
        altura: pdi.altura,
        localidad: pdi.localidad?.id || 0,
        privado: pdi.privado || false,
      });
      setImagePreview(pdi.imagen);
    } else if (show) {
      setForm({
        nombre: '',
        descripcion: '',
        calle: '',
        altura: 0,
        localidad: 0,
        privado: false,
      });
      setImagePreview('');
    }
  }, [pdi, show]);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value, type } = e.target;

    if (type === 'checkbox') {
      setForm({
        ...form,
        [name]: (e.target as HTMLInputElement).checked,
      });
    } else if (type === 'number') {
      setForm({
        ...form,
        [name]: parseFloat(value) || 0,
      });
    } else {
      setForm({
        ...form,
        [name]: value,
      });
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setForm({
        ...form,
        imagen: file,
      });

      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleProvinciaChange = async (
    e: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    const provinciaId = parseInt(e.target.value);
    setSelectedProvincia(provinciaId);
    if (provinciaId) {
      const locs = await getLocalidadesByProvincia(provinciaId);
      setLocalidades(locs);
      setForm({ ...form, localidad: 0 });
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const success = await onSubmit(form);
      if (success) {
        onClose();
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 flex justify-between items-center p-6 border-b border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
            {pdi ? 'Editar Punto de Interés' : 'Crear Punto de Interés'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
            disabled={submitting}
          >
            <X className="w-6 h-6 text-slate-600 dark:text-slate-400" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Image */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-2">
              Imagen
            </label>
            <div className="border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-xl p-6 text-center hover:border-blue-500 transition-colors cursor-pointer">
              {imagePreview && (
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="max-w-full max-h-48 mx-auto mb-4 rounded-lg"
                />
              )}
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
                id="image-input"
              />
              <label htmlFor="image-input" className="cursor-pointer">
                <p className="text-slate-600 dark:text-slate-300">
                  {imagePreview ? 'Cambiar imagen' : 'Seleccionar imagen'}
                </p>
              </label>
            </div>
          </div>

          {/* Nombre */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-2">
              Nombre *
            </label>
            <input
              type="text"
              name="nombre"
              value={form.nombre}
              onChange={handleInputChange}
              placeholder="Nombre del PDI"
              required
              disabled={submitting}
              className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-slate-100 dark:disabled:bg-slate-600"
            />
          </div>

          {/* Descripción */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-2">
              Descripción *
            </label>
            <textarea
              name="descripcion"
              value={form.descripcion}
              onChange={handleInputChange}
              placeholder="Describe el punto de interés"
              rows={4}
              required
              disabled={submitting}
              className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-slate-100 dark:disabled:bg-slate-600"
            />
          </div>

          {/* Dirección */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-2">
                Calle *
              </label>
              <input
                type="text"
                name="calle"
                value={form.calle}
                onChange={handleInputChange}
                placeholder="Nombre de la calle"
                required
                disabled={submitting}
                className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-slate-100 dark:disabled:bg-slate-600"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-2">
                Altura *
              </label>
              <input
                type="number"
                name="altura"
                value={form.altura}
                onChange={handleInputChange}
                placeholder="0"
                required
                disabled={submitting}
                className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-slate-100 dark:disabled:bg-slate-600"
              />
            </div>
          </div>

          {/* Provincia y Localidad */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-2">
                Provincia *
              </label>
              <select
                value={selectedProvincia}
                onChange={handleProvinciaChange}
                required
                disabled={submitting || loadingUbicaciones}
                className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-slate-100 dark:disabled:bg-slate-600"
              >
                <option value="">Seleccionar provincia</option>
                {provincias.map((prov) => (
                  <option key={prov.id} value={prov.id}>
                    {prov.nombre}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-2">
                Localidad *
              </label>
              <select
                name="localidad"
                value={form.localidad}
                onChange={handleInputChange}
                required
                disabled={submitting || !selectedProvincia}
                className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-slate-100 dark:disabled:bg-slate-600"
              >
                <option value="">Seleccionar localidad</option>
                {localidades.map((loc) => (
                  <option key={loc.id} value={loc.id}>
                    {loc.nombre}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Privado */}
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="privado"
              name="privado"
              checked={form.privado}
              onChange={handleInputChange}
              disabled={submitting}
              className="w-5 h-5 rounded cursor-pointer"
            />
            <label
              htmlFor="privado"
              className="text-slate-700 dark:text-slate-200 font-medium"
            >
              Este PDI es privado
            </label>
          </div>

          {/* Actions */}
          <div className="flex gap-3 justify-end pt-4 border-t border-slate-200 dark:border-slate-700">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white rounded-lg font-medium hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors disabled:opacity-50"
              disabled={submitting}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-colors disabled:opacity-50 flex items-center gap-2"
              disabled={submitting || loading}
            >
              {submitting || loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Guardando...
                </>
              ) : (
                'Guardar'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
