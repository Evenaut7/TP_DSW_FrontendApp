import type { FormFieldProps } from '@/types';

export default function FormField({
  label,
  name,
  type = 'text',
  value,
  onChange,
  required = false,
  placeholder
}: FormFieldProps) {
  return (
    <div className="mb-3">
      {label && (
        <label htmlFor={name} className="form-label">
          {label}
          {required && <span className="text-danger">*</span>}
        </label>
      )}
      <input
        type={type}
        className="form-control"
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        placeholder={placeholder}
      />
    </div>
  );
}
