import { motion } from "framer-motion";

function calculateWSI(village) {
  const soilFactor = 100 - village.soil;
  const groundwaterFactor = village.groundwater * 10;
  const tempFactor = village.temp;

  return Math.round(
    0.4 * soilFactor +
    0.4 * groundwaterFactor +
    0.2 * tempFactor
  );
}

function InfoPanel({ village, setDispatch }) {

  if (!village) {
    return (
      <motion.div
        className="info-card collapsed"
        initial={{ height: 120 }}
        animate={{ height: 120 }}
      >
        <h3>Select a village</h3>
      </motion.div>
    );
  }

  const wsi = calculateWSI(village);

  let risk;
  if (wsi > 70) risk = "High";
  else if (wsi > 45) risk = "Moderate";
  else risk = "Low";

  return (
    <motion.div
      className="info-card expanded"
      initial={{ height: 120 }}
      animate={{ height: 350 }}
      transition={{ duration: 0.5 }}
    >
      <h2>{village.name}</h2>

      <div className={`risk-badge ${risk.toLowerCase()}`}>
        {risk} Risk
      </div>

      <p>📊 Water Stress Index: {wsi}</p>
      <p>🌱 Soil Moisture: {village.soil}%</p>
      <p>💧 Groundwater Level: {village.groundwater} m</p>
      <p>🌡 Temperature: {village.temp}°C</p>

      <button
        className={`dispatch-btn ${risk === "High" ? "attention" : ""}`}
        onClick={() => setDispatch(true)}
        disabled={!village}
      >
        🚛 Dispatch Tanker
      </button>
    </motion.div>
  );
}

export default InfoPanel;