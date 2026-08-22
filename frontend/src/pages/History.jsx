import {
  Bell,
  ChevronLeft,
  ChevronRight,
  Code2,
  Download,
  Filter,
  Moon,
  Search,
} from "lucide-react";
import { Link } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import "./History.css";

const interviews = [
  {
    id: 1,
    date: "20 May 2024",
    category: "Technical",
    duration: "45 min",
    score: 78,
    tone: "primary",
    icon: Code2,
  },
  {
    id: 2,
    date: "18 May 2024",
    category: "Behavioral",
    duration: "30 min",
    score: 85,
    tone: "secondary",
    icon: Bell,
  },
  {
    id: 3,
    date: "15 May 2024",
    category: "System Design",
    duration: "60 min",
    score: 62,
    tone: "tertiary",
    icon: Moon,
  },
];

function ScoreRing({ score, tone }) {
  return (
    <div className={`history-score-ring ${tone}`}>
      <svg viewBox="0 0 36 36" aria-hidden="true">
        <path
          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
          className="ring-track"
        />
        <path
          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
          className="ring-value"
          style={{ strokeDasharray: `${score}, 100` }}
        />
      </svg>
      <span>{score}</span>
    </div>
  );
}

export default function History() {
  return (
    <div className="dashboard-shell">
      <Sidebar />
      <main className="dashboard-main">
        <div className="history-page">
          <header className="history-topbar">
            <div />
            <div className="history-topbar-actions">
              <button type="button" aria-label="Notifications">
                <Bell size={18} />
              </button>
              <button type="button" aria-label="Search">
                <Search size={18} />
              </button>
              <button type="button" aria-label="Dark mode">
                <Moon size={18} />
              </button>
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAF1q1LLlhe9hbKkrKrNfm9HWhEHKpqLpUl3VjwMd6TuoZ31T5P2185FodE1ac6I4YRF6pWn-A0BbFkCBIp2t91t2cCRAiXI31wjkaIXPlPBhSXgADeZfmc2cxOLQ6y8TKOohvpOV67zuI0MIHa_qKEt37LCC4hOigUUKrgwd-cMejLZK_f0hEtxdTrZsmfxCjffyiCOGCL2CmlVacubGJ1vZP8m_mKOQLTp8_t2FqT3g0IO2TC20YMJA"
                alt="User avatar"
              />
            </div>
          </header>

          <section className="history-header">
            <div>
              <h1>Interview History</h1>
              <p>Review and analyze your past performance.</p>
            </div>
            <div className="history-tools">
              <label>
                <Search size={14} />
                <input type="text" placeholder="Search history..." />
              </label>
              <button type="button">
                <Filter size={16} />
                Filter
              </button>
            </div>
          </section>

          <section className="history-table-panel">
            <div className="history-table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Category</th>
                    <th>Duration</th>
                    <th>Score</th>
                    <th className="align-right">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {interviews.map(
                    ({
                      id,
                      date,
                      category,
                      duration,
                      score,
                      tone,
                      icon: Icon,
                    }) => (
                      <tr key={id}>
                        <td className="date-cell">{date}</td>
                        <td>
                          <span className={`category-pill ${tone}`}>
                            <Icon size={13} />
                            {category}
                          </span>
                        </td>
                        <td className="muted">{duration}</td>
                        <td>
                          <ScoreRing score={score} tone={tone} />
                        </td>
                        <td className="align-right action-cell">
                          <button type="button" title="Download PDF">
                            <Download size={16} />
                          </button>
                          <Link to="/report" title="View Report">
                            View
                          </Link>
                        </td>
                      </tr>
                    ),
                  )}
                </tbody>
              </table>
            </div>
            <footer>
              <span>Showing 1-3 of 12 reports</span>
              <div>
                <button type="button" aria-label="Previous">
                  <ChevronLeft size={18} />
                </button>
                <button type="button" aria-label="Next">
                  <ChevronRight size={18} />
                </button>
              </div>
            </footer>
          </section>
        </div>
      </main>
    </div>
  );
}
