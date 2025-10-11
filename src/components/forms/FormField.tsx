import React from 'react';

interface Props {
  label: string;
  name: string;
  value?: string | number;
  type?: string;
  as?: 'input' | 'textarea';
  onChange: (e: React.ChangeEvent<any>) => void;
  required?: boolean;
}

const FormField = ({
  label,
  name,
  value,
  type = 'text',
  as,
  onChange,
  required,
}: Props) => (
  <div className="mb-3">
    <label className="form-label">{label}</label>
    {as === 'textarea' ? (
      <textarea
        name={name}
        className="form-control"
        value={value as string}
        onChange={onChange}
        required={required}
      />
    ) : (
      <input
        name={name}
        type={type}
        className="form-control"
        value={value}
        onChange={onChange}
        required={required}
      />
    )}
  </div>
);

export default FormField;
