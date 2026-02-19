import {
  ArrowLeft,
  Plus,
  Edit,
  Trash2,
  Calendar,
  Clock,
  Tag as TagIcon,
  Loader2,
} from 'lucide-react';
import Navbar from '@/components/layout/Navbar/Navbar';
import RedirectModal from '@/components/modals/RedirectModal/RedirectModal';
import CreatorEventModal from '@/features/creator/components/CreatorEventModal/CreatorEventModal';
import DeleteEventConfirmationModal from '@/features/creator/components/CreatorEventModal/DeleteEventConfirmationModal.tsx';
import { useCreatorEventsPage } from '@/features/creator/hooks/useCreatorEventsPage';
import type { Evento } from '@/types';

export default function CreatorEventsPage() {
  const {
    pdiData,
    pdiLoading,
    pdiError,
    events,
    allTags,
    user,
    navigate,
    showModal,
    submitting,
    editingEvent,
    eventToDelete,
    setEventToDelete,
    handleOpenCreate,
    handleOpenEdit,
    handleCloseModal,
    handleEventSubmit,
    handleDeleteConfirm,
  } = useCreatorEventsPage();

  // Helpers de fecha y hora
  const formatTime = (isoString?: string) => {
    if (!isoString) return '';
    return new Date(isoString).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatDate = (isoString?: string) => {
    if (!isoString) return '';
    return new Date(isoString).toLocaleDateString();
  };

  if (pdiLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="animate-spin w-8 h-8 text-blue-500" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 pb-12">
        <Navbar />
        <RedirectModal
          show={true}
          title="Acceso Restringido"
          message="Debes iniciar sesión para administrar eventos."
          buttonText="Ir al inicio"
          redirectTo="/"
        />
      </div>
    );
  }

  if (pdiError || !pdiData) {
    return (
      <div className="text-center mt-10">Error al cargar PDI: {pdiError}</div>
    );
  }

  // Verificar propiedad del PDI
  if (pdiData.usuario !== user.id) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 pb-12">
        <Navbar />
        <RedirectModal
          show={true}
          title="Acceso Denegado"
          message="No tienes permiso para administrar los eventos de este PDI."
          buttonText="Volver al Dashboard"
          redirectTo="/creator"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 pb-12">
      <Navbar />

      <div className="max-w-5xl mx-auto px-4 pt-24">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/creator')}
            className="flex items-center text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 mb-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Volver al Dashboard
          </button>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
                Administrar Eventos
              </h1>
              <p className="text-slate-600 dark:text-slate-400 mt-1">
                {pdiData.nombre}
              </p>
            </div>
            <button
              onClick={handleOpenCreate}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors shadow-sm"
            >
              <Plus className="w-5 h-5" />
              Nuevo Evento
            </button>
          </div>
        </div>

        {/* Lista de Eventos */}
        <div className="grid gap-4">
          {events.length === 0 ? (
            <div className="text-center py-12 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 border-dashed">
              <Calendar className="w-12 h-12 mx-auto text-slate-300 mb-3" />
              <p className="text-slate-500">No hay eventos creados aún.</p>
            </div>
          ) : (
            events.map((evento: Evento) => (
              <div
                key={evento.id}
                className="bg-white dark:bg-slate-800 p-5 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 flex flex-col md:flex-row gap-4 justify-between"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                      {evento.titulo}
                    </h3>
                    <span
                      className={`px-2 py-0.5 text-xs font-medium rounded-full ${
                        evento.estado === 'Disponible'
                          ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                          : evento.estado === 'Agotado'
                            ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400'
                            : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                      }`}
                    >
                      {evento.estado}
                    </span>
                  </div>
                  <p className="text-slate-600 dark:text-slate-300 mb-4 line-clamp-2">
                    {evento.descripcion}
                  </p>
                  <div className="flex flex-wrap gap-4 text-sm text-slate-500 dark:text-slate-400">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-4 h-4" />
                      {formatDate(evento.horaDesde)}
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-4 h-4" />
                      {formatTime(evento.horaDesde)} -{' '}
                      {formatTime(evento.horaHasta)}
                    </div>
                    {evento.tags && evento.tags.length > 0 && (
                      <div className="flex items-center gap-1.5">
                        <TagIcon className="w-4 h-4" />
                        {evento.tags.length} tags
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex md:flex-col gap-2 justify-center border-t md:border-t-0 md:border-l border-slate-100 dark:border-slate-700 pt-4 md:pt-0 md:pl-4">
                  <button
                    onClick={() => handleOpenEdit(evento)}
                    className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 rounded-lg transition-colors text-sm font-medium"
                  >
                    <Edit className="w-4 h-4" />
                    Editar
                  </button>
                  <button
                    onClick={() => setEventToDelete(evento)}
                    className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/40 rounded-lg transition-colors text-sm font-medium"
                  >
                    <Trash2 className="w-4 h-4" />
                    Eliminar
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Modals */}
      <CreatorEventModal
        show={showModal}
        pdi={pdiData}
        evento={editingEvent}
        onClose={handleCloseModal}
        onSubmit={handleEventSubmit}
        loading={submitting}
        allTags={allTags || []}
      />

      {eventToDelete && (
        <DeleteEventConfirmationModal
          evento={eventToDelete}
          onConfirm={handleDeleteConfirm}
          onCancel={() => setEventToDelete(null)}
        />
      )}
    </div>
  );
}
