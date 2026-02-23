import { useState } from "react";
import "./App.css";
import MapSection from "./components/MapSection";
import InfoPanel from "./components/InfoPanel";

function App() {
  
  const [selectedVillage, setSelectedVillage] = useState(null);
  const [dispatch, setDispatch] = useState(false);
  return (
    <div className="app">
      <header className="navbar">
        💧 JalRakshak – Rural Water Dashboard
      </header>

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
    </div>
  );
}

export default App;