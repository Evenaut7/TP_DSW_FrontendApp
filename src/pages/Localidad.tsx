import Navbar from '../components/Navbar.tsx';
import Estrellas from '../components/Estrellas.tsx';
import { useParams } from 'react-router-dom';
import { useFetchById } from '../reducers/UseFetchByID.ts';
import { useFetch } from '../reducers/UseFetch.ts';
import '../styles/Localidad.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import imagenlocalidad from '../assets/rosario.webp';
import imagenenEventoStock from '../assets/eventoStock.jpg';
import { useState } from 'react';
import PantallaDeCarga from '../components/PantallaDeCarga.tsx';

interface Tag {
  id: number;
  tipo: string;
  descripcion: string; 
  nombre: string;
}

interface Localidad {
  id: number;
  nombre: string;
  codUta: string;
  latitud: number;
  longitud: number;
  provincia: {
    id: number;
    nombre: string;
    codUta: string;
  };
}

const imagenes = [
  imagenlocalidad,
  imagenenEventoStock,
  imagenlocalidad,
  imagenenEventoStock,
  imagenlocalidad,
  imagenenEventoStock,
];

const Localidad = () => {
  const [indice, setIndice] = useState(0);
  const { id } = useParams<{ id: string }>();

  // Transformamos id a number o null
  const localidadId = id ? parseInt(id) : null;

  const {
    data: localidad,
    loading,
    error,
  } = useFetchById<Localidad>(
    'http://localhost:3000/api/localidades',
    localidadId
  );

  const {
  data: tags
  } = useFetch<Tag[]>(
    'http://localhost:3000/api/tags'
  );

  if (loading) return <PantallaDeCarga mensaje={"Localidad"}/>;
  if (error) return <p>Error: {error}</p>;
  if (!localidad) return <p>No se encontró la localidad</p>;

  const siguiente = () => {
    setIndice((indice + 1) % imagenes.length);
  };

  const anterior = () => {
    setIndice((indice - 1 + imagenes.length) % imagenes.length);
  };



  return (
    <>
      <Navbar />
      <div className="topDivLocalidades">
        <div className="leftTopDivLocalidades">
          <div className="titleLocalidades">
            <h3>
              {localidad.nombre}, {localidad.provincia.nombre}
            </h3>
          </div>
          <div className="descriptionLocalidades">
            <p>Detalles de la localidad</p>
          </div>
          <div className="underDescriptionLocalidades">
            <Estrellas rating={3} reviews={37}/>
            <button className="verMasButton"> Ver Mas </button>
          </div>
        </div>
        <div>
          <div className="carrusel">
            {imagenes.map((img, i) => {
              const pos = (i - indice + imagenes.length) % imagenes.length;
              if (pos >= 0 && pos < 3) {
                return (
                  <img
                    key={i}
                    src={img}
                    alt={`Imagen ${i + 1}`}
                    className="imagenCarrusel"
                  />
                );
              }
              return null;
            })}
            <button onClick={anterior} className="control prev">
              ‹
            </button>
            <button onClick={siguiente} className="control next">
              ›
            </button>
          </div>
        </div>
      </div>
      <div className='pdiSearchboxDiv'>
        <input className='pdiSearchbox' placeholder='Busca un Punto De Interes'></input>
      </div>
      <div className='tagsDiv'>
        {tags.map((tag) => {
          return(<button className='tagButton'>{tag.nombre}</button>)
        })}
      </div>
    </>
  );
};

export default Localidad;
