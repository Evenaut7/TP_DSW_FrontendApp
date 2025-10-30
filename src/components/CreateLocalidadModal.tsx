import { useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import FormField from '../components/forms/FormField';
import BotonCeleste from '../components/BotonCeleste';

interface CreateLocalidadModalProps {
  show: boolean;
  onHide: () => void;
  provinciaId: number;
  onLocalidadCreada?: () => void;
}

const CreateLocalidadModal: React.FC<CreateLocalidadModalProps> = ({
  show,
  onHide,
  provinciaId,
  onLocalidadCreada,
}) => {
  const [form, setForm] = useState({
    nombre: '',
    latitud: '',
    longitud: '',
    descripcion: '',
    imagen: null as File | null,
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setForm((prev) => ({ ...prev, imagen: file }));
  };

  const handleSubmit = async () => {
    if (!form.nombre.trim()) {
      alert('El nombre es obligatorio');
      return;
    }

    setLoading(true);
    try {
      let imagenUrl = '';

      if (form.imagen) {
        const imagenData = new FormData();
        imagenData.append('imagen', form.imagen);

        const uploadRes = await fetch('http://localhost:3000/api/imagenes', {
          method: 'POST',
          body: imagenData,
        });
        const uploadJson = await uploadRes.json();
        imagenUrl = uploadJson.nombreArchivo;
      }

      const localidadData = {
        nombre: form.nombre,
        latitud: parseFloat(form.latitud) || null,
        longitud: parseFloat(form.longitud) || null,
        descripcion: form.descripcion || null,
        imagen: imagenUrl || null,
        provincia: provinciaId,
      };

      const res = await fetch('http://localhost:3000/api/localidades', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(localidadData),
        credentials: 'include',
      });

      if (!res.ok) throw new Error('Error al crear la localidad');

      alert('Localidad creada con éxito ✅');
      onHide();
      setForm({
        nombre: '',
        latitud: '',
        longitud: '',
        descripcion: '',
        imagen: null,
      });
      if (onLocalidadCreada) onLocalidadCreada();
    } catch (err) {
      alert('Error al crear la localidad ❌');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>Crear Localidad</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <form>
          <FormField
            name="nombre"
            label="Nombre"
            value={form.nombre}
            onChange={handleChange}
            required
          />
          <FormField
            name="latitud"
            label="Latitud"
            value={form.latitud}
            onChange={handleChange}
          />
          <FormField
            name="longitud"
            label="Longitud"
            value={form.longitud}
            onChange={handleChange}
          />
          <FormField
            name="descripcion"
            label="Descripción"
            value={form.descripcion}
            onChange={handleChange}
          />
          <div className="mb-3">
            <label className="form-label">Imagen</label>
            <input
              type="file"
              accept="image/*"
              className="form-control"
              onChange={handleImageChange}
            />
          </div>
        </form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Cancelar
        </Button>
        <div onClick={handleSubmit}>
          <BotonCeleste
            type="submit"
            texto="Guardar Localidad"
            disabled={loading}
          />
        </div>
      </Modal.Footer>
    </Modal>
  );
};

export default CreateLocalidadModal;
