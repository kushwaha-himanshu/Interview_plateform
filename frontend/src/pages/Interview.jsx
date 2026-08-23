import { ArrowLeft, Clock3, Mic, Send, Square } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import QuestionCard from "../components/QuestionCard";
import "./Interview.css";

export default function Interview() {
  const [answer, setAnswer] = useState("");
  const navigate = useNavigate();
  return (
    <div className="interview-page">
      <header className="interview-top">
        <Link to="/interview/setup">
          <ArrowLeft size={20} />
          <b>AI Interview</b>
        </Link>
        <div>
          <span className="timer">
            <Clock3 size={17} />
            04:32
          </span>
          <Link className="end-interview" to="/dashboard">
            <Square size={16} />
            End Interview
          </Link>
        </div>
      </header>
      <main className="interview-layout">
        <section className="interview-content">
          <div className="interview-glow" />
          <div className="interview-inner">
            <QuestionCard />
            <section className="answer-box">
              <textarea
                value={answer}
                onChange={(event) => setAnswer(event.target.value)}
                placeholder="Type your answer here..."
              />
              <footer>
                <button type="button">
                  <Mic size={18} />
                  Voice Answer
                </button>
                <button
                  className="submit-answer"
                  type="button"
                  onClick={() => navigate("/evaluation")}
                >
                  Submit Answer <Send size={17} />
                </button>
              </footer>
            </section>
          </div>
        </section>
        <aside className="progress-panel">
          <h3>Interview Progress</h3>
          <div className="progress-circle">
            <svg viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="45" />
              <circle className="progress-value" cx="50" cy="50" r="45" />
            </svg>
            <strong>30%</strong>
          </div>
          <p>3 / 10 Questions Completed</p>
          <hr />
          <div className="progress-detail">
            <span>Current Focus</span>
            <b>Backend Integration</b>
          </div>
          <div className="progress-detail">
            <span>Adaptive Mode</span>
            <b className="active-status">
              <i />
              Active
            </b>
          </div>
        </aside>
      </main>
    </div>
  );
}
