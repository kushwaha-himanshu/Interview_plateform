import {
  Check,
  Database,
  Download,
  Lightbulb,
  ThumbsUp,
  TrendingDown,
  TrendingUp,
  X,
} from "lucide-react";
import Sidebar from "../components/Sidebar";
import "./Report.css";

const scores = [
  ["Technical", 82, "purple"],
  ["Projects", 88, "cyan"],
  ["DSA", 64, "red"],
  ["Communication", 76, "blue"],
  ["HR", 79, "purple"],
];
const strengths = [
  "Strong knowledge of React and frontend architecture.",
  "Good project explanation and practical application.",
  "Understands backend fundamentals and API flow.",
];
const weaknesses = [
  "DSA problem solving speed under pressure.",
  "System design concepts for large scale applications.",
  "Database optimization and indexing strategies.",
];
const plan = [
  [
    "Practice DSA",
    "Focus on graph algorithms and dynamic programming to improve speed.",
    "purple",
  ],
  [
    "Study System Design",
    "Review scalability patterns, load balancing, and microservices architecture.",
    "cyan",
  ],
  [
    "Database Indexing",
    "Deep dive into query optimization, indexing types, and ACID properties.",
    "blue",
  ],
];
export default function Report() {
  return (
    <div className="dashboard-shell">
      <Sidebar />
      <main className="dashboard-main">
        <div className="report-page">
          <header className="report-header">
            <div>
              <h1>Interview Report</h1>
              <p>Generated on 20 May 2024</p>
            </div>
            <button onClick={() => window.print()}>
              <Download size={16} />
              Download PDF
            </button>
          </header>
          <section className="report-grid">
            <article className="dashboard-card report-score">
              <h2>Overall Score</h2>
              <div className="report-ring">
                <svg viewBox="0 0 36 36">
                  <circle cx="18" cy="18" r="16" />
                  <circle className="report-ring-fill" cx="18" cy="18" r="16" />
                </svg>
                <div>
                  <b>78</b>
                  <span>/100</span>
                </div>
              </div>
              <p>
                <TrendingUp size={16} />
                Good Job! Keep improving.
              </p>
            </article>
            <article className="dashboard-card category-scores">
              <h2>Category Scores</h2>
              {scores.map(([name, value, tone]) => (
                <div className="report-progress" key={name}>
                  <span>{name}</span>
                  <i>
                    <em className={tone} style={{ width: `${value}%` }} />
                  </i>
                  <b>
                    {value}
                    <small>/100</small>
                  </b>
                </div>
              ))}
            </article>
            <section className="report-insights">
              <article className="dashboard-card insight-list success">
                <h2>
                  <ThumbsUp size={20} />
                  Strengths
                </h2>
                {strengths.map((item) => (
                  <p key={item}>
                    <Check size={16} />
                    {item}
                  </p>
                ))}
              </article>
              <article className="dashboard-card insight-list danger">
                <h2>
                  <TrendingDown size={20} />
                  Areas to Improve
                </h2>
                {weaknesses.map((item) => (
                  <p key={item}>
                    <X size={16} />
                    {item}
                  </p>
                ))}
              </article>
            </section>
            <article className="dashboard-card action-plan">
              <h2>
                <Lightbulb size={20} />
                Action Plan
              </h2>
              {plan.map(([title, text, tone]) => (
                <div className={tone} key={title}>
                  <h3>{title}</h3>
                  <p>{text}</p>
                </div>
              ))}
            </article>
          </section>
        </div>
      </main>
    </div>
  );
}
