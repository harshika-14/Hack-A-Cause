import {
  MapContainer,
  TileLayer,
  CircleMarker,
  Popup,
  Marker,
  Polyline,
  Tooltip,
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
            <Tooltip direction="top" offset={[0, -15]} permanent={false}>
              📍 {village.name}
            </Tooltip>
            
            <Popup maxWidth={300}>
              <div className="map-popup">
                <h3 style={{ margin: "8px 0", color: "#2563eb", fontWeight: "700" }}>
                  📍 {village.name}
                </h3>
                
                <div style={{ fontSize: "12px", lineHeight: "1.8", color: "#e0e0e0" }}>
                  <p style={{ margin: "6px 0" }}>
                    <strong>Status:</strong> 
                    <span style={{ 
                      marginLeft: "8px",
                      padding: "2px 8px",
                      borderRadius: "4px",
                      backgroundColor: getColor(status) + "40",
                      color: getColor(status),
                      fontWeight: "700"
                    }}>
                      {status}
                    </span>
                  </p>
                  
                  <p style={{ margin: "6px 0" }}>
                    <strong>💧 WSS:</strong> {village.WSS || "N/A"}
                  </p>
                  
                  <p style={{ margin: "6px 0" }}>
                    <strong>🚛 Tankers Available:</strong> {village.tankers || 0}
                  </p>
                  
                  <hr style={{ borderColor: "rgba(100,150,200,0.3)", margin: "8px 0" }} />
                  
                  <p style={{ margin: "6px 0" }}>
                    <strong>🌱 Soil Moisture:</strong> {village.soil || "N/A"}%
                  </p>
                  
                  <p style={{ margin: "6px 0" }}>
                    <strong>💦 Groundwater Level:</strong> {village.groundwater || "N/A"} m
                  </p>
                  
                  <p style={{ margin: "6px 0" }}>
                    <strong>🌡 Temperature:</strong> {village.temp || "N/A"}°C
                  </p>
                  
                  <hr style={{ borderColor: "rgba(100,150,200,0.3)", margin: "8px 0" }} />
                  
                  <p style={{ margin: "6px 0", fontSize: "11px", opacity: "0.7" }}>
                    <strong>📍 Coordinates:</strong> {village.lat?.toFixed(2)}, {village.lng?.toFixed(2)}
                  </p>
                </div>
                
                <button
                  onClick={() => setSelectedVillage(village)}
                  style={{
                    width: "100%",
                    padding: "8px",
                    marginTop: "10px",
                    backgroundColor: "#2563eb",
                    color: "white",
                    border: "none",
                    borderRadius: "6px",
                    fontSize: "12px",
                    fontWeight: "600",
                    cursor: "pointer",
                    transition: "all 0.3s"
                  }}
                  onMouseOver={(e) => {
                    e.target.style.backgroundColor = "#1d4ed8";
                    e.target.style.filter = "brightness(1.1)";
                  }}
                  onMouseOut={(e) => {
                    e.target.style.backgroundColor = "#2563eb";
                    e.target.style.filter = "brightness(1)";
                  }}
                >
                  👁 View Details
                </button>
              </div>
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