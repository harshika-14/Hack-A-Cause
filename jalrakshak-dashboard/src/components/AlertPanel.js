import { useEffect } from "react";

function AlertPanel({ alerts }) {

  useEffect(() => {
    // Alert user when new critical/emergency villages detected
    if (alerts && alerts.length > 0) {
      const alertMessage = alerts.map(v => `${v.name}: ${v.status}`).join(", ");
      console.warn("🚨 Alert:", alertMessage);
    }
  }, [alerts]);

  if (!alerts || alerts.length === 0) {
    return (
      <div className="alert-status">
        ✅ All villages are stable. No critical alerts.
      </div>
    );
  }

  return (
    <div className="alert-status">
      <h3>🚨 Emergency Alerts</h3>
      {alerts.map((village, index) => (
        <div key={index} className="alert-item">
          ⚠️ <strong>{village.name}</strong> — Status: <span className={`status-${village.status.toLowerCase()}`}>{village.status}</span>
        </div>
    </div>
  );
}

export default AlertPanel;