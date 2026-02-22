// import { useEffect, useState } from 'react';

// interface UseGeocodingParams {
//   calle?: string;
//   altura?: string;
//   localidad?: string;
//   provincia?: string;
// }

// export const useGeocoding = ({
//   calle,
//   altura,
//   localidad,
//   provincia,
// }: UseGeocodingParams) => {
//   const [latitud, setLatitud] = useState<number | undefined>();
//   const [longitud, setLongitud] = useState<number | undefined>();
//   const [manualOverride, setManualOverride] = useState(false);

//   const direccionCompleta =
//     calle && altura && localidad && provincia
//       ? `${calle} ${altura}, ${localidad}, ${provincia}, Argentina`
//       : null;

//   //  Reactivar geocoding si cambia la dirección
//   useEffect(() => {
//     setManualOverride(false);
//   }, [calle, altura, localidad, provincia]);

//   //  Geocoding con debounce
//   useEffect(() => {
//     if (!direccionCompleta) return;
//     if (manualOverride) return;

//     const timeout = setTimeout(async () => {
//       try {
//         const response = await fetch(
//           `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
//             direccionCompleta,
//           )}`,
//         );

//         const data = await response.json();

//         if (data.length > 0) {
//           setLatitud(parseFloat(data[0].lat));
//           setLongitud(parseFloat(data[0].lon));
//         }
//       } catch (error) {
//         console.error('Error geocoding:', error);
//       }
//     }, 600);

//     return () => clearTimeout(timeout);
//   }, [direccionCompleta, manualOverride]);

//   return {
//     latitud,
//     longitud,
//     setLatitud,
//     setLongitud,
//     setManualOverride,
//   };
// };
import { useEffect } from 'react';

interface UseGeocodingParams {
  calle?: string;
  altura?: number;
  localidad?: string;
  provincia?: string;
  manualOverride: boolean;
  onCoordinates: (lat: number, lng: number) => void;
}

export const useGeocoding = ({
  calle,
  altura,
  localidad,
  provincia,
  manualOverride,
  onCoordinates,
}: UseGeocodingParams) => {
  const direccionCompleta =
    calle && altura && localidad && provincia
      ? `${calle} ${altura}, ${localidad}, ${provincia}, Argentina`
      : null;

  useEffect(() => {
    if (!direccionCompleta) return;
    if (manualOverride) return;

    const timeout = setTimeout(async () => {
      try {
        console.log('Buscando:', direccionCompleta);
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
            direccionCompleta,
          )}`,
        );

        const data = await response.json();

        if (data.length > 0) {
          console.log('Resultado geocoding:', data);
          onCoordinates(parseFloat(data[0].lat), parseFloat(data[0].lon));
        }
      } catch (error) {
        console.error('Error geocoding:', error);
      }
    }, 600);

    return () => clearTimeout(timeout);
  }, [direccionCompleta, manualOverride]);
};
