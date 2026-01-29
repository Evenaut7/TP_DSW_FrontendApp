import type { FormSelectProps } from '@/types';

export default function FormSelect({
  label,
  name,
  value,
  options,
  onChange,
  required = false,
  placeholder = 'Seleccione una opción'
}: FormSelectProps) {
  return (
    <div className="mb-3">
      {label && (
        <label htmlFor={name} className="form-label">
          {label}
          {required && <span className="text-danger">*</span>}
        </label>
      )}
      <select
        className="form-select"
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
      >
        <option value="">{placeholder}</option>
        {options.map((option: { id: number; nombre: string }) => (
          <option key={option.id} value={option.id}>
            {option.nombre}
          </option>
        ))}
      </select>
    </div>
  );
}
