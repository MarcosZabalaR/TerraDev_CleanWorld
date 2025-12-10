# DOCUMENTACIÓN FRONT-END:

- Dependencias:
  - TablerIcons: npm install @tabler/icons-react
  - React Router Dom: npm install react-router-dom
  - Tailwind CSS: npm install -D tailwindcss postcss autoprefixer
  - React-Leaflet: npm install react-leaflet leaflet
    Cloudinary-React: npm install @cloudinary/react @cloudinary/url-gen

# 📘 DOCUMENTACIÓN COMPLETA DE REACT-LEAFLET (El punto 27 te sorprenderá!!!)

### _(Para proyectos React + Vite)_

---

# 📍 1. ¿Qué es React-Leaflet?

**React-Leaflet** es un conjunto de componentes que envuelven a **Leaflet**, permitiendo usar mapas de forma declarativa en React.

En Leaflet normal tú haces:

```jsx
const map = L.map("map");
```

Pero en React-Leaflet NO.

En cambio usas un componente:

```jsx
<MapContainer center={[lat, lng]} zoom={13} />
```

Leaflet funciona por dentro, pero tú solo usas **componentes React**.

---

# 📍 2. Instalación

```bash
npm install react-leaflet leaflet

```

Importa el CSS de Leaflet (obligatorio):

```jsx
import "leaflet/dist/leaflet.css";
```

---

# 📍 3. Componente básico del mapa

```jsx
import { MapContainer, TileLayer } from "react-leaflet";

function MapaBasico() {
  return (
    <MapContainercenter={[36.7213, -4.4214]}
      zoom={13}
      style={{ width: "100%", height: "400px" }}
    >
      <TileLayerattribution='&copy; OpenStreetMap contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
    </MapContainer>
  );
}

```

---

# 📍 4. Añadir un marcador

```jsx
import { Marker, Popup } from "react-leaflet";

<Marker position={[36.7213, -4.4214]}>
  <Popup>Hola, esto es Málaga</Popup>
</Marker>;
```

---

# 📍 5. Solución de iconos (Vite + Leaflet)

Leaflet no carga los iconos por defecto en Vite.

Solución:

```jsx
import L from "leaflet";
import iconUrl from "leaflet/dist/images/marker-icon.png";
import shadowUrl from "leaflet/dist/images/marker-shadow.png";

const DefaultIcon = L.icon({
  iconUrl,
  shadowUrl,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;
```

Pon eso en tu componente o en un archivo global.

---

# 📍 6. Añadir muchos marcadores desde un array

```jsx
const puntos = [
  { id: 1, nombre: "Punto 1", coords: [36.72, -4.42] },
  { id: 2, nombre: "Punto 2", coords: [36.71, -4.43] },
  { id: 3, nombre: "Punto 3", coords: [36.73, -4.4] },
];

{
  puntos.map((p) => (
    <Marker key={p.id} position={p.coords}>
      <Popup>{p.nombre}</Popup>
    </Marker>
  ));
}
```

---

# 📍 7. Eventos en el mapa (clic, movimientos…)

## 📌 Detectar clic en el mapa

React-Leaflet usa hooks:

```jsx
import { useMapEvents } from "react-leaflet";

function ClickHandler() {
  useMapEvents({
    click: (e) => {
      console.log("Coordenadas:", e.latlng);
    },
  });
  return null;
}
```

Y lo usas dentro del `MapContainer`:

```jsx
<MapContainer ...>
  <ClickHandler />
</MapContainer>

```

---

# 📍 8. Eventos en marcadores

```jsx
<Marker
  position={[36.72, -4.42]}
  eventHandlers={{
    click: () => {
      console.log("Clic en el marcador");
    },
  }}
/>
```

---

# 📍 9. Popups personalizados con JSX

Puedes poner **lo que quieras** dentro del popup:

```jsx
<Marker position={[36.72, -4.42]}>
  <Popup>
    <div>
      <h2 className="font-bold text-lg">Punto interesante</h2>
      <button className="bg-blue-500 text-white px-2 py-1 rounded">
        Ver más
      </button>
    </div>
  </Popup>
</Marker>
```

---

# 📍 10. Clustering (agrupar marcadores)

Usa la librería:

```bash
npm install react-leaflet-cluster

```

Ejemplo:

```jsx
import MarkerClusterGroup from "react-leaflet-cluster";

<MarkerClusterGroup>
  {puntos.map((p) => (
    <Marker key={p.id} position={p.coords}>
      <Popup>{p.nombre}</Popup>
    </Marker>
  ))}
</MarkerClusterGroup>;
```

---

# 📍 11. Mapas en modo oscuro

Usa proveedores de tiles distintos:

```jsx
<TileLayer url="https://tile.openstreetmap.fr/hot/{z}/{x}/{y}.png" />
```

