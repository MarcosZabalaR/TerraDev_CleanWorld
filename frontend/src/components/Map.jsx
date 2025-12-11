import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from "react-leaflet";
import { useEffect } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const severityColors = {
  1: '#5F7336', LOW: '#5F7336',
  2: '#f97316', MEDIUM: '#f97316',
  3: '#ef4444', HIGH: '#ef4444'
};

const wasteTypeConfig = {
  envases: { color: '#eab308', icon: `<path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M10 5h4v-2a1 1 0 0 0 -1 -1h-2a1 1 0 0 0 -1 1v2z" /><path d="M14 3.5c0 1.626 .507 3.212 1.45 4.537l.05 .07a8.093 8.093 0 0 1 1.5 4.694v6.199a2 2 0 0 1 -2 2h-6a2 2 0 0 1 -2 -2v-6.2c0 -1.682 .524 -3.322 1.5 -4.693l.05 -.07a7.823 7.823 0 0 0 1.45 -4.537" /><path d="M7.003 14.803a2.4 2.4 0 0 0 .997 -.803a2.4 2.4 0 0 1 2 -1a2.4 2.4 0 0 1 2 1a2.4 2.4 0 0 0 2 1a2.4 2.4 0 0 0 2 -1a2.4 2.4 0 0 1 1 -.805" />` },
  papel: { color: '#3b82f6', icon: `<path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M12 3l8 4.5l0 9l-8 4.5l-8 -4.5l0 -9l8 -4.5" /><path d="M12 12l8 -4.5" /><path d="M12 12l0 9" /><path d="M12 12l-8 -4.5" /><path d="M16 5.25l-8 4.5" />` },
  vidrio: { color: '#10b981', icon: `<path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M8 21l8 0" /><path d="M12 16l0 5" /><path d="M17 5l1 6c0 3.012 -2.686 5 -6 5s-6 -1.988 -6 -5l1 -6" /><path d="M12 5m-5 0a5 2 0 1 0 10 0a5 2 0 1 0 -10 0" />` },
  restos: { color: '#6b7280', icon: `<path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M4 7l16 0" /><path d="M10 11l0 6" /><path d="M14 11l0 6" /><path d="M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12" /><path d="M9 7v-3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3" />` },
  pilas: { color: '#f59e0b', icon: `<path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M13 3l0 7l6 0l-8 11l0 -7l-6 0l8 -11" />` },
  ropa: { color: '#ec4899', icon: `<path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M15 4l6 2v5h-3v8a1 1 0 0 1 -1 1h-10a1 1 0 0 1 -1 -1v-8h-3v-5l6 -2a3 3 0 0 0 6 0" />` },
  aceite: { color: '#92400e', icon: `<path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M7.502 19.423c2.602 2.105 6.395 2.105 8.996 0c2.602 -2.105 3.262 -5.708 1.566 -8.546l-4.89 -7.26c-.42 -.625 -1.287 -.803 -1.936 -.397a1.376 1.376 0 0 0 -.41 .397l-4.893 7.26c-1.695 2.838 -1.035 6.441 1.567 8.546z" /><path d="M5 14h14" />` },
  industria: { color: '#5F7336', icon: `<path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M3 21h18" /><path d="M5 21v-12l5 4v-4l5 4h4" /><path d="M19 21v-8l-1.436 -9.574a.5 .5 0 0 0 -.495 -.426h-1.145a.5 .5 0 0 0 -.494 .418l-1.43 8.582" /><path d="M9 17h1" /><path d="M14 17h1" />` }
};

const createPinIcon = (color) => L.divIcon({
  html: `<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24">
    <path d="M12 2.5a7.5 7.5 0 0 0-7.5 7.5c0 5.2 5.3 10.7 6.7 12.1a1.3 1.3 0 0 0 1.6 0c1.4-1.4 6.7-6.9 6.7-12.1A7.5 7.5 0 0 0 12 2.5z" fill="${color}" />
    <circle cx="12" cy="10" r="3.2" fill="white" /></svg>`,
  className: "",
  iconSize: [48, 48],
  iconAnchor: [24, 48]
});

