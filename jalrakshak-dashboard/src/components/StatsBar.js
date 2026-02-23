import { useEffect, useState } from "react";

function StatsBar({ villages }) {
  const [stats, setStats] = useState({
    totalVillages: 0,
    critical: 0,
    emergency: 0,
    totalTankers: 0
  });

  useEffect(() => {
    if (villages && villages.length > 0) {
      const totalVillages = villages.length;
      const critical = villages.filter(v => v.status === "CRITICAL").length;
      const emergency = villages.filter(v => v.status === "EMERGENCY").length;
      const totalTankers = villages.reduce((sum, v) => sum + (v.tankers || 0), 0);

      setStats({ totalVillages, critical, emergency, totalTankers });
    }
  }, [villages]);

  return (
    <>
      <div className="stat-card">
        <h4>Total Villages</h4>
        <h2>{stats.totalVillages}</h2>
      </div>

      <div className="stat-card">
        <h4>Critical</h4>
        <h2>{stats.critical}</h2>
      </div>

      <div className="stat-card">
        <h4>Emergency</h4>
        <h2>{stats.emergency}</h2>
      </div>

      <div className="stat-card">
        <h4>Total Tankers</h4>
        <h2>{stats.totalTankers}</h2>
      </div>
    </>
  );
}

export default StatsBar;