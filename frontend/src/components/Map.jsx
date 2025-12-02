import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix para que el icono del marker funcione en Vite
import iconUrl from "leaflet/dist/images/marker-icon.png";
import shadowUrl from "leaflet/dist/images/marker-shadow.png";

const defaultIcon = L.icon({
  iconUrl,
  shadowUrl,
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = defaultIcon;

export default function Mapa() {
  return (
    <MapContainer
      center={[36.7213, -4.4214]} // Málaga por ejemplo
      zoom={14}
      scrollWheelZoom={true}
      className="rounded-xl shadow-lg grow"
    >
      <TileLayer
        attribution='&copy; OpenStreetMap contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <Marker position={[36.7213, -4.4214]}>
        <Popup>
          ¡Hola! Esto es <b>Málaga</b>.
        </Popup>
      </Marker>
    </MapContainer>
  );
}