const createWasteIcon = (wasteType, severity) => {
  const config = wasteTypeConfig[wasteType];
  if (!config) return createPinIcon(severityColors[severity] || severityColors.MEDIUM);
  
  return L.divIcon({
    html: `<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24">
      <path d="M12 2.5a7.5 7.5 0 0 0-7.5 7.5c0 5.2 5.3 10.7 6.7 12.1a1.3 1.3 0 0 0 1.6 0c1.4-1.4 6.7-6.9 6.7-12.1A7.5 7.5 0 0 0 12 2.5z" fill="${config.color}" />
      <g transform="translate(6.5, 4.5) scale(0.45)" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none">
        ${config.icon}
      </g>
    </svg>`,
    className: "",
    iconSize: [48, 48],
    iconAnchor: [24, 48]
  });
};

// Pin por defecto (para el marcador temporal)
const DefaultPinIcon = createPinIcon('#ec4899'); // rosa fucsia chillón

function MapClickHandler({ onMapClick, isReportMode, reportCoords }) {
  const map = useMap();
  useMapEvents({
    click: (e) => {
      // Permitir clicks si está en modo reporte O si ya hay un reporte abierto (para cambiar ubicación)
      if (onMapClick && (isReportMode || reportCoords)) {
        onMapClick(e.latlng);
        const offsetLng = e.latlng.lng + 0.002;
        map.flyTo([e.latlng.lat, offsetLng], 18);
      }
    },
  });
  return null;
}

function SpotlightOverlay({ reportCoords, onPositionUpdate }) {
  const map = useMap();
  
  useEffect(() => {
    if (!reportCoords || !map) return;
    
    const updatePosition = () => {
      const point = map.latLngToContainerPoint([reportCoords.lat, reportCoords.lng]);
      const container = map.getContainer();
      const rect = container.getBoundingClientRect();
      const x = ((point.x / rect.width) * 100).toFixed(1);
      const y = (((point.y + 15) / rect.height) * 100).toFixed(1);
      onPositionUpdate?.({ x, y });
    };
    
    updatePosition();
    map.on('move', updatePosition);
    map.on('zoom', updatePosition);
    
    return () => {
      map.off('move', updatePosition);
      map.off('zoom', updatePosition);
    };
  }, [map, reportCoords, onPositionUpdate]);
  
  return null;
}

export default function Mapa({ 
  onMapClick, 
  reportCoords, 
  isReportMode, 
  reports = [],
  onReportClick,
  onPinPositionUpdate
}) {
  return (
    <MapContainer
      center={[36.7213, -4.4214]}
      zoom={14}
      scrollWheelZoom={true}
      style={{ height: '100%', width: '100%' }}
    >
      <TileLayer
        attribution="&copy; CleanWorld"
        url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
      />

      <MapClickHandler onMapClick={onMapClick} isReportMode={isReportMode} reportCoords={reportCoords} />
      <SpotlightOverlay reportCoords={reportCoords} onPositionUpdate={onPinPositionUpdate} />

      {/* Marcador temporal */}
      {reportCoords && (
        <Marker position={[reportCoords.lat, reportCoords.lng]} icon={DefaultPinIcon} />
      )}

      {/* Reportes guardados */}
      {reports.map(report => (
        <Marker 
          key={report.id} 
          position={[report.latitude, report.longitude]} 
          icon={report.residuo 
            ? createWasteIcon(report.residuo, report.severity)
            : createPinIcon(severityColors[report.severity] || severityColors.MEDIUM)
          }
          eventHandlers={{
            click: () => {
              // No permitir clicks en zonas cuando se está reportando
              if (!isReportMode && !reportCoords) {
                onReportClick?.(report);
              }
            }
          }}
        />
      ))}
    </MapContainer>
  );
}