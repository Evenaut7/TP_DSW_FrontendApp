import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import { useParams, useNavigate } from 'react-router-dom';
import PantallaDeCarga from '../components/PantallaDeCarga';
import ListadoDeTags from '../components/ListadoDeTags';
import ListadoEventosEditable from '../components/ListadoEventosEditable';
import PDIFormEdit from '../components/forms/PDIFormEdit';
import { useFetch } from '../reducers/UseFetch';
import { usePDIForm } from '../hooks/usePDIForm';
import '../styles/PDIPage.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useAuthAdmin } from '../hooks/useAuthAdmin';

interface PDI {
  id: number;
  nombre: string;
  descripcion: string;
  imagen: string;
  calle: string;
  altura: number;
  privado: boolean;
  tags: { id: number; nombre: string }[];
  usuario: number;
  localidad: number;
  eventos?: any[];
}

const EditPDI = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const pdiId = id ? parseInt(id) : null;

  const { isAdmin, loading, error } = useAuthAdmin();

  const { form, setForm, handleChange } = usePDIForm();
  const { data: usuarios } = useFetch<any[]>(
    'http://localhost:3000/api/usuarios'
  );
  const { data: localidades } = useFetch<any[]>(
    'http://localhost:3000/api/localidades'
  );
  const { data: tags } = useFetch<any[]>('http://localhost:3000/api/tags');

  const [loadingPDI, setLoading] = useState(false);
  const [cargandoPDI, setCargandoPDI] = useState(true);
  const [pdiOriginal, setPdiOriginal] = useState<PDI | null>(null);

  useEffect(() => {
    const fetchPDI = async () => {
      try {
        const res = await fetch(
          `http://localhost:3000/api/puntosDeInteres/${pdiId}`
        );
        const json = await res.json();
        const data: PDI = json.data;
        setPdiOriginal(data);

        setForm({
          nombre: data.nombre,
          descripcion: data.descripcion,
          imagen: null,
          calle: data.calle,
          altura: data.altura,
          privado: data.privado,
          tags: data.tags.map((t) => t.id), // IDs para TagsSelector
          usuario: data.usuario,
          localidad: data.localidad,
        });
      } catch (err) {
        alert('Error cargando el PDI');
      } finally {
        setCargandoPDI(false);
      }
    };
    fetchPDI();
  }, [pdiId, setForm]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let imagenUrl = pdiOriginal?.imagen || '';

      if (form.imagen instanceof File) {
        const imagenData = new FormData();
        imagenData.append('imagen', form.imagen);
        const uploadRes = await fetch('http://localhost:3000/api/imagenes', {
          method: 'POST',
          body: imagenData,
        });
        const uploadJson = await uploadRes.json();
        imagenUrl = uploadJson.nombreArchivo;
      }

      const updatedPDI = {
        nombre: form.nombre,
        descripcion: form.descripcion,
        calle: form.calle,
        altura: Number(form.altura),
        privado: Boolean(form.privado),
        tags: form.tags, // mantener array de IDs
        usuario: Number(form.usuario),
        localidad: Number(form.localidad),
        imagen: imagenUrl,
      };

      const res = await fetch(
        `http://localhost:3000/api/puntosDeInteres/${pdiId}`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updatedPDI),
          credentials: 'include',
        }
      );

      const json = await res.json();
      if (!res.ok)
        throw new Error(json.message || 'Error al actualizar el PDI');

      alert('✅ PDI actualizado correctamente');
      navigate(`/pdi/${pdiId}`);
    } catch (err) {
      alert(`❌ No se pudo actualizar el PDI: ${err}`);
    } finally {
      setLoading(false);
    }
  };

  if (cargandoPDI) return <PantallaDeCarga mensaje="Cargando PDI..." />;
  if (loading) return <p className="text-center mt-4">Cargando...</p>;
  if (error) return <p className="text-center mt-4 text-danger">{error}</p>;
  if (isAdmin === false)
    return (
      <p className="text-center mt-4 text-warning">
        No podés acceder a esta página
      </p>
    );

  return (
    <div className="backgroundPDI">
      <Navbar />
      <div className="divPDI">
        <div className="heroPDI">
          <img
            src={
              form.imagen
                ? URL.createObjectURL(form.imagen)
                : `http://localhost:3000/public/${pdiOriginal?.imagen}`
            }
            alt={form.nombre}
            className="heroImage"
          />
          <div className="heroOverlay">
            <h1 className="heroTitle">{form.nombre}</h1>
          </div>
        </div>

        <PDIFormEdit
          form={form}
          onChange={handleChange}
          onSubmit={handleSubmit}
          loading={loadingPDI}
          usuarios={usuarios ?? []}
          localidades={localidades ?? []}
          tags={tags ?? []}
        />

        <div className="proximosEventosBanner mt-4">
          <h3>Próximos eventos</h3>
        </div>

        <ListadoDeTags />
        <div className="listadoEventos">
          <ListadoEventosEditable pdiId={pdiId!} />
        </div>
      </div>
    </div>
  );
};

export default EditPDI;
