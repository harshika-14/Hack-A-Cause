import { useEffect, useState } from "react";

function AlertPanel() {
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    function loadAlerts() {
      fetch("http://localhost:8000/villages")
        .then(res => res.json())
        .then(data => {
          const formatted = Object.keys(data).map(key => ({
            name: key,
            ...data[key]
          }));

          const emergencyVillages = formatted.filter(
            v => v.status === "EMERGENCY" || v.status === "CRITICAL"
          );

          setAlerts(emergencyVillages);
        })
        .catch(() => {});
    }

    loadAlerts();
    const interval = setInterval(loadAlerts, 5000);

    return () => clearInterval(interval);
  }, []);

  if (alerts.length === 0) {
    return (
      <div className="alert-panel safe">
        ✅ All villages are stable.
      </div>
    );
  }

  return (
    <div className="alert-panel danger">
      <h3>🚨 Emergency Alerts</h3>
      {alerts.map((v, index) => (
        <div key={index} className="alert-item">
          ⚠ {v.name} — {v.status}
        </div>
      ))}
    </div>
  );
}

export default AlertPanel;