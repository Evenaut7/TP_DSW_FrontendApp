import { useEffect, useRef, useState } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import './MapPage.css';
import Navbar from '@/components/layout/Navbar/Navbar.tsx';
import { useApiGet } from '@/utils/api.ts';
import { API_BASE_URL } from '@/utils/api';

interface PDI {
  id: number;
  nombre: string;
  descripcion?: string;
  lng?: number;
  lat?: number;
  color?: string;
  imagen?: string;
  localidad?: {
    nombre: string;
  };
}

export default function MapPage() {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<maplibregl.Map | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);

  const {
    data: pdis,
    loading,
    error,
  } = useApiGet<PDI[]>('/api/puntosDeInteres');

  useEffect(() => {
    if (map.current) return;

    const apiKey = import.meta.env.VITE_MAPTILER_KEY;
    if (!apiKey || !mapContainer.current) return;

    map.current = new maplibregl.Map({
      container: mapContainer.current,
      style: `https://api.maptiler.com/maps/streets-v2/style.json?key=${apiKey}`,
      center: [-63.51, -37.53],
      zoom: 0,
    });

    map.current.on('load', () => setMapLoaded(true));

    map.current.addControl(new maplibregl.NavigationControl(), 'bottom-left');
    map.current.addControl(new maplibregl.ScaleControl(), 'bottom-right');

    return () => {
      map.current?.remove();
      map.current = null;
    };
  }, []);

  useEffect(() => {
    if (!mapLoaded || !map.current || !pdis) return;

    const validPDIs = pdis.filter(
      (p) => typeof p.lng === 'number' && typeof p.lat === 'number',
    );

    const features = validPDIs.map((p) => ({
      type: 'Feature',
      properties: {
        id: p.id,
        nombre: p.nombre,
        imagen: p.imagen,
        descripcion: p.descripcion || '',
        localidad: p.localidad?.nombre || '',
        color: p.color || '#3FB1CE',
      },
      geometry: {
        type: 'Point',
        coordinates: [p.lng!, p.lat!],
      },
    }));

    const geojson = {
      type: 'FeatureCollection',
      features,
    };

    if (map.current.getSource('pdis')) {
      (map.current.getSource('pdis') as any).setData(geojson);
      return;
    }

    map.current.addSource('pdis', {
      type: 'geojson',
      data: geojson,
    });

    map.current.addLayer({
      id: 'pdis-layer',
      type: 'circle',
      source: 'pdis',
      paint: {
        'circle-radius': 8,
        'circle-color': ['get', 'color'],
        'circle-stroke-width': 2,
        'circle-stroke-color': '#ffffff',
      },
    });

    map.current.on('click', 'pdis-layer', (e) => {
      const feature = e.features?.[0];
      if (!feature) return;

      const coordinates = (feature.geometry as any).coordinates.slice();
      const props = feature.properties;

      const popupHTML = `
        <div class="custom-popup">
          <img
            src=${API_BASE_URL}/public/${props.imagen}
            alt={props.nombre}
            class="card-image"
          />
          <h4>${props.nombre}</h4>
          ${props.descripcion ? `<p>${props.descripcion}</p>` : ''}
          ${props.localidad ? `<small>📍 ${props.localidad}</small>` : ''}
          <a href="/pdi/${props.id}">Ver detalles</a>
        </div>
      `;

      new maplibregl.Popup({
        offset: 20,
        closeButton: false,
        closeOnClick: true,
      })
        .setLngLat(coordinates)
        .setHTML(popupHTML)
        .addTo(map.current!);
    });

    map.current.on('mouseenter', 'pdis-layer', () => {
      map.current!.getCanvas().style.cursor = 'pointer';
    });

    map.current.on('mouseleave', 'pdis-layer', () => {
      map.current!.getCanvas().style.cursor = '';
    });

    if (validPDIs.length > 0) {
      const bounds = new maplibregl.LngLatBounds();
      validPDIs.forEach((p) => bounds.extend([p.lng!, p.lat!]));

      map.current.fitBounds(bounds, {
        padding: 50,
        maxZoom: 3,
        duration: 1500,
      });
    }
  }, [mapLoaded, pdis]);

  return (
    <>
      <Navbar />
      <div className="map-page">
        {loading && (
          <div className="loading-overlay">
            <div className="loading-card">
              <div className="spinner"></div>
              <p>Cargando puntos de interés...</p>
            </div>
          </div>
        )}

        {error && (
          <div className="error-overlay">
            <div className="error-card">⚠️ {error}</div>
          </div>
        )}

        <div ref={mapContainer} style={{ width: '100vw', height: '100vh' }} />
      </div>
    </>
  );
}
