import { useEffect, useMemo, useRef, useState } from 'react';
import { useTheme } from '@/hooks/useTheme';

type MapPoint = {
  id: number | string;
  title?: string;
  code?: string;
  address?: string;
  price?: number;
  lat: number;
  lng: number;
};

type ImoveisMapProps = {
  points: MapPoint[];
  className?: string;
};

declare global {
  interface Window {
    L?: any;
  }
}

const LEAFLET_JS = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
const LEAFLET_CSS = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
const TILE_LIGHT = 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png';
const TILE_DARK = 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png';
const TILE_ATTRIBUTION =
  '&copy; OpenStreetMap contributors &copy; CARTO';

let leafletPromise: Promise<any> | null = null;

const loadLeaflet = () => {
  if (leafletPromise) {
    return leafletPromise;
  }

  leafletPromise = new Promise((resolve, reject) => {
    if (window.L) {
      resolve(window.L);
      return;
    }

    const existingLink = document.querySelector<HTMLLinkElement>(
      'link[data-leaflet="true"]'
    );
    if (!existingLink) {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = LEAFLET_CSS;
      link.dataset.leaflet = 'true';
      document.head.appendChild(link);
    }

    const existingScript = document.querySelector<HTMLScriptElement>(
      'script[data-leaflet="true"]'
    );
    if (existingScript) {
      existingScript.addEventListener('load', () => resolve(window.L));
      existingScript.addEventListener('error', () => reject(new Error('leaflet-load-failed')));
      return;
    }

    const script = document.createElement('script');
    script.src = LEAFLET_JS;
    script.async = true;
    script.dataset.leaflet = 'true';
    script.onload = () => resolve(window.L);
    script.onerror = () => reject(new Error('leaflet-load-failed'));
    document.body.appendChild(script);
  });

  return leafletPromise;
};

const formatPrice = (value?: number) => {
  if (!value) {
    return '';
  }
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    maximumFractionDigits: 0
  }).format(value);
};

export const ImoveisMap = ({ points, className }: ImoveisMapProps) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<any>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const { resolvedTheme } = useTheme();
  const tileUrl = useMemo(
    () => (resolvedTheme === 'dark' ? TILE_DARK : TILE_LIGHT),
    [resolvedTheme],
  );

  useEffect(() => {
    let isMounted = true;

    loadLeaflet()
      .then(L => {
        if (!isMounted || !containerRef.current) {
          return;
        }

        if (mapRef.current) {
          mapRef.current.remove();
          mapRef.current = null;
        }

        L.Icon.Default.mergeOptions({
          iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
          iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
          shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png'
        });

        const map = L.map(containerRef.current, {
          zoomControl: true,
          attributionControl: true,
          scrollWheelZoom: false
        });
        mapRef.current = map;

        L.tileLayer(tileUrl, {
          maxZoom: 19,
          attribution: TILE_ATTRIBUTION
        }).addTo(map);

        const latLngs = points.map(point => [point.lat, point.lng]);
        if (latLngs.length > 0) {
          const bounds = L.latLngBounds(latLngs);
          map.fitBounds(bounds, { padding: [40, 40] });
        } else {
          map.setView([-14.235, -51.9253], 4);
        }

        points.forEach(point => {
          const marker = L.marker([point.lat, point.lng]).addTo(map);
          const price = formatPrice(point.price);
          const popup = `
            <div style="font-family: Inter, sans-serif; min-width: 180px;">
              ${
                point.title
                  ? `<div style="font-weight:600; color:#111827;">${point.title}</div>`
                  : ''
              }
              ${
                point.code
                  ? `<div style="color:#6b7280; font-size:11px; margin-top:2px;">${point.code}</div>`
                  : ''
              }
              ${
                point.address
                  ? `<div style="color:#6b7280; font-size:12px; margin-top:4px;">${point.address}</div>`
                  : ''
              }
              ${
                price
                  ? `<div style="color:hsl(var(--accent)); font-weight:600; margin-top:8px;">${price}</div>`
                  : ''
              }
            </div>
          `;
          marker.bindPopup(popup, { closeButton: true });
        });
      })
      .catch(() => {
        if (isMounted) {
          setLoadError('Não foi possível carregar o mapa neste momento.');
        }
      });

    return () => {
      isMounted = false;
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [points, tileUrl]);

  if (loadError) {
    return (
      <div className="flex h-full items-center justify-center rounded-2xl border border-dashed border-gray-200 bg-gray-50 text-sm text-gray-500">
        {loadError}
      </div>
    );
  }

  return <div ref={containerRef} className={className} />;
};
