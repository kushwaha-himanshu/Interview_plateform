import {
  ChevronLeft,
  ChevronRight,
  Download,
  Filter,
  Search,
  FileText,
  Code2,
  GitFork,
  BriefcaseBusiness,
  UsersRound,
  BrainCircuit,
  Network,
} from "lucide-react";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  Link,
} from "react-router-dom";

import DashboardLayout from "../components/DashboardLayout";
import api from "../services/api";

import "./History.css";


const categoryIcons = {
  "Resume Based": FileText,
  "Technical": Code2,
  "DSA": GitFork,
  "Projects": BriefcaseBusiness,
  "HR": UsersRound,
  "Behavioral": BrainCircuit,
  "System Design": Network,
};


const getCategoryIcon = (category) => {

  return (
    categoryIcons[category] ||
    FileText
  );

};


const getTone = (score) => {

  if (score == null) {
    return "neutral";
  }

  if (score >= 8) {
    return "success";
  }

  if (score >= 5) {
    return "info";
  }

  return "danger";

};


function ScoreRing({
  score,
  tone,
}) {

  return (

    <div
      className={`history-score-ring ${tone}`}
    >

      <svg
        viewBox="0 0 36 36"
        aria-hidden="true"
      >

        <path
          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
          className="ring-track"
        />

        <path
          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
          className="ring-value"
          style={{
            strokeDasharray:
              `${score}, 100`,
          }}
        />

      </svg>

      <span>
        {score}
      </span>

    </div>

  );

}


