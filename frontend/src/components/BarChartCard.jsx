import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { ChevronDown } from "lucide-react";
import { useState, useRef, useEffect } from "react";

export default function BarChartCard({ data }) {
  const [range, setRange] = useState(12);
  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredData = data ? data.slice(-range) : [];

  return (
    <article className="dashboard-card analytics-card">
      <div className="chart-title">
        <h2>Score Trend</h2>
        <div className="range-selector-wrap" ref={containerRef}>
          <button
            type="button"
            className="range-selector-btn"
            onClick={() => setOpen(!open)}
          >
            <span>{range === 999 ? "All Sessions" : `Last ${range} Sessions`}</span>
            <ChevronDown size={14} />
          </button>
          {open && (
            <div className="range-dropdown">
              <button
                type="button"
                className={`range-option-btn ${range === 7 ? "selected" : ""}`}
                onClick={() => {
                  setRange(7);
                  setOpen(false);
                }}
              >
                Last 7 Sessions
              </button>
              <button
                type="button"
                className={`range-option-btn ${range === 12 ? "selected" : ""}`}
                onClick={() => {
                  setRange(12);
                  setOpen(false);
                }}
              >
                Last 12 Sessions
              </button>
              <button
                type="button"
                className={`range-option-btn ${range === 999 ? "selected" : ""}`}
                onClick={() => {
                  setRange(999);
                  setOpen(false);
                }}
              >
                All Sessions
              </button>
            </div>
          )}
        </div>
      </div>
      <div className="bar-chart">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={filteredData}>
            <CartesianGrid
              vertical={false}
              stroke="#4a4455"
              strokeOpacity={0.3}
            />
            <XAxis
              dataKey="session"
              tick={{ fill: "#958da1", fontSize: 11 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              domain={[0, 100]}
              tick={{ fill: "#958da1", fontSize: 11 }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              contentStyle={{
                background: "#1c2b3c",
                border: "1px solid #4a4455",
              }}
            />
            <Bar dataKey="score" radius={[4, 4, 0, 0]} fill="#7c3aed" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </article>
  );
}
