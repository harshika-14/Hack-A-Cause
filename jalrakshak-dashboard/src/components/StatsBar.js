import { useEffect, useState } from "react";

function StatsBar() {
  const [villages, setVillages] = useState([]);

  useEffect(() => {
    fetch("http://localhost:3000")
      .then(res => res.json())
      .then(data => {
        const formatted = Object.keys(data).map(key => ({
          name: key,
          ...data[key]
        }));
        setVillages(formatted);
      })
      .catch(() => {});
  }, []);
  const totalVillages = villages.length;
  const critical = villages.filter(v => v.status === "CRITICAL").length;
  const emergency = villages.filter(v => v.status === "EMERGENCY").length;
  const totalTankers = villages.reduce(
    (sum, v) => sum + (v.tankers || 0),
    0
  );

  return (
    <>
      <div className="stat-card">
        <h4>Total Villages</h4>
        <h2>{totalVillages}</h2>
      </div>

      <div className="stat-card">
        <h4>Critical</h4>
        <h2>{critical}</h2>
      </div>

      <div className="stat-card">
        <h4>Emergency</h4>
        <h2>{emergency}</h2>
      </div>

      <div className="stat-card">
        <h4>Total Tankers</h4>
        <h2>{totalTankers}</h2>
      </div>
    </>
  );
}

export default StatsBar;