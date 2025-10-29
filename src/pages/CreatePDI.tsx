import { useState } from 'react';
import Navbar from '../components/Navbar';
import PDIForm from '../components/PDIForm';
import '../styles/PDIPage.css';

const CreatePDI = () => {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (form: any) => {
    setLoading(true);
    try {
      const imagenData = new FormData();
      imagenData.append('imagen', form.imagen);

      const uploadRes = await fetch('http://localhost:3000/api/imagenes', {
        method: 'POST',
        body: imagenData,
      });
      const uploadJson = await uploadRes.json();
      const imagenUrl = uploadJson.nombreArchivo;

      const pdiData = { ...form, imagen: imagenUrl };

      await fetch('http://localhost:3000/api/puntosDeInteres', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(pdiData),
        credentials: 'include',
      });

      alert('PDI creado con éxito');
    } catch (e) {
      alert('Error al crear el PDI');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
    <div className='backgroundPDI'>
      <Navbar />
      <div className="create-pdi-container">
        <h2 className="create-pdi-title">Crear Punto de Interés</h2>
        <PDIForm onSubmit={handleSubmit} loading={loading} />
      </div>
    </div>
    </>
  );
};

export default CreatePDI;
