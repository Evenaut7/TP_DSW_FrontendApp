import React from 'react';
import { Sun, Moon, Pencil, Save, X, MapPin, AlertCircle, Camera } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import PantallaDeCarga from '@/components/ui/PantallaDeCarga';
import { ListadoEventosEditable } from '@/features/eventos';
import UbicacionModal from '@/features/pdi/UbicacionModal.tsx';
import { useEditPDI } from '@/features/pdi/useEditPDI.tsx';
import PantallaDeError from '@/components/ui/PantallaDeError.tsx';

const Field = ({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) => (
  <div className="flex flex-col gap-1">
    <label className="text-xs font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-500">{label}</label>
    {children}
    {error && <p className="text-red-500 text-xs">{error}</p>}
  </div>
);

const editCls =
  'w-full px-3 py-2 rounded-lg border border-transparent hover:border-slate-200 dark:hover:border-slate-600 focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none bg-transparent hover:bg-slate-50 dark:hover:bg-slate-700/50 text-slate-800 dark:text-slate-100 text-sm transition-all';
const editClsSelect = `${editCls} cursor-pointer`;

const EditPDI = () => {
  const {
    pdiId,
    navigate,
    userLoading,
    puedeEditar,
    isAdmin,
    theme,
    toggleTheme,
    allTags,
    usuarios,
    provincias,
    todasLocalidades,
    form,
    errors,
    saving,
    cargando,
    saveError,
    previewUrl,
    latitud,
    longitud,
    localidadNombre,
    provinciaSeleccionada,
    showUbicacionModal,
    submitted,
    setShowUbicacionModal,
    handleChange,
    handleTagToggle,
    handlePrivadoToggle,
    handleImagenChange,
    handleUbicacionConfirm,
    handleSubmit,
  } = useEditPDI();

  if (cargando || userLoading) return <PantallaDeCarga mensaje="Cargando PDI..." />;
  if (!puedeEditar) return <PantallaDeError mensaje="No podés acceder a esta página" error="403" />;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-800 font-display transition-colors duration-300">
      <Navbar />

      {/* ── Hero ── */}
      <div className="relative w-full h-[50vh]">
        <img src={previewUrl} alt={form.nombre} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent dark:from-slate-800 dark:via-black/30 dark:to-transparent" />

        {/* Botón cambiar foto */}
        <label className="absolute top-28 right-4 md:right-6 z-10 cursor-pointer inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/50 hover:bg-black/70 text-white text-xs font-semibold backdrop-blur-sm border border-white/20 transition-colors">
          <Camera className="w-3.5 h-3.5" />
          Cambiar foto
          <input
            type="file"
            accept="image/jpeg,image/png"
            className="hidden"
            onChange={(e) => e.target.files?.[0] && handleImagenChange(e.target.files[0])}
          />
        </label>

        <div className="absolute bottom-0 left-0 w-full px-5 md:px-16 pb-6">
          <div className="max-w-7xl mx-auto">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400 text-amber-900 text-xs font-bold mb-4">
              <Pencil className="w-3 h-3" /> MODO EDICIÓN
            </span>

            {/* Nombre editable */}
            <div className="relative group/nombre">
              <input
                name="nombre"
                value={form.nombre}
                onChange={handleChange}
                className="w-full bg-transparent text-white text-3xl md:text-5xl font-extrabold tracking-tight drop-shadow-lg border-b-2 border-transparent group-hover/nombre:border-white/40 focus:border-white focus:outline-none transition-all placeholder:text-white/50"
                placeholder="Nombre del PDI"
              />
              <Pencil className="absolute right-0 bottom-2 w-4 h-4 text-white/40 group-hover/nombre:text-white/70 transition-colors pointer-events-none" />
            </div>
            {errors.nombre && <p className="text-red-400 text-xs mt-1">{errors.nombre}</p>}

            {/* Dirección */}
            <div className="flex flex-col items-start mt-2">
              <button
                type="button"
                onClick={() => setShowUbicacionModal(true)}
                className="group/dir flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/25 border border-white/20 hover:border-white/50 text-white/80 hover:text-white text-sm transition-all backdrop-blur-sm"
              >
                <MapPin className="w-4 h-4 flex-shrink-0" />
                <span>
                  {form.calle} {form.altura}
                  {localidadNombre ? `, ${localidadNombre}` : ''}
                </span>
                <span className="flex items-center gap-1 ml-1 text-xs text-white/50 group-hover/dir:text-white/80 transition-colors">
                  <Pencil className="w-3 h-3" />
                  Editar
                </span>
              </button>
              {(errors.calle || errors.altura || errors.localidad) && (
                <p className="text-red-300 bg-red-900/40 px-2 py-1 rounded text-xs mt-1 font-medium backdrop-blur-sm border border-red-500/20">
                  {errors.calle || errors.altura || errors.localidad}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── Formulario ── */}
      <form onSubmit={handleSubmit}>
        <div className="bg-white dark:bg-slate-800">
          <div className="max-w-7xl mx-auto px-5 md:px-16 py-8 md:py-12 space-y-10">
            {saveError && (
              <div className="flex items-center gap-2 px-4 py-3 rounded-lg bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-sm">
                <X className="w-4 h-4 flex-shrink-0" /> {saveError}
              </div>
            )}

            {submitted && Object.keys(errors).length > 0 && (
              <div className="flex items-center gap-2 px-4 py-3 rounded-lg bg-amber-50 dark:bg-amber-900/30 border border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-400 text-sm">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                Hay campos inválidos. Por favor, revisá el formulario.
              </div>
            )}

            {/* ── Descripción ── */}
            <section className="space-y-4">
              <h2 className="text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 border-b border-slate-100 dark:border-slate-700 pb-2">
                Descripción
              </h2>
              <Field label="" error={errors.descripcion}>
                <textarea
                  name="descripcion"
                  value={form.descripcion}
                  onChange={handleChange}
                  rows={4}
                  className={`${editCls} resize-none leading-relaxed`}
                  placeholder="Descripción del PDI"
                />
              </Field>
            </section>

            {/* ── Clasificación ── */}
            <section className="space-y-5">
              <h2 className="text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 border-b border-slate-100 dark:border-slate-700 pb-2">
                Clasificación
              </h2>
              <Field label="Tags" error={errors.tags}>
                <div className="flex flex-wrap gap-2 mt-1">
                  {allTags
                    ?.filter((tag) => tag.id !== undefined)
                    .map((tag) => (
                      <button
                        key={tag.id}
                        type="button"
                        onClick={() => handleTagToggle(tag.id)}
                        className={`px-3 py-1 rounded-full text-sm font-medium border transition-all ${
                          form.tags?.includes(tag.id)
                            ? 'bg-primary border-primary text-white'
                            : 'border-slate-200 dark:border-slate-600 text-slate-500 dark:text-slate-300 hover:border-primary hover:text-primary'
                        }`}
                      >
                        #{tag.nombre}
                      </button>
                    ))}
                </div>
              </Field>

              <Field label="Tipo de propietario" error={errors.privado}>
                <div className="flex gap-3 mt-1">
                  {[
                    { val: false, label: 'Estatal', color: 'emerald' },
                    { val: true, label: 'Privado', color: 'amber' },
                  ].map((opt) => (
                    <button
                      key={String(opt.val)}
                      type="button"
                      onClick={() => handlePrivadoToggle(opt.val)}
                      className={`px-4 py-2 rounded-full text-sm font-semibold border transition-all ${
                        form.privado === opt.val
                          ? opt.color === 'emerald'
                            ? 'bg-emerald-500 border-emerald-500 text-white'
                            : 'bg-amber-400 border-amber-400 text-amber-900'
                          : 'border-slate-200 dark:border-slate-600 text-slate-500 dark:text-slate-400 hover:border-slate-300'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </Field>
            </section>

            {/* ── Asignación (solo admin) ── */}
            {isAdmin && (
              <section className="space-y-4">
                <h2 className="text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 border-b border-slate-100 dark:border-slate-700 pb-2">
                  Asignación
                </h2>
                <Field label="Usuario propietario" error={errors.usuario}>
                  <select name="usuario" value={form.usuario} onChange={handleChange} className={editClsSelect}>
                    <option value={0}>Seleccioná un usuario</option>
                    {usuarios?.map((u) => (
                      <option key={u.id} value={u.id}>
                        {u.nombre || u.gmail}
                      </option>
                    ))}
                  </select>
                </Field>
              </section>
            )}

            {/* ── Acciones ── */}
            <div className="flex flex-row gap-3 pt-2 border-t border-slate-100 dark:border-slate-700">
              <button
                type="submit"
                disabled={saving}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-primary text-white font-semibold hover:bg-accent transition-colors disabled:opacity-50 text-sm"
              >
                <Save className="w-4 h-4" />
                {saving ? 'Guardando...' : 'Guardar cambios'}
              </button>
              <button
                type="button"
                onClick={() => navigate(`/pdi/${pdiId}`)}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-full border border-slate-300 dark:border-slate-600 text-slate-600 dark:text-slate-300 font-semibold hover:border-red-400 hover:text-red-500 transition-all text-sm"
              >
                <X className="w-4 h-4" />
                Cancelar
              </button>
            </div>
          </div>
        </div>
      </form>

      <div className="w-full h-8 bg-gradient-to-b from-white to-slate-100 dark:from-slate-800 dark:to-slate-900" />

      <div className="w-full bg-slate-100 dark:bg-slate-900 py-10 md:py-16">
        <div className="max-w-7xl mx-auto px-5 md:px-16 space-y-6">
          <div className="space-y-1">
            <h2 className="text-2xl md:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100">
              Eventos
            </h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm">Gestioná los eventos asociados a este lugar.</p>
          </div>
          <ListadoEventosEditable pdiId={pdiId!} />
        </div>
      </div>

      {provincias && todasLocalidades && (
        <UbicacionModal
          show={showUbicacionModal}
          onClose={() => setShowUbicacionModal(false)}
          provincias={provincias}
          todasLocalidades={todasLocalidades}
          calle={form.calle}
          altura={form.altura}
          latitud={latitud}
          longitud={longitud}
          provinciaSeleccionada={provinciaSeleccionada}
          localidad={form.localidad}
          onConfirm={handleUbicacionConfirm}
        />
      )}

      <button
        onClick={toggleTheme}
        aria-label="Cambiar tema"
        className="fixed bottom-6 right-6 z-50 p-3 rounded-full shadow-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-600 dark:text-slate-200 hover:scale-110 transition-all duration-300"
      >
        {theme === 'dark' ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5" />}
      </button>
    </div>
  );
};

export default EditPDI;
