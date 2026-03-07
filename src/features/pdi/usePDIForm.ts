import { useState } from 'react';

interface FormState {
  nombre: string;
  descripcion: string;
  imagen: File | null;
  calle: string;
  altura: number;
  privado: boolean;
  tags: number[];
  usuario: number;
  localidad: number;
}

export const usePDIForm = () => {
  const [form, setForm] = useState<FormState>({
    nombre: '',
    descripcion: '',
    imagen: null,
    calle: '',
    altura: 0,
    privado: false,
    tags: [],
    usuario: 0,
    localidad: 0,
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value, checked, files } = e.target as HTMLInputElement;

    setForm((prev) => {
      if (name === 'imagen' && files && files[0])
        return { ...prev, imagen: files[0] };

      if (name === 'privado') return { ...prev, privado: checked };

      if (name === 'tags') {
        const id = Number(value);
        const newTags = checked
          ? [...prev.tags, id]
          : prev.tags.filter((t) => t !== id);
        return { ...prev, tags: newTags };
      }

      const numericFields = ['usuario', 'localidad', 'altura'];
      return {
        ...prev,
        [name]: numericFields.includes(name) ? Number(value) : value,
      };
    });
  };

  const resetForm = () =>
    setForm({
      nombre: '',
      descripcion: '',
      imagen: null,
      calle: '',
      altura: 0,
      privado: false,
      tags: [],
      usuario: 0,
      localidad: 0,
    });

  return { form, handleChange, resetForm, setForm };
};
