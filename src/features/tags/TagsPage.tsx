import { useState, useEffect, useMemo } from 'react';
import {
  Plus,
  Pencil,
  Trash2,
  Check,
  X,
  Search,
  ChevronDown,
  ChevronUp,
  Sun,
  Moon,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/layout/Navbar';
import { useTagCRUD } from '@/features/tags';
import { useAuthAdmin } from '@/features/auth';
import RedirectModal from '@/components/modals/RedirectModal';
import { useUser } from '@/features/user';
import { useTheme } from '@/context/ThemeContext';
import { filterPDIs, API_BASE_URL, getImageUrl } from '@/utils/api';
import type { PDI } from '@/types';

const inputCls =
  'w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100 text-sm focus:outline-none focus:border-primary transition-colors';

// ── Panel de PDIs por tag ─────────────────────────────────────────────────────
function PDIsDelTag({
  tagId,
  tagNombre,
}: {
  tagId: number;
  tagNombre: string;
}) {
  const [pdis, setPdis] = useState<PDI[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    filterPDIs({ tags: [tagId] })
      .then((res) => {
        if (res.success && Array.isArray(res.data)) {
          setPdis(res.data as PDI[]);
        } else {
          setPdis([]);
        }
      })
      .catch(() => setPdis([]))
      .finally(() => setLoading(false));
  }, [tagId]);

  if (loading) {
    return (
      <div className="px-6 py-4 text-slate-400 dark:text-slate-500 text-sm animate-pulse">
        Cargando PDIs con #{tagNombre}...
      </div>
    );
  }

  if (pdis.length === 0) {
    return (
      <div className="px-6 py-4 text-slate-400 dark:text-slate-500 text-sm italic">
        Ningún punto de interés tiene este tag.
      </div>
    );
  }

  return (
    <div className="px-6 py-4 border-t border-slate-200 dark:border-slate-600 bg-slate-50/80 dark:bg-slate-900/30">
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-500 mb-3">
        {pdis.length} PDI{pdis.length !== 1 ? 's' : ''} con este tag
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {pdis.map((pdi) => (
          <Link
            key={pdi.id}
            to={`/pdi/${pdi.id}`}
            className="flex items-center gap-3 p-2.5 rounded-xl bg-white dark:bg-slate-700 hover:bg-primary/5 dark:hover:bg-primary/10 border border-slate-200 dark:border-slate-600 hover:border-primary/30 transition-all group no-underline shadow-sm"
          >
            <img
              src={getImageUrl(pdi.imagen)}
              alt={pdi.nombre}
              className="w-10 h-10 rounded-lg object-cover flex-shrink-0"
            />
            <div className="min-w-0">
              <p className="text-sm font-semibold text-slate-800 dark:text-slate-100 group-hover:text-primary transition-colors truncate">
                {pdi.nombre}
              </p>
              <p className="text-xs text-slate-400 dark:text-slate-500 truncate">
                {pdi.calle} {pdi.altura}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

// ── Fila de tag ───────────────────────────────────────────────────────────────
function TagRow({
  tag,
  index,
  isEditing,
  editNombre,
  onEdit,
  onCancelEdit,
  onUpdate,
  onDelete,
  setEditNombre,
}: {
  tag: { id: number; nombre: string };
  index: number;
  isEditing: boolean;
  editNombre: string;
  onEdit: () => void;
  onCancelEdit: () => void;
  onUpdate: () => void;
  onDelete: () => void;
  setEditNombre: (v: string) => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const isEven = index % 2 === 0;

  return (
    <div className="border-b border-slate-200 dark:border-slate-600 last:border-b-0">
      <div
        className={`flex items-center transition-colors hover:bg-primary/5 dark:hover:bg-primary/10 ${
          isEven
            ? 'bg-white dark:bg-slate-800'
            : 'bg-slate-50 dark:bg-slate-700/50'
        }`}
      >
        {/* ID */}
        <div className="px-6 py-4 text-slate-400 dark:text-slate-500 font-mono text-xs w-16 flex-shrink-0">
          {tag.id}
        </div>

        {/* Nombre */}
        <div className="px-6 py-4 text-slate-800 dark:text-slate-100 font-medium flex-1 min-w-0">
          {isEditing ? (
            <input
              value={editNombre}
              onChange={(e) => setEditNombre(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && onUpdate()}
              className={inputCls}
              autoFocus
            />
          ) : (
            <span className="flex items-center gap-2">
              <span className="inline-block px-2.5 py-0.5 rounded-full bg-primary/10 text-primary text-sm font-semibold">
                #{tag.nombre}
              </span>
            </span>
          )}
        </div>

        {/* Acciones */}
        <div className="px-6 py-4 flex-shrink-0">
          <div className="flex items-center justify-end gap-2">
            {isEditing ? (
              <>
                <button
                  onClick={onUpdate}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary text-white text-xs font-semibold hover:bg-accent transition-colors"
                >
                  <Check className="w-3.5 h-3.5" />
                  Guardar
                </button>
                <button
                  onClick={onCancelEdit}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-slate-300 dark:border-slate-600 text-slate-500 dark:text-slate-400 text-xs font-semibold hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                  Cancelar
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => setExpanded((v) => !v)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-semibold transition-colors ${
                    expanded
                      ? 'bg-primary/10 border-primary/40 text-primary'
                      : 'border-slate-300 dark:border-slate-600 text-slate-500 dark:text-slate-400 hover:border-primary/40 hover:text-primary'
                  }`}
                  title="Ver PDIs con este tag"
                >
                  PDIs
                  {expanded ? (
                    <ChevronUp className="w-3.5 h-3.5" />
                  ) : (
                    <ChevronDown className="w-3.5 h-3.5" />
                  )}
                </button>
                <button
                  onClick={onEdit}
                  className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-400 hover:text-primary transition-colors"
                  title="Editar"
                >
                  <Pencil className="w-4 h-4" />
                </button>
                <button
                  onClick={onDelete}
                  className="p-2 rounded-full hover:bg-red-50 dark:hover:bg-red-900/20 text-slate-400 hover:text-red-500 transition-colors"
                  title="Eliminar"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Panel expandible de PDIs */}
      {expanded && !isEditing && (
        <PDIsDelTag tagId={tag.id} tagNombre={tag.nombre} />
      )}
    </div>
  );
}

// ── Página principal ──────────────────────────────────────────────────────────
function TagsPage() {
  const { isAdmin, loading } = useAuthAdmin();
  const { user } = useUser();
  const { theme, toggleTheme } = useTheme();
  const [showRedirect, setShowRedirect] = useState(false);
  const [busqueda, setBusqueda] = useState('');

  const {
    tags,
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
  } = useTagCRUD();

  useEffect(() => {
    if (!loading && (!user || isAdmin === false)) {
      setShowRedirect(true);
    }
  }, [user, isAdmin, loading]);

  const tagsFiltrados = useMemo(() => {
    const sorted = [...tags].sort((a, b) =>
      a.nombre.localeCompare(b.nombre, 'es', { sensitivity: 'base' }),
    );
    if (!busqueda.trim()) return sorted;
    const q = busqueda.trim().toLowerCase();
    return sorted.filter((t) => t.nombre.toLowerCase().includes(q));
  }, [tags, busqueda]);

  if (loading)
    return (
      <div className="min-h-screen bg-slate-100 dark:bg-slate-900 flex items-center justify-center">
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
    <div className="min-h-screen bg-slate-100 dark:bg-slate-900">
      <Navbar />

      <div className="max-w-3xl mx-auto px-4 pt-32 pb-16 space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              Tags
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              {tags.length} tags registrados
              {busqueda && tagsFiltrados.length !== tags.length && (
                <span className="ml-1">
                  · {tagsFiltrados.length} resultado
                  {tagsFiltrados.length !== 1 ? 's' : ''}
                </span>
              )}
            </p>
          </div>

          {/* Buscador */}
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              placeholder="Buscar tag..."
              className="w-full pl-9 pr-4 py-2 rounded-full border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 text-sm focus:outline-none focus:border-primary transition-colors shadow-sm"
            />
            {busqueda && (
              <button
                onClick={() => setBusqueda('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 text-sm">
            <X className="w-4 h-4 shrink-0" />
            {error}
          </div>
        )}

        {/* Sin resultados */}
        {busqueda && tagsFiltrados.length === 0 && (
          <div className="text-center py-8 text-slate-400 dark:text-slate-500 text-sm">
            No se encontraron tags para "{busqueda}"
          </div>
        )}

        {/* Tabla */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-md border border-slate-200 dark:border-slate-700 overflow-hidden">
          {/* Encabezado */}
          <div className="flex border-b-2 border-slate-200 dark:border-slate-600 bg-slate-100 dark:bg-slate-700/60">
            <div className="px-6 py-3 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 w-16 flex-shrink-0">
              ID
            </div>
            <div className="px-6 py-3 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex-1">
              Nombre
            </div>
            <div className="px-6 py-3 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 text-right flex-shrink-0">
              Acciones
            </div>
          </div>

          {/* Filas */}
          {tagsFiltrados.map((tag, index) => (
            <TagRow
              key={tag.id}
              tag={tag}
              index={index}
              isEditing={editingId === tag.id}
              editNombre={editNombre}
              setEditNombre={setEditNombre}
              onEdit={() => handleEdit(tag)}
              onCancelEdit={handleCancelEdit}
              onUpdate={() => handleUpdate(tag.id!)}
              onDelete={() => handleDelete(tag.id, tag.nombre)}
            />
          ))}

          {/* Fila agregar nuevo */}
          <div className="px-6 py-4 border-t-2 border-slate-200 dark:border-slate-600 bg-slate-100 dark:bg-slate-700/40">
            {!addingNew ? (
              <button
                onClick={() => setAddingNew(true)}
                className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 hover:text-primary dark:hover:text-primary transition-colors font-medium"
              >
                <Plus className="w-4 h-4" />
                Agregar tag
              </button>
            ) : (
              <div className="flex items-center gap-3">
                <input
                  value={nuevoNombre}
                  onChange={(e) => setNuevoNombre(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
                  className={`${inputCls} max-w-xs`}
                  placeholder="Nombre del tag"
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
                  className="flex items-center gap-1.5 px-3 py-2 rounded-full border border-slate-300 dark:border-slate-600 text-slate-500 dark:text-slate-400 text-xs font-semibold hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                  Cancelar
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Botón dark mode */}
      <button
        onClick={toggleTheme}
        className="fixed bottom-6 right-6 z-50 p-3 rounded-full shadow-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-600 dark:text-slate-200 hover:scale-110 transition-all duration-300"
        title={theme === 'dark' ? 'Modo claro' : 'Modo oscuro'}
      >
        {theme === 'dark' ? (
          <Sun className="w-5 h-5 text-amber-400" />
        ) : (
          <Moon className="w-5 h-5" />
        )}
      </button>
    </div>
  );
}

export default TagsPage;
