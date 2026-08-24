import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  FileText,
  Lightbulb,
  Star,
  TriangleAlert,
} from "lucide-react";

import {
  Link,
  useLocation,
} from "react-router-dom";

import {
  useEffect,
  useState,
} from "react";

import api from "../services/api";

import DashboardLayout from "../components/DashboardLayout";

import EvaluationCard from "../components/EvaluationCard";

import FeedbackCard from "../components/FeedbackCard";

import "./Evaluation.css";


export default function Evaluation() {

  const location = useLocation();

  const [report, setReport] = useState(location.state?.report || null);
  const [loading, setLoading] = useState(!report);
  const [error, setError] = useState("");

  const interviewId =
    location.state?.interviewId ||
    report?.interviewId ||
    sessionStorage.getItem("lastInterviewId");

  useEffect(() => {
    if (location.state?.interviewId) {
      sessionStorage.setItem("lastInterviewId", location.state.interviewId);
    }
  }, [location.state?.interviewId]);

  useEffect(() => {
    if (!report && interviewId) {
      const fetchReport = async () => {
        try {
          setLoading(true);
          const response = await api.get(`/interview/${interviewId}/report`);
          setReport(response.data.report);
        } catch (err) {
          console.error("Failed to fetch report:", err);
          setError("Failed to load interview report. Please try again.");
        } finally {
          setLoading(false);
        }
      };
      fetchReport();
    } else {
      setLoading(false);
    }
  }, [report, interviewId]);

  // --------------------------------
  // Safety fallback / Loading states
  // --------------------------------

  if (loading) {
    return (
      <DashboardLayout>
        <div className="evaluation-page" style={{ textAlign: "center", padding: "100px 20px" }}>
          <h2>Loading evaluation details...</h2>
          <p>Please wait while we fetch your interview evaluation.</p>
        </div>
      </DashboardLayout>
    );
  }

  if (error || !report) {
    return (
      <DashboardLayout>
        <div className="evaluation-page" style={{ textAlign: "center", padding: "100px 20px" }}>
          <h1>Evaluation not found</h1>
          <p>{error || "Please complete an interview first."}</p>
          <Link to="/interview/setup" style={{
            display: "inline-block",
            marginTop: "20px",
            padding: "10px 20px",
            background: "#7c3aed",
            color: "#fff",
            borderRadius: "8px",
            textDecoration: "none"
          }}>
            Start Interview
          </Link>
        </div>
      </DashboardLayout>
    );
  }

  const score = report.overallScore || 0;
  const questionsAnswered = report.questionsAnswered || 0;
  const totalQuestions = report.answers?.length || 5;

  const correctPoints = report.strengths || [];
  const missingPoints = report.weaknesses || [];

  return (

    <DashboardLayout>

      <div className="evaluation-page">


        {/* =========================
            HEADER
        ========================= */}

        <header className="evaluation-heading">

          <div className="evaluation-heading-main">

            <Link to="/interview/setup">

              <ArrowLeft size={20} />

            </Link>

            <h1>
              Answer Evaluation
            </h1>

          </div>


          <Link
            className="report-nav-btn"
            to="/report"
            state={{
              interviewId: report.interviewId || interviewId,
              report,
            }}
          >

            <FileText size={16} />

            View Full Report

          </Link>

        </header>


        <div className="evaluation-grid">


          {/* =========================
              LEFT
          ========================= */}

          <section className="evaluation-left">


            {/* SCORE */}

            <article
              className="dashboard-card score-card"
            >

              <h2>
                Overall Score
              </h2>


              <div className="score-ring">

                <svg viewBox="0 0 100 100">

                  <circle
                    cx="50"
                    cy="50"
                    r="45"
                  />

                  <circle
                    className="score-ring-value"
                    cx="50"
                    cy="50"
                    r="45"
                    style={{
                      strokeDasharray: "283",
                      strokeDashoffset:
                        283 -
                        (283 * score) /
                          10,
                    }}
                  />

                </svg>


                <div>

                  <b>
                    {score}
                  </b>

                  <span>
                    / 10
                  </span>

                </div>

              </div>


              <p className="stars">

                {[1, 2, 3, 4, 5].map(
                  (x) => (

                    <Star
                      key={x}

                      fill={
                        x <=
                        Math.round(
                          score / 2
                        )
                          ? "currentColor"
                          : "none"
                      }
                    />

                  )
                )}

              </p>

            </article>


            {/* INTERVIEW INFO CARD */}

            <article
              className="dashboard-card metrics-card"
            >

              <h2>
                Interview Summary
              </h2>

              <div className="metric">
                <p>
                  <span>Questions Evaluated</span>
                  <b className="cyan">{questionsAnswered} / {totalQuestions}</b>
                </p>
                <i>
                  <em className="cyan" style={{ width: `${(questionsAnswered / totalQuestions) * 100}%` }} />
                </i>
              </div>

              {report.category && (
                <div className="metric" style={{ marginTop: "12px" }}>
                  <p>
                    <span>Category</span>
                    <b className="purple" style={{ textTransform: "capitalize" }}>{report.category}</b>
                  </p>
                </div>
              )}

              {report.topicsCovered && report.topicsCovered.length > 0 && (
                <div style={{ marginTop: "20px" }}>
                  <h4 style={{ color: "#ccc3d8", fontSize: "14px", marginBottom: "8px", fontWeight: "600" }}>Topics Covered</h4>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                    {report.topicsCovered.map((topic, i) => (
                      <span key={i} style={{
                        background: "#122131",
                        color: "#4cd7f6",
                        padding: "4px 10px",
                        borderRadius: "6px",
                        fontSize: "12px",
                        fontWeight: "500"
                      }}>
                        {topic}
                      </span>
                    ))}
                  </div>
                </div>
              )}

            </article>

            {/* OVERALL STRENGTHS */}

            <article className="feedback-card success">
              <h3>
                <CheckCircle2 size={21} />
                Overall Strengths
              </h3>
              {correctPoints.length > 0 ? (
                <ul style={{ margin: "10px 0 0", paddingLeft: "20px", color: "#ccc3d8" }}>
                  {correctPoints.map((str, i) => (
                    <li key={i} style={{ marginBottom: "6px", lineHeight: "1.4" }}>{str}</li>
                  ))}
                </ul>
              ) : (
                <p>No specific strengths identified yet.</p>
              )}
            </article>

            {/* OVERALL WEAKNESSES */}

            <article className="feedback-card warning">
              <h3>
                <TriangleAlert size={21} />
                Overall Areas to Improve
              </h3>
              {missingPoints.length > 0 ? (
                <ul style={{ margin: "10px 0 0", paddingLeft: "20px", color: "#ccc3d8" }}>
                  {missingPoints.map((weak, i) => (
                    <li key={i} style={{ marginBottom: "6px", lineHeight: "1.4" }}>{weak}</li>
                  ))}
                </ul>
              ) : (
                <p>No major areas to improve identified.</p>
              )}
            </article>

          </section>


          {/* =========================
              FEEDBACK LIST (INDIVIDUAL QUESTION EVALUATIONS)
          ========================= */}

          <section className="feedback-list">

            {(report.answers || []).map((item, index) => {
              const qNum = item.questionNumber || (index + 1);
              const qScore = item.score ?? 0;
              const qEval = item.evaluation || {};
              
              return (
                <article key={index} className="dashboard-card" style={{ padding: "24px", display: "flex", flexDirection: "column", gap: "16px" }}>
                  
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid rgba(255, 255, 255, 0.05)", paddingBottom: "12px" }}>
                    <h2 style={{ fontSize: "20px", color: "#fff", margin: 0 }}>Question {qNum}</h2>
                    <span style={{ fontSize: "16px", fontWeight: "700", color: "#4cd7f6" }}>Score: {qScore}/10</span>
                  </div>

                  <div>
                    <h4 style={{ color: "#958da1", fontSize: "13px", margin: "0 0 6px" }}>Question:</h4>
                    <p style={{ color: "#fff", fontSize: "15px", margin: 0, lineHeight: "1.5" }}>{item.question}</p>
                  </div>

                  <div>
                    <h4 style={{ color: "#958da1", fontSize: "13px", margin: "0 0 6px" }}>Your Answer:</h4>
                    <p style={{ color: "#ccc3d8", fontSize: "14px", margin: 0, lineHeight: "1.5", fontStyle: "italic" }}>
                      {item.answer || "(No answer provided)"}
                    </p>
                  </div>

                  <div style={{ display: "flex", flexWrap: "wrap", gap: "12px", fontSize: "12px" }}>
                    {qEval.topic && (
                      <span style={{ color: "#d2bbff", background: "rgba(210, 187, 255, 0.1)", padding: "4px 8px", borderRadius: "4px" }}>
                        Topic: {qEval.topic}
                      </span>
                    )}
                    {item.difficulty && (
                      <span style={{ color: "#adc6ff", background: "rgba(173, 198, 255, 0.1)", padding: "4px 8px", borderRadius: "4px" }}>
                        Difficulty: {item.difficulty}
                      </span>
                    )}
                    {qEval.answer_quality && (
                      <span style={{ color: "#4cd7f6", background: "rgba(76, 215, 246, 0.1)", padding: "4px 8px", borderRadius: "4px" }}>
                        Quality: {qEval.answer_quality}
                      </span>
                    )}
                    {qEval.technical_accuracy && (
                      <span style={{ color: "#10b981", background: "rgba(16, 185, 129, 0.1)", padding: "4px 8px", borderRadius: "4px" }}>
                        Accuracy: {qEval.technical_accuracy}
                      </span>
                    )}
                  </div>

                  <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginTop: "8px" }}>
                    
                    <FeedbackCard
                      title="What You Did Well"
                      icon={CheckCircle2}
                      tone="success"
                    >
                      {qEval.correct_points && qEval.correct_points.length > 0 ? (
                        <ul style={{ paddingLeft: "16px", margin: 0 }}>
                          {qEval.correct_points.map((pt, i) => (
                            <li key={i}>{pt}</li>
                          ))}
                        </ul>
                      ) : (
                        "No specific strengths identified for this answer."
                      )}
                    </FeedbackCard>

                    <FeedbackCard
                      title="What's Missing"
                      icon={TriangleAlert}
                      tone="warning"
                    >
                      {qEval.missing_points && qEval.missing_points.length > 0 ? (
                        <ul style={{ paddingLeft: "16px", margin: 0 }}>
                          {qEval.missing_points.map((pt, i) => (
                            <li key={i}>{pt}</li>
                          ))}
                        </ul>
                      ) : (
                        "No major missing points identified."
                      )}
                    </FeedbackCard>

                    {qEval.improvement_suggestions && (
                      <FeedbackCard
                        title="How To Improve"
                        icon={Lightbulb}
                        tone="improve"
                      >
                        {qEval.improvement_suggestions}
                      </FeedbackCard>
                    )}

                  </div>

                </article>
              );
            })}

            <div className="continue-action" style={{ marginTop: "20px" }}>

              <Link
                to="/report"
                state={{
                  interviewId: report.interviewId || interviewId,
                  report,
                }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  padding: "15px 27px",
                  borderRadius: "99px",
                  color: "#fff",
                  background: "linear-gradient(90deg, #7c3aed, #0566d9)",
                  boxShadow: "0 0 25px rgba(124, 58, 237, 0.25)",
                  fontSize: "17px",
                  fontWeight: "700",
                  border: "none",
                  textDecoration: "none"
                }}
              >

                View Full Report

                <ArrowRight size={20} />

              </Link>

            </div>

          </section>

        </div>

      </div>

    </DashboardLayout>

  );
}