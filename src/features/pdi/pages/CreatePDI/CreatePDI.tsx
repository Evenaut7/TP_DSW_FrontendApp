import { useState } from 'react';
import './';
import Navbar from '../components/Navbar.tsx';
import PDIFormEdit from '../components/forms/PDIForm.tsx';
import { useAuthAdmin } from '../hooks/useAuthAdmin.ts';
import { useApiGet, uploadImage, createPDI } from '@/utils/api';
import { usePDIForm } from '../hooks/usePDIForm.ts';
import { useNavigate } from 'react-router-dom';

const CreatePDI = () => {
  const { isAdmin, error } = useAuthAdmin();

  const { data: usuarios } = useApiGet<any[]>('/api/usuarios');
  const { data: localidades } = useApiGet<any[]>('/api/localidades');
  const { data: tags } = useApiGet<any[]>('/api/tags');

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

      // Subir imagen usando función centralizada
      const uploadResult = await uploadImage(form.imagen);
      if (!uploadResult.success || !uploadResult.data) {
        throw new Error(uploadResult.error || 'Error al subir imagen');
      }
      const imagenUrl = uploadResult.data.filename;

      // Crear PDI usando función centralizada
      const pdiData = { ...form, imagen: imagenUrl };
      const result = await createPDI(pdiData);

      if (!result.success || !result.data) {
        throw new Error(result.error || 'Error al crear el PDI');
      }

      // TypeScript: response.data es de tipo unknown, necesitamos hacer type assertion
      const newPdi = result.data as { id: number };
      const newPdiId = newPdi.id;
      alert('PDI creado con éxito');
      navigate(`/pdi/${newPdiId}`);
    } catch (e) {
      alert(`Error al crear el PDI: ${e instanceof Error ? e.message : 'Error desconocido'}`);
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
