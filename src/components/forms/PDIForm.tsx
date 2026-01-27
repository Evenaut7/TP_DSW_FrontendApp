import React from 'react';
import FormField from './FormField';
import FormSelect from './FormSelect';
import TagsSelector from './TagsSelector';

type PDIFormEditProps = {
  form: any;
  usuarios: any[];
  localidades: any[];
  tags: any[];
  loading: boolean;
  onChange: (e: React.ChangeEvent<any>) => void;
  onSubmit: (e: React.FormEvent) => void;
};

function PDIForm({
  form,
  usuarios,
  localidades,
  tags,
  loading,
  onChange,
  onSubmit,
}: PDIFormEditProps) {
  return (
    <form className="descriptionPDI bg-light p-4 rounded" onSubmit={onSubmit}>
      <FormField
        label="Nombre"
        name="nombre"
        value={form.nombre}
        onChange={onChange}
        required
      />

      <FormField
        label="Descripción"
        name="descripcion"
        value={form.descripcion}
        as="textarea"
        onChange={onChange}
        required
      />

      <FormField label="Imagen" name="imagen" type="file" onChange={onChange} />

      <FormField
        label="Calle"
        name="calle"
        value={form.calle}
        onChange={onChange}
        required
      />

      <FormField
        label="Altura"
        name="altura"
        type="number"
        value={form.altura}
        onChange={onChange}
        required
      />

      <div className="mb-3 form-check">
        <input
          type="checkbox"
          name="privado"
          className="form-check-input"
          checked={form.privado}
          onChange={onChange}
        />
        <label className="form-check-label">Privado</label>
      </div>

      <FormSelect
        label="Usuario"
        name="usuario"
        value={form.usuario}
        options={usuarios}
        onChange={onChange}
      />

      <FormSelect
        label="Localidad"
        name="localidad"
        value={form.localidad}
        options={localidades}
        onChange={onChange}
      />

      <TagsSelector tags={tags} selected={form.tags} onChange={onChange} />

      <button disabled={loading} type="submit" className="btn btn-primary mt-3">
        {loading ? 'Guardando...' : 'Actualizar PDI'}
      </button>
    </form>
  );
}

export default PDIForm;
