import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import { useParams, useNavigate } from 'react-router-dom';
import PantallaDeCarga from '../components/PantallaDeCarga';
import ListadoDeTags from '../components/ListadoDeTags';
import ListadoEventos from '../components/ListadoEventos';
import FormField from '../components/forms/FormField';
import FormSelect from '../components/forms/FormSelect';
import TagsSelector from '../components/forms/TagsSelector';
import { useFetch } from '../reducers/UseFetch';
import { usePDIForm } from '../hooks/usePDIForm';
import '../styles/PDIPage.css';
import 'bootstrap/dist/css/bootstrap.min.css';

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

  const { form, setForm, handleChange } = usePDIForm();
  const { data: usuarios } = useFetch<any[]>(
    'http://localhost:3000/api/usuarios'
  );
  const { data: localidades } = useFetch<any[]>(
    'http://localhost:3000/api/localidades'
  );
  const { data: tags } = useFetch<any[]>('http://localhost:3000/api/tags');

  const [loading, setLoading] = useState(false);
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
          tags: data.tags.map((t) => t.id),
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
        tags: form.tags,
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

        <form
          className="descriptionPDI bg-light p-4 rounded"
          onSubmit={handleSubmit}
        >
          <FormField
            label="Nombre"
            name="nombre"
            value={form.nombre}
            onChange={handleChange}
            required
          />
          <FormField
            label="Descripción"
            name="descripcion"
            value={form.descripcion}
            onChange={handleChange}
            as="textarea"
            required
          />
          <FormField
            label="Imagen"
            name="imagen"
            type="file"
            onChange={handleChange}
          />
          <FormField
            label="Calle"
            name="calle"
            value={form.calle}
            onChange={handleChange}
            required
          />
          <FormField
            label="Altura"
            name="altura"
            type="number"
            value={form.altura}
            onChange={handleChange}
            required
          />

          <div className="mb-3 form-check">
            <input
              type="checkbox"
              name="privado"
              className="form-check-input"
              checked={form.privado}
              onChange={handleChange}
            />
            <label className="form-check-label">Privado</label>
          </div>

          <FormSelect
            label="Usuario"
            name="usuario"
            value={form.usuario}
            options={usuarios ?? []}
            onChange={handleChange}
          />
          <FormSelect
            label="Localidad"
            name="localidad"
            value={form.localidad}
            options={localidades ?? []}
            onChange={handleChange}
          />

          <TagsSelector
            tags={tags ?? []}
            selected={form.tags}
            onChange={handleChange}
          />

          <button
            disabled={loading}
            type="submit"
            className="btn btn-primary mt-3"
          >
            {loading ? 'Guardando...' : 'Actualizar PDI'}
          </button>
        </form>

        <div className="proximosEventosBanner mt-4">
          <h3>Próximos eventos</h3>
        </div>

        <ListadoDeTags />
        <div className="listadoEventos">
          <ListadoEventos pdiId={pdiId!} />
        </div>
      </div>
    </div>
  );
};

export default EditPDI;
