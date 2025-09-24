import { useEffect, useMemo, useRef } from 'react';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { Button } from '@/components/ui/button';

export type NearbyMarker = { id: string; pos: [number, number]; name: string };

export default function MapView({
  userPosition,
  markers,
  onBook,
}: {
  userPosition: [number, number] | null;
  markers: NearbyMarker[];
  onBook: () => void;
}) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<L.Map | null>(null);
  const userIcon = useMemo(() => L.icon({
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
  }), []);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;
    const map = L.map(containerRef.current).setView([20.5937, 78.9629], 5);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
    }).addTo(map);
    mapRef.current = map;
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    // Clear previous layer group
    map.eachLayer(layer => {
      // keep tile layer
      if ((layer as any).getAttribution) return;
      map.removeLayer(layer);
    });

    if (userPosition) {
      L.marker(userPosition, { icon: userIcon }).addTo(map).bindPopup('Your Location');
      map.setView(userPosition, 13);
    }

    markers.forEach(m => {
      L.marker(m.pos).addTo(map).bindPopup(
        `<div style="display:flex;flex-direction:column;gap:6px">` +
        `<div style="font-weight:600">${m.name}</div>` +
        `<button id="book-${m.id}" style="border:1px solid #e5e7eb;padding:4px 8px;border-radius:6px;cursor:pointer;background:white">Book</button>` +
        `</div>`
      );
    });

    // Attach click handlers after popup opens
    map.on('popupopen', (e: any) => {
      const idMatch = (e.popup._content as string).match(/book-([^"]+)/);
      const id = idMatch?.[1];
      if (!id) return;
      const btn = document.getElementById(`book-${id}`);
      if (btn) btn.onclick = onBook;
    });
  }, [markers, userPosition, userIcon, onBook]);

  return <div ref={containerRef} style={{ height: '100%', width: '100%' }} />;
}


