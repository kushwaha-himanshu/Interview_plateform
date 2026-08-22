import {
  ChevronLeft,
  ChevronRight,
  Download,
  Filter,
  Search,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import DashboardLayout from "../components/DashboardLayout";
import Topbar from "../components/Topbar";
import { allInterviews } from "../data/historyData";
import "./History.css";

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
  const [query, setQuery] = useState("");
  const [sortDesc, setSortDesc] = useState(true);
  const [page, setPage] = useState(1);
  const pageSize = 5;

  const filteredInterviews = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    const result = allInterviews.filter(({ category, date, duration }) => {
      if (!normalized) {
        return true;
      }
      return (
        category.toLowerCase().includes(normalized) ||
        date.toLowerCase().includes(normalized) ||
        duration.toLowerCase().includes(normalized)
      );
    });

    return [...result].sort((a, b) =>
      sortDesc ? b.score - a.score : a.score - b.score,
    );
  }, [query, sortDesc]);

  const totalPages = Math.max(1, Math.ceil(filteredInterviews.length / pageSize));

  useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages);
    }
  }, [page, totalPages]);

  const start = (page - 1) * pageSize;
  const pageItems = filteredInterviews.slice(start, start + pageSize);

  const handleDownload = () => {
    window.print();
  };

  return (
    <DashboardLayout>
      <Topbar avatarSrc="https://lh3.googleusercontent.com/aida-public/AB6AXuAF1q1LLlhe9hbKkrKrNfm9HWhEHKpqLpUl3VjwMd6TuoZ31T5P2185FodE1ac6I4YRF6pWn-A0BbFkCBIp2t91t2cCRAiXI31wjkaIXPlPBhSXgADeZfmc2cxOLQ6y8TKOohvpOV67zuI0MIHa_qKEt37LCC4hOigUUKrgwd-cMejLZK_f0hEtxdTrZsmfxCjffyiCOGCL2CmlVacubGJ1vZP8m_mKOQLTp8_t2FqT3g0IO2TC20YMJA" />
      <div className="history-page">
        <section className="history-header">
          <div>
            <h1>Interview History</h1>
            <p>Review and analyze your past performance.</p>
          </div>
            <div className="history-tools">
              <label>
                <Search size={14} />
                <input
                  type="text"
                  placeholder="Search history..."
                  value={query}
                  onChange={(event) => {
                    setQuery(event.target.value);
                    setPage(1);
                  }}
                />
              </label>
              <button
                type="button"
                onClick={() => {
                  setSortDesc((prev) => !prev);
                  setPage(1);
                }}
              >
                <Filter size={16} />
                {sortDesc ? "High Score" : "Low Score"}
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
                  {pageItems.map(
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
                          <button
                            type="button"
                            title="Download PDF"
                            onClick={handleDownload}
                          >
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
              <span>
                Showing {filteredInterviews.length === 0 ? 0 : start + 1}-
                {Math.min(start + pageSize, filteredInterviews.length)} of{" "}
                {filteredInterviews.length} reports
              </span>
              <div>
                <button
                  type="button"
                  aria-label="Previous"
                  onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                  disabled={page === 1}
                >
                  <ChevronLeft size={18} />
                </button>
                <button
                  type="button"
                  aria-label="Next"
                  onClick={() =>
                    setPage((prev) => Math.min(totalPages, prev + 1))
                  }
                  disabled={page === totalPages}
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            </footer>
          </section>
        </div>
    </DashboardLayout>
  );
}
