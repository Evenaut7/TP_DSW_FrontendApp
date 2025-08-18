import Navbar from '../components/Navbar.tsx';
import Estrellas from '../components/Estrellas.tsx';
import { useParams } from 'react-router-dom';
import { useFetchById } from '../reducers/UseFetchByID.ts';
import '../styles/Localidad.css';
import 'bootstrap/dist/css/bootstrap.min.css';
//import { useState } from 'react';
import PantallaDeCarga from '../components/PantallaDeCarga.tsx';
import ListadoDeTags from '../components/ListadoDeTags.tsx';
import ListadoPDI from '../components/ListadoPDI.tsx';

interface Localidad {
  id: number;
  nombre: string;
  codUta: string;
  latitud: number;
  longitud: number;
  imagen: string;
  provincia: {
    id: number;
    nombre: string;
    codUta: string;
  };
  puntosDeInteres?: {
    id: number;
    nombre: string;
    descripcion: string;
    imagenes: string[];
    calle: string;
    altura: number;
  }[];
}

const Localidad = () => {
  const { id } = useParams<{ id: string }>();
  const localidadId = id ? parseInt(id) : null;

  const {
    data: localidad,
    loading,
    error,
  } = useFetchById<Localidad>(
    'http://localhost:3000/api/localidades',
    localidadId
  );

  if (loading) return <PantallaDeCarga mensaje={'Localidad'} />;
  if (error) return <p>Error: {error}</p>;
  if (!localidad) return <p>No se encontró la localidad</p>;

  return (
    <>
      <div className="divLocalidades">
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
              <Estrellas rating={3} reviews={37} />
              <div className="verMasButtonDiv">
                <button className="verMasButton"> Ver Mas </button>
              </div>
            </div>
          </div>
          <div className="imageContainer">
            <img
              src={`http://localhost:3000/public/${localidad.imagen}`}
              className="image"
            />
          </div>
        </div>

        <h4>Lugares para conocer en {localidad.nombre}</h4>
        <div className="pdiSearchboxDiv">
          <input
            className="pdiSearchbox"
            placeholder="Busca un Punto De Interes"
          ></input>
        </div>
        <ListadoDeTags />
        <div className="container my-4">
          <ListadoPDI pdis={localidad.puntosDeInteres ?? []} />
        </div>
      </div>
    </>
  );
};

export default Localidad;