export default function History() {

  const [
    interviews,
    setInterviews,
  ] = useState([]);

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    error,
    setError,
  ] = useState("");

  const [
    query,
    setQuery,
  ] = useState("");

  const [
    sortDesc,
    setSortDesc,
  ] = useState(true);

  const [
    page,
    setPage,
  ] = useState(1);

  const pageSize = 5;


  // =============================
  // FETCH HISTORY
  // =============================

  useEffect(() => {

    const fetchHistory =
      async () => {

        try {

          setLoading(true);
          setError("");

          const response =
            await api.get(
              "/interview/history"
            );

          console.log(
            "Interview history:",
            response.data
          );

          setInterviews(
            response.data
              .interviews || []
          );

        } catch (error) {

          console.error(
            "Failed to fetch interview history:",
            error
          );

          setError(
            error.response?.data
              ?.message ||
            "Failed to load interview history."
          );

        } finally {

          setLoading(false);

        }

      };


    fetchHistory();

  }, []);


  // =============================
  // FILTER + SORT
  // =============================

  const filteredInterviews =
    useMemo(() => {

      const normalized =
        query
          .trim()
          .toLowerCase();


      const result =
        interviews.filter(
          (interview) => {

            const category =
              interview.category ||
              "";

            const status =
              interview.status ||
              "";

            const date =
              new Date(
                interview.createdAt
              ).toLocaleDateString();

            return (
              !normalized ||
              category
                .toLowerCase()
                .includes(normalized) ||
              status
                .toLowerCase()
                .includes(normalized) ||
              date
                .toLowerCase()
                .includes(normalized)
            );

          }
        );


      return [...result].sort(
        (a, b) => {

          const scoreA =
            a.overallScore ?? -1;

          const scoreB =
            b.overallScore ?? -1;

          return sortDesc
            ? scoreB - scoreA
            : scoreA - scoreB;

        }
      );

    }, [
      interviews,
      query,
      sortDesc,
    ]);


  // =============================
  // PAGINATION
  // =============================

  const totalPages =
    Math.max(
      1,
      Math.ceil(
        filteredInterviews.length /
        pageSize
      )
    );


  useEffect(() => {

    if (page > totalPages) {

      setPage(totalPages);

    }

  }, [
    page,
    totalPages,
  ]);


  const start =
    (page - 1) *
    pageSize;


  const pageItems =
    filteredInterviews.slice(
      start,
      start + pageSize
    );


  // =============================
  // DOWNLOAD
  // =============================

  const handleDownload =
    () => {

      window.print();

    };


  return (

    <DashboardLayout>


      <div className="history-page">

        <section
          className="history-header"
        >

          <div>

            <h1>
              Interview History
            </h1>

            <p>
              Review and analyze your
              past performance.
            </p>

          </div>


          <div
            className="history-tools"
          >

            <label>

              <Search
                size={14}
              />

              <input
                type="text"
                placeholder="Search history..."
                value={query}
                onChange={(event) => {

                  setQuery(
                    event.target.value
                  );

                  setPage(1);

                }}
              />

            </label>


            <button
              type="button"
              onClick={() => {

                setSortDesc(
                  (prev) => !prev
                );

                setPage(1);

              }}
            >

              <Filter size={16} />

              {sortDesc
                ? "High Score"
                : "Low Score"}

            </button>

          </div>

        </section>


        {loading && (

          <div className="history-loading">

            Loading interview history...

          </div>

        )}


        {error && (

          <div className="history-error">

            {error}

          </div>

        )}


        {!loading && !error && (

          <section
            className="history-table-panel"
          >

            <div
              className="history-table-wrap"
            >

              <table>

                <thead>

                  <tr>

                    <th>
                      Date
                    </th>

                    <th>
                      Category
                    </th>

                    <th>
                      Questions
                    </th>

                    <th>
                      Score
                    </th>

                    <th className="align-right">
                      Action
                    </th>

                  </tr>

                </thead>


                <tbody>

                  {pageItems.map(
                    (interview) => {

                      const {
                        _id,
                        category,
                        status,
                        overallScore,
                        questionsAnswered,
                        createdAt,
                      } = interview;


                      const score =
                        (overallScore*10) ??
                        0;


                      const tone =
                        getTone(
                          overallScore
                        );


                      const Icon =
                        getCategoryIcon(
                          category
                        );


                      const date =
                        new Date(
                          createdAt
                        ).toLocaleDateString(
                          "en-IN",
                          {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          }
                        );


                      const duration =
                        `${questionsAnswered} Questions`;


                      return (

                        <tr
                          key={_id}
                        >

                          <td
                            className="date-cell"
                          >
                            {date}
                          </td>


                          <td>

                            <span
                              className={`category-pill ${tone}`}
                            >

                              <Icon
                                size={13}
                              />

                              {category}

                            </span>

                          </td>


                          <td className="muted">

                            {duration}

                          </td>


                          <td>

                            {status ===
                            "completed" ? (

                              <ScoreRing
                                score={score}
                                tone={tone}
                              />

                            ) : (

                              <span className="muted">
                                In Progress
                              </span>

                            )}

                          </td>


                          <td className="align-right action-cell">

                            {status ===
                              "completed" && (

                              <>

                                <button
                                  type="button"
                                  title="Download PDF"
                                  onClick={
                                    handleDownload
                                  }
                                >

                                  <Download
                                    size={16}
                                  />

                                </button>


                                <Link
                                  to="/report"
                                  state={{
                                    interviewId:
                                      _id,
                                  }}
                                  title="View Report"
                                >

                                  View

                                </Link>

                              </>

                            )}

                            {status ===
                              "in_progress" && (

                              <Link
                                to="/interview"
                                state={{
                                  interviewId:
                                    _id,
                                }}
                              >

                                Continue

                              </Link>

                            )}

                          </td>

                        </tr>

                      );

                    }
                  )}


                  {!pageItems.length && (

                    <tr>

                      <td
                        colSpan="5"
                        style={{
                          textAlign:
                            "center",
                        }}
                      >

                        No interviews found.

                      </td>

                    </tr>

                  )}

                </tbody>

              </table>

            </div>


            <footer>

              <span>

                Showing{" "}

                {filteredInterviews.length ===
                0
                  ? 0
                  : start + 1}

                -

                {Math.min(
                  start + pageSize,
                  filteredInterviews.length
                )}

                {" "}of{" "}

                {filteredInterviews.length}

                {" "}reports

              </span>


              <div>

                <button
                  type="button"
                  aria-label="Previous"
                  onClick={() =>
                    setPage(
                      (prev) =>
                        Math.max(
                          1,
                          prev - 1
                        )
                    )
                  }
                  disabled={
                    page === 1
                  }
                >

                  <ChevronLeft
                    size={18}
                  />

                </button>


                <button
                  type="button"
                  aria-label="Next"
                  onClick={() =>
                    setPage(
                      (prev) =>
                        Math.min(
                          totalPages,
                          prev + 1
                        )
                    )
                  }
                  disabled={
                    page === totalPages
                  }
                >

                  <ChevronRight
                    size={18}
                  />

                </button>

              </div>

            </footer>

          </section>

        )}

      </div>

    </DashboardLayout>

  );

}