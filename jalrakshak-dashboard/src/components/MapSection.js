import {
  MapContainer,
  TileLayer,
  CircleMarker,
  Popup,
  Marker,
  useMap
} from "react-leaflet";
import { villages, depot } from "../data";
import { useEffect, useState } from "react";

function getRisk(soil) {
  if (soil < 20) return "High";
  if (soil < 40) return "Moderate";
  return "Low";
}

function getColor(risk) {
  if (risk === "High") return "#ff4b2b";
  if (risk === "Moderate") return "#ff9800";
  return "#00c853";
}

function FlyToVillage({ selectedVillage }) {
  const map = useMap();

  useEffect(() => {
    if (selectedVillage) {
      map.flyTo(
        [selectedVillage.lat, selectedVillage.lng],
        12,
        { duration: 1.5 }
      );
    }
  }, [selectedVillage, map]);

  return null;
}

function MapSection({ setSelectedVillage, selectedVillage, dispatch }) {
  const [tankerPos, setTankerPos] = useState(null);

  useEffect(() => {
    if (dispatch && selectedVillage) {
      let progress = 0;
      const interval = setInterval(() => {
        progress += 0.02;

        const lat =
          depot.lat +
          (selectedVillage.lat - depot.lat) * progress;
        const lng =
          depot.lng +
          (selectedVillage.lng - depot.lng) * progress;

        setTankerPos([lat, lng]);

        if (progress >= 1) {
          clearInterval(interval);
        }
      }, 50);
    }
  }, [dispatch, selectedVillage]);

  return (
    <MapContainer
      center={[21.1458, 79.0882]}
      zoom={10}
      style={{ height: "100%", width: "100%", borderRadius: "15px" }}
    >
      <TileLayer
        attribution="© OpenStreetMap contributors"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <FlyToVillage selectedVillage={selectedVillage} />

      {villages.map((village) => {
        const risk = getRisk(village.soil);

        return (
          <CircleMarker
            key={village.id}
            center={[village.lat, village.lng]}
            radius={12}
            pathOptions={{
              color: getColor(risk),
              fillColor: getColor(risk),
              fillOpacity: 0.7
            }}
            eventHandlers={{
              click: () => setSelectedVillage(village)
            }}
          >
            <Popup>
              <strong>{village.name}</strong>
              <br />
              Risk: {risk}
            </Popup>
          </CircleMarker>
        );
      })}

      {/* Tanker Marker */}
      {tankerPos && (
        <Marker position={tankerPos}>
          <Popup>🚛 Tanker Moving</Popup>
        </Marker>
      )}
    </MapContainer>
  );
}

export default MapSection;