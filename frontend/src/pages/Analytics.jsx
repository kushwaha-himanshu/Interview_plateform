import {
  Bar,
  BarChart,
  CartesianGrid,
  PolarAngleAxis,
  PolarGrid,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { ArrowLeft, FileText, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import StatCard from "../components/StatCard";
import "./Analytics.css";

const skills = [
  ["Technical", 82],
  ["Projects", 85],
  ["HR", 79],
  ["Communication", 74],
  ["DSA", 68],
].map(([skill, value]) => ({ skill, value }));
const trend = [48, 54, 51, 59, 67, 64, 72, 76, 74, 82, 80, 88].map(
  (score, index) => ({ session: index + 1, score }),
);
const interviews = [
  ["20 May 2024", "Technical", "78%", "45 min", "↑ 8%", "blue"],
  ["18 May 2024", "System Design", "70%", "60 min", "↑ 5%", "purple"],
  ["15 May 2024", "Behavioral", "85%", "30 min", "-", "green"],
];
export default function Analytics() {
  return (
    <div className="dashboard-shell">
      <Sidebar />
      <main className="dashboard-main">
        <div className="analytics-page">
          <header className="analytics-heading">
            <div className="analytics-heading-main">
              <h1>
                <ArrowLeft size={21} />
                Analytics
              </h1>
              <p>Track your performance over time</p>
            </div>
            <Link className="report-nav-btn" to="/report">
              <FileText size={16} />
              View Report
            </Link>
          </header>
          <section className="analytics-kpis">
            <StatCard
              label="Overall Score"
              value="78%"
              detail="↑ 12% this week"
            />
            <StatCard
              label="Total Sessions"
              value="12"
              detail="Interviews Completed"
            />
            <StatCard
              label="Avg. Improvement"
              value="+14%"
              detail="in last 7 sessions"
            />
          </section>
          <section className="analytics-charts">
            <article className="dashboard-card analytics-card">
              <h2>Skill Performance</h2>
              <div className="radar-chart">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart data={skills}>
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
            <article className="dashboard-card analytics-card">
              <div className="chart-title">
                <h2>Score Trend</h2>
                <button>Last 12 Sessions</button>
              </div>
              <div className="bar-chart">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={trend}>
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
          </section>
          <section className="dashboard-card interview-table">
            <header>
              <h2>Recent Interviews</h2>
              <Link to="/history">View All</Link>
            </header>
            <div>
              <table>
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Category</th>
                    <th>Score</th>
                    <th>Duration</th>
                    <th>Improvement</th>
                  </tr>
                </thead>
                <tbody>
                  {interviews.map(
                    ([date, category, score, duration, improvement, tone]) => (
                      <tr key={date}>
                        <td>{date}</td>
                        <td>
                          <i className={tone} />
                          {category}
                        </td>
                        <td>
                          <b>{score}</b>
                        </td>
                        <td>{duration}</td>
                        <td className={improvement === "-" ? "" : "increase"}>
                          {improvement}
                        </td>
                      </tr>
                    ),
                  )}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
