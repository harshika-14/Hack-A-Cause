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

    fetch(`http://localhost:8000/history/${village.name}`)
      .then(res => res.json())
      .then(data => {
        setHistory(data);
      })
      .catch(() => {
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