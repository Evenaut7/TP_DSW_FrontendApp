import { useState, useEffect } from 'react';
import { getTags } from '@/utils/api';

interface Tag {
  id: number;
  nombre: string;
  tipo?: string;
}

interface ListadoDeTagsProps {
  onTagsChange?: (tagsSeleccionados: number[]) => void;
}

const TAGS_VISIBLE = 8;

const ListadoDeTags = ({ onTagsChange }: ListadoDeTagsProps) => {
  const [tags, setTags] = useState<Tag[]>([]);
  const [seleccionados, setSeleccionados] = useState<number[]>([]);
  const [expandido, setExpandido] = useState(false);

  useEffect(() => {
    const fetchTags = async () => {
      try {
        const response = await getTags();
        if (response.success && Array.isArray(response.data)) {
          setTags(response.data);
        } else {
          setTags([]);
        }
      } catch (err) {
        console.error('Error al cargar tags', err);
      }
    };
    fetchTags();
  }, []);

  const toggleTag = (id: number) => {
    const nuevos = seleccionados.includes(id)
      ? seleccionados.filter((t) => t !== id)
      : [...seleccionados, id];
    setSeleccionados(nuevos);
    onTagsChange?.(nuevos);
  };

  const visible = expandido ? tags : tags.slice(0, TAGS_VISIBLE);
  const hasMore = tags.length > TAGS_VISIBLE;

  if (tags.length === 0) return null;

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap gap-2">
        {visible.map((tag) => {
          const activo = seleccionados.includes(tag.id);
          return (
            <button
              key={tag.id}
              type="button"
              onClick={() => toggleTag(tag.id)}
              className={`px-3 py-1 rounded-full text-sm font-medium border transition-all duration-200
                ${
                  activo
                    ? 'bg-primary border-primary text-white scale-105'
                    : 'border-slate-200 dark:border-slate-600 text-slate-500 dark:text-slate-300 hover:border-primary hover:text-primary'
                }`}
            >
              #{tag.nombre}
            </button>
          );
        })}

        {hasMore && (
          <button
            type="button"
            onClick={() => setExpandido((v) => !v)}
            className="px-3 py-1 rounded-full text-sm font-medium border border-dashed border-slate-300 dark:border-slate-600 text-slate-400 dark:text-slate-500 hover:border-primary hover:text-primary transition-all"
          >
            {expandido ? 'Ver menos ↑' : `+${tags.length - TAGS_VISIBLE} más ↓`}
          </button>
        )}
      </div>
    </div>
  );
};

export default ListadoDeTags;
