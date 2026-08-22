import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  FileText,
  Lightbulb,
  Star,
  TriangleAlert,
} from "lucide-react";
import { Link } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import EvaluationCard from "../components/EvaluationCard";
import FeedbackCard from "../components/FeedbackCard";
import "./Evaluation.css";

const metrics = [
  ["Technical Accuracy", "8.5", "cyan"],
  ["Relevance", "9.0", "purple"],
  ["Completeness", "6.5", "red"],
  ["Clarity", "7.8", "blue"],
  ["Depth", "6.0", "gray"],
];
export default function Evaluation() {
  return (
    <div className="dashboard-shell">
      <Sidebar />
      <main className="dashboard-main">
        <div className="evaluation-page">
          <header className="evaluation-heading">
            <div className="evaluation-heading-main">
              <Link to="/interview">
                <ArrowLeft size={20} />
              </Link>
              <h1>Answer Evaluation</h1>
            </div>
            <Link className="report-nav-btn" to="/report">
              <FileText size={16} />
              View Report
            </Link>
          </header>
          <div className="evaluation-grid">
            <section className="evaluation-left">
              <article className="dashboard-card score-card">
                <h2>Overall Score</h2>
                <div className="score-ring">
                  <svg viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="45" />
                    <circle
                      className="score-ring-value"
                      cx="50"
                      cy="50"
                      r="45"
                    />
                  </svg>
                  <div>
                    <b>7.8</b>
                    <span>/ 10</span>
                  </div>
                </div>
                <p className="stars">
                  {[1, 2, 3, 4, 5].map((x) => (
                    <Star key={x} fill={x < 5 ? "currentColor" : "none"} />
                  ))}
                </p>
              </article>
              <article className="dashboard-card metrics-card">
                <h2>Evaluation Metrics</h2>
                {metrics.map(([label, score, tone]) => (
                  <EvaluationCard
                    key={label}
                    label={label}
                    score={score}
                    tone={tone}
                  />
                ))}
              </article>
            </section>
            <section className="feedback-list">
              <FeedbackCard
                title="What You Did Well"
                icon={CheckCircle2}
                tone="success"
              >
                You correctly explained the role of React in the frontend and
                the role of Node.js in the backend.
              </FeedbackCard>
              <FeedbackCard
                title="What's Missing"
                icon={TriangleAlert}
                tone="warning"
              >
                You did not explain API communication, Express, and how data
                flows between frontend and backend.
              </FeedbackCard>
              <FeedbackCard
                title="How To Improve"
                icon={Lightbulb}
                tone="improve"
              >
                Try explaining REST endpoints, request-response flow, and how
                frontend and backend communicate.
              </FeedbackCard>
              <div className="continue-action">
                <Link to="/interview">
                  Continue Interview <ArrowRight size={20} />
                </Link>
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}
