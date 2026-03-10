import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet';
import { useEffect } from 'react';
import type { LatLngExpression, LeafletEvent } from 'leaflet';
import { useMapEvents } from 'react-leaflet';

interface Props {
  latitud?: number;
  longitud?: number;
  setLatitud: (lat: number) => void;
  setLongitud: (lng: number) => void;
  setManualOverride: (value: boolean) => void;
  zoomLevel?: number;
}

function MapClickHandler({
  setLatitud,
  setLongitud,
  setManualOverride,
}: {
  setLatitud: (lat: number) => void;
  setLongitud: (lng: number) => void;
  setManualOverride: (value: boolean) => void;
}) {
  useMapEvents({
    click(e) {
      setLatitud(e.latlng.lat);
      setLongitud(e.latlng.lng);
      setManualOverride(true);
    },
  });

  return null;
}

function RecenterMap({
  latitud,
  longitud,
  zoomLevel = 15,
}: {
  latitud?: number;
  longitud?: number;
  zoomLevel?: number;
}) {
  const map = useMap();

  useEffect(() => {
    if (latitud !== undefined && longitud !== undefined) {
      map.setView([latitud, longitud], zoomLevel);
    }
  }, [latitud, longitud, zoomLevel, map]);

  return null;
}

export default function MapSelector({
  latitud,
  longitud,
  setLatitud,
  setLongitud,
  setManualOverride,
  zoomLevel,
}: Props) {
  const argentinaCenter: LatLngExpression = [-38.4161, -63.6167];

  return (
    <MapContainer
      center={argentinaCenter}
      zoom={5}
      style={{ height: '300px', width: '100%' }}
    >
      <TileLayer
        attribution="&copy; OpenStreetMap contributors"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <MapClickHandler
        setLatitud={setLatitud}
        setLongitud={setLongitud}
        setManualOverride={setManualOverride}
      />

      <RecenterMap
        latitud={latitud}
        longitud={longitud}
        zoomLevel={zoomLevel}
      />

      {latitud !== undefined && longitud !== undefined && (
        <Marker
          position={[latitud, longitud]}
          draggable
          eventHandlers={{
            dragend: (event: LeafletEvent) => {
              const marker = event.target;
              const newPos = marker.getLatLng();

              setLatitud(newPos.lat);
              setLongitud(newPos.lng);
              setManualOverride(true);
            },
          }}
        />
      )}
    </MapContainer>
  );
}
