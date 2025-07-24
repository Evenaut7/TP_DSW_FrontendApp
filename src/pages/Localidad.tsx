import Navbar from "../components/Navbar.tsx"
import { useParams } from "react-router-dom"
import { useFetchById } from "../reducers/UseFetchByID.ts"
import "../styles/Localidad.css"
import 'bootstrap/dist/css/bootstrap.min.css'
import imagenlocalidad from "../assets/rosario.webp";
import imagenenEventoStock from "../assets/eventoStock.jpg";
import { useState } from "react";

interface Localidad {
  id: number;
  nombre: string;
  codUta: string;
  latitud: number;
  longitud: number;
  provincia: number;
}

const imagenes = [
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

  const { data: localidad, loading, error } = useFetchById<Localidad>(
    'http://localhost:3000/api/localidades',
    localidadId
  );

  if (loading) return <p>Cargand{imagenlocalidad}</p>;
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
      <Navbar/>
        <div className="topDivLocalidades">
          <div className="leftTopDivLocalidades">
            <div className="titleLocalidades">
              <h3>{localidad.nombre}, Santa Fe</h3>
              
            </div>
            <div className="descriptionLocalidades">
              <p>Detalles de la localidad</p>
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
              <button onClick={anterior} className="control prev">‹</button>
              <button onClick={siguiente} className="control next">›</button>
            </div>
          </div>
        </div>
        <div>
          <p>Cod UTA: {localidad.codUta}</p>
          <p>Latitud: {localidad.latitud}</p>
          <p>Longitud: {localidad.longitud}</p>
        </div>
    </>    
  );
}

export default Localidad