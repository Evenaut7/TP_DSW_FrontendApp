// import Navbar from '../components/Navbar.tsx';
// import Estrellas from '../components/Estrellas.tsx';
// import { useParams } from 'react-router-dom';
// import { useFetchById } from '../reducers/UseFetchByID.ts';
// import '../styles/Localidad.css';
// import 'bootstrap/dist/css/bootstrap.min.css';
// import { useState } from 'react';
// import PantallaDeCarga from '../components/PantallaDeCarga.tsx';
// import ListadoDeTags from '../components/ListadoDeTags.tsx';
// import ListadoPDI from '../components/ListadoPDI.tsx';

// interface Localidad {
//   id: number;
//   nombre: string;
//   codUta: string;
//   descripcion: string;
//   latitud: number;
//   longitud: number;
//   imagen: string;
//   provincia: {
//     id: number;
//     nombre: string;
//     codUta: string;
//   };
//   puntosDeInteres?: {
//     id: number;
//     nombre: string;
//     descripcion: string;
//     imagen: string;
//     calle: string;
//     altura: number;
//   }[];
// }

// const Localidad = () => {
//   const { id } = useParams<{ id: string }>();
//   const localidadId = id ? parseInt(id) : null;

//   const {
//     data: localidad,
//     loading,
//     error,
//   } = useFetchById<Localidad>(
//     'http://localhost:3000/api/localidades',
//     localidadId
//   );

//   if (loading) return <PantallaDeCarga mensaje={'Localidad'} />;
//   if (error) return <p>Error: {error}</p>;
//   if (!localidad) return <p>No se encontró la localidad</p>;

//   return (
//     <div className="backgroundLocalidad">
//       <Navbar />
//       <div className="divLocalidades">
//         <div className="topDivLocalidades">
//           <div className="leftTopDivLocalidades">
//             <div className="titleLocalidades">
//               <h3>
//                 {localidad.nombre}, {localidad.provincia.nombre}
//               </h3>
//               <div className="underDescriptionLocalidades">
//                 <Estrellas rating={3} reviews={37} />
//               </div>
//             </div>
//             <div className="descriptionLocalidades">
//               <p>{localidad.descripcion}</p>
//             </div>
//           </div>
//           <div className="imageContainer">
//             <img
//               src={`http://localhost:3000/public/${localidad.imagen}`}
//               className="image"
//             />
//           </div>
//         </div>
//         <ListadoDeTags />
//         <div className="pdiSearchboxDiv">
//           <input
//             className="pdiSearchbox"
//             placeholder="Busca un Punto De Interes"
//           ></input>
//         </div>
//         <div className="listadoPDI">
//           <ListadoPDI pdis={localidad.puntosDeInteres ?? []} />
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Localidad;
import Navbar from '../components/Navbar.tsx';
import Estrellas from '../components/Estrellas.tsx';
import { useParams } from 'react-router-dom';
import { useFetchById } from '../reducers/UseFetchByID.ts';
import '../styles/Localidad.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useState, useEffect } from 'react';
import PantallaDeCarga from '../components/PantallaDeCarga.tsx';
import ListadoDeTags from '../components/ListadoDeTags.tsx';
import ListadoPDI from '../components/ListadoPDI.tsx';

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
  } = useFetchById<Localidad>(
    'http://localhost:3000/api/localidades',
    localidadId
  );

  const [pdis, setPdis] = useState<PDI[]>([]);
  const [tagsSeleccionados, setTagsSeleccionados] = useState<number[]>([]);
  const [busqueda, setBusqueda] = useState('');

  // Al cargar la localidad, mostramos todos los PDIs
  useEffect(() => {
    if (localidad?.puntosDeInteres) {
      setPdis(localidad.puntosDeInteres);
    }
  }, [localidad]);

  const handleBuscar = async () => {
    if (!localidadId) return;

    const body = {
      localidad: localidadId,
      tags: tagsSeleccionados,
      busqueda: busqueda.trim(),
    };

    try {
      const res = await fetch(
        'http://localhost:3000/api/puntosDeInteres/filtro',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        }
      );
      const json = await res.json();
      if (json.data && Array.isArray(json.data)) {
        setPdis(json.data);
      } else {
        setPdis([]);
      }
    } catch (err) {
      console.error('Error al filtrar PDIs:', err);
      setPdis([]);
    }
  };

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
              src={`http://localhost:3000/public/${localidad.imagen}`}
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
          <button className="btn btn-primary" onClick={handleBuscar}>
            Buscar
          </button>
        </div>

        {/* Tags seleccionables */}
        <ListadoDeTags onTagsChange={setTagsSeleccionados} />

        {/* Listado de PDIs filtrados */}
        <div className="listadoPDI">
          <ListadoPDI pdis={pdis} />
        </div>
      </div>
    </div>
  );
};

export default Localidad;
