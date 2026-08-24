import {
  ArrowLeft,
  Clock3,
  Mic,
  Send,
  Square,
} from "lucide-react";

import {
  useState,
} from "react";

import {
  Link,
  useLocation,
  useNavigate,
} from "react-router-dom";

import QuestionCard from "../components/QuestionCard";

import api from "../services/api";

import "./Interview.css";


export default function Interview() {

  const location = useLocation();
  const navigate = useNavigate();


  // Interview received from InterviewSetup
  const initialInterview =
    location.state?.interview;


  const [interview, setInterview] =
    useState(initialInterview);


  const [answer, setAnswer] =
    useState("");


  const [submitting, setSubmitting] =
    useState(false);


  const [error, setError] =
    useState("");


  // --------------------------------
  // Safety check
  // --------------------------------

  if (!interview) {

    return (
      <div className="interview-page">

        <h2>
          Interview session not found
        </h2>

        <button
          type="button"
          onClick={() =>
            navigate("/interview/setup")
          }
        >
          Start New Interview
        </button>

      </div>
    );
  }


  // --------------------------------
  // Interview information
  // --------------------------------

  const questionNumber =
    interview.questionNumber || 1;


  const totalQuestions =
    interview.totalQuestions || 5;


  const completedQuestions =
    questionNumber - 1;


  const progress =
    (completedQuestions / totalQuestions) * 100;


  // --------------------------------
  // Submit answer
  // --------------------------------

  const submitAnswer = async () => {

    if (!answer.trim()) {

      setError(
        "Please enter your answer before submitting."
      );

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


      console.log(
        "Answer submitted:",
        response.data
      );


      const data = response.data;


      // --------------------------------
      // Interview completed
      // --------------------------------

      if (data.completed) {

  try {

    // Get evaluations of ALL questions
    const reportResponse =
      await api.get(
        `/interview/${interview.id}/report`
      );

    console.log(
      "Final interview report:",
      reportResponse.data
    );

    navigate("/evaluation", {
      state: {
        interviewId: interview.id,
        report: reportResponse.data.report,
      },
    });

  } catch (reportError) {

    console.error(
      "Failed to get final evaluation:",
      reportError
    );

    setError(
      "Interview completed, but final evaluation could not be loaded."
    );
  }

  return;
}

      // --------------------------------
      // Next question available
      // --------------------------------

      setInterview({
        ...interview,

        question:
          data.nextQuestion,

        questionNumber:
          data.questionNumber,

        difficulty:
          data.difficulty,

        coveredTopics:
          data.coveredTopics,
      });


      // Clear previous answer
      setAnswer("");


    } catch (error) {

      console.error(
        "Submit answer failed:",
        error
      );


      setError(
        error.response?.data?.message ||
        "Failed to submit answer. Please try again."
      );


    } finally {

      setSubmitting(false);

    }
  };


  return (

    <div className="interview-page">

      {/* =========================
          HEADER
      ========================= */}

      <header className="interview-top">

        <Link to="/interview/setup">

          <ArrowLeft size={20} />

          <b>
            AI Interview
          </b>

        </Link>


        <div>

          <span className="timer">

            <Clock3 size={17} />

            04:32

          </span>


          <Link
            className="end-interview"
            to="/dashboard"
          >

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
              question={
                interview.question
              }

              questionNumber={
                questionNumber
              }

              totalQuestions={
                totalQuestions
              }

              difficulty={
                interview.difficulty
              }
            />


            {/* =========================
                ANSWER
            ========================= */}

            <section className="answer-box">

              <textarea

                value={answer}

                onChange={(event) =>
                  setAnswer(
                    event.target.value
                  )
                }

                placeholder="Type your answer here..."

                disabled={submitting}

              />


              {error && (

                <p
                  style={{
                    color: "#ef4444",
                    margin: "10px 0",
                  }}
                >
                  {error}
                </p>

              )}


              <footer>


                <button
                  type="button"
                  disabled={submitting}
                >

                  <Mic size={18} />

                  Voice Answer

                </button>


                <button

                  className="submit-answer"

                  type="button"

                  disabled={submitting}

                  onClick={
                    submitAnswer
                  }

                >

                  {submitting
                    ? "Evaluating..."
                    : "Submit Answer"}

                  {!submitting && (
                    <Send size={17} />
                  )}

                </button>


              </footer>

            </section>

          </div>

        </section>


        {/* =========================
            PROGRESS
        ========================= */}

        <aside className="progress-panel">

          <h3>
            Interview Progress
          </h3>


          <div className="progress-circle">

            <svg viewBox="0 0 100 100">

              <circle
                cx="50"
                cy="50"
                r="45"
              />

              <circle
                className="progress-value"
                cx="50"
                cy="50"
                r="45"

                style={{
                  strokeDasharray: "283",
                  strokeDashoffset:
                    283 -
                    (283 * progress) /
                      100,
                }}
              />

            </svg>


            <strong>
              {Math.round(progress)}%
            </strong>

          </div>


          <p>
            {completedQuestions} /{" "}
            {totalQuestions}{" "}
            Questions Completed
          </p>


          <hr />


          <div className="progress-detail">

            <span>
              Current Focus
            </span>

            <b>
              {interview.coveredTopics?.[
                interview.coveredTopics.length - 1
              ] || "Resume Based"}
            </b>

          </div>


          <div className="progress-detail">

            <span>
              Adaptive Mode
            </span>

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