import { useFetch } from '../reducers/UseFetch.ts';
import '../styles/ListadoDeTags.css';

interface Tag {
  id: number;
  tipo: string;
  descripcion: string; 
  nombre: string;
}

const ListadoDeTags:React.FC = () => {
  
  const {
  data: tags
  } = useFetch<Tag[]>(
    'http://localhost:3000/api/tags'
  );

  return(
    <div className='tagsDiv'>
      {tags?.map((tag) => {
        return(<button className='tagButton'>{tag.nombre}</button>)
      })}
    </div>
  )

}

export default ListadoDeTags;