O Stamen, Carto, etc.

---

# 📍 12. Añadir capas (satélite, calles, híbrido)

```jsx
import { LayersControl } from "react-leaflet";

const { BaseLayer } = LayersControl;

<LayersControl position="topright">
  <BaseLayer checked name="Calles">
    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
  </BaseLayer>

  <BaseLayer name="Satélite">
    <TileLayer url="https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png" />
  </BaseLayer>
</LayersControl>;
```

---

# 📍 13. Añadir tu ubicación (geolocalización)

```jsx
function UserLocation() {
  const map = useMapEvents({
    locationfound(e) {
      L.marker(e.latlng).addTo(map);
      map.setView(e.latlng, 15);
    },
  });

  useEffect(() => {
    map.locate();
  }, []);

  return null;
}
```

---

# 📍 14. Control personalizado (botones, UI propia)

```jsx
import { useMap } from "react-leaflet";

function ControlCentrar() {
  const map = useMap();

  return (
    <buttonstyle={{
        position: "absolute",
        top: 10,
        right: 10,
        padding: "10px",
        background: "white",
        borderRadius: "8px",
      }}
      onClick={() => map.setView([36.72, -4.42], 13)}
    >
      Centrar
    </button>
  );
}

```

---

# 📍 15. Guardar coordenadas en estado (por ejemplo, para un formulario)

```jsx
const [coords, setCoords] = useState(null);

function ClickMap() {
  useMapEvents({
    click(e) {
      setCoords(e.latlng);
    },
  });
  return null;
}
```

---

# 📍 **16. Dibujar líneas (polylines)**

Sirve para rutas, caminos, trayectos o unir puntos.

```jsx
import { Polyline } from "react-leaflet";

const ruta = [
  [36.7213, -4.4214],
  [36.722, -4.419],
  [36.723, -4.417],
];

<Polyline positions={ruta} color="blue" weight={4} />;
```

---

# 📍 **17. Dibujar polígonos**

Útil para resaltar zonas, áreas, barrios, recintos…

```jsx
import { Polygon } from "react-leaflet";

const zona = [
  [36.72, -4.42],
  [36.73, -4.43],
  [36.71, -4.44],
];

<Polygon positions={zona} color="red" />;
```

---

# 📍 **18. Dibujar círculos y círculos con radio**

### 🔵 Círculo visual

```jsx
import { Circle } from "react-leaflet";

<Circle center={[36.72, -4.42]} radius={200} color="green" />;
```

### 🔵 Círculo geográfico

```jsx
import { CircleMarker } from "react-leaflet";

<CircleMarker center={[36.72, -4.42]} radius={12} color="orange" />;
```

---

# 📍 **19. Cargar capas WMS (mapas oficiales)**

Permite cargar información oficial como catastros, ortofotos, etc.

```jsx
import { WMSTileLayer } from "react-leaflet";

<WMSTileLayerurl="https://www.ign.es/wms-inspire/ign-base"
  layers="IGNBaseTodo"
  format="image/png"
  transparent={true}
/>

```

---

# 📍 **20. Mini-mapa en una esquina**

Instala el plugin:

```bash
npm install leaflet-minimap

```

Código:

```jsx
import MiniMap from "leaflet-minimap";
import { useMap } from "react-leaflet";

function MiniMapa() {
  const map = useMap();

  useEffect(() => {
    const osm = L.tileLayer(
      "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
    );
    new MiniMap(osm, { toggleDisplay: true }).addTo(map);
  }, []);

  return null;
}
```

Úsalo dentro del `<MapContainer>`.

---

# 📍 **21. Heatmaps (mapas de calor)**

Instala el plugin:

```bash
npm install leaflet.heat react-leaflet-heatmap-layer

```

Ejemplo:

```jsx
import { HeatmapLayer } from "react-leaflet-heatmap-layer";

const puntos = [
  [36.72, -4.42, 0.8], // lat, lng, intensidad
  [36.73, -4.43, 0.5],
  [36.71, -4.41, 1.0],
];

<HeatmapLayerpoints={puntos}
  latitudeExtractor={(p) => p[0]}
  longitudeExtractor={(p) => p[1]}
  intensityExtractor={(p) => p[2]}
/>

```

---

# 📍 **22. Geocodificación (buscar dirección → coordenadas)**

Instala un plugin de geosearch:

```bash
npm install leaflet-geosearch

```

Ejemplo:

```jsx
import { GeoSearchControl, OpenStreetMapProvider } from "leaflet-geosearch";
import { useMap } from "react-leaflet";

function Buscador() {
  const map = useMap();

  useEffect(() => {
    const provider = new OpenStreetMapProvider();
    const searchControl = new GeoSearchControl({
      provider,
      style: "bar",
    });

    map.addControl(searchControl);
    return () => map.removeControl(searchControl);
  }, []);

  return null;
}
```

