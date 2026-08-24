import {
  ArrowLeft,
  Clock3,
  Send,
  Square,
  Volume2,
  VolumeX,
} from "lucide-react";
import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import QuestionCard from "../components/QuestionCard";
import api from "../services/api";
import "./Interview.css";
import VoiceRecorder from "../components/voiceRecorder";
import QuestionSpeaker from "../components/questionSpeaker";

const durationToSeconds = {
  "15 min": 15 * 60,
  "30 min": 30 * 60,
  "45 min": 45 * 60,
};

export default function Interview() {
  const location = useLocation();
  const navigate = useNavigate();

  // Interview received from InterviewSetup
  const initialInterview = location.state?.interview;

  const [interview, setInterview] = useState(initialInterview);
  const [answer, setAnswer] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const [timeLeft, setTimeLeft] = useState(() => {
    return durationToSeconds[initialInterview?.duration] || 30 * 60;
  });
  const [timeIsOver, setTimeIsOver] = useState(false);

  // Initialize and run countdown timer
  useEffect(() => {
    if (!interview) return;
    
    setTimeLeft(durationToSeconds[interview.duration] || 30 * 60);
  }, [interview?.duration]);

  useEffect(() => {
    if (!interview || timeLeft <= 0) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setTimeIsOver(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [interview, timeLeft]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${String(minutes).padStart(2, "0")}:${String(remainingSeconds).padStart(2, "0")}`;
  };

  // --------------------------------
  // Safety check
  // --------------------------------
  if (!interview) {
    return (
      <div style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        background: "#0d0d18",
        color: "#fff",
        textAlign: "center",
        padding: "20px"
      }}>
        <h2 style={{ fontSize: "24px", marginBottom: "16px" }}>No active interview found</h2>
        <p style={{ color: "#ccc3d8", marginBottom: "24px", maxWidth: "400px" }}>
          You did not start or select an interview session. Please navigate to the Interview Setup page.
        </p>
        <button
          type="button"
          onClick={() => navigate("/interview/setup")}
          style={{
            background: "#7c3aed",
            border: "none",
            color: "#fff",
            padding: "12px 24px",
            borderRadius: "8px",
            cursor: "pointer",
            fontWeight: "600"
          }}
        >
          Back to Interview Setup
        </button>
      </div>
    );
  }

  // --------------------------------
  // Interview information
  // --------------------------------
  const questionNumber = interview.questionNumber || 1;
  const totalQuestions = interview.totalQuestions || 5;
  const completedQuestions = Math.max(0, questionNumber - 1);
  const progress = Math.round((completedQuestions / totalQuestions) * 100);

  // --------------------------------
  // Submit answer
  // --------------------------------
  const submitAnswer = async () => {
    if (timeIsOver) return;

    if (!answer.trim()) {
      setError("Please enter your answer before submitting.");
      return;
    }

    setError("");
    setSubmitting(true);

    try {
      const response = await api.post(
        `/interview/${interview.id}/answer`,
        {
          answer: answer.trim(),
        }
      );

      console.log("Answer submitted:", response.data);
      const data = response.data;

      // --------------------------------
      // Interview completed
      // --------------------------------
      if (data.completed) {
        try {
          // Get evaluations of ALL questions
          const reportResponse = await api.get(
            `/interview/${interview.id}/report`
          );

          console.log("Final interview report:", reportResponse.data);

          navigate("/evaluation", {
            state: {
              interviewId: interview.id,
              report: reportResponse.data.report,
            },
          });
        } catch (reportError) {
          console.error("Failed to get final evaluation:", reportError);
          setError("Interview completed, but final evaluation could not be loaded.");
        }
        return;
      }

      // --------------------------------
      // Next question available
      // --------------------------------
      setInterview((prev) => ({
        ...prev,
        question: data.nextQuestion,
        questionNumber: data.questionNumber,
        difficulty: data.difficulty ?? prev.difficulty,
        coveredTopics: data.coveredTopics,
      }));

      // Clear previous answer
      setAnswer("");
    } catch (error) {
      console.error("Submit answer failed:", error);
      setError(
        error.response?.data?.message ||
        "Failed to submit answer. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const speakQuestion = () => {
    if (!interview?.question) {
      return;
    }

    window.speechSynthesis.cancel();

    const speech = new SpeechSynthesisUtterance(interview.question);
    speech.lang = "en-US";
    speech.rate = 1;
    speech.pitch = 1;
    window.speechSynthesis.speak(speech);
  };

  const stopSpeaking = () => {
    window.speechSynthesis.cancel();
  };

  return (
    <div className="interview-page">
      {/* =========================
          HEADER
      ========================= */}
      <header className="interview-top">
        <Link to="/interview/setup">
          <ArrowLeft size={20} />
          <b>AI Interview</b>
        </Link>

        <div>
          <span className="timer">
            <Clock3 size={17} />
            {formatTime(timeLeft)}
          </span>

          <Link className="end-interview" to="/dashboard">
            <Square size={16} />
            End Interview
          </Link>
        </div>
      </header>

      {/* =========================
          MAIN
      ========================= */}
      <main className="interview-layout">
        <section className="interview-content">
          <div className="interview-glow" />

          <div className="interview-inner">
            {/* =========================
                QUESTION
            ========================= */}
            <QuestionCard
              question={interview.question}
              questionNumber={questionNumber}
              totalQuestions={totalQuestions}
              difficulty={interview.difficulty || "Intermediate"}
            />

            <QuestionSpeaker text={interview.question} />

            {/* =========================
                ANSWER
            ========================= */}
            <section className="answer-box">
              <textarea
                value={answer}
                onChange={(event) => setAnswer(event.target.value)}
                placeholder="Type your answer here..."
                disabled={submitting || timeIsOver}
              />
              <VoiceRecorder
                disabled={submitting || timeIsOver}
                onTranscript={(transcript) => {
                  setAnswer((previousAnswer) => {
                    if (!previousAnswer.trim()) {
                      return transcript;
                    }
                    return previousAnswer + " " + transcript;
                  });
                }}
              />

              {error && (
                <p style={{ color: "#ef4444", margin: "10px 0" }}>
                  {error}
                </p>
              )}

              <footer>
                <button
                  className="submit-answer"
                  type="button"
                  disabled={submitting || timeIsOver}
                  onClick={submitAnswer}
                >
                  {submitting ? "Evaluating..." : "Submit Answer"}
                  {!submitting && <Send size={17} />}
                </button>
              </footer>
            </section>
          </div>
        </section>

        {/* =========================
            PROGRESS
        ========================= */}
        <aside className="progress-panel">
          <h3>Interview Progress</h3>

          <div className="progress-circle">
            <svg viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="45" />
              <circle
                className="progress-value"
                cx="50"
                cy="50"
                r="45"
                style={{
                  strokeDasharray: "283",
                  strokeDashoffset: 283 - (283 * progress) / 100,
                }}
              />
            </svg>

            <strong>{Math.round(progress)}%</strong>
          </div>

          <p>
            {completedQuestions} / {totalQuestions} Questions Completed
          </p>

          <hr />

          <div className="progress-detail">
            <span>Current Focus</span>
            <b>
              {interview.coveredTopics?.[interview.coveredTopics.length - 1] || interview.category || "Resume Based"}
            </b>
          </div>

          <div className="progress-detail">
            <span>Resume</span>
            <b style={{ color: "#d2bbff" }}>{interview.resumeFileName || "Standard Resume"}</b>
          </div>

          <div className="progress-detail">
            <span>Category</span>
            <b>{interview.category || "Resume Based"}</b>
          </div>

          <div className="progress-detail">
            <span>Difficulty</span>
            <b>{interview.difficulty || "Intermediate"}</b>
          </div>

          <div className="progress-detail">
            <span>Style</span>
            <b>{interview.interviewerStyle || "Professional"}</b>
          </div>

          <div className="progress-detail">
            <span>Duration</span>
            <b>{interview.duration || "30 min"}</b>
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

      {/* =========================
          TIMEOUT BANNER OVERLAY
      ========================= */}
      {timeIsOver && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          background: "rgba(0, 0, 0, 0.8)",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          zIndex: 1000
        }}>
          <div style={{
            background: "#0d0d18",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            borderRadius: "12px",
            padding: "32px",
            maxWidth: "450px",
            width: "90%",
            textAlign: "center",
            boxShadow: "0 8px 32px rgba(0, 0, 0, 0.5)"
          }}>
            <h2 style={{ color: "#ef4444", margin: "0 0 12px", fontSize: "24px" }}>Interview Time is Over!</h2>
            <p style={{ color: "#ccc3d8", fontSize: "14px", margin: "0 0 24px" }}>
              Your time has run out. You can no longer submit answers for this interview session.
            </p>
            <div style={{ display: "flex", justifyContent: "center", gap: "12px" }}>
              <button
                type="button"
                onClick={() => navigate("/dashboard")}
                style={{
                  background: "rgba(255, 255, 255, 0.05)",
                  border: "1px solid rgba(255, 255, 255, 0.1)",
                  color: "#fff",
                  padding: "12px 24px",
                  borderRadius: "8px",
                  cursor: "pointer",
                  fontWeight: "600"
                }}
              >
                Go to Dashboard
              </button>
              {completedQuestions > 0 && (
                <button
                  type="button"
                  onClick={async () => {
                    try {
                      const reportResponse = await api.get(`/interview/${interview.id}/report`);
                      navigate("/evaluation", {
                        state: {
                          interviewId: interview.id,
                          report: reportResponse.data.report,
                        },
                      });
                    } catch (reportError) {
                      console.error("Failed to generate report:", reportError);
                      navigate("/dashboard");
                    }
                  }}
                  style={{
                    background: "#7c3aed",
                    border: "none",
                    color: "#fff",
                    padding: "12px 24px",
                    borderRadius: "8px",
                    cursor: "pointer",
                    fontWeight: "600"
                  }}
                >
                  View Evaluation Report
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}