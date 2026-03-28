import { useEffect, useMemo, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { API_BASE_URL, createPDI, uploadImage, useApiGet, updateLocalidad } from '@/utils/api';
import type { PDI as PDIType, Provincia, Localidad } from '@/types';
import { useAuthAdmin } from '@/features/auth';
import type { PDIFormData } from '@/features/creator/CreatorPDIModal';

async function deleteImage(filename: string) {
  if (!filename) return;
  try {
    await fetch(`${API_BASE_URL}/api/imagenes/${filename}`, {
      method: 'DELETE',
      credentials: 'include',
    });
  } catch {
    // silencioso
  }
}

export function useEditLocalidad() {
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

  // ── Carga inicial ─────────────────────────────────────────────────────────
  useEffect(() => {
    if (!localidadId) return;
    setLoadingLocalidad(true);

    const fetchAll = async () => {
      try {
        const [locRes, provRes] = await Promise.all([
          fetch(`${API_BASE_URL}/api/localidades/${localidadId}`, { credentials: 'include' }),
          fetch(`${API_BASE_URL}/api/provincias`, { credentials: 'include' }),
        ]);

        if (!locRes.ok) {
          const errJson = await locRes.json().catch(() => null);
          throw new Error(errJson?.message ?? `Error ${locRes.status} al obtener localidad`);
        }
        if (!provRes.ok) {
          const errJson = await provRes.json().catch(() => null);
          throw new Error(errJson?.message ?? `Error ${provRes.status} al obtener provincias`);
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

  // ── Refetch ───────────────────────────────────────────────────────────────
  const refetchLocalidad = async () => {
    if (!localidadId) return;
    try {
      const locRes = await fetch(`${API_BASE_URL}/api/localidades/${localidadId}`, { credentials: 'include' });
      if (!locRes.ok) throw new Error('Failed to refetch localidad');
      const locJson = await locRes.json();
      const locData = locJson.data ?? locJson;
      setLocalidad(locData);
      originalRef.current = JSON.parse(JSON.stringify(locData));
    } catch (error) {
      console.error('Error refetching localidad:', error);
    }
  };

  // ── Handlers ─────────────────────────────────────────────────────────────
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!localidad) return;
    setGuardando(true);
    setMensaje(null);
    setErrorMsg(null);

    try {
      let imagenNombre = localidad.imagen ?? '';

      if (imagenFile instanceof File) {
        const fd = new FormData();
        fd.append('imagen', imagenFile);
        const imagenAnterior = localidad.imagen;
        const uploadRes = await fetch(
          imagenAnterior ? `${API_BASE_URL}/api/imagenes/${imagenAnterior}` : `${API_BASE_URL}/api/imagenes`,
          { method: imagenAnterior ? 'PUT' : 'POST', body: fd, credentials: 'include' },
        );
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
      if (!result.success) throw new Error(result.error ?? 'Error al actualizar');

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

  const handleCreatePDISubmit = async (pdiFormData: PDIFormData): Promise<boolean> => {
    setGuardando(true);
    try {
      if (!pdiFormData.imagen || !(pdiFormData.imagen instanceof File)) {
        throw new Error('Tenés que seleccionar una imagen');
      }
      const uploadResult = await uploadImage(pdiFormData.imagen);
      if (!uploadResult.success || !uploadResult.data) {
        throw new Error(uploadResult.error || 'Error al subir imagen');
      }
      const imagenUrl = uploadResult.data.nombreArchivo || uploadResult.data.filename;
      if (!imagenUrl) throw new Error('No se pudo obtener el nombre de la imagen subida');

      const payload: any = {
        ...pdiFormData,
        imagen: imagenUrl,
        usuario: isAdmin ? pdiFormData.usuarioId : undefined,
      };

      const result = await createPDI(payload);
      if (!result.success) throw new Error(result.error || 'Error al crear el PDI');

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
      await deleteImage(deletedPdi.imagen);
      const res = await fetch(`${API_BASE_URL}/api/puntosDeInteres/${deletedPdi.id}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      if (!res.ok) {
        const errJson = await res.json().catch(() => null);
        throw new Error(errJson?.message ?? 'Error al eliminar PDI');
      }
      setLocalidad((prev) =>
        prev ? { ...prev, puntosDeInteres: prev.puntosDeInteres?.filter((x) => x.id !== deletedPdi.id) } : prev,
      );
    } catch (err: any) {
      alert(err.message ?? 'Error al eliminar PDI');
    }
  };

  const handleAddEvent = (pdi: PDIType) => navigate(`/creator/pdi/${pdi.id}/events`);

  // ── Valores derivados ─────────────────────────────────────────────────────
  const previewUrl = imagenFile
    ? URL.createObjectURL(imagenFile)
    : localidad?.imagen
      ? `${API_BASE_URL}/public/${localidad.imagen}`
      : '';

  return {
    // auth
    isAdmin,
    loadingAuth,
    errorAuth,
    // estado
    localidad,
    provincias,
    guardando,
    mensaje,
    errorMsg,
    loadingLocalidad,
    imagenFile,
    showCreatePDIModal,
    setShowCreatePDIModal,
    // datos derivados
    initialPdiData,
    previewUrl,
    usuarios,
    // handlers
    handleInputChange,
    handleProvinciaChange,
    handleImagenChange,
    handleRestore,
    handleCancel,
    handleSubmit,
    handleCreatePDISubmit,
    handleDeletePDI,
    handleAddEvent,
  };
}
