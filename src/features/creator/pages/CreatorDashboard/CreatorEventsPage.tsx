import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Plus,
  Edit,
  Trash2,
  Calendar,
  Clock,
  Tag as TagIcon,
  X,
  Loader2,
  AlertTriangle,
} from 'lucide-react';
import Navbar from '@/components/layout/Navbar/Navbar';
import RedirectModal from '@/components/modals/RedirectModal/RedirectModal';
import { useUser } from '@/features/user';
import {
  useApiGet,
  useApiGetById,
  createEvento,
  updateEvento,
  deleteEvento,
} from '@/utils/api';
import TagsSelector from '@/features/tags/components/TagsSelector/TagsSelector';
import type { PDI, Evento, Tag } from '@/types';

interface EventoFormData {
  id?: number;
  titulo: string;
  descripcion: string;
  horaDesde: string;
  horaHasta: string;
  fecha: string;
  estado: string;
  tags: number[];
}

const ESTADOS = ['Disponible', 'Agotado', 'Cancelado'];

export default function CreatorEventsPage() {
  const { id } = useParams<{ id: string }>();
  const pdiId = id ? parseInt(id) : null;
  const navigate = useNavigate();
  const { user, loading: userLoading } = useUser();

  // Fetch Data
  const {
    data: pdiData,
    loading: loadingPDI,
    error: errorPDI,
    refetch,
  } = useApiGetById<{ eventos: Evento[]; nombre: string; usuario: number }>(
    '/api/puntosDeInteres',
    pdiId,
  );
  const { data: allTags } = useApiGet<Tag[]>('/api/tags');

  // Local State
  const [events, setEvents] = useState<Evento[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [eventToDelete, setEventToDelete] = useState<Evento | null>(null);

  // Form State
  const [form, setForm] = useState<EventoFormData>({
    titulo: '',
    descripcion: '',
    horaDesde: '',
    horaHasta: '',
    fecha: new Date().toISOString().split('T')[0],
    estado: 'Disponible',
    tags: [],
  });

  // Sincronizar eventos cuando cargan
  useEffect(() => {
    if (pdiData && Array.isArray((pdiData as any).eventos)) {
      setEvents((pdiData as any).eventos);
    }
  }, [pdiData]);

  // Helpers de fecha
  const formatTime = (isoString: string) => {
    if (!isoString) return '';
    const date = new Date(isoString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (isoString: string) => {
    if (!isoString) return '';
    return new Date(isoString).toLocaleDateString();
  };

  // Handlers
  const handleOpenCreate = () => {
    setForm({
      titulo: '',
      descripcion: '',
      horaDesde: '',
      horaHasta: '',
      fecha: new Date().toISOString().split('T')[0],
      estado: 'Disponible',
      tags: [],
    });
    setShowModal(true);
  };

  const handleOpenEdit = (evento: Evento) => {
    const fecha = evento.horaDesde
      ? new Date(evento.horaDesde).toISOString().split('T')[0]
      : new Date().toISOString().split('T')[0];

    const getTime = (iso?: string) => {
      if (!iso) return '';
      const d = new Date(iso);
      return d.toTimeString().slice(0, 5); // HH:mm
    };

    setForm({
      id: evento.id,
      titulo: evento.titulo,
      descripcion: evento.descripcion,
      horaDesde: getTime(evento.horaDesde),
      horaHasta: getTime(evento.horaHasta),
      fecha,
      estado: evento.estado || 'Disponible',
      tags: Array.isArray(evento.tags)
        ? evento.tags.map((t: any) => (typeof t === 'number' ? t : t.id))
        : [],
    });
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pdiId) return;
    setSubmitting(true);

    try {
      // Combinar fecha y hora
      const formatTimestamp = (timeStr: string) => {
        return `${form.fecha} ${timeStr}:00`;
      };

      const payload = {
        titulo: form.titulo,
        descripcion: form.descripcion,
        horaDesde: formatTimestamp(form.horaDesde),
        horaHasta: formatTimestamp(form.horaHasta),
        estado: form.estado, // ¡Aquí enviamos el estado corregido!
        tags: form.tags,
        puntoDeInteres: pdiId,
      };

      const result = form.id
        ? await updateEvento(form.id, payload)
        : await createEvento(payload);

      if (!result.success) {
        throw new Error(result.error || 'Error al guardar evento');
      }

      await refetch();
      setSubmitting(false);
      setShowModal(false);
    } catch (err: any) {
      alert(err.message);
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!eventToDelete) return;
    try {
      const res = await deleteEvento(eventToDelete.id);
      if (!res.success) throw new Error(res.error);
      setEvents((prev) => prev.filter((e) => e.id !== eventToDelete.id));
      setEventToDelete(null);
    } catch (err: any) {
      alert(err.message);
    }
  };

  if (loadingPDI || userLoading)
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="animate-spin w-8 h-8 text-blue-500" />
      </div>
    );

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

  if (errorPDI || !pdiData)
    return <div className="text-center mt-10">Error al cargar PDI</div>;

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

  const pdiNombre = (pdiData as any).nombre || 'PDI';

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
                {pdiNombre}
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
            events.map((evento) => (
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

      {/* Modal Formulario */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b border-slate-200 dark:border-slate-700 sticky top-0 bg-white dark:bg-slate-800 z-10">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                {form.id ? 'Editar Evento' : 'Nuevo Evento'}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Título
                </label>
                <input
                  type="text"
                  required
                  value={form.titulo}
                  onChange={(e) => setForm({ ...form, titulo: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Descripción
                </label>
                <textarea
                  required
                  rows={3}
                  value={form.descripcion}
                  onChange={(e) =>
                    setForm({ ...form, descripcion: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Fecha
                  </label>
                  <input
                    type="date"
                    required
                    value={form.fecha}
                    onChange={(e) =>
                      setForm({ ...form, fecha: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Estado
                  </label>
                  <select
                    value={form.estado}
                    onChange={(e) =>
                      setForm({ ...form, estado: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                  >
                    {ESTADOS.map((st) => (
                      <option key={st} value={st}>
                        {st}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Hora Inicio
                  </label>
                  <input
                    type="time"
                    required
                    value={form.horaDesde}
                    onChange={(e) =>
                      setForm({ ...form, horaDesde: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Hora Fin
                  </label>
                  <input
                    type="time"
                    required
                    value={form.horaHasta}
                    onChange={(e) =>
                      setForm({ ...form, horaHasta: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Etiquetas
                </label>
                <TagsSelector
                  tags={allTags || []}
                  selected={form.tags}
                  onChange={(e: any) => {
                    const val = parseInt(e.target.value);
                    const checked = e.target.checked;
                    setForm((prev) => ({
                      ...prev,
                      tags: checked
                        ? [...prev.tags, val]
                        : prev.tags.filter((t) => t !== val),
                    }));
                  }}
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-700">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg font-medium transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex items-center gap-2 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50"
                >
                  {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
                  Guardar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Eliminar */}
      {eventToDelete && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl max-w-sm w-full p-6">
            <div className="flex items-center gap-3 mb-4 text-red-600 dark:text-red-400">
              <AlertTriangle className="w-8 h-8" />
              <h3 className="text-lg font-bold">Eliminar Evento</h3>
            </div>
            <p className="text-slate-600 dark:text-slate-300 mb-6">
              ¿Estás seguro que deseas eliminar el evento "
              <strong>{eventToDelete.titulo}</strong>"?
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setEventToDelete(null)}
                className="px-4 py-2 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg font-medium"
              >
                Cancelar
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium"
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
