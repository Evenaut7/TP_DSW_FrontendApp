import { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '@/components/layout/Navbar/Navbar';
import Estrellas from '@/components/ui/Rating/Estrellas';
import PantallaDeCarga from '@/components/ui/Loading/PantallaDeCarga';
import FormField from '@/components/forms/FormField/FormField';
import FormSelect from '@/components/forms/FormSelect/FormSelect';
import PDIListItem from '@/components/PDI/PDIListItem';
import { API_BASE_URL } from '@/utils/api';
import type { PDI as PDIType } from '@/types';
import './EditLocalidad.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useAuthAdmin } from '@/features/auth';

interface Provincia {
  id: number;
  nombre: string;
}

interface Localidad {
  id: number;
  nombre: string;
  descripcion?: string;
  latitud?: number;
  longitud?: number;
  imagen?: string;
  provincia?: Provincia;
  puntosDeInteres?: PDIType[];
}

export default function EditLocalidad() {
  const { id } = useParams<{ id: string }>();
  const localidadId = id ? parseInt(id, 10) : null;
  const navigate = useNavigate();

  const { isAdmin, loading, error } = useAuthAdmin();

  const [localidad, setLocalidad] = useState<Localidad | null>(null);
  const originalRef = useRef<Localidad | null>(null);
  const [provincias, setProvincias] = useState<Provincia[]>([]);
  const [loadingLocalidad, setLoading] = useState(true);
  const [imagenFile, setImagenFile] = useState<File | null>(null);
  const [guardando, setGuardando] = useState(false);
  const [mensaje, setMensaje] = useState<string | null>(null);
  const [errorLocalidad, setError] = useState<string | null>(null);

  // Cargar localidad + provincias
  useEffect(() => {
    if (!localidadId) return;
    setLoading(true);

    const fetchAll = async () => {
      try {
        const [locRes, provRes] = await Promise.all([
          fetch(`${API_BASE_URL}/api/localidades/${localidadId}`, {
            credentials: 'include',
          }),
          fetch(`${API_BASE_URL}/api/provincias`, {
            credentials: 'include',
          }),
        ]);

        if (!locRes.ok) {
          const errJson = await locRes.json().catch(() => null);
          throw new Error(
            errJson?.message ?? `Error ${locRes.status} al obtener localidad`,
          );
        }
        if (!provRes.ok) {
          const errJson = await provRes.json().catch(() => null);
          throw new Error(
            errJson?.message ?? `Error ${provRes.status} al obtener provincias`,
          );
        }

        const locJson = await locRes.json();
        const provJson = await provRes.json();

        const locData: Localidad = locJson.data ?? locJson;
        const provData: Provincia[] = provJson.data ?? provJson;

        setLocalidad(locData);
        originalRef.current = JSON.parse(JSON.stringify(locData));
        setProvincias(Array.isArray(provData) ? provData : []);
        setError(null);
      } catch (err: any) {
        console.error(err);
        setError(err.message ?? 'Error inesperado al cargar datos');
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, [localidadId]);

  if (loadingLocalidad)
    return <PantallaDeCarga mensaje="Cargando localidad..." />;
  if (errorLocalidad)
    return (
      <div className="container mt-4">
        <p className="text-danger">Error: {errorLocalidad}</p>
      </div>
    );
  if (!localidad)
    return (
      <div className="container mt-4">
        <p>No se encontró la localidad</p>
      </div>
    );

  // Handlers de inputs
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setLocalidad((prev) =>
      prev
        ? {
            ...prev,
            [name]:
              name === 'latitud' || name === 'longitud'
                ? value === ''
                  ? undefined
                  : Number(value)
                : value,
          }
        : prev,
    );
  };

  const handleProvinciaChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const idProv = Number(e.target.value);
    const prov = provincias.find((p) => p.id === idProv) ?? undefined;
    setLocalidad((prev) => (prev ? { ...prev, provincia: prov } : prev));
  };

  const handleImagenChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    setImagenFile(file);
  };

  const handleRestore = () => {
    if (originalRef.current) {
      setLocalidad(JSON.parse(JSON.stringify(originalRef.current)));
      setImagenFile(null);
      setMensaje('Se restauraron los valores originales');
      setTimeout(() => setMensaje(null), 1500);
    }
  };

  const handleCancel = () => {
    navigate(`/localidad/${localidadId}`);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setGuardando(true);
    setMensaje(null);
    setError(null);

    try {
      let imagenNombre = localidad.imagen ?? '';

      if (imagenFile instanceof File) {
        const fd = new FormData();
        fd.append('imagen', imagenFile);
        const uploadRes = await fetch(`${API_BASE_URL}/api/imagenes`, {
          method: 'POST',
          body: fd,
          credentials: 'include',
        });
        if (!uploadRes.ok) throw new Error('Error al subir imagen');
        const uploadJson = await uploadRes.json();
        imagenNombre = uploadJson.nombreArchivo ?? imagenNombre;
      }

      const payload: any = {
        nombre: localidad.nombre,
        descripcion: localidad.descripcion ?? '',
        latitud: localidad.latitud ?? null,
        longitud: localidad.longitud ?? null,
        imagen: imagenNombre,
        provincia: localidad.provincia?.id ?? null,
      };

      const res = await fetch(
        `${API_BASE_URL}/api/localidades/${localidadId}`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify(payload),
        },
      );

      const resJson = await res.json().catch(() => null);
      if (!res.ok) throw new Error(resJson?.message ?? 'Error al actualizar');

      const updatedData = resJson.data ?? resJson ?? null;
      if (updatedData) {
        setLocalidad(updatedData);
        originalRef.current = JSON.parse(JSON.stringify(updatedData));
      }

      setMensaje('✅ Localidad actualizada correctamente');
      setTimeout(() => {
        setMensaje(null);
        navigate(`/localidad/${localidadId}`);
      }, 900);
    } catch (err: any) {
      console.error('Error guardando localidad:', err);
      setError(err.message ?? 'Error inesperado al guardar');
    } finally {
      setGuardando(false);
    }
  };

  const handleDeletePDI = async (deletedPdi: PDIType) => {
    if (!confirm(`¿Eliminar el PDI "${deletedPdi.nombre}"?`)) return;
    try {
      const res = await fetch(
        `${API_BASE_URL}/api/puntosDeInteres/${deletedPdi.id}`,
        {
          method: 'DELETE',
          credentials: 'include',
        },
      );

      if (!res.ok) {
        const errJson = await res.json().catch(() => null);
        throw new Error(errJson?.message ?? 'Error al eliminar PDI');
      }

      setLocalidad((prev) =>
        prev
          ? {
              ...prev,
              puntosDeInteres: prev.puntosDeInteres?.filter(
                (x) => x.id !== deletedPdi.id,
              ),
            }
          : prev,
      );
    } catch (err: any) {
      alert(err.message ?? 'Error al eliminar PDI');
    }
  };

  if (loading) return <p className="text-center mt-4">Cargando...</p>;
  if (error) return <p className="text-center mt-4 text-danger">{error}</p>;
  if (isAdmin === false)
    return (
      <p className="text-center mt-4 text-warning">
        No podés acceder a esta página
      </p>
    );

  return (
    <div className="backgroundLocalidad">
      <Navbar />

      <div className=" divLocalidades py-4">
        <div className="topDivLocalidades">
          <div className="leftTopDivLocalidades" style={{ flex: 1 }}>
            <div className="titleLocalidades">
              <h3 style={{ margin: 0 }}>
                {localidad.nombre}{' '}
                {localidad.provincia ? `, ${localidad.provincia.nombre}` : ''}
                <span
                  className="badge bg-warning text-dark"
                  style={{ marginLeft: 12 }}
                >
                  MODO EDICIÓN
                </span>
              </h3>
              <div className="underDescriptionLocalidades">
                <Estrellas rating={3} reviews={37} />
              </div>
            </div>

            <div className="descriptionLocalidades mt-3">
              <label className="form-label">Descripción</label>
              <textarea
                name="descripcion"
                value={localidad.descripcion ?? ''}
                onChange={handleInputChange}
                className="form-control"
                rows={4}
                style={{ resize: 'vertical' }}
              />
            </div>

            <form onSubmit={handleSubmit} className="mt-3">
              <div className="row">
                <div className="col-md-6">
                  <FormField
                    label="Nombre"
                    name="nombre"
                    value={localidad.nombre ?? ''}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="col-md-3">
                  <FormField
                    label="Latitud"
                    name="latitud"
                    type="number"
                    value={localidad.latitud ?? ''}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="col-md-3">
                  <FormField
                    label="Longitud"
                    name="longitud"
                    type="number"
                    value={localidad.longitud ?? ''}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div className="row mt-2">
                <div className="col-md-6">
                  <FormSelect
                    label="Provincia"
                    name="provincia"
                    value={localidad.provincia?.id ?? 0}
                    options={provincias}
                    onChange={handleProvinciaChange}
                  />
                </div>
                <div className="col-md-6">
                  <div className="mb-3">
                    <label className="form-label">Imagen</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImagenChange}
                      className="form-control"
                    />
                  </div>
                </div>
              </div>

              <div className="mt-3 d-flex gap-2 align-items-center">
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={guardando}
                >
                  {guardando ? 'Guardando...' : 'Guardar cambios'}
                </button>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={handleRestore}
                  disabled={guardando}
                >
                  Restaurar valores
                </button>
                <button
                  type="button"
                  className="btn btn-outline-danger"
                  onClick={handleCancel}
                  disabled={guardando}
                >
                  Cancelar
                </button>

                {mensaje && (
                  <div className="alert alert-success mb-0 ms-2">{mensaje}</div>
                )}
                {errorLocalidad && (
                  <div className="alert alert-danger mb-0 ms-2">
                    {errorLocalidad}
                  </div>
                )}
              </div>
            </form>
          </div>

          <div className="imageContainer" style={{ marginLeft: 16 }}>
            <img
              src={
                imagenFile
                  ? URL.createObjectURL(imagenFile)
                  : `${API_BASE_URL}/public/${localidad.imagen}`
              }
              className="image"
              alt={localidad.nombre}
              style={{
                maxWidth: 360,
                borderRadius: 8,
                objectFit: 'cover',
              }}
            />
          </div>
        </div>

        {/* Searchbox */}
        <div className="pdiSearchboxDiv mt-3">
          <input
            className="pdiSearchbox form-control"
            placeholder="Busca un Punto De Interés"
          />
        </div>

        {/* Listado de PDI con editar/eliminar */}
        <div className="mt-3 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {localidad.puntosDeInteres?.map((pdi) => (
            <PDIListItem
              key={pdi.id}
              pdi={pdi}
              onEdit={() => navigate(`/editPDI/${pdi.id}`)}
              onDelete={handleDeletePDI}
            />
          ))}

          {/* Card para agregar nuevo PDI */}
          <div
            onClick={() => navigate('/CreatePDI')}
            style={{ cursor: 'pointer' }}
            className="h-100"
          >
            <div
              className="card h-100 shadow-sm listado-pdi-card d-flex flex-column justify-content-center align-items-center"
              style={{ height: 220 }}
            >
              <div style={{ fontSize: 60, color: '#0d6efd' }}>+</div>
              <p className="mt-2 mb-0 text-center fw-bold">Agregar nuevo PDI</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
