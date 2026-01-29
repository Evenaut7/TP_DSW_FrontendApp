import { useApiGet } from '../../utils/api';
import type { Localidad } from '../../types';
import CityCard from './CityCard';

export default function CityGrid() {
  const { data: localidades, loading, error } = useApiGet<Localidad[]>('/api/localidades');

  if (loading) {
    return (
      <section className="max-w-7xl mx-auto px-6 py-24">
        <div className="text-center text-slate-500 dark:text-slate-400">
          Cargando ciudades...
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="max-w-7xl mx-auto px-6 py-24">
        <div className="text-center text-red-500">
          Error al cargar las ciudades
        </div>
      </section>
    );
  }

  return (
    <section className="max-w-7xl mx-auto px-6 py-24">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
        <div className="space-y-4">
          <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Ciudades Destacadas
          </h2>
          <p className="text-slate-500 dark:text-slate-400 max-w-lg text-lg">
            Descubre la esencia de Argentina a través de sus ciudades más vibrantes y su cultura única.
          </p>
        </div>
        <div className="flex gap-4">
          <button className="p-4 rounded-full border border-slate-200 dark:border-slate-800 hover:border-primary transition-all group">
            <span className="material-symbols-outlined group-hover:text-primary">west</span>
          </button>
          <button className="p-4 rounded-full border border-slate-200 dark:border-slate-800 hover:border-primary transition-all group">
            <span className="material-symbols-outlined group-hover:text-primary">east</span>
          </button>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {localidades?.map((localidad) => (
          <CityCard
            key={localidad.id}
            id={localidad.id}
            nombre={localidad.nombre}
            imagen={localidad.imagen}
          />
        ))}
      </div>
    </section>
  );
}
