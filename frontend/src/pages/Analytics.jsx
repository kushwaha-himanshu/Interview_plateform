import { ArrowLeft, FileText } from "lucide-react";
import { Link } from "react-router-dom";
import DashboardLayout from "../components/DashboardLayout";
import StatCard from "../components/StatCard";
import BarChartCard from "../components/BarChartCard";
import RadarChartCard from "../components/RadarChartCard";
import { skills, trend, recentInterviews } from "../data/analyticsData";
import "./Analytics.css";

export default function Analytics() {
  return (
    <DashboardLayout>
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
          <RadarChartCard data={skills} />
          <BarChartCard data={trend} />
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
                {recentInterviews.map((interview) => (
                  <tr key={interview.date}>
                    <td>{interview.date}</td>
                    <td>
                      <i className={interview.tone} />
                      {interview.category}
                    </td>
                    <td>
                      <b>{interview.score}</b>
                    </td>
                    <td>{interview.duration}</td>
                    <td className={interview.improvement === "-" ? "" : "increase"}>
                      {interview.improvement}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </DashboardLayout>
  );
}
