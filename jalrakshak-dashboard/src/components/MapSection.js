import {
  MapContainer,
  TileLayer,
  CircleMarker,
  Popup,
  Marker,
  Polyline,
  useMap
} from "react-leaflet";

import { useEffect, useState } from "react";
import L from "leaflet";

/* ---------------- Depot Location ---------------- */

const depot = {
  lat: 21.1458,
  lng: 79.0882
};

/* ---------------- Status Color ---------------- */

function getColor(status) {
  if (status === "SAFE") return "#2ecc71";
  if (status === "WATCH") return "#f1c40f";
  if (status === "WARNING") return "#e67e22";
  if (status === "CRITICAL") return "#e74c3c";
  if (status === "EMERGENCY") return "#8b0000";
  return "#999";
}

/* ---------------- Tanker Icon ---------------- */

const tankerIcon = L.divIcon({
  html: "🚛",
  className: "tanker-icon",
  iconSize: [30, 30]
});

/* ---------------- Fly Animation ---------------- */

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

/* ---------------- Main Component ---------------- */

function MapSection({ setSelectedVillage, selectedVillage, dispatch, villages, alerts }) {

  const [tankerPos, setTankerPos] = useState(null);

  /* -------- Tanker Movement -------- */

useEffect(() => {

  if (!dispatch || !selectedVillage || selectedVillage.tankers <= 0) return;
  if (!selectedVillage?.lat || !selectedVillage?.lng) return;

  let step = 0;
  const duration = 10000;
  const steps = 150;
  const intervalTime = duration / steps;

  const interval = setInterval(() => {

    step++;
    const progress = step / steps;

    const lat =
      depot.lat +
      (selectedVillage.lat - depot.lat) * progress;

    const lng =
      depot.lng +
      (selectedVillage.lng - depot.lng) * progress;

    setTankerPos([lat, lng]);

    if (step >= steps) {
      clearInterval(interval);
      setTankerPos(null);
      alert("🚛 Tanker Successfully Reached Destination!");
    }

  }, intervalTime);

  return () => clearInterval(interval);

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

      {/* -------- Village Markers -------- */}

      {villages.map((village) => {

        const status = village.status;

        return (
          <CircleMarker
            key={village.id}
            center={[village.lat, village.lng]}
            radius={12}
            pathOptions={{
              color: getColor(status),
              fillColor: getColor(status),
              fillOpacity: 0.8
            }}
            className={status === "EMERGENCY" ? "blink-marker" : ""}
            eventHandlers={{
              click: () => setSelectedVillage(village)
            }}
          >
            <Popup>
              <strong>{village.name}</strong>
              <br />
              Status: {status}
              <br />
              WSS: {village.WSS}
              <br />
              Tankers: {village.tankers}
            </Popup>
          </CircleMarker>
        );
      })}

      {/* -------- Route Line -------- */}

      {dispatch && selectedVillage && selectedVillage.tankers > 0 && (
        <Polyline
          positions={[
            [depot.lat, depot.lng],
            [selectedVillage.lat, selectedVillage.lng]
          ]}
          pathOptions={{ color: "#00c6ff", weight: 4 }}
        />
      )}

      {/* -------- Tanker Marker -------- */}

      {tankerPos && (
        <Marker position={tankerPos} icon={tankerIcon} />
      )}

    </MapContainer>
  );
}

export default MapSection;