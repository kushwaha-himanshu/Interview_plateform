import {
  ArrowLeft,
  FileText,
} from "lucide-react";

import {
  Link,
} from "react-router-dom";

import {
  useEffect,
  useState,
} from "react";

import DashboardLayout from "../components/DashboardLayout";

import StatCard from "../components/StatCard";

import BarChartCard from "../components/BarChartCard";

import RadarChartCard from "../components/RadarChartCard";

import api from "../services/api";

import "./Analytics.css";


export default function Analytics() {

  const [
    analytics,
    setAnalytics,
  ] = useState(null);


  const [
    loading,
    setLoading,
  ] = useState(true);


  const [
    error,
    setError,
  ] = useState("");


  // ============================
  // FETCH ANALYTICS
  // ============================

  useEffect(() => {

    const fetchAnalytics =
      async () => {

        try {

          setLoading(true);

          setError("");

          const response =
            await api.get(
              "/interview/analytics"
            );


          console.log(
            "Analytics response:",
            response.data
          );


          setAnalytics(
            response.data.analytics
          );


        } catch (error) {

          console.error(
            "Analytics fetch failed:",
            error
          );


          setError(
            error.response?.data
              ?.message ||
            "Failed to load analytics."
          );


        } finally {

          setLoading(false);

        }

      };


    fetchAnalytics();

  }, []);


  // ============================
  // LOADING
  // ============================

  if (loading) {

    return (

      <DashboardLayout>

        <div className="analytics-page">

          <h2>
            Loading analytics...
          </h2>

        </div>

      </DashboardLayout>

    );

  }


  // ============================
  // ERROR
  // ============================

  if (error || !analytics) {

    return (

      <DashboardLayout>

        <div className="analytics-page">

          <h2>
            Failed to load analytics
          </h2>

          <p>
            {error ||
              "No analytics available."}
          </p>

        </div>

      </DashboardLayout>

    );

  }


  // ============================
  // DATA
  // ============================

  const {
    overview,
    skills,
    trend,
    recentInterviews,
  } = analytics;


  return (

    <DashboardLayout>

      <div className="analytics-page">


        {/* ==========================
            HEADER
        ========================== */}

        <header
          className="analytics-heading"
        >

          <div
            className="analytics-heading-main"
          >

            <h1>

              <ArrowLeft
                size={21}
              />

              Analytics

            </h1>

            <p>
              Track your performance
              over time
            </p>

          </div>


          {/* <Link
            className="report-nav-btn"
            to="/report"
          >

            <FileText
              size={16}
            />

            View Report

          </Link> */}

        </header>


        {/* ==========================
            KPI
        ========================== */}

        <section
          className="analytics-kpis"
        >

          <StatCard

            label="Overall Score"

            value={`${Math.round(
              overview.overallScore * 10
            )}%`}

            detail={`Best Score: ${Math.round(
              overview.bestScore * 10
            )}%`}

          />


          <StatCard

            label="Total Sessions"

            value={
              overview.totalSessions
            }

            detail={`${overview.totalQuestions} Questions Answered`}

          />


          <StatCard

            label="Avg. Improvement"

            value={`${
              overview.averageImprovement >=
              0
                ? "+"
                : ""
            }${Math.round(
              overview.averageImprovement *
              10
            )}%`}

            detail="Across recent sessions"

          />

        </section>


        {/* ==========================
            CHARTS
        ========================== */}

        <section
          className="analytics-charts"
        >

          <RadarChartCard
            data={skills}
          />

          <BarChartCard
            data={trend}
          />

        </section>


        {/* ==========================
            RECENT INTERVIEWS
        ========================== */}

        <section
          className="dashboard-card interview-table"
        >

          <header>

            <h2>
              Recent Interviews
            </h2>

            <Link to="/history">
              View All
            </Link>

          </header>


          <div>

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
                    Score
                  </th>

                  <th>
                    Duration
                  </th>

                  <th>
                    Improvement
                  </th>

                </tr>

              </thead>


              <tbody>

                {recentInterviews.map(
                  (interview) => (

                    <tr
                      key={interview.id}
                    >

                      <td>
                        {interview.date}
                      </td>


                      <td>

                        <i
                          className={
                            interview.tone
                          }
                        />

                        {
                          interview.category
                        }

                      </td>


                      <td>

                        <b>
                          {
                            interview.score
                          }
                        </b>

                      </td>


                      <td>

                        {
                          interview.duration
                        }

                      </td>


                      <td
                        className={
                          interview.improvement ===
                          "-"
                            ? ""
                            : "increase"
                        }
                      >

                        {
                          interview.improvement
                        }

                      </td>

                    </tr>

                  )
                )}


                {recentInterviews.length ===
                  0 && (

                  <tr>

                    <td
                      colSpan="5"
                    >

                      No completed
                      interviews yet.

                    </td>

                  </tr>

                )}

              </tbody>

            </table>

          </div>

        </section>

      </div>

    </DashboardLayout>

  );

}