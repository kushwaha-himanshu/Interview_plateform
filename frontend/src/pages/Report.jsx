import {
  Check,
  Download,
  Lightbulb,
  ThumbsUp,
  TrendingDown,
  TrendingUp,
  X,
} from "lucide-react";

import {
  useEffect,
  useState,
} from "react";

import {
  useLocation,
} from "react-router-dom";

import DashboardLayout from "../components/DashboardLayout";

import api from "../services/api";

import "./Report.css";


export default function Report() {

  const location = useLocation();

  const [report, setReport] =
    useState(location.state?.report || null);

  const interviewId =
    location.state?.interviewId ||
    report?.interviewId ||
    sessionStorage.getItem("lastInterviewId");

  const [loading, setLoading] =
    useState(!report);

  const [error, setError] =
    useState("");

  useEffect(() => {
    if (location.state?.interviewId) {
      sessionStorage.setItem("lastInterviewId", location.state.interviewId);
    }
  }, [location.state?.interviewId]);

  // =================================
  // Fetch report
  // =================================

  useEffect(() => {

    const fetchReport = async () => {

      if (!interviewId) {

        setError(
          "Interview ID not found."
        );

        setLoading(false);

        return;
      }


      try {

        const response =
          await api.get(
            `/interview/${interviewId}/report`
          );


        console.log(
          "Interview report:",
          response.data
        );


        setReport(
          response.data.report
        );


      } catch (error) {

        console.error(
          "Failed to fetch report:",
          error
        );


        setError(
          error.response?.data?.message ||
          "Failed to load interview report."
        );


      } finally {

        setLoading(false);

      }
    };


    if (!report) {
      fetchReport();
    } else {
      setLoading(false);
    }

  }, [interviewId, report]);


  // =================================
  // Loading
  // =================================

  if (loading) {

    return (

      <DashboardLayout>

        <div className="report-page">

          <h2>
            Generating your report...
          </h2>

          <p>
            Please wait while we
            prepare your interview report.
          </p>

        </div>

      </DashboardLayout>

    );
  }


  // =================================
  // Error
  // =================================

  if (error || !report) {

    return (

      <DashboardLayout>

        <div className="report-page">

          <h2>
            Report unavailable
          </h2>

          <p>
            {error}
          </p>

        </div>

      </DashboardLayout>

    );
  }


  // =================================
  // Convert score
  // Backend = /10
  // UI = /100
  // =================================

  const overallScore =
    Math.round(
      report.overallScore * 10
    );


  // =================================
  // Strengths / Weaknesses
  // =================================

  const strengths =
    report.strengths || [];


  const weaknesses =
    report.weaknesses || [];


  // =================================
  // Category scores
  // =================================

  const categoryScores = [];


  if (report.answers) {

    const topicMap = {};


    report.answers.forEach(
      (item) => {

        const topic =
          item.evaluation?.topic ||
          item.difficulty ||
          "General";


        if (!topicMap[topic]) {

          topicMap[topic] = {
            total: 0,
            count: 0,
          };

        }


        topicMap[topic].total +=
          item.score || 0;

        topicMap[topic].count++;

      }
    );


    Object.entries(topicMap)
      .forEach(
        ([topic, data]) => {

          const score =
            Math.round(
              (data.total /
                data.count) * 10
            );


          categoryScores.push([
            topic,
            score,
            score >= 70
              ? "success"
              : score >= 40
              ? "warning"
              : "danger",
          ]);

        }
      );

  }


  // =================================
  // Action plan
  // =================================

  const actionPlan = [];


  weaknesses
    .slice(0, 5)
    .forEach(
      (weakness, index) => {

        actionPlan.push({
          title:
            `Improve: ${weakness}`,

          text:
            "Review this topic and practice explaining it clearly with examples.",

          tone:
            index % 2 === 0
              ? "warning"
              : "improve",
        });

      }
    );


  if (!actionPlan.length) {

    actionPlan.push({
      title: "Keep Practicing",

      text:
        "Continue practicing interview questions and focus on giving structured, detailed answers.",

      tone: "improve",
    });

  }


  return (

    <DashboardLayout>

      <div className="report-page">


        {/* =========================
            HEADER
        ========================= */}

        <header className="report-header">

          <div>

            <h1>
              Interview Report
            </h1>

            <p>
              Questions answered:{" "}
              {report.questionsAnswered}
            </p>

          </div>


          <button
            onClick={() =>
              window.print()
            }
          >

            <Download size={16} />

            Download PDF

          </button>

        </header>


        <section className="report-grid">


          {/* =========================
              OVERALL SCORE
          ========================= */}

          <article
            className="dashboard-card report-score"
          >

            <h2>
              Overall Score
            </h2>


            <div className="report-ring">

              <svg viewBox="0 0 36 36">

                <circle
                  cx="18"
                  cy="18"
                  r="16"
                />

                <circle
                  className="report-ring-fill"
                  cx="18"
                  cy="18"
                  r="16"
                  style={{
                    strokeDasharray: "100",
                    strokeDashoffset:
                      100 - overallScore,
                  }}
                />

              </svg>


              <div>

                <b>
                  {overallScore}
                </b>

                <span>
                  /100
                </span>

              </div>

            </div>


            <p>

              {overallScore >= 70 ? (
                <>
                  <TrendingUp
                    size={16}
                  />

                  Good Job! Keep improving.
                </>
              ) : (
                <>
                  <TrendingDown
                    size={16}
                  />

                  Keep practicing and improving.
                </>
              )}

            </p>

          </article>


          {/* =========================
              CATEGORY SCORES
          ========================= */}

          <article
            className="dashboard-card category-scores"
          >

            <h2>
              Category Scores
            </h2>


            {categoryScores.length > 0 ? (

              categoryScores.map(
                ([name, value, tone]) => (

                  <div
                    className="report-progress"
                    key={name}
                  >

                    <span>
                      {name}
                    </span>


                    <i>

                      <em
                        className={tone}
                        style={{
                          width:
                            `${value}%`,
                        }}
                      />

                    </i>


                    <b>

                      {value}

                      <small>
                        /100
                      </small>

                    </b>

                  </div>

                )
              )

            ) : (

              <p>
                No category data available.
              </p>

            )}

          </article>


          {/* =========================
              INSIGHTS
          ========================= */}

          <section className="report-insights">


            {/* STRENGTHS */}

            <article
              className="dashboard-card insight-list success"
            >

              <h2>

                <ThumbsUp size={20} />

                Strengths

              </h2>


              {strengths.length > 0 ? (

                strengths.map(
                  (item, index) => (

                    <p
                      key={`${item}-${index}`}
                    >

                      <Check size={16} />

                      {item}

                    </p>

                  )
                )

              ) : (

                <p>
                  No specific strengths
                  were identified.
                </p>

              )}

            </article>


            {/* WEAKNESSES */}

            <article
              className="dashboard-card insight-list danger"
            >

              <h2>

                <TrendingDown
                  size={20}
                />

                Areas to Improve

              </h2>


              {weaknesses.length > 0 ? (

                weaknesses.map(
                  (item, index) => (

                    <p
                      key={`${item}-${index}`}
                    >

                      <X size={16} />

                      {item}

                    </p>

                  )
                )

              ) : (

                <p>
                  No major weaknesses
                  were identified.
                </p>

              )}

            </article>

          </section>


          {/* =========================
              ACTION PLAN
          ========================= */}

          <article
            className="dashboard-card action-plan"
          >

            <h2>

              <Lightbulb size={20} />

              Action Plan

            </h2>


            {actionPlan.map(
              (item) => (

                <div
                  className={item.tone}
                  key={item.title}
                >

                  <h3>
                    {item.title}
                  </h3>

                  <p>
                    {item.text}
                  </p>

                </div>

              )
            )}

          </article>

          {/* =========================
              QUESTION HISTORY
          ========================= */}

          <article
            className="dashboard-card"
            style={{
              gridColumn: "span 12",
              padding: "24px",
              marginTop: "24px",
              display: "flex",
              flexDirection: "column",
              gap: "20px"
            }}
          >

            <h2 style={{ margin: "0 0 10px", fontSize: "18px" }}>
              Question History
            </h2>

            <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              {(report.answers || []).map((item, index) => (
                <div key={index} style={{ borderBottom: "1px solid rgba(149, 141, 161, 0.2)", paddingBottom: "16px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                    <h3 style={{ margin: 0, fontSize: "15px", color: "#d2bbff" }}>
                      Question {item.questionNumber || (index + 1)}
                    </h3>
                    <b style={{ color: "#4cd7f6" }}>Score: {item.score || 0}/10</b>
                  </div>
                  <p style={{ margin: "0 0 8px", color: "#fff", fontSize: "14px" }}>
                    <strong>Question:</strong> {item.question}
                  </p>
                  <p style={{ margin: "0 0 8px", color: "#ccc3d8", fontSize: "13px" }}>
                    <strong>Your Answer:</strong> {item.answer}
                  </p>
                  {item.evaluation?.improvement_suggestions && (
                    <p style={{ margin: 0, color: "#adc6ff", fontSize: "12px" }}>
                      <strong>AI Suggestion:</strong> {item.evaluation.improvement_suggestions}
                    </p>
                  )}
                </div>
              ))}
            </div>

          </article>


        </section>

      </div>

    </DashboardLayout>

  );
}