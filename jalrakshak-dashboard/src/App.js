import { useState, useEffect } from "react";
import "./App.css";
import MapSection from "./components/MapSection";
import InfoPanel from "./components/InfoPanel";
import StatsBar from "./components/StatsBar";
import AlertPanel from "./components/AlertPanel";
import WssChart from "./components/WssChart";

function App() {
  const [selectedVillage, setSelectedVillage] = useState(null);
  const [dispatch, setDispatch] = useState(false);
  const [villages, setVillages] = useState([]);
  const [alerts, setAlerts] = useState([]);

  /* -------- Fetch Backend Data -------- */
  useEffect(() => {
    function loadData() {
      fetch("http://172.16.216.219:8000/villages")
        .then(res => res.json())
        .then(data => {
          const formatted = Object.keys(data).map((key, index) => ({
            id: index,
            name: key,
            ...data[key],
            lat: data[key].lat || 21.1458,
            lng: data[key].lng || 79.0882
          }));

          setVillages(formatted);

          // Calculate alerts based on status
          const criticalAndEmergency = formatted.filter(
            v => v.status === "EMERGENCY" || v.status === "CRITICAL"
          );
          setAlerts(criticalAndEmergency);
        })
        .catch(() => {
          // Mock data fallback
          const mockData = {
            "Ashta": { status: "WATCH", WSS: "Yes", tankers: 2, soil: 45, groundwater: 8, temp: 32, lat: 21.5, lng: 78.9 },
            "Karegaon": { status: "SAFE", WSS: "Yes", tankers: 1, soil: 65, groundwater: 12, temp: 30, lat: 21.2, lng: 79.3 },
            "Pulgaon": { status: "CRITICAL", WSS: "No", tankers: 3, soil: 25, groundwater: 4, temp: 35, lat: 20.9, lng: 79.1 },
            "Jalgaon": { status: "WARNING", WSS: "Partial", tankers: 2, soil: 35, groundwater: 6, temp: 34, lat: 21.4, lng: 79.5 },
            "Murtijapur": { status: "EMERGENCY", WSS: "No", tankers: 4, soil: 15, groundwater: 2, temp: 36, lat: 20.7, lng: 78.8 }
          };

          const formatted = Object.keys(mockData).map((key, index) => ({
            id: index,
            name: key,
            ...mockData[key]
          }));
          setVillages(formatted);

          const criticalAndEmergency = formatted.filter(
            v => v.status === "EMERGENCY" || v.status === "CRITICAL"
          );
          setAlerts(criticalAndEmergency);
        });
    }

    loadData();
    const interval = setInterval(loadData, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="app">
      <header className="navbar">
        💧 JalRakshak – Rural Water Dashboard
      </header>

      <div className="stats-bar">
        <StatsBar villages={villages} />
      </div>

      <div className={alerts.length > 0 ? "alert-panel danger" : "alert-panel safe"}>
        <AlertPanel alerts={alerts} />
      </div>

      {/* Main Section */}
      <div className="content">
        <div className="map-section">
          <MapSection
            setSelectedVillage={setSelectedVillage}
            selectedVillage={selectedVillage}
            dispatch={dispatch}
            villages={villages}
            alerts={alerts}
          />
        </div>

        <div className="info-section">
          <InfoPanel
            village={selectedVillage}
            setDispatch={setDispatch}
          />
        </div>
      </div>

      {/* WSS Chart - Scrollable */}
      <div className="bottom-section">
        <WssChart village={selectedVillage} />
      </div>
    </div>
  );
}

export default App;