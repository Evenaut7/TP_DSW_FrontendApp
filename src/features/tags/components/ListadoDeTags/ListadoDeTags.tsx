import './';
import { useState, useEffect } from 'react';
import { getTags } from '@/utils/api';

interface Tag {
  id: number;
  nombre: string;
  tipo?: string;
}

interface ListadoDeTagsProps {
  onTagsChange?: (tagsSeleccionados: number[]) => void; // solo ids
}

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
    let nuevos: number[];
    if (seleccionados.includes(id)) {
      nuevos = seleccionados.filter((t) => t !== id);
    } else {
      nuevos = [...seleccionados, id];
    }
    setSeleccionados(nuevos);
    onTagsChange?.(nuevos); // enviamos solo ids al padre
  };

  return (
    <div className="tagsWrapper">
      <div className={`tagsDiv ${expandido ? 'expandido' : 'colapsado'}`}>
        {tags.length > 0 ? (
          tags.map((tag) => {
            const activo = seleccionados.includes(tag.id);
            return (
              <button
                key={tag.id}
                className={`tagButton ${activo ? 'selected' : ''}`}
                onClick={() => toggleTag(tag.id)}
              >
                {tag.nombre}
              </button>
            );
          })
        ) : (
          <p>No hay tags disponibles</p>
        )}
      </div>
      <button className="verMasBtn" onClick={() => setExpandido(!expandido)}>
        {expandido ? 'Ver menos ⌃' : 'Ver más ⌄'}
      </button>
    </div>
  );
};

export default ListadoDeTags;
