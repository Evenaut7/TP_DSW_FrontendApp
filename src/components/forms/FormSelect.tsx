interface Props {
  label: string;
  name: string;
  value: number;
  options?: { id: number; nombre: string }[];
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

const FormSelect = ({ label, name, value, options = [], onChange }: Props) => (
  <div className="mb-3">
    <label className="form-label">{label}</label>
    <select
      name={name}
      className="form-select"
      value={value}
      onChange={onChange}
      required
    >
      <option value={0}>Seleccionar {label.toLowerCase()}</option>
      {options.map((opt) => (
        <option key={opt.id} value={opt.id}>
          {opt.nombre}
        </option>
      ))}
    </select>
  </div>
);

export default FormSelect;
