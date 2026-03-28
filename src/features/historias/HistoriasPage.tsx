import { useState, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Plus, Pencil, Trash2, ArrowLeft, CalendarRange, Sun, Moon, ImageOff } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import { useTheme } from '@/context/ThemeContext';
import { getImageUrl, useApiGet } from '@/utils/api';
import { useHistoriaCRUD } from './useHistoriaCRUD';
import type { Historia, PDI } from '@/types';

function formatFecha(iso: string) {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('es-AR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

const inputCls =
  'w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100 text-sm focus:outline-none focus:border-primary transition-colors';

const labelCls = 'block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1 uppercase tracking-wide';

// ── Formulario ────────────────────────────────────────────────────────────────
function HistoriaForm({
  form,
  saving,
  error,
  fieldErrors,
  editingId,
  onChange,
  onSubmit,
  onCancel,
}: {
  form: any;
  saving: boolean;
  error: string;
  fieldErrors: Record<string, string | undefined>;
  editingId: number | null;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onSubmit: () => void;
  onCancel: () => void;
}) {
  const fe = (field: string) =>
    fieldErrors[field] ? <p className="text-xs text-red-500 mt-1">{fieldErrors[field]}</p> : null;

  const preview = form.imagenFile
    ? URL.createObjectURL(form.imagenFile)
    : form.imagenActual
      ? getImageUrl(form.imagenActual)
      : null;

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl border border-primary/30 shadow-md p-6 space-y-4">
      <h3 className="font-bold text-slate-800 dark:text-slate-100 text-lg">
        {editingId ? 'Editar historia' : 'Nueva historia'}
      </h3>
      {error && <p className="text-sm text-red-500 bg-red-50 dark:bg-red-900/20 px-3 py-2 rounded-lg">{error}</p>}
      <div>
        <label className={labelCls}>Título *</label>
        <input
          name="titulo"
          value={form.titulo}
          onChange={onChange}
          className={`${inputCls} ${fieldErrors.titulo ? 'border-red-400' : ''}`}
          placeholder="Ej: Fundación del pueblo"
        />
        {fe('titulo')}
      </div>
      <div>
        <label className={labelCls}>Descripción *</label>
        <textarea
          name="descripcion"
          value={form.descripcion}
          onChange={onChange}
          rows={4}
          className={`${inputCls} ${fieldErrors.descripcion ? 'border-red-400' : ''}`}
          placeholder="Contá la historia..."
        />
        {fe('descripcion')}
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelCls}>Fecha desde *</label>
          <input
            type="date"
            name="fechaDesde"
            value={form.fechaDesde}
            onChange={onChange}
            className={`${inputCls} ${fieldErrors.fechaDesde ? 'border-red-400' : ''}`}
          />
          {fe('fechaDesde')}
        </div>
        <div>
          <label className={labelCls}>Fecha hasta</label>
          <input type="date" name="fechaHasta" value={form.fechaHasta} onChange={onChange} className={inputCls} />
        </div>
      </div>
      <div>
        <label className={labelCls}>Imagen (opcional)</label>
        <div className="flex items-center gap-4">
          {preview ? (
            <img
              src={preview}
              alt="preview"
              className="w-20 h-20 rounded-xl object-cover border border-slate-200 dark:border-slate-600 flex-shrink-0"
            />
          ) : (
            <div className="w-20 h-20 rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-600 flex items-center justify-center flex-shrink-0">
              <ImageOff className="w-6 h-6 text-slate-300 dark:text-slate-600" />
            </div>
          )}
          <input
            type="file"
            name="imagenFile"
            accept="image/*"
            onChange={onChange}
            className="text-sm text-slate-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20 cursor-pointer"
          />
        </div>
      </div>
      <div className="flex gap-3 pt-2">
        <button
          onClick={onSubmit}
          disabled={saving}
          className="px-5 py-2 rounded-full bg-primary text-white text-sm font-semibold hover:bg-accent transition-colors disabled:opacity-50"
        >
          {saving ? 'Guardando...' : editingId ? 'Guardar cambios' : 'Crear historia'}
        </button>
        <button
          onClick={onCancel}
          className="px-5 py-2 rounded-full border border-slate-300 dark:border-slate-600 text-slate-500 dark:text-slateate-400 text-sm font-semibold hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
        >
          Cancelar
        </button>
      </div>
    </div>
  );
}

