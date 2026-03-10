import { useEffect } from 'react';

interface UseGeocodingParams {
  calle?: string;
  altura?: number;
  localidad?: string;
  provincia?: string;
  manualOverride: boolean;
  onCoordinates: (lat: number, lng: number) => void;
  onCoordinatesParcial?: (lat: number, lng: number) => void;
}

export const useGeocoding = ({
  calle,
  altura,
  localidad,
  provincia,
  manualOverride,
  onCoordinates,
  onCoordinatesParcial,
}: UseGeocodingParams) => {
  const direccionCompleta =
    calle && altura && localidad && provincia
      ? `${calle} ${altura}, ${localidad}, ${provincia}, Argentina`
      : null;

  useEffect(() => {
    if (!direccionCompleta || manualOverride) return;

    const timeout = setTimeout(async () => {
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(direccionCompleta)}`,
        );
        const data = await response.json();
        if (data.length > 0) {
          onCoordinates(parseFloat(data[0].lat), parseFloat(data[0].lon));
        }
      } catch (error) {
        console.error('Error geocoding:', error);
      }
    }, 600);

    return () => clearTimeout(timeout);
  }, [direccionCompleta, manualOverride]);

  const direccionParcial =
    !calle || !altura
      ? localidad
        ? `${localidad}, ${provincia}, Argentina`
        : provincia
          ? `${provincia}, Argentina`
          : null
      : null;

  useEffect(() => {
    if (!direccionParcial || manualOverride) return;

    const timeout = setTimeout(async () => {
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(direccionParcial)}`,
        );
        const data = await response.json();
        if (data.length > 0) {
          onCoordinatesParcial?.(
            parseFloat(data[0].lat),
            parseFloat(data[0].lon),
          );
        }
      } catch (error) {
        console.error('Error geocoding parcial:', error);
      }
    }, 400);

    return () => clearTimeout(timeout);
  }, [direccionParcial, manualOverride]);
};
