import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { ChevronDown } from "lucide-react";
import { useState, useRef, useEffect } from "react";

export default function ChartCard({ data }) {
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
    <section className="dashboard-card chart-card">
      <div className="card-heading">
        <h3>Performance Overview</h3>
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
      <div className="performance-chart">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={filteredData} margin={{ left: -17, right: 8, top: 10 }}>
            <defs>
              <linearGradient id="performanceArea" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#7c3aed" stopOpacity=".25" />
                <stop offset="100%" stopColor="#4cd7f6" stopOpacity="0" />
              </linearGradient>
            </defs>
            <CartesianGrid
              vertical={false}
              stroke="#4a4455"
              strokeOpacity=".28"
            />
            <XAxis
              dataKey="session"
              tickLine={false}
              axisLine={false}
              tick={{ fill: "#958da1", fontSize: 11 }}
            />
            <YAxis
              domain={[0, 100]}
              ticks={[0, 25, 50, 75, 100]}
              tickLine={false}
              axisLine={false}
              tick={{ fill: "#958da1", fontSize: 11 }}
            />
            <Tooltip
              contentStyle={{
                background: "#1c2b3c",
                border: "1px solid #4a4455",
                borderRadius: 6,
              }}
              labelStyle={{ color: "#ccc3d8" }}
              itemStyle={{ color: "#fff" }}
            />
            <Area
              type="monotone"
              dataKey="score"
              stroke="url(#performanceStroke)"
              strokeWidth={3}
              fill="url(#performanceArea)"
              dot={{ r: 3, fill: "#d2bbff", stroke: "#0d0d18", strokeWidth: 2 }}
              activeDot={{ r: 5 }}
            />
            <linearGradient id="performanceStroke" x1="0" x2="1" y1="0" y2="0">
              <stop offset="0%" stopColor="#732ee4" />
              <stop offset="100%" stopColor="#4cd7f6" />
            </linearGradient>
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}

