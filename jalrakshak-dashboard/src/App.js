import { useState } from "react";
import "./App.css";
import MapSection from "./components/MapSection";
import InfoPanel from "./components/InfoPanel";
import StatsBar from "./components/StatsBar";
import AlertPanel from "./components/AlertPanel";
import WssChart from "./components/WssChart";

function App() {
  const [selectedVillage, setSelectedVillage] = useState(null);
  const [dispatch, setDispatch] = useState(false);

  return (
    <div className="app">
      <header className="navbar">
        💧 JalRakshak – Rural Water Dashboard
      </header>

      <div className="stats-bar">
        <StatsBar />
      </div>

      <div className="alert-panel safe">
        <AlertPanel />
      </div>

      {/* Main Section */}
      <div className="content">
        <div className="map-section">
          <MapSection
            setSelectedVillage={setSelectedVillage}
            selectedVillage={selectedVillage}
            dispatch={dispatch}
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