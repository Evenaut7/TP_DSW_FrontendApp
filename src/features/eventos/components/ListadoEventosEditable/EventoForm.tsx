import { Form, Button } from 'react-bootstrap';
import FormField from '@/components/forms/FormField/FormField';
import TagsSelector from '@/features/tags/components/TagsSelector/TagsSelector';

const ESTADOS = ['Disponible', 'Agotado', 'Cancelado'];

type Props = {
  form: any;
  allTags: any[];
  onChange: (e: any) => void;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
};

const EventoForm: React.FC<Props> = ({
  form,
  allTags,
  onChange,
  onSubmit,
  onCancel,
}) => {
  return (
    <Form onSubmit={onSubmit}>
      <FormField
        label="Título"
        name="titulo"
        value={form.titulo}
        onChange={onChange}
        required
      />

      <FormField
        label="Descripción"
        name="descripcion"
        value={form.descripcion}
        onChange={onChange}
        as="textarea"
        required
      />

      <FormField
        label="Hora desde"
        name="horaDesde"
        type="datetime-local"
        value={form.horaDesde}
        onChange={onChange}
        required
      />

      <FormField
        label="Hora hasta"
        name="horaHasta"
        type="datetime-local"
        value={form.horaHasta}
        onChange={onChange}
        required
      />

      <Form.Select
        name="estado"
        value={form.estado}
        onChange={onChange}
        className="mb-3"
        required
      >
        {ESTADOS.map((estado) => (
          <option key={estado} value={estado}>
            {estado}
          </option>
        ))}
      </Form.Select>

      <TagsSelector
        tags={allTags}
        selected={form.tags || []}
        onChange={onChange}
      />

      <div className="d-flex justify-content-end gap-2 mt-3">
        <Button variant="secondary" onClick={onCancel}>
          Cancelar
        </Button>
        <Button variant="primary" type="submit">
          Guardar
        </Button>
      </div>
    </Form>
  );
};

export default EventoForm;
