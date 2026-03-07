import { useEffect } from 'react';

interface UseReverseGeocodingParams {
  lat?: number;
  lng?: number;
  enabled: boolean;
  onAddress: (data: {
    calle?: string;
    altura?: number;
    localidad?: string;
    provincia?: string;
  }) => void;
}

export const useReverseGeocoding = ({
  lat,
  lng,
  enabled,
  onAddress,
}: UseReverseGeocodingParams) => {
  useEffect(() => {
    if (!lat || !lng) return;
    if (!enabled) return;

    const fetchAddress = async () => {
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`,
        );

        const data = await response.json();

        const address = data.address || {};

        onAddress({
          calle: address.road,
          altura: address.house_number
            ? Number(address.house_number)
            : undefined,
          localidad:
            address.city ||
            address.town ||
            address.village ||
            address.municipality,
          provincia: address.state,
        });
      } catch (err) {
        console.error('Reverse geocoding error:', err);
      }
    };

    fetchAddress();
  }, [lat, lng, enabled]);
};
