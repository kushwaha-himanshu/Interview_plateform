import {
  PolarAngleAxis,
  PolarGrid,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

export default function RadarChartCard({ data }) {
  return (
    <article className="dashboard-card analytics-card">
      <h2>Skill Performance</h2>
      <div className="radar-chart">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart data={data}>
            <PolarGrid stroke="#4a4455" />
            <PolarAngleAxis
              dataKey="skill"
              tick={{ fill: "#ccc3d8", fontSize: 11 }}
            />
            <Radar
              dataKey="value"
              stroke="#d2bbff"
              fill="#7c3aed"
              fillOpacity={0.22}
            />
            <Tooltip
              contentStyle={{
                background: "#1c2b3c",
                border: "1px solid #4a4455",
              }}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </article>
  );
}
