import React, { useState, useEffect, useMemo } from 'react';
import { MapPin, X } from 'lucide-react';
import MapSelector from '@/components/map/MapSelector';
import { useGeocoding } from '@/components/map/useGeocoding';
import { useReverseGeocoding } from '@/components/map/useReverseGeocoding';
import type { Provincia } from './useEditPDI';

interface UbicacionModalProps {
  show: boolean;
  onClose: () => void;
  provincias: Provincia[];
  todasLocalidades: any[];
  calle: string;
  altura: number;
  latitud?: number;
  longitud?: number;
  provinciaSeleccionada: number;
  localidad: number;
  onConfirm: (data: {
    calle: string;
    altura: number;
    localidad: number;
    provincia: number;
    lat?: number;
    lng?: number;
  }) => void;
}

const inputCls =
  'w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100 text-sm focus:outline-none focus:border-primary transition-colors';

const Field = ({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) => (
  <div className="flex flex-col gap-1">
    <label className="text-xs font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-500">
      {label}
    </label>
    {children}
  </div>
);

const UbicacionModal: React.FC<UbicacionModalProps> = ({
  show,
  onClose,
  provincias,
  todasLocalidades,
  calle: calleInit,
  altura: alturaInit,
  latitud: latInit,
  longitud: lngInit,
  provinciaSeleccionada: provInit,
  localidad: locInit,
  onConfirm,
}) => {
  const [calle, setCalle] = useState(calleInit);
  const [altura, setAltura] = useState(alturaInit);
  const [provincia, setProvincia] = useState(provInit);
  const [localidad, setLocalidad] = useState(locInit);
  const [lat, setLat] = useState(latInit);
  const [lng, setLng] = useState(lngInit);
  const [manualOverride, setManualOverride] = useState(false);
  const [coordSource, setCoordSource] = useState<
    'full' | 'partial' | 'manual' | null
  >(null);

  useEffect(() => {
    if (show) {
      setCalle(calleInit);
      setAltura(alturaInit);
      setProvincia(provInit);
      setLocalidad(locInit);
      setLat(latInit);
      setLng(lngInit);
      setManualOverride(false);
    }
  }, [show]);

  const localidadesFiltradas =
    provincia === 0
      ? todasLocalidades
      : todasLocalidades.filter(
          (l) => l.provincia?.id === provincia || l.provincia === provincia,
        );

  const localidadNombre = todasLocalidades.find(
    (l) => l.id === localidad,
  )?.nombre;
  const provinciaNombre = provincias.find((p) => p.id === provincia)?.nombre;

  useGeocoding({
    calle,
    altura,
    localidad: localidadNombre,
    provincia: provinciaNombre,
    manualOverride,
    onCoordinates: (newLat, newLng) => {
      setLat(newLat);
      setLng(newLng);
      setCoordSource('full');
    },
    onCoordinatesParcial: (newLat, newLng) => {
      setLat(newLat);
      setLng(newLng);
      setCoordSource('partial');
    },
  });

  const handleManualOverride = (value: boolean) => {
    setManualOverride(value);
    if (value) setCoordSource('manual');
  };

  useReverseGeocoding({
    lat,
    lng,
    enabled: manualOverride,
    onAddress: ({ calle: c, altura: a }) => {
      if (c) setCalle(c);
      if (a) setAltura(a);
    },
  });

  const zoomLevel = useMemo(() => {
    if (coordSource === 'manual' || coordSource === 'full') return 16;
    if (coordSource === 'partial' && localidadNombre) return 11;
    if (coordSource === 'partial' && provinciaNombre) return 7;
    return 5;
  }, [coordSource, localidadNombre, provinciaNombre]);

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-700">
          <h3 className="font-bold text-slate-900 dark:text-slate-100 text-lg flex items-center gap-2">
            <MapPin className="w-5 h-5 text-primary" /> Cambiar ubicación
          </h3>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-400 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Field label="Provincia">
              <select
                value={provincia}
                onChange={(e) => {
                  setProvincia(Number(e.target.value));
                  setManualOverride(false);
                }}
                className={inputCls}
              >
                <option value={0}>Seleccioná una provincia</option>
                {provincias.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.nombre}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Localidad">
              <select
                value={localidad}
                onChange={(e) => {
                  setLocalidad(Number(e.target.value));
                  setManualOverride(false);
                }}
                className={inputCls}
              >
                <option value={0}>Seleccioná una localidad</option>
                {localidadesFiltradas.map((l) => (
                  <option key={l.id} value={l.id}>
                    {l.nombre}
                  </option>
                ))}
              </select>
            </Field>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Field label="Calle">
              <input
                value={calle}
                onChange={(e) => {
                  setCalle(e.target.value);
                  setManualOverride(false);
                }}
                className={inputCls}
                placeholder="Nombre de la calle"
              />
            </Field>
            <Field label="Altura">
              <input
                type="number"
                value={altura === 0 ? '' : altura}
                onChange={(e) => {
                  setAltura(Number(e.target.value));
                  setManualOverride(false);
                }}
                className={inputCls}
                placeholder="Número"
              />
            </Field>
          </div>

          <p className="text-xs text-slate-400 dark:text-slate-500">
            Las coordenadas se calculan desde la dirección, o hacé click en el
            mapa para ajustar manualmente.
          </p>

          <div className="grid grid-cols-2 gap-4">
            <Field label="Latitud (auto)">
              <input
                value={lat?.toFixed(6) ?? '—'}
                readOnly
                className={`${inputCls} bg-slate-50 dark:bg-slate-600 cursor-not-allowed text-slate-400`}
              />
            </Field>
            <Field label="Longitud (auto)">
              <input
                value={lng?.toFixed(6) ?? '—'}
                readOnly
                className={`${inputCls} bg-slate-50 dark:bg-slate-600 cursor-not-allowed text-slate-400`}
              />
            </Field>
          </div>

          <div className="rounded-xl overflow-hidden border border-slate-100 dark:border-slate-600">
            <MapSelector
              latitud={lat}
              longitud={lng}
              setLatitud={setLat}
              setLongitud={setLng}
              setManualOverride={handleManualOverride}
              zoomLevel={zoomLevel}
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-full border border-slate-300 dark:border-slate-600 text-slate-600 dark:text-slate-300 font-semibold hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors text-sm"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={() => {
                onConfirm({ calle, altura, localidad, provincia, lat, lng });
                onClose();
              }}
              className="flex-1 py-2.5 rounded-full bg-primary text-white font-semibold hover:bg-accent transition-colors text-sm"
            >
              Confirmar ubicación
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UbicacionModal;
