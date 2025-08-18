import React, { useState } from 'react';
import type { FormEvent } from 'react';
import { useFetch } from '../reducers/UseFetch';
import 'bootstrap/dist/css/bootstrap.min.css';

interface Tag {
  id: number;
  nombre: string;
}

interface Usuario {
  id: number;
  nombre: string;
}

interface Localidad {
  id: number;
  nombre: string;
}

const CreatePDI = () => {
  const { data: tagsData } = useFetch<Tag[]>('http://localhost:3000/api/tags');
  const { data: usuariosData } = useFetch<Usuario[]>('http://localhost:3000/api/usuarios');
  const { data: localidadesData } = useFetch<Localidad[]>('http://localhost:3000/api/localidades');

  const [form, setForm] = useState({
    nombre: '',
    descripcion: '',
    imagenes: [] as File[],
    calle: '',
    altura: 0,
    privado: false,
    tags: [] as number[],
    usuario: 0,
    localidad: 0,
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type, checked, files } = e.target as HTMLInputElement;

    if (name === 'imagenes' && files) {
      setForm((prev) => ({   //convierte FileList en File[]
        ...prev,
        imagenes: Array.from(files),
      }));
    } else if (name === 'privado') {
      setForm((prev) => ({ ...prev, [name]: checked }));
    } else if (name === 'tags') {
      const id = Number(value);
      setForm((prev) => {
        let newTags = [...prev.tags];
        if (checked) {
          if (!newTags.includes(id)) newTags.push(id);
        } else {
          newTags = newTags.filter((t) => t !== id);
        }
        return { ...prev, tags: newTags };
      });
    } else if (name === 'usuario' || name === 'localidad' || name === 'altura') {
      setForm((prev) => ({ ...prev, [name]: Number(value) }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!form.nombre.trim()) return alert('Nombre es obligatorio');
    if (!form.descripcion.trim()) return alert('Descripción es obligatoria');
    if (!form.imagenes.length) return alert('Debe subir al menos una imagen');
    if (!form.calle.trim()) return alert('Calle es obligatoria');
    if (form.altura <= 0) return alert('Altura debe ser positiva');
    if (form.usuario <= 0) return alert('Debe seleccionar un usuario');
    if (form.localidad <= 0) return alert('Debe seleccionar una localidad');
    if (form.tags.length === 0) return alert('Debe seleccionar al menos un tag');

    setLoading(true);

    try {
      const formData = new FormData();

      formData.append('nombre', form.nombre);
      formData.append('descripcion', form.descripcion);
      form.imagenes.forEach((img) => formData.append('imagenes', img));
      formData.append('calle', form.calle);
      formData.append('altura', form.altura.toString());
      formData.append('privado', String(form.privado));
      form.tags.forEach((t) => formData.append('tags', t.toString()));
      formData.append('usuario', form.usuario.toString());
      formData.append('localidad', form.localidad.toString());

      const res = await fetch('http://localhost:3000/api/puntosDeInteres', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(`Error ${res.status}: ${text}`);
      }

      alert('Punto de Interés creado con éxito');

      setForm({
        nombre: '',
        descripcion: '',
        imagenes: [],
        calle: '',
        altura: 0,
        privado: false,
        tags: [],
        usuario: 0,
        localidad: 0,
      });
    } catch (error: any) {
      alert(error.message || 'Error desconocido');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-4">
      <h2>Crear Punto de Interés</h2>
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        {/* Nombre */}
        <div className="mb-3">
          <label className="form-label">Nombre</label>
          <input
            type="text"
            name="nombre"
            className="form-control"
            value={form.nombre}
            onChange={handleChange}
            required
          />
        </div>

        {/* Descripción */}
        <div className="mb-3">
          <label className="form-label">Descripción</label>
          <textarea
            name="descripcion"
            className="form-control"
            value={form.descripcion}
            onChange={handleChange}
            required
          />
        </div>

        {/* Imagenes */}
        <div className="mb-3">
          <label className="form-label">Imágenes</label>
          <input
            type="file"
            name="imagenes"
            multiple
            className="form-control"
            onChange={handleChange}
            required
          />
        </div>

        {/* Calle */}
        <div className="mb-3">
          <label className="form-label">Calle</label>
          <input
            type="text"
            name="calle"
            className="form-control"
            value={form.calle}
            onChange={handleChange}
            required
          />
        </div>

        {/* Altura */}
        <div className="mb-3">
          <label className="form-label">Altura</label>
          <input
            type="number"
            name="altura"
            className="form-control"
            value={form.altura}
            onChange={handleChange}
            min={1}
            required
          />
        </div>

        {/* Privado */}
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

        {/* Usuario */}
        <div className="mb-3">
          <label className="form-label">Usuario</label>
          <select
            name="usuario"
            className="form-select"
            value={form.usuario}
            onChange={handleChange}
            required
          >
            <option value={0}>Seleccionar usuario</option>
            {usuariosData?.map((u) => (
              <option key={u.id} value={u.id}>
                {u.nombre}
              </option>
            ))}
          </select>
        </div>

        {/* Localidad */}
        <div className="mb-3">
          <label className="form-label">Localidad</label>
          <select
            name="localidad"
            className="form-select"
            value={form.localidad}
            onChange={handleChange}
            required
          >
            <option value={0}>Seleccionar localidad</option>
            {localidadesData?.map((l) => (
              <option key={l.id} value={l.id}>
                {l.nombre}
              </option>
            ))}
          </select>
        </div>

        {/* Tags */}
        <div className="mb-3">
          <label className="form-label">Tags</label>
          <div>
            {tagsData?.map((tag) => (
              <div key={tag.id} className="form-check form-check-inline">
                <input
                  className="form-check-input"
                  type="checkbox"
                  name="tags"
                  id={`tag-${tag.id}`}
                  value={tag.id}
                  checked={form.tags.includes(tag.id)}
                  onChange={handleChange}
                />
                <label className="form-check-label" htmlFor={`tag-${tag.id}`}>
                  {tag.nombre}
                </label>
              </div>
            ))}
          </div>
        </div>

        <button disabled={loading} type="submit" className="btn btn-primary">
          {loading ? 'Guardando...' : 'Crear Punto de Interés'}
        </button>
      </form>
    </div>
  );
};

export default CreatePDI; 