---

# 📍 **23. Rotar el mapa (map rotation)**

Leaflet no trae esto de serie, pero hay un plugin:

```bash
npm install leaflet-rotatedmarker

```

Ejemplo para un icono girado según dirección:

```jsx
import "leaflet-rotatedmarker";

<Markerposition={[36.72, -4.42]}
  rotationAngle={120}
  rotationOrigin="center"
/>

```

---

# 📍 **24. Animar movimiento de marcadores**

Con latlng interpolation:

```jsx
import L from "leaflet";
import { useEffect } from "react";

function MarkerAnimado() {
  const map = useMap();

  useEffect(() => {
    const marker = L.marker([36.72, -4.42]).addTo(map);

    let i = 0;
    const ruta = [
      [36.72, -4.42],
      [36.721, -4.421],
      [36.722, -4.422],
    ];

    const interval = setInterval(() => {
      marker.setLatLng(ruta[i]);
      i = (i + 1) % ruta.length;
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return null;
}
```

---

# 📍 **25. Sincronizar varios mapas**

Instalar plugin:

```bash
npm install leaflet.sync

```

Código:

```jsx
import "leaflet.sync";
import { useMap } from "react-leaflet";

function SyncMap({ otherMap }) {
  const map = useMap();

  useEffect(() => {
    map.sync(otherMap);
  }, []);

  return null;
}
```

---

# 📍 **26. Dibujar área a mano (dibujar y editar shapes)**

Instala plugin:

```bash
npm install leaflet-draw

```

Y úsalo:

```jsx
import "leaflet-draw";
import { useMap } from "react-leaflet";

function HerramientasDibujo() {
  const map = useMap();

  useEffect(() => {
    const draw = new L.Control.Draw({
      draw: {
        polyline: true,
        polygon: true,
        circle: true,
        rectangle: true,
        marker: true,
      },
    });

    map.addControl(draw);

    map.on("draw:created", (e) => {
      map.addLayer(e.layer);
    });
  }, []);

  return null;
}
```

---

# 📍 **27. Cargar GeoJSON**

Muy útil para datos oficiales (barrios, municipios, zonas…).

```jsx
import { GeoJSON } from "react-leaflet";

<GeoJSONdata={miGeoJson}
  style={{ color: "blue", weight: 2 }}
  onEachFeature={(feature, layer) => {
    layer.bindPopup(feature.properties.nombre);
  }}
/>
⠀⠀⠀⠀⠀⠀⠀
```

---

# 📍 **28. Cambiar cursor, capa activa, y estilo dinámico**

```jsx
useMapEvents({
  mouseover() {
    map.getContainer().style.cursor = "pointer";
  },
  mouseout() {
    map.getContainer().style.cursor = "";
  },
});
```

---

# 📍 **29. Control de escala**

```jsx
import { ScaleControl } from "react-leaflet";

<ScaleControl position="bottomleft" />;
```

---

# 📍 **30. Control de capas personalizado**

```jsx
import { LayersControl } from "react-leaflet";

const { BaseLayer, Overlay } = LayersControl;

<LayersControl position="topright">
  <BaseLayer checked name="Calles">
    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
  </BaseLayer>

  <Overlay name="Zona Roja">
    <Polygon positions={zona} color="red" />
  </Overlay>
</LayersControl>;
```

---

# 📍 **31. Cargar imágenes encima del mapa (overlay)**

```jsx
import { ImageOverlay } from "react-leaflet";

<ImageOverlayurl="/mi-imagen.png"
  bounds={[
    [36.70, -4.45],
    [36.75, -4.40],
  ]}
/>

```

---

# 📍 **32. Hacer zoom al contenido automáticamente**

```jsx
const map = useMap();
map.fitBounds(puntos.map((p) => p.coords));
```

---

# 📍 **33. Mapa con límites maximales (evitar mover fuera)**

```jsx
<MapContainer
  center={[36.72, -4.42]}
  zoom={13}
  maxBounds={[
    [36.7, -4.45],
    [36.75, -4.4],
  ]}
  maxBoundsViscosity={1.0}
/>
```

---

# 📍 **34. Modo offline (tiles desde carpeta local)**

```jsx
<TileLayer url="/tiles/{z}/{x}/{y}.png" />
```

---

# 📍 **35. Integrarlo con APIs externas (Google, Mapbox, HERE, etc.)**

Ejemplo con Mapbox:

```jsx
<TileLayer
  url={`https://api.mapbox.com/styles/v1/mapbox/streets-v11/tiles/{z}/{x}/{y}?access_token=${MAPBOX_TOKEN}`}
/>
```
