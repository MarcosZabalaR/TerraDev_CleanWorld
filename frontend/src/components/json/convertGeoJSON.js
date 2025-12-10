import proj4 from "proj4";

// Define la proyección de origen (EPSG:25830) y destino (EPSG:4326)
const fromProj = "+proj=utm +zone=30 +ellps=GRS80 +units=m +no_defs";
const toProj = "+proj=longlat +datum=WGS84 +no_defs";

export function convertGeoJSON(geojson) {
  const convertedFeatures = geojson.features.map(feature => {
    const [x, y] = feature.geometry.coordinates;
    const [lon, lat] = proj4(fromProj, toProj, [x, y]);
    return {
      id: feature.id,
      latitude: lat,
      longitude: lon,
      properties: feature.properties,
    };
  });

  return { features: convertedFeatures };
}
