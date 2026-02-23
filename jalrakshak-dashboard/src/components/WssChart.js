import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend
} from "chart.js";

import { Line } from "react-chartjs-2";
import { useEffect, useState } from "react";

ChartJS.register(
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend
);

function WssChart({ village }) {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    if (!village) return;

    // Try to fetch historical data for the village
    fetch(`http://172.16.216.219:8000/history/${village.name}`)
      .then(res => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then(data => {
        console.log(`✅ History data for ${village.name}:`, data);
        // Ensure data is an array of 7 days
        if (Array.isArray(data)) {
          setHistory(data.slice(0, 7));
        } else {
          setHistory(data);
        }
      })
      .catch(err => {
        console.warn(`⚠️ Could not fetch history for ${village.name}:`, err.message);
        // fallback dummy data if history API not ready
        const dummy = Array.from({ length: 7 }, () =>
          Math.floor(Math.random() * 100)
        );
        setHistory(dummy);
      });
  }, [village]);

  if (!village) return null;

  const data = {
    labels: ["Day 1", "Day 2", "Day 3", "Day 4", "Day 5", "Day 6", "Day 7"],
    datasets: [
      {
        label: "WSS Trend",
        data: history,
        borderColor: "#00c6ff",
        backgroundColor: "rgba(0,198,255,0.2)",
        tension: 0.4
      }
    ]
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { display: false }
    },
    scales: {
      y: {
        min: 0,
        max: 100
      }
    }
  };

  return (
    <div className="chart-container">
      <h4>📈 WSS Trend (Last 7 Days)</h4>
      <Line data={data} options={options} />
    </div>
  );
}

export default WssChart;