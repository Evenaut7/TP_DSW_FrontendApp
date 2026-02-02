import { useState } from 'react';
import { useApiGet } from '../../utils/api';
import type { Localidad } from '../../types';
import CityCard from './CityCard';

export default function CityGrid() {
  const { data: localidades, loading, error } = useApiGet<Localidad[]>('/api/localidades');
  const [currentPage, setCurrentPage] = useState(0);
  const citiesPerPage = 6;

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

  const totalPages = Math.ceil((localidades?.length || 0) / citiesPerPage);
  const startIndex = currentPage * citiesPerPage;
  const endIndex = startIndex + citiesPerPage;
  const currentCities = localidades?.slice(startIndex, endIndex) || [];

  const handlePrevious = () => {
    setCurrentPage((prev) => (prev > 0 ? prev - 1 : totalPages - 1));
  };

  const handleNext = () => {
    setCurrentPage((prev) => (prev < totalPages - 1 ? prev + 1 : 0));
  };

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
          <button 
            onClick={handlePrevious}
            className="p-4 rounded-full border border-slate-200 dark:border-slate-800 hover:border-primary transition-all group"
            aria-label="Anterior"
          >
            <span className="material-symbols-outlined group-hover:text-primary">west</span>
          </button>
          <button 
            onClick={handleNext}
            className="p-4 rounded-full border border-slate-200 dark:border-slate-800 hover:border-primary transition-all group"
            aria-label="Siguiente"
          >
            <span className="material-symbols-outlined group-hover:text-primary">east</span>
          </button>
        </div>
      </div>

      {/* Carousel Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 min-h-[600px]">
        {currentCities.map((localidad) => (
          <CityCard
            key={localidad.id}
            id={localidad.id}
            nombre={localidad.nombre}
            imagen={localidad.imagen}
          />
        ))}
      </div>

      {/* Pagination Dots */}
      <div className="flex justify-center gap-2 mt-12">
        {Array.from({ length: totalPages }).map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentPage(index)}
            className={`h-2 rounded-full transition-all ${
              index === currentPage 
                ? 'w-8 bg-primary' 
                : 'w-2 bg-slate-300 dark:bg-slate-700 hover:bg-slate-400'
            }`}
            aria-label={`Ir a página ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
