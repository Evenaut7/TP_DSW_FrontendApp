import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '@/features/user';
import { useCreatorPDI } from '@/features/creator/hooks/useCreatorPDI';
import { uploadImage, createPDI, updatePDI, deletePDI } from '@/utils/api';
import type { PDI } from '@/types';
import type { PDIFormData } from '@/features/creator/components/CreatorEventModal/CreatorPDIModal';

export function useCreatorDashboard() {
  const navigate = useNavigate();
  const { user } = useUser();
  const { pdiList, loading, error, refetch } = useCreatorPDI();

  // Modal states
  const [showPDIModal, setShowPDIModal] = useState(false);
  const [editingPDI, setEditingPDI] = useState<PDI | null>(null);
  const [pdiToDelete, setPdiToDelete] = useState<PDI | null>(null);

  // Result states
  const [showResult, setShowResult] = useState(false);
  const [resultSuccess, setResultSuccess] = useState(false);
  const [resultMessage, setResultMessage] = useState('');

  // Loading states
  const [submittingPDI, setSubmittingPDI] = useState(false);

  // Handle Create/Edit PDI
  const handlePDISubmit = async (data: PDIFormData): Promise<boolean> => {
    if (!user) return false;
    setSubmittingPDI(true);

    try {
      let imagenNombre = '';

      // 1. Si es un archivo nuevo, subirlo primero
      if (data.imagen instanceof File) {
        const uploadRes = await uploadImage(data.imagen);
        if (!uploadRes.success || !uploadRes.data) {
          throw new Error(uploadRes.error || 'Error al subir la imagen');
        }
        const uploadData = uploadRes.data;
        imagenNombre = uploadData.nombreArchivo || uploadData.filename || '';
      } else if (typeof data.imagen === 'string') {
        imagenNombre = data.imagen;
      }

      // 2. Enviar los datos del PDI como JSON
      const payload = {
        nombre: data.nombre,
        descripcion: data.descripcion,
        calle: data.calle,
        altura: Number(data.altura),
        localidad: Number(data.localidad),
        privado: Boolean(data.privado),
        imagen: imagenNombre,
        usuario: user.id,
      };

      const result = editingPDI
        ? await updatePDI(editingPDI.id, payload)
        : await createPDI(payload);

      if (!result.success) {
        setResultSuccess(false);
        setResultMessage(result.error || 'Error al guardar el PDI');
        setShowResult(true);
        return false;
      }

      setResultSuccess(true);
      setResultMessage(
        editingPDI
          ? 'PDI actualizado correctamente'
          : 'PDI creado correctamente',
      );
      setShowResult(true);
      setEditingPDI(null);
      await refetch();
      return true;
    } catch (err) {
      setResultSuccess(false);
      setResultMessage(
        err instanceof Error ? err.message : 'Error desconocido',
      );
      setShowResult(true);
      return false;
    } finally {
      setSubmittingPDI(false);
    }
  };

  // Handle Delete PDI
  const confirmDeletePDI = async () => {
    if (!pdiToDelete) return;
    const pdi = pdiToDelete;
    setPdiToDelete(null);

    try {
      const result = await deletePDI(pdi.id);

      if (!result.success) {
        setResultSuccess(false);
        const msg = result.error || 'Error al eliminar el PDI';
        setResultMessage(msg);
        setShowResult(true);
        return;
      }

      setResultSuccess(true);
      setResultMessage('PDI eliminado correctamente');
      setShowResult(true);
      await refetch();
    } catch (err) {
      setResultSuccess(false);
      setResultMessage(
        err instanceof Error ? err.message : 'Error desconocido',
      );
      setShowResult(true);
    }
  };

  const handleDeleteClick = (pdi: PDI) => {
    setPdiToDelete(pdi);
  };

  // Modal handlers
  const handleCreatePDI = () => {
    setEditingPDI(null);
    setShowPDIModal(true);
  };

  const handleEditPDI = (pdi: PDI) => {
    navigate(`/editPDI/${pdi.id}`);
  };

  const handleAddEvent = (pdi: PDI) => {
    navigate(`/creator/pdi/${pdi.id}/events`);
  };

  const closePDIModal = () => {
    setShowPDIModal(false);
    setEditingPDI(null);
  };

  const closeResultModal = () => {
    setShowResult(false);
  };

  const cancelDeletePDI = () => {
    setPdiToDelete(null);
  };

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
