import Navbar from "../components/Navbar.tsx"
import { useParams } from "react-router-dom"
import { useFetchById } from "../reducers/UseFetchByID.ts"

interface Localidad {
  id: number;
  nombre: string;
  codUta: string;
  latitud: number;
  longitud: number;
  provincia: number;
}

const Localidad = () => {
  
  const { id } = useParams<{ id: string }>();

  // Transformamos id a number o null
  const localidadId = id ? parseInt(id) : null;

  const { data: localidad, loading, error } = useFetchById<Localidad>(
    'http://localhost:3000/api/localidades',
    localidadId
  );

  if (loading) return <p>Cargando...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!localidad) return <p>No se encontró la localidad</p>;

  return (
    <>
      <Navbar/>
        <div>
          <h2>Localidad: {localidad.nombre}</h2>
          <p>Cod UTA: {localidad.codUta}</p>
          <p>Latitud: {localidad.latitud}</p>
          <p>Longitud: {localidad.longitud}</p>
          <p>Provincia ID: {localidad.provincia}</p>
        </div>
    </>    
  );
}

export default Localidad