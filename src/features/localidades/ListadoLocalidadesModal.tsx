import React, { useEffect, useState } from 'react';
import { X, Pencil, Trash2, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import CreateLocalidadModal from '@/features/localidades/CreateLocalidadModal';
import { getProvinciaById, deleteLocalidad, getImageUrl } from '@/utils/api';

interface Localidad {
  id: number;
  nombre: string;
  imagen?: string;
  latitud?: number;
  longitud?: number;
}

interface Props {
  show: boolean;
  onHide: () => void;
  provinciaId: number;
}

const ListadoLocalidadesModal: React.FC<Props> = ({
  show,
  onHide,
  provinciaId,
}) => {
  const [localidades, setLocalidades] = useState<Localidad[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const navigate = useNavigate();

  const fetchLocalidades = async () => {
    try {
      const response = await getProvinciaById(provinciaId);
      if (response.success && response.data) {
        const provincia = response.data as { localidades?: Localidad[] };
        setLocalidades(provincia.localidades || []);
      }
    } catch (error) {
      console.error('Error al obtener las localidades:', error);
    }
  };

  useEffect(() => {
    if (show) fetchLocalidades();
  }, [show]);

  useEffect(() => {
    const reopenHandler = () => {
      const modal = document.getElementById('listadoLocalidadesTrigger');
      if (modal) modal.click();
    };
    window.addEventListener('reopenListadoLocalidades', reopenHandler);
    return () =>
      window.removeEventListener('reopenListadoLocalidades', reopenHandler);
  }, []);

  const handleEditar = (id: number) => {
    onHide();
    navigate(`/editLocalidad/${id}`);
  };

  const handleEliminar = async (id: number) => {
    if (!window.confirm('¿Seguro que querés eliminar esta localidad?')) return;
    try {
      const response = await deleteLocalidad(id);
      if (response.success) {
        setLocalidades((prev) => prev.filter((loc) => loc.id !== id));
      }
    } catch (error) {
      console.error('Error al eliminar la localidad:', error);
    }
  };

  const handleAbrirCrear = () => {
    onHide();
    setShowCreateModal(true);
  };

  const handleLocalidadCreada = async () => {
    setShowCreateModal(false);
    await fetchLocalidades();
    onHide();
    setTimeout(() => {
      const event = new CustomEvent('reopenListadoLocalidades');
      window.dispatchEvent(event);
    }, 200);
  };

  if (!show) return null;

  return (
    <>
      {/* Modal */}
      <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
        <div
          className="absolute inset-0 bg-black/40 backdrop-blur-sm"
          onClick={onHide}
        />
        <div className="relative bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-5xl max-h-[85vh] flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-700 shrink-0">
            <h3 className="font-bold text-slate-900 dark:text-slate-100 text-lg">
              Localidades de la provincia
            </h3>
            <button
              onClick={onHide}
              className="p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-400 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <div className="overflow-y-auto p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {localidades.map((loc) => (
                <div
                  key={loc.id}
                  className="bg-slate-50 dark:bg-slate-700/50 rounded-2xl overflow-hidden border border-slate-100 dark:border-slate-700 hover:shadow-md transition-shadow"
                >
                  {loc.imagen && (
                    <img
                      src={getImageUrl(loc.imagen)}
                      alt={loc.nombre}
                      className="w-full h-40 object-cover"
                    />
                  )}
                  <div className="p-4 flex items-center justify-between">
                    <span className="font-semibold text-slate-800 dark:text-slate-100 text-sm">
                      {loc.nombre}
                    </span>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleEditar(loc.id)}
                        className="p-1.5 rounded-full hover:bg-white dark:hover:bg-slate-600 text-slate-400 hover:text-primary transition-colors"
                        title="Editar"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleEliminar(loc.id)}
                        className="p-1.5 rounded-full hover:bg-red-50 dark:hover:bg-red-900/20 text-slate-400 hover:text-red-500 transition-colors"
                        title="Eliminar"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              {/* Card agregar */}
              <button
                onClick={handleAbrirCrear}
                className="flex flex-col items-center justify-center gap-3 h-48 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-700 hover:border-primary dark:hover:border-primary hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-all group"
              >
                <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-700 group-hover:bg-primary/10 flex items-center justify-center transition-colors">
                  <Plus className="w-6 h-6 text-slate-400 dark:text-slate-500 group-hover:text-primary transition-colors" />
                </div>
                <span className="text-sm font-semibold text-slate-400 dark:text-slate-500 group-hover:text-primary transition-colors">
                  Agregar nueva localidad
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <CreateLocalidadModal
        show={showCreateModal}
        onHide={() => setShowCreateModal(false)}
        provinciaId={provinciaId}
        onLocalidadCreada={handleLocalidadCreada}
      />
    </>
  );
};

export default ListadoLocalidadesModal;
