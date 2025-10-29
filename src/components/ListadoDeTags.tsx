// import { useFetch } from '../reducers/UseFetch.ts';
// import '../styles/ListadoDeTags.css';

// interface Tag {
//   id: number;
//   tipo: string;
//   descripcion: string;
//   nombre: string;
// }

// const ListadoDeTags:React.FC = () => {

//   const {
//   data: tags
//   } = useFetch<Tag[]>(
//     'http://localhost:3000/api/tags'
//   );

//   return(
//     <div className='tagsDiv'>
//       {tags?.map((tag) => {
//         return(<button className='tagButton'>{tag.nombre}</button>)
//       })}
//     </div>
//   )

// }

// export default ListadoDeTags;
import '../styles/ListadoDeTags.css';
import { useState, useEffect } from 'react';

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

  useEffect(() => {
    const fetchTags = async () => {
      try {
        const res = await fetch('http://localhost:3000/api/tags');
        const json = await res.json();
        if (Array.isArray(json.data)) {
          setTags(json.data); // ahora sí usamos json.data
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
    <div className="tagsDiv">
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
  );
};

export default ListadoDeTags;
