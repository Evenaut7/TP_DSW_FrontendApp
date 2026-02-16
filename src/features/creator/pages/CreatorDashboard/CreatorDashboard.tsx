import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Loader2, AlertTriangle } from 'lucide-react';
import Navbar from '@/components/layout/Navbar/Navbar';
import RedirectModal from '@/components/modals/RedirectModal/RedirectModal';
import ResultModal from '@/components/modals/ResultModal/ResultModal';
import { useUser } from '@/features/user';
import { useCreatorPDI } from '@/features/creator/hooks/useCreatorPDI';
import { uploadImage, createPDI, updatePDI, deletePDI } from '@/utils/api';
import PDIListItem from '@/components/PDI/PDIListItem';
import CreatorPDIModal from '@/features/creator/components/CreatorPDIModal/CreatorPDIModal';
import type { PDI } from '@/types';
import type { PDIFormData } from '@/features/creator/components/CreatorPDIModal/CreatorPDIModal';

export default function CreatorDashboard() {
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

  // Redirect if not logged in
  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
        <Navbar />
        <RedirectModal
          show={true}
          title="Acceso Restringido"
          message="Debes iniciar sesión para acceder a tu panel de creador"
          buttonText="Ir al inicio"
          redirectTo="/"
        />
      </div>
    );
  }

  // Redirect if not a creator
  if (user.tipo !== 'creador') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
        <Navbar />
        <RedirectModal
          show={true}
          title="Acceso Restringido"
          message="Solo usuarios creadores pueden acceder a este panel"
          buttonText="Ir al inicio"
          redirectTo="/"
        />
      </div>
    );
  }

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
        // La función uploadImage ya maneja la respuesta, pero nos aseguramos de obtener el nombre
        const uploadData = uploadRes.data;
        imagenNombre = uploadData.nombreArchivo || uploadData.filename || '';
      } else if (typeof data.imagen === 'string') {
        // Si ya es un string (edición sin cambios de imagen), lo mantenemos
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 sm:pt-24 pb-12">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Mi Panel de Creador
            </h1>
            <p className="mt-2 text-lg text-slate-600 dark:text-slate-300">
              Gestiona tus puntos de interés y eventos
            </p>
          </div>
          <button
            onClick={handleCreatePDI}
            className="flex items-center gap-2 px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-xl font-semibold transition-colors whitespace-nowrap"
          >
            <Plus className="w-5 h-5" />
            Nuevo PDI
          </button>
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-16">
            <Loader2 className="w-10 h-10 text-blue-500 animate-spin mb-3" />
            <p className="text-slate-600 dark:text-slate-300">
              Cargando tus puntos de interés...
            </p>
          </div>
        ) : error ? (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 text-red-800 dark:text-red-200">
            <p className="font-semibold">⚠️ Error: {error}</p>
          </div>
        ) : pdiList.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🏛️</div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
              Sin puntos de interés
            </h2>
            <p className="text-slate-600 dark:text-slate-300 mb-6 max-w-md mx-auto">
              Comienza creando tu primer punto de interés para gestionar eventos
            </p>
            <button
              onClick={handleCreatePDI}
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-xl font-semibold transition-colors"
            >
              <Plus className="w-5 h-5" />
              Crear Mi Primer PDI
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pdiList.map((pdi) => (
              <PDIListItem
                key={pdi.id}
                pdi={pdi}
                onEdit={() => handleEditPDI(pdi)}
                onDelete={handleDeleteClick}
                onAddEvent={handleAddEvent}
              />
            ))}
          </div>
        )}
      </main>

      {/* Modals */}
      <CreatorPDIModal
        show={showPDIModal}
        pdi={editingPDI}
        onClose={() => {
          setShowPDIModal(false);
          setEditingPDI(null);
        }}
        onSubmit={handlePDISubmit}
        loading={submittingPDI}
      />

      <ResultModal
        show={showResult}
        success={resultSuccess}
        message={resultMessage}
        onClose={() => setShowResult(false)}
      />

      {/* Delete Confirmation Modal */}
      {pdiToDelete && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl max-w-md w-full p-6 transform transition-all">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded-full">
                <AlertTriangle className="w-6 h-6 text-red-600 dark:text-red-400" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                ¿Eliminar PDI?
              </h3>
            </div>

            <p className="text-slate-600 dark:text-slate-300 mb-6">
              ¿Estás seguro que deseas eliminar{' '}
              <strong>"{pdiToDelete.nombre}"</strong>? Esta acción no se puede
              deshacer y eliminará todos los eventos asociados.
            </p>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setPdiToDelete(null)}
                className="px-4 py-2 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg font-medium transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={confirmDeletePDI}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
