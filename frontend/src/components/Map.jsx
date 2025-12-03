import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const PinSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24">
  <path d="M12 2.5a7.5 7.5 0 0 0-7.5 7.5c0 5.2 5.3 10.7 6.7 12.1a1.3 1.3 0 0 0 1.6 0c1.4-1.4 6.7-6.9 6.7-12.1A7.5 7.5 0 0 0 12 2.5z" fill="#ff2d55" />
  <circle cx="12" cy="10" r="3.2" fill="white" /></svg>`;

const PinIcon = L.divIcon({
  html: PinSvg,
  className: "",
  iconSize: [48, 48],
  iconAnchor: [24, 48],
});

export default function Mapa({ className }) {
  return (
    <MapContainer
      center={[36.7213, -4.4214]}
      zoom={14}
      scrollWheelZoom={true}
      className={className}
      style={{ height: '100%', width: '100%' }}
    >
      <TileLayer
        attribution="&copy; CleanWorld"
        url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
      />

      <Marker position={[36.7302, -4.4336]} icon={PinIcon}>
        <Popup>La casa del Pablo ☣️</Popup>
      </Marker>
    </MapContainer>
  );
}
