import { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, MapPin, Check, X } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import { useProvinciaCRUD } from '@/features/provincias';
import type { Provincia } from '@/types';
import ListadoLocalidadesModal from '@/features/localidades/ListadoLocalidadesModal';
import { useAuthAdmin } from '@/features/auth';
import RedirectModal from '@/components/modals/RedirectModal';
import { useUser } from '@/features/user';

const inputCls =
  'w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100 text-sm focus:outline-none focus:border-primary transition-colors';

function CRUDProvincia() {
  const { isAdmin, loading } = useAuthAdmin();
  const { user } = useUser();
  const [showRedirect, setShowRedirect] = useState(false);
  const provinciasHook = useProvinciaCRUD();

  const {
    provincias,
    editingId,
    editNombre,
    addingNew,
    nuevoNombre,
    error,
    setEditNombre,
    setAddingNew,
    setNuevoNombre,
    handleEdit,
    handleCancelEdit,
    handleUpdate,
    handleDelete,
    handleCreate,
  } = provinciasHook;

  const [showLocalidadesModal, setShowLocalidadesModal] = useState(false);
  const [provActual, setProvActual] = useState<Provincia | null>(null);

  const handleShowLocalidades = (prov: Provincia) => {
    setProvActual(prov);
    setShowLocalidadesModal(true);
  };

  useEffect(() => {
    if (!loading && (!user || isAdmin === false)) {
      setShowRedirect(true);
    }
  }, [user, isAdmin, loading]);

  if (loading)
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center">
        <p className="text-slate-400">Cargando...</p>
      </div>
    );

  if (!user || isAdmin === false || showRedirect) {
    return (
      <>
        <Navbar />
        <RedirectModal show={true} />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 pt-32 pb-16 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              Provincias
            </h1>
            <p className="text-sm text-slate-400 dark:text-slate-500 mt-1">
              {provincias.length} provincias registradas
            </p>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 text-sm">
            <X className="w-4 h-4 shrink-0" />
            {error}
          </div>
        )}

        {/* Tabla */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-700">
                <th className="text-left px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-500 w-16">
                  ID
                </th>
                <th className="text-left px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-500">
                  Nombre
                </th>
                <th className="text-right px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-500">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
              {provincias.map((prov) => (
                <tr
                  key={prov.id}
                  className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
                >
                  <td className="px-6 py-4 text-slate-400 dark:text-slate-500 font-mono text-xs">
                    {prov.id}
                  </td>
                  <td className="px-6 py-4 text-slate-800 dark:text-slate-100 font-medium">
                    {editingId === prov.id ? (
                      <input
                        value={editNombre}
                        onChange={(e) => setEditNombre(e.target.value)}
                        onKeyDown={(e) =>
                          e.key === 'Enter' && handleUpdate(prov.id!)
                        }
                        className={inputCls}
                        autoFocus
                      />
                    ) : (
                      prov.nombre
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      {editingId === prov.id ? (
                        <>
                          <button
                            onClick={() => handleUpdate(prov.id!)}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary text-white text-xs font-semibold hover:bg-accent transition-colors"
                          >
                            <Check className="w-3.5 h-3.5" />
                            Guardar
                          </button>
                          <button
                            onClick={handleCancelEdit}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-slate-200 dark:border-slate-600 text-slate-500 dark:text-slate-400 text-xs font-semibold hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                          >
                            <X className="w-3.5 h-3.5" />
                            Cancelar
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => handleEdit(prov)}
                            className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-400 hover:text-primary transition-colors"
                            title="Editar"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(prov.id)}
                            className="p-2 rounded-full hover:bg-red-50 dark:hover:bg-red-900/20 text-slate-400 hover:text-red-500 transition-colors"
                            title="Eliminar"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleShowLocalidades(prov)}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-300 text-xs font-semibold hover:bg-slate-50 dark:hover:bg-slate-700 hover:border-primary hover:text-primary transition-colors"
                          >
                            <MapPin className="w-3.5 h-3.5" />
                            Localidades
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}

              {/* Fila agregar nueva */}
              <tr>
                <td colSpan={3} className="px-6 py-4">
                  {!addingNew ? (
                    <button
                      onClick={() => setAddingNew(true)}
                      className="flex items-center gap-2 text-sm text-slate-400 dark:text-slate-500 hover:text-primary dark:hover:text-primary transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                      Agregar provincia
                    </button>
                  ) : (
                    <div className="flex items-center gap-3">
                      <input
                        value={nuevoNombre}
                        onChange={(e) => setNuevoNombre(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
                        className={`${inputCls} max-w-xs`}
                        placeholder="Nombre de la provincia"
                        autoFocus
                      />
                      <button
                        onClick={handleCreate}
                        className="flex items-center gap-1.5 px-3 py-2 rounded-full bg-primary text-white text-xs font-semibold hover:bg-accent transition-colors"
                      >
                        <Check className="w-3.5 h-3.5" />
                        Agregar
                      </button>
                      <button
                        onClick={() => {
                          setAddingNew(false);
                          setNuevoNombre('');
                        }}
                        className="flex items-center gap-1.5 px-3 py-2 rounded-full border border-slate-200 dark:border-slate-600 text-slate-500 dark:text-slate-400 text-xs font-semibold hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                      >
                        <X className="w-3.5 h-3.5" />
                        Cancelar
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <ListadoLocalidadesModal
        show={showLocalidadesModal}
        onHide={() => setShowLocalidadesModal(false)}
        provinciaId={provActual?.id ?? 0}
        provinciaNombre={provActual?.nombre ?? ''}
      />
    </div>
  );
}

export default CRUDProvincia;
