import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const severityColors = {
  // Soportar ambos formatos (números para compatibilidad legacy)
  1: '#5F7336', // LOW - verde oscuro (brand-primary)
  2: '#f97316', // MEDIUM - naranja
  3: '#ef4444', // HIGH - rojo
  // Formato de base de datos
  LOW: '#5F7336',
  MEDIUM: '#f97316',
  HIGH: '#ef4444'
};

const createPinIcon = (color) => {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24">
    <path d="M12 2.5a7.5 7.5 0 0 0-7.5 7.5c0 5.2 5.3 10.7 6.7 12.1a1.3 1.3 0 0 0 1.6 0c1.4-1.4 6.7-6.9 6.7-12.1A7.5 7.5 0 0 0 12 2.5z" fill="${color}" />
    <circle cx="12" cy="10" r="3.2" fill="white" /></svg>`;
  
  return L.divIcon({
    html: svg,
    className: "",
    iconSize: [48, 48],
    iconAnchor: [24, 48],
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

export default function Mapa({ 
  onMapClick, 
  reportCoords, 
  isReportMode, 
  reports = [],
  onReportClick 
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

      {/* Marcador temporal */}
      {reportCoords && (
        <Marker position={[reportCoords.lat, reportCoords.lng]} icon={DefaultPinIcon} />
      )}

      {/* Reportes guardados */}
      {reports.map(report => (
        <Marker 
          key={report.id} 
          position={[report.latitude, report.longitude]} 
          icon={createPinIcon(severityColors[report.severity] || severityColors.MEDIUM)}
          eventHandlers={{
            click: () => onReportClick?.(report)
          }}
        />
      ))}
    </MapContainer>
  );
}