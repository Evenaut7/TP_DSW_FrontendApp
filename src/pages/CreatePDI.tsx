import { useState } from 'react';
import '../styles/PDIPage.css';
import Navbar from '../components/Navbar.tsx';
import PDIFormEdit from '../components/forms/PDIForm.tsx';
import { useAuthAdmin } from '../hooks/useAuthAdmin.ts';
import { useFetch } from '../reducers/UseFetch.ts';
import { usePDIForm } from '../hooks/usePDIForm.ts';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../utils/api';

const CreatePDI = () => {
  const { isAdmin, error } = useAuthAdmin();

  const { data: usuarios } = useFetch<any[]>(
    `${API_BASE_URL}/api/usuarios`
  );
  const { data: localidades } = useFetch<any[]>(
    `${API_BASE_URL}/api/localidades`
  );
  const { data: tags } = useFetch<any[]>(`${API_BASE_URL}/api/tags`);

  const { form, handleChange } = usePDIForm();

  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (!form.imagen) {
        alert('Tenés que seleccionar una imagen');
        setLoading(false);
        return;
      }
      const imagenData = new FormData();
      imagenData.append('imagen', form.imagen);

      const uploadRes = await fetch(`${API_BASE_URL}/api/imagenes`, {
        method: 'POST',
        body: imagenData,
      });
      const uploadJson = await uploadRes.json();
      const imagenUrl = uploadJson.nombreArchivo;

      const pdiData = { ...form, imagen: imagenUrl };

      const res = await fetch(`${API_BASE_URL}/api/puntosDeInteres`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(pdiData),
        credentials: 'include',
      });

      const json = await res.json();
      const newPdiId = json.data.id;
      alert('PDI creado con éxito');
      navigate(`/pdi/${newPdiId}`);
    } catch (e) {
      alert('Error al crear el PDI');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p className="text-center mt-4">Cargando...</p>;
  if (error) return <p className="text-center mt-4 text-danger">{error}</p>;
  if (isAdmin === false)
    return (
      <p className="text-center mt-4 text-warning">
        No podés acceder a esta página
      </p>
    );

  return (
    <>
      <div className="backgroundPDI">
        <Navbar />
        <div className="create-pdi-container">
          <h2 className="create-pdi-title">Crear Punto de Interés</h2>

          <PDIFormEdit
            form={form}
            onChange={handleChange}
            onSubmit={handleSubmit}
            loading={loading}
            usuarios={usuarios ?? []}
            localidades={localidades ?? []}
            tags={tags ?? []}
          />
        </div>
      </div>
    </>
  );
};

export default CreatePDI;
