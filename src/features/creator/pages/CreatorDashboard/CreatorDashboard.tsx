import { Plus, Loader2 } from 'lucide-react';
import Navbar from '@/components/layout/Navbar/Navbar';
import RedirectModal from '@/components/modals/RedirectModal/RedirectModal';
import ResultModal from '@/components/modals/ResultModal/ResultModal';
import PDIListItem from '@/components/PDI/PDIListItem';
import CreatorPDIModal from '@/features/creator/components/CreatorEventModal/CreatorPDIModal';
import { useCreatorDashboard } from '@/features/creator/hooks/useCreatorDashboard';
import DeletePDIConfirmationModal from '@/features/creator/components/CreatorEventModal/DeletePDIConfirmationModal';

export default function CreatorDashboard() {
  const {
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
  } = useCreatorDashboard();

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
                onAddEvent={() => handleAddEvent(pdi)}
              />
            ))}
          </div>
        )}
      </main>

      {/* Modals */}
      <CreatorPDIModal
        show={showPDIModal}
        pdi={editingPDI}
        onClose={closePDIModal}
        onSubmit={handlePDISubmit}
        loading={submittingPDI}
      />

      <ResultModal
        show={showResult}
        success={resultSuccess}
        message={resultMessage}
        onClose={closeResultModal}
      />

      {pdiToDelete && (
        <DeletePDIConfirmationModal
          pdi={pdiToDelete}
          onConfirm={confirmDeletePDI}
          onCancel={cancelDeletePDI}
        />
      )}
    </div>
  );
}
