import React from 'react';
import { usePDIForm } from '../hooks/usePDIForm';
import { useFetch } from '../reducers/UseFetch';
import TagsSelector from './forms/TagsSelector';
import FormField from './forms/FormField';
import FormSelect from './forms/FormSelect';

interface Props {
  onSubmit: (data: any) => void;
  loading: boolean;
  form?: any;
  handleChange?: (e: React.ChangeEvent<any>) => void;
}

const PDIForm = ({
  onSubmit,
  loading,
  form: externalForm,
  handleChange: externalHandleChange,
}: Props) => {
  // Si no vienen props, usa el hook interno (modo "crear")
  const internal = usePDIForm();
  const form = externalForm ?? internal.form;
  const handleChange = externalHandleChange ?? internal.handleChange;

  // Datos dinámicos (tags, usuarios, localidades)
  const { data: tags } = useFetch<any[]>('http://localhost:3000/api/tags');
  const { data: usuarios } = useFetch<any[]>(
    'http://localhost:3000/api/usuarios'
  );
  const { data: localidades } = useFetch<any[]>(
    'http://localhost:3000/api/localidades'
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <form onSubmit={handleSubmit} encType="multipart/form-data">
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
        as="textarea"
        onChange={handleChange}
        required
      />

      <FormField
        label="Imagen"
        name="imagen"
        type="file"
        onChange={handleChange}
        // si estás en modo edición, no forzamos el campo como requerido
        required={externalForm ? false : true}
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

      <button disabled={loading} type="submit" className="btn btn-primary mt-3">
        {loading
          ? 'Guardando...'
          : externalForm
          ? 'Guardar Cambios'
          : 'Crear Punto de Interés'}
      </button>
    </form>
  );
};

export default PDIForm;
