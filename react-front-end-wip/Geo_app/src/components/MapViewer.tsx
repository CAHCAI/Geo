import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, GeoJSON, LayersControl } from "react-leaflet";
import "leaflet/dist/leaflet.css";

// Utility to convert DB rows to GeoJSON FeatureCollection
function toFeatureCollection(rows: any[]): GeoJSON.FeatureCollection {
  return {
    type: "FeatureCollection",
    features: rows.map((row: any) => ({
      type: "Feature",
      geometry: JSON.parse(row.geom_geojson),
      properties: { ...row },
    })),
  };
}

// Generates a unique key based on timestamp or data hash
// https://stackoverflow.com/questions/44155385/rendering-geojson-with-react-leaflet
const keyFunction = (data: GeoJSON.FeatureCollection) => {
  return `geojson-${data.features.length}-${Date.now()}`;
};

// layer styling so each layer has its own color
const styles = {
  assembly: { color: "blue", weight: 1, fillOpacity: 0.3 },
  senate: { color: "red", weight: 1, fillOpacity: 0.3 },
  congress: { color: "green", weight: 1, fillOpacity: 0.3 },
  health: { color: "purple", weight: 1, fillOpacity: 0.3 },
  la: { color: "orange", weight: 1, fillOpacity: 0.3 },
  rnsa: { color: "brown", weight: 1, fillOpacity: 0.3 },
  mssa: { color: "cyan", weight: 1, fillOpacity: 0.3 },
  pcsa: { color: "magenta", weight: 1, fillOpacity: 0.3 },
};

// Map viewer react component
const MapViewer: React.FC = () => {
  const [geoData, setGeoData] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const apiUrl = "http://localhost:8000/api/all-districts-data";
        const response = await fetch(apiUrl, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "X-Api-Key": import.meta.env.VITE_API_KEY,
          },
        });

        if (!response.ok) {
          throw new Error(
            `Fetch failed: ${response.status} ${response.statusText}`
          );
        }

        const data = await response.json();
        console.log(data);
        setGeoData(data);
      } catch (error) {
        console.error("Error fetching district data:", error);
      }
    };

    fetchData();
  }, []);

  // Early return while loading
  if (!geoData) {
    return <div>Loading map...</div>;
  }

  // Convert just the first district type (e.g. assembly_districts)
  const assembly = toFeatureCollection(geoData.assembly_districts);
  const senate = toFeatureCollection(geoData.senate_districts);
  const congressional = toFeatureCollection(geoData.congressional_districts);
  const hsa = toFeatureCollection(geoData.health_service_data);
  const mssa = toFeatureCollection(geoData.mssa);
  const pcsa = toFeatureCollection(geoData.pcsa);
  const rnsa = toFeatureCollection(geoData.rnsa);
  const laspa = toFeatureCollection(geoData.la_service_planning);

  // function for rendering json data when any given shape is clicked on the map
  const onEachFeature = (feature: any, layer: any) => {
    const props = { ...feature.properties };
    delete props.geom_geojson;

    const popupContent = Object.entries(props)
      .map(([k, v]) => `<strong>${k}:</strong> ${v}`)
      .join("<br/>");

    layer.bindPopup(popupContent);
  };

  return (
    <section>
      <MapContainer
        center={[38, -121]} // Somewhere in California
        zoom={6}
        style={{ width: "80vw", height: "70vh", zIndex:1 }}
      >
        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Render only the first district layer */}
        <LayersControl position="topright">
          <LayersControl.Overlay checked={false} name="Assembly Districts">
            // assembly district GeoJSON
            <GeoJSON
              key={keyFunction(assembly)}
              data={assembly}
              style={styles.assembly}
              onEachFeature={onEachFeature}
            />
          </LayersControl.Overlay>
          <LayersControl.Overlay checked={false} name="Senate Districts">
            <GeoJSON
              key={keyFunction(senate)}
              data={senate}
              style={styles.senate}
              onEachFeature={onEachFeature}
            />
          </LayersControl.Overlay>
          <LayersControl.Overlay checked={false} name="Congressional Districts">
            <GeoJSON
              key={keyFunction(congressional)}
              data={congressional}
              style={styles.congress}
              onEachFeature={onEachFeature}
            />
          </LayersControl.Overlay>
          <LayersControl.Overlay checked={false} name="Health Service Area">
            <GeoJSON
              key={keyFunction(hsa)}
              data={hsa}
              style={styles.health}
              onEachFeature={onEachFeature}
            />
          </LayersControl.Overlay>
          <LayersControl.Overlay
            checked={false}
            name="Medical Service Study Area"
          >
            <GeoJSON
              key={keyFunction(mssa)}
              data={mssa}
              style={styles.mssa}
              onEachFeature={onEachFeature}
            />
          </LayersControl.Overlay>
          <LayersControl.Overlay
            checked={false}
            name="Primary Care Shortage Area"
          >
            <GeoJSON
              key={keyFunction(pcsa)}
              data={pcsa}
              style={styles.pcsa}
              onEachFeature={onEachFeature}
            />
          </LayersControl.Overlay>
          <LayersControl.Overlay
            checked={false}
            name="Registered Nurse Shortage Area"
          >
            <GeoJSON
              key={keyFunction(rnsa)}
              data={rnsa}
              style={styles.rnsa}
              onEachFeature={onEachFeature}
            />
          </LayersControl.Overlay>
          <LayersControl.Overlay
            checked={false}
            name="LA Service Planning Area"
          >
            <GeoJSON
              key={keyFunction(laspa)}
              data={laspa}
              style={styles.la}
              onEachFeature={onEachFeature}
            />
          </LayersControl.Overlay>
        </LayersControl>
      </MapContainer>
    </section>
  );
};

export default MapViewer;
