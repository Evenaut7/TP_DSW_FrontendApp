import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '@/features/user';
import { useCreatorPDI } from '@/features/creator/useCreatorPDI';
import { uploadImage, createPDI, updatePDI, deletePDI, API_BASE_URL } from '@/utils/api';
import type { PDI } from '@/types';
import type { PDIFormData } from '@/features/creator/CreatorPDIModal';

async function deleteImage(filename: string) {
  if (!filename) return;
  try {
    await fetch(`${API_BASE_URL}/api/imagenes/${filename}`, {
      method: 'DELETE',
      credentials: 'include',
    });
  } catch {}
}

export function useCreatorDashboard() {
  const navigate = useNavigate();
  const { user } = useUser();
  const { pdiList, loading, error, refetch } = useCreatorPDI();

  const [showPDIModal, setShowPDIModal] = useState(false);
  const [editingPDI, setEditingPDI] = useState<PDI | null>(null);
  const [pdiToDelete, setPdiToDelete] = useState<PDI | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [resultSuccess, setResultSuccess] = useState(false);
  const [resultMessage, setResultMessage] = useState('');
  const [submittingPDI, setSubmittingPDI] = useState(false);

  const handlePDISubmit = async (data: PDIFormData): Promise<boolean> => {
    if (!user) return false;
    setSubmittingPDI(true);

    try {
      let imagenNombre = '';

      if (data.imagen instanceof File) {
        const imagenAnterior = editingPDI?.imagen || undefined;
        const uploadRes = await uploadImage(data.imagen, imagenAnterior);

        if (!uploadRes.success || !uploadRes.data) {
          throw new Error(uploadRes.error || 'Error al subir la imagen');
        }
        imagenNombre = uploadRes.data.nombreArchivo || uploadRes.data.filename || '';
      } else if (typeof data.imagen === 'string') {
        imagenNombre = data.imagen;
      }

      const payload = {
        nombre: data.nombre,
        descripcion: data.descripcion,
        calle: data.calle,
        altura: Number(data.altura),
        lat: data.lat,
        lng: data.lng,
        localidad: Number(data.localidad),
        privado: Boolean(data.privado),
        imagen: imagenNombre,
        usuario: user.id,
        tags: data.tags,
      };

      const result = editingPDI ? await updatePDI(editingPDI.id, payload) : await createPDI(payload);

      if (!result.success) {
        setResultSuccess(false);
        setResultMessage(result.error || 'Error al guardar el PDI');
        setShowResult(true);
        return false;
      }

      setResultSuccess(true);
      setResultMessage(editingPDI ? 'PDI actualizado correctamente' : 'PDI creado correctamente');
      setShowResult(true);
      setEditingPDI(null);
      await refetch();
      return true;
    } catch (err) {
      setResultSuccess(false);
      setResultMessage(err instanceof Error ? err.message : 'Error desconocido');
      setShowResult(true);
      return false;
    } finally {
      setSubmittingPDI(false);
    }
  };

  const confirmDeletePDI = async () => {
    if (!pdiToDelete) return;
    const pdi = pdiToDelete;
    setPdiToDelete(null);

    try {
      // 1. Borrar imagen del servidor antes de eliminar el PDI
      await deleteImage(pdi.imagen);

      // 2. Eliminar el PDI
      const result = await deletePDI(pdi.id);

      if (!result.success) {
        setResultSuccess(false);
        setResultMessage(result.error || 'Error al eliminar el PDI');
        setShowResult(true);
        return;
      }

      setResultSuccess(true);
      setResultMessage('PDI eliminado correctamente');
      setShowResult(true);
      await refetch();
    } catch (err) {
      setResultSuccess(false);
      setResultMessage(err instanceof Error ? err.message : 'Error desconocido');
      setShowResult(true);
    }
  };

  const handleDeleteClick = (pdi: PDI) => setPdiToDelete(pdi);
  const handleCreatePDI = () => {
    setEditingPDI(null);
    setShowPDIModal(true);
  };
  const handleEditPDI = (pdi: PDI) => navigate(`/editPDI/${pdi.id}`);
  const handleAddEvent = (pdi: PDI) => navigate(`/creator/pdi/${pdi.id}/events`);
  const closePDIModal = () => {
    setShowPDIModal(false);
    setEditingPDI(null);
  };
  const closeResultModal = () => setShowResult(false);
  const cancelDeletePDI = () => setPdiToDelete(null);

  return {
    user,
    pdiList,
    loading,
    error,
    showPDIModal,
    editingPDI,
    pdiToDelete,
    showResult,
    resultSuccess,
    resultMessage,
    submittingPDI,
    handlePDISubmit,
    confirmDeletePDI,
    handleDeleteClick,
    handleCreatePDI,
    handleEditPDI,
    handleAddEvent,
    closePDIModal,
    closeResultModal,
    cancelDeletePDI,
  };
}
