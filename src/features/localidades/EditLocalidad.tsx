import { useEffect, useMemo, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ChevronLeft,
  RotateCcw,
  Save,
  Plus,
  Pencil,
  CheckCircle,
  AlertCircle,
} from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Estrellas from '@/components/ui/Estrellas';
import PantallaDeCarga from '@/components/ui/PantallaDeCarga';
import PDIListItem from '@/components/PDI/PDIListItem';
import {
  API_BASE_URL,
  createPDI,
  uploadImage,
  useApiGet,
  updateLocalidad,
  getImageUrl,
} from '@/utils/api';
import type { PDI as PDIType, Provincia, Localidad } from '@/types';
import { useAuthAdmin } from '@/features/auth';
import CreatorPDIModal, {
  type PDIFormData,
} from '@/features/creator/CreatorPDIModal';

const inputInlineCls =
  'w-full bg-transparent border-b-2 border-transparent hover:border-slate-300 dark:hover:border-slate-600 focus:border-primary dark:focus:border-primary outline-none transition-colors';

export default function EditLocalidad() {
  const { id } = useParams<{ id: string }>();
  const localidadId = id ? parseInt(id, 10) : null;
  const navigate = useNavigate();

  const { isAdmin, loading: loadingAuth, error: errorAuth } = useAuthAdmin();
  const { data: usuarios } = useApiGet<any[]>('/api/usuarios');

  const [localidad, setLocalidad] = useState<Localidad | null>(null);
  const originalRef = useRef<Localidad | null>(null);
  const [provincias, setProvincias] = useState<Provincia[]>([]);
  const [loadingLocalidad, setLoadingLocalidad] = useState(true);
  const [imagenFile, setImagenFile] = useState<File | null>(null);
  const [guardando, setGuardando] = useState(false);
  const [mensaje, setMensaje] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [showCreatePDIModal, setShowCreatePDIModal] = useState(false);

  // ── Carga inicial ──
  useEffect(() => {
    if (!localidadId) return;
    setLoadingLocalidad(true);

    const fetchAll = async () => {
      try {
        const [locRes, provRes] = await Promise.all([
          fetch(`${API_BASE_URL}/api/localidades/${localidadId}`, {
            credentials: 'include',
          }),
          fetch(`${API_BASE_URL}/api/provincias`, { credentials: 'include' }),
        ]);

        if (!locRes.ok) {
          const errJson = await locRes.json().catch(() => null);
          throw new Error(
            errJson?.message ?? `Error ${locRes.status} al obtener localidad`,
          );
        }
        if (!provRes.ok) {
          const errJson = await provRes.json().catch(() => null);
          throw new Error(
            errJson?.message ?? `Error ${provRes.status} al obtener provincias`,
          );
        }

        const locJson = await locRes.json();
        const provJson = await provRes.json();
        const locData = locJson.data ?? locJson;
        const provData = provJson.data ?? provJson;

        setLocalidad(locData);
        originalRef.current = JSON.parse(JSON.stringify(locData));
        setProvincias(Array.isArray(provData) ? provData : []);
        setErrorMsg(null);
      } catch (err: any) {
        setErrorMsg(err.message ?? 'Error inesperado al cargar datos');
      } finally {
        setLoadingLocalidad(false);
      }
    };

    fetchAll();
  }, [localidadId]);

  const initialPdiData = useMemo<Partial<PDIFormData>>(() => {
    if (!localidad) return {};
    return {
      provincia: localidad.provincia?.id,
      localidad: localidad.id,
      provinciaNombre: localidad.provincia?.nombre,
      localidadNombre: localidad.nombre,
    };
  }, [localidad]);

  // ── Guards ──
  if (loadingLocalidad)
    return <PantallaDeCarga mensaje="Cargando localidad..." />;
  if (loadingAuth) return <PantallaDeCarga mensaje="Verificando acceso..." />;
  if (errorAuth)
    return <p className="text-center mt-4 text-red-500">{errorAuth}</p>;
  if (isAdmin === false)
    return (
      <p className="text-center mt-4 text-yellow-500">
        No podés acceder a esta página
      </p>
    );
  if (errorMsg && !localidad)
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center">
        <p className="text-red-500">Error: {errorMsg}</p>
      </div>
    );
  if (!localidad)
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center">
        <p className="text-slate-500">No se encontró la localidad</p>
      </div>
    );

  // ── Handlers ──
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setLocalidad((prev) => (prev ? { ...prev, [name]: value } : prev));
  };

  const handleProvinciaChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const idProv = Number(e.target.value);
    const prov = provincias.find((p) => p.id === idProv) ?? undefined;
    setLocalidad((prev) => (prev ? { ...prev, provincia: prov as any } : prev));
  };

  const handleImagenChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setImagenFile(e.target.files?.[0] ?? null);
  };

  const handleRestore = () => {
    if (originalRef.current) {
      setLocalidad(JSON.parse(JSON.stringify(originalRef.current)));
      setImagenFile(null);
      setMensaje('Se restauraron los valores originales');
      setTimeout(() => setMensaje(null), 1500);
    }
  };

  const handleCancel = () => navigate('/provincias');

  const refetchLocalidad = async () => {
    if (!localidadId) return;
    try {
      const locRes = await fetch(
        `${API_BASE_URL}/api/localidades/${localidadId}`,
        { credentials: 'include' },
      );
      if (!locRes.ok) throw new Error('Failed to refetch localidad');
      const locJson = await locRes.json();
      const locData = locJson.data ?? locJson;
      setLocalidad(locData);
      originalRef.current = JSON.parse(JSON.stringify(locData));
    } catch (error) {
      console.error('Error refetching localidad:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setGuardando(true);
    setMensaje(null);
    setErrorMsg(null);

    try {
      let imagenNombre = localidad.imagen ?? '';

      if (imagenFile instanceof File) {
        const fd = new FormData();
        fd.append('imagen', imagenFile);
        const uploadRes = await fetch(`${API_BASE_URL}/api/imagenes`, {
          method: 'POST',
          body: fd,
          credentials: 'include',
        });
        if (!uploadRes.ok) throw new Error('Error al subir imagen');
        const uploadJson = await uploadRes.json();
        imagenNombre = uploadJson.nombreArchivo ?? imagenNombre;
      }

      const payload = {
        nombre: localidad.nombre,
        descripcion: localidad.descripcion ?? '',
        imagen: imagenNombre,
        provincia: localidad.provincia?.id ?? null,
      };

      const result = await updateLocalidad(localidadId!, payload);
      if (!result.success)
        throw new Error(result.error ?? 'Error al actualizar');

      const updatedData = result.data as any;
      if (updatedData) {
        setLocalidad(updatedData);
        originalRef.current = JSON.parse(JSON.stringify(updatedData));
      }

      setMensaje('Localidad actualizada correctamente');
      setTimeout(() => {
        setMensaje(null);
        navigate(`/localidad/${localidadId}`);
      }, 900);
    } catch (err: any) {
      setErrorMsg(err.message ?? 'Error inesperado al guardar');
    } finally {
      setGuardando(false);
    }
  };

  const handleCreatePDISubmit = async (pdiFormData: PDIFormData) => {
    setGuardando(true);
    try {
      if (!pdiFormData.imagen || !(pdiFormData.imagen instanceof File)) {
        throw new Error('Tenés que seleccionar una imagen');
      }
      const uploadResult = await uploadImage(pdiFormData.imagen);
      if (!uploadResult.success || !uploadResult.data) {
        throw new Error(uploadResult.error || 'Error al subir imagen');
      }
      const imagenUrl =
        uploadResult.data.nombreArchivo || uploadResult.data.filename;
      if (!imagenUrl)
        throw new Error('No se pudo obtener el nombre de la imagen subida');

      const payload: any = {
        ...pdiFormData,
        imagen: imagenUrl,
        usuario: isAdmin ? pdiFormData.usuarioId : undefined,
      };

      const result = await createPDI(payload);
      if (!result.success)
        throw new Error(result.error || 'Error al crear el PDI');

      await refetchLocalidad();
      return true;
    } catch (err: any) {
      setErrorMsg(err.message ?? 'Error inesperado al crear PDI');
      return false;
    } finally {
      setGuardando(false);
    }
  };

  const handleDeletePDI = async (deletedPdi: PDIType) => {
    if (!confirm(`¿Eliminar el PDI "${deletedPdi.nombre}"?`)) return;
    try {
      const res = await fetch(
        `${API_BASE_URL}/api/puntosDeInteres/${deletedPdi.id}`,
        { method: 'DELETE', credentials: 'include' },
      );
      if (!res.ok) {
        const errJson = await res.json().catch(() => null);
        throw new Error(errJson?.message ?? 'Error al eliminar PDI');
      }
      setLocalidad((prev) =>
        prev
          ? {
              ...prev,
              puntosDeInteres: prev.puntosDeInteres?.filter(
                (x) => x.id !== deletedPdi.id,
              ),
            }
          : prev,
      );
    } catch (err: any) {
      alert(err.message ?? 'Error al eliminar PDI');
    }
  };

  const handleAddEvent = (pdi: PDIType) => {
    navigate(`/creator/pdi/${pdi.id}/events`);
  };

  // ── Render ──
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <Navbar />

      {/* ── Header editable ── */}
      <div className="w-full bg-gradient-to-br from-sky-50 via-blue-100 to-slate-50 dark:from-slate-900 dark:via-primary/30 dark:to-slate-800 pt-32 pb-14">
        <div className="max-w-6xl mx-auto px-4">
          {/* Volver */}
          <button
            onClick={handleCancel}
            className="flex items-center gap-1.5 text-sm text-slate-400 dark:text-slate-500 hover:text-primary dark:hover:text-white transition-colors mb-8"
          >
            <ChevronLeft className="w-4 h-4" />
            Volver a provincias
          </button>

          <form onSubmit={handleSubmit}>
            <div className="flex flex-col md:flex-row md:items-start gap-8 md:gap-12">
              {/* Izquierda — campos editables */}
              <div className="flex-1 space-y-5">
                <span className="inline-block px-2 py-0.5 rounded-full text-xs font-bold bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800">
                  MODO EDICIÓN
                </span>

                {/* Nombre */}
                <div className="flex items-end gap-2 max-w-lg">
                  <input
                    name="nombre"
                    value={localidad.nombre ?? ''}
                    onChange={handleInputChange}
                    required
                    className={`${inputInlineCls} text-5xl md:text-6xl font-extrabold tracking-tight leading-none text-slate-900 dark:text-white pb-1`}
                    placeholder="Nombre de la localidad"
                  />
                  <Pencil className="w-5 h-5 text-slate-400 dark:text-slate-500 mb-2 shrink-0" />
                </div>

                <Estrellas rating={3} reviews={37} />

                {/* Descripción */}
                <div className="flex items-start gap-2 max-w-lg">
                  <textarea
                    name="descripcion"
                    value={localidad.descripcion ?? ''}
                    onChange={handleInputChange}
                    rows={3}
                    className={`${inputInlineCls} text-slate-500 dark:text-white/75 text-base leading-relaxed resize-none`}
                    placeholder="Descripción de la localidad..."
                  />
                  <Pencil className="w-4 h-4 text-slate-400 dark:text-slate-500 mt-1 shrink-0" />
                </div>

                {/* Provincia */}
                <div className="flex flex-col gap-1.5">
                  <span className="text-xs font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-500 flex items-center gap-1.5">
                    <Pencil className="w-3 h-3" />
                    Modificar provincia
                  </span>
                  <select
                    value={localidad.provincia?.id ?? 0}
                    onChange={handleProvinciaChange}
                    className="bg-white/60 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-600 rounded-full px-4 py-1.5 text-sm text-slate-700 dark:text-slate-200 focus:outline-none focus:border-primary transition-colors"
                  >
                    <option value={0}>Seleccioná una provincia</option>
                    {provincias.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.nombre}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Feedback */}
                {mensaje && (
                  <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-400 text-sm max-w-lg">
                    <CheckCircle className="w-4 h-4 shrink-0" />
                    {mensaje}
                  </div>
                )}
                {errorMsg && (
                  <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 text-sm max-w-lg">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    {errorMsg}
                  </div>
                )}

                {/* Botones */}
                <div className="flex flex-wrap gap-3 pt-1">
                  <button
                    type="submit"
                    disabled={guardando}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary text-white font-semibold hover:bg-accent transition-colors text-sm disabled:opacity-50"
                  >
                    <Save className="w-4 h-4" />
                    {guardando ? 'Guardando...' : 'Guardar cambios'}
                  </button>
                  <button
                    type="button"
                    onClick={handleRestore}
                    disabled={guardando}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-full border border-slate-300 dark:border-slate-600 text-slate-600 dark:text-slate-300 font-semibold hover:bg-slate-50 dark:hover:bg-slate-700/50 bg-white/60 dark:bg-slate-800/60 transition-colors text-sm disabled:opacity-50"
                  >
                    <RotateCcw className="w-4 h-4" />
                    Restaurar
                  </button>
                  <button
                    type="button"
                    onClick={handleCancel}
                    disabled={guardando}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-full border border-red-200 dark:border-red-800 text-red-500 dark:text-red-400 font-semibold hover:bg-red-50 dark:hover:bg-red-900/20 bg-white/60 dark:bg-slate-800/60 transition-colors text-sm disabled:opacity-50"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    Cancelar
                  </button>
                </div>
              </div>

              {/* Derecha — imagen */}
              <div className="w-full md:w-80 lg:w-96 flex-shrink-0">
                <div className="relative rounded-2xl overflow-hidden shadow-xl aspect-[4/3] ring-1 ring-slate-200 dark:ring-white/10">
                  <img
                    src={
                      imagenFile
                        ? URL.createObjectURL(imagenFile)
                        : getImageUrl(localidad.imagen)
                    }
                    alt={localidad.nombre}
                    className="w-full h-full object-cover"
                  />
                  <label className="absolute bottom-3 right-3 flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/50 hover:bg-black/70 text-white text-xs font-medium cursor-pointer transition-colors backdrop-blur-sm">
                    <Pencil className="w-3.5 h-3.5" />
                    Cambiar imagen
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImagenChange}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>

      {/* ── Separador ── */}
      <div className="w-full h-8 bg-gradient-to-b from-blue-50 to-slate-100 dark:from-slate-800 dark:to-slate-900" />

      {/* ── Sección PDIs ── */}
      <div className="w-full bg-slate-100 dark:bg-slate-900 py-10 md:py-16">
        <div className="max-w-6xl mx-auto px-4 space-y-6">
          <div className="space-y-1">
            <h2 className="text-2xl md:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100">
              Puntos de Interés
            </h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm">
              {localidad.puntosDeInteres?.length ?? 0} PDIs en{' '}
              {localidad.nombre}
            </p>
          </div>

          {/* Buscador */}
          <input
            className="w-full md:max-w-md px-4 py-3 rounded-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
            placeholder="Buscar un Punto de Interés..."
          />

          {/* Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {localidad.puntosDeInteres?.map((pdi) => (
              <PDIListItem
                key={pdi.id}
                pdi={pdi}
                onEdit={() => navigate(`/editPDI/${pdi.id}`)}
                onDelete={handleDeletePDI}
                onAddEvent={handleAddEvent}
              />
            ))}

            {/* Card agregar */}
            <button
              type="button"
              onClick={() => setShowCreatePDIModal(true)}
              className="flex flex-col items-center justify-center gap-3 h-48 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-700 hover:border-primary dark:hover:border-primary hover:bg-white dark:hover:bg-slate-800/50 transition-all group"
            >
              <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-700 group-hover:bg-primary/10 flex items-center justify-center transition-colors">
                <Plus className="w-6 h-6 text-slate-400 dark:text-slate-500 group-hover:text-primary transition-colors" />
              </div>
              <span className="text-sm font-semibold text-slate-400 dark:text-slate-500 group-hover:text-primary transition-colors">
                Agregar nuevo PDI
              </span>
            </button>
          </div>
        </div>
      </div>

      {showCreatePDIModal && (
        <CreatorPDIModal
          show={showCreatePDIModal}
          onClose={() => setShowCreatePDIModal(false)}
          onSubmit={handleCreatePDISubmit}
          isAdmin={isAdmin ?? false}
          usuarios={usuarios ?? []}
          loading={guardando}
          initialData={initialPdiData}
        />
      )}
    </div>
  );
}