// ── Card ──────────────────────────────────────────────────────────────────────
function HistoriaCard({
  historia,
  onEdit,
  onDelete,
}: {
  historia: Historia;
  onEdit: () => void;
  onDelete: () => void;
}) {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden flex flex-col">
      {historia.imagen ? (
        <img
          src={getImageUrl(historia.imagen)}
          alt={historia.titulo}
          className="w-full h-40 object-cover"
          onError={(e) => {
            (e.target as HTMLImageElement).style.display = 'none';
          }}
        />
      ) : (
        <div className="w-full h-40 bg-gradient-to-br from-primary/10 to-primary/5 dark:from-primary/20 dark:to-slate-700 flex items-center justify-center">
          <div className="w-16 h-16 rounded-full bg-primary/15 border-4 border-primary/30 flex items-center justify-center">
            <span className="text-xl font-black text-primary">{new Date(historia.fechaDesde).getFullYear()}</span>
          </div>
        </div>
      )}
      <div className="p-4 flex-1 flex flex-col gap-2">
        <div className="flex items-center gap-1.5 text-xs text-primary font-semibold">
          <CalendarRange className="w-3.5 h-3.5" />
          {formatFecha(historia.fechaDesde)}
          {historia.fechaHasta && ` → ${formatFecha(historia.fechaHasta)}`}
        </div>
        <h3 className="font-bold text-slate-800 dark:text-slate-100 leading-snug">{historia.titulo}</h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-3 flex-1">{historia.descripcion}</p>
        <div className="flex gap-2 pt-2 border-t border-slate-100 dark:border-slate-700 mt-auto">
          <button
            onClick={onEdit}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border border-slate-200 dark:border-slate-600 text-slate-500 dark:text-slate-400 hover:text-primary hover:border-primary/30 transition-colors"
          >
            <Pencil className="w-3.5 h-3.5" /> Editar
          </button>
          <button
            onClick={onDelete}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border border-slate-200 dark:border-slate-600 text-slate-400 hover:text-red-500 hover:border-red-200 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" /> Eliminar
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Página ────────────────────────────────────────────────────────────────────
export default function HistoriasPage() {
  const { id } = useParams<{ id: string }>();
  const pdiId = Number(id);
  const { theme, toggleTheme } = useTheme();

  const [refreshKey, setRefreshKey] = useState(0);
  const { data: pdi, loading: pdiLoading } = useApiGet<PDI>(`/api/puntosDeInteres/${pdiId}?_=${refreshKey}`);
  const historias: Historia[] = (pdi as any)?.historias ?? [];
  const onSuccess = useCallback(() => setRefreshKey((k) => k + 1), []);

  const {
    puedeEditar,
    authLoading,
    form,
    saving,
    error,
    fieldErrors,
    editingId,
    showForm,
    handleChange,
    openCreate,
    openEdit,
    cancel,
    submit,
    remove,
  } = useHistoriaCRUD(pdiId, onSuccess);

  // Igual que EditPDI — esperamos loading, luego chequeamos permiso
  if (authLoading || pdiLoading) {
    return (
      <div className="min-h-screen bg-slate-100 dark:bg-slate-900 flex items-center justify-center">
        <p className="text-slate-400">Cargando...</p>
      </div>
    );
  }

  if (!puedeEditar) {
    return <p className="text-center mt-8 text-slate-500">No tenés acceso a esta página.</p>;
  }

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-900">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 pt-32 pb-16 space-y-6">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            <Link
              to={`/pdi/${pdiId}`}
              className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">Historias</h1>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                {(pdi as any)?.nombre} · {historias.length} historia{historias.length !== 1 ? 's' : ''}
              </p>
            </div>
          </div>
          {!showForm && (
            <button
              onClick={openCreate}
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-primary text-white text-sm font-semibold hover:bg-accent transition-colors shadow-sm"
            >
              <Plus className="w-4 h-4" /> Nueva historia
            </button>
          )}
        </div>

        {showForm && (
          <HistoriaForm
            form={form}
            saving={saving}
            error={error}
            fieldErrors={fieldErrors}
            editingId={editingId}
            onChange={handleChange}
            onSubmit={submit}
            onCancel={cancel}
          />
        )}

        {historias.length === 0 && !showForm && (
          <div className="text-center py-16 text-slate-400 dark:text-slate-500">
            <CalendarRange className="w-10 h-10 mx-auto mb-3 opacity-40" />
            <p className="text-sm">Este PDI no tiene historias todavía.</p>
          </div>
        )}

        {historias.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[...historias]
              .sort((a, b) => new Date(a.fechaDesde).getTime() - new Date(b.fechaDesde).getTime())
              .map((h) => (
                <HistoriaCard
                  key={h.id}
                  historia={h}
                  onEdit={() => openEdit(h)}
                  onDelete={() => remove(h.id, h.imagen)}
                />
              ))}
          </div>
        )}
      </div>

      <button
        onClick={toggleTheme}
        className="fixed bottom-6 right-6 z-50 p-3 rounded-full shadow-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-600 dark:text-slate-200 hover:scale-110 transition-all duration-300"
        title={theme === 'dark' ? 'Modo claro' : 'Modo oscuro'}
      >
        {theme === 'dark' ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5" />}
      </button>
    </div>
  );
}
