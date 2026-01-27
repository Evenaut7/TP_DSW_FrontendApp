import Navbar from '../components/Navbar.tsx';
import Estrellas from '../components/Estrellas.tsx';
import { useParams } from 'react-router-dom';
import { useApiGetById, API_BASE_URL } from '../utils/api';
import '../styles/Localidad.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useState } from 'react';
import PantallaDeCarga from '../components/PantallaDeCarga.tsx';
import ListadoDeTags from '../components/ListadoDeTags.tsx';
import ListadoPDI from '../components/ListadoPDI.tsx';
import { useBusquedaPDI } from '../hooks/useBusquedaPDI.ts';
import ListadoPDISkeleton from '../components/ListadoPDISkeleton.tsx';

interface PDI {
  id: number;
  nombre: string;
  descripcion: string;
  imagen: string;
  calle: string;
  altura: number;
}

interface Localidad {
  id: number;
  nombre: string;
  codUta: string;
  descripcion: string;
  latitud: number;
  longitud: number;
  imagen: string;
  provincia: {
    id: number;
    nombre: string;
    codUta: string;
  };
  puntosDeInteres?: PDI[];
}

const Localidad = () => {
  const { id } = useParams<{ id: string }>();
  const localidadId = id ? parseInt(id) : null;

  const {
    data: localidad,
    loading,
    error,
  } = useApiGetById<Localidad>(
    '/api/localidades',
    localidadId
  );

  const [tagsSeleccionados, setTagsSeleccionados] = useState<number[]>([]);
  const [busqueda, setBusqueda] = useState('');

  const pdisIniciales = localidad?.puntosDeInteres ?? [];

  const { pdis, loadingPDIs } = useBusquedaPDI({
    localidadId,
    busqueda,
    tags: tagsSeleccionados,
    pdisIniciales,
  });

  if (loading) return <PantallaDeCarga mensaje="Localidad" />;
  if (error) return <p>Error: {error}</p>;
  if (!localidad) return <p>No se encontró la localidad</p>;

  return (
    <div className="backgroundLocalidad">
      <Navbar />
      <div className="divLocalidades">
        <div className="topDivLocalidades">
          <div className="leftTopDivLocalidades">
            <div className="titleLocalidades">
              <h3>
                {localidad.nombre}, {localidad.provincia.nombre}
              </h3>
              <div className="underDescriptionLocalidades">
                <Estrellas rating={3} reviews={37} />
              </div>
            </div>
            <div className="descriptionLocalidades">
              <p>{localidad.descripcion}</p>
            </div>
          </div>
          <div className="imageContainer">
            <img
              src={`${API_BASE_URL}/public/${localidad.imagen}`}
              className="image"
            />
          </div>
        </div>

        {/* Buscador */}
        <div className="pdiSearchboxDiv d-flex gap-2 mb-3">
          <input
            className="pdiSearchbox"
            placeholder="Busca un Punto De Interés"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
        </div>

        {/* Tags seleccionables */}
        <ListadoDeTags onTagsChange={setTagsSeleccionados} />

        {/* Listado de PDIs filtrados */}
        <div className="listadoPDI">
          {loadingPDIs ? <ListadoPDISkeleton /> : <ListadoPDI pdis={pdis} />}
        </div>
      </div>
    </div>
  );
};

export default Localidad;
