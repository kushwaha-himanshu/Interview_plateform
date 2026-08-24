import {
  ArrowLeft,
  ArrowRight,
  BrainCircuit,
  BriefcaseBusiness,
  Code2,
  FileText,
  GitFork,
  Network,
  UsersRound,
  CheckCircle2,
} from "lucide-react";
import { useState, useEffect } from "react";
import api from "../services/api";
import { Link, useNavigate } from "react-router-dom";
import DashboardLayout from "../components/DashboardLayout";
import Topbar from "../components/Topbar";
import "./InterviewSetup.css";

const categories = [
  [FileText, "Resume Based", "Questions generated from your resume"],
  [Code2, "Technical", "Core technical concepts"],
  [GitFork, "DSA", "Data structures & Algorithms"],
  [BriefcaseBusiness, "Projects", "In-depth project discussion"],
  [UsersRound, "HR", "HR & Behavioral questions"],
  [BrainCircuit, "Behavioral", "Situational & behavioral questions"],
  [Network, "System Design", "System architecture & design"],
];
const choices = {
  difficulty: ["Beginner", "Intermediate", "Advanced"],
  style: ["Friendly", "Professional", "Technical", "Stress Mode"],
  duration: ["15 min", "30 min", "45 min"],
};
export default function InterviewSetup() {
  const [category, setCategory] = useState("Resume Based");
  const [settings, setSettings] = useState({
    difficulty: "Intermediate",
    style: "Professional",
    duration: "30 min",
  });
  const navigate = useNavigate();
  const [starting, setStarting] = useState(false);
  const [error, setError] = useState("");
  const [resumes, setResumes] = useState([]);
  const [selectedResumeId, setSelectedResumeId] = useState(null);

  useEffect(() => {
    const fetchResumes = async () => {
      try {
        const response = await api.get("/resume");
        if (response.data?.resumes) {
          setResumes(response.data.resumes);
          if (response.data.resumes.length > 0) {
            setSelectedResumeId(response.data.resumes[0].id);
          }
        }
      } catch (err) {
        console.error("Failed to fetch resumes:", err);
      }
    };
    fetchResumes();
  }, []);

  const select = (key, value) => setSettings({ ...settings, [key]: value });

  const startInterview = async () => {
    if (!selectedResumeId) {
      setError("Please select a resume first.");
      return;
    }
    if (!category || !settings.difficulty || !settings.style || !settings.duration) {
      setError("Please select all options before starting.");
      return;
    }
    setStarting(true);
    setError("");

    try {
      const response = await api.post(
        "/interview/start",
        {
          resumeId: selectedResumeId,
          category,
          difficulty: settings.difficulty,
          interviewerStyle: settings.style,
          duration: settings.duration,
        }
      );

      console.log(
        "Interview started:",
        response.data
      );

      const interview =
        response.data.interview;

      // Send the interview data to Interview page
      navigate("/interview", {
        state: {
          interview,
        },
      });

    } catch (error) {

      console.error(
        "Failed to start interview:",
        error
      );

      setError(
        error.response?.data?.message ||
        "Failed to start interview. Please try again."
      );

    } finally {
      setStarting(false);
    }
  };
  return (
    <DashboardLayout>
      <Topbar avatarText="NG" />
      <section className="setup-page">
        <header className="setup-heading">
          <Link to="/dashboard">
            <ArrowLeft size={18} />
            Back
          </Link>
          <h1>Start Interview</h1>
          <p>Choose your interview type and preferences</p>
        </header>
        <section>
          <h2>Interview Category</h2>
          <div className="category-grid">
            {categories.map(([Icon, title, description]) => (
              <button
                key={title}
                className={`category-card ${category === title ? "selected" : ""}`}
                onClick={() => setCategory(title)}
              >
                {category === title && (
                  <CheckCircle2 className="selected-icon" size={19} />
                )}
                <span>
                  <Icon size={21} />
                </span>
                <b>{title}</b>
                <p>{description}</p>
              </button>
            ))}
          </div>
        </section>
        
        {/* =========================
            SELECT RESUME
        ========================= */}
        <section style={{ marginTop: "24px" }}>
          <h2>Select Resume</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginTop: "12px" }}>
            {resumes.map((res) => {
              const isSelected = selectedResumeId === res.id;
              return (
                <button
                  type="button"
                  key={res.id}
                  onClick={() => setSelectedResumeId(res.id)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "16px",
                    width: "100%",
                    textAlign: "left",
                    background: isSelected ? "rgba(124, 58, 237, 0.08)" : "rgba(28, 43, 60, 0.45)",
                    border: isSelected ? "1px solid #7c3aed" : "1px solid rgba(255, 255, 255, 0.05)",
                    borderRadius: "8px",
                    cursor: "pointer"
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <span style={{
                      display: "grid",
                      placeItems: "center",
                      width: "20px",
                      height: "20px",
                      borderRadius: "50%",
                      background: isSelected ? "#7c3aed" : "#1c2b3c",
                      color: "#fff",
                      fontSize: "12px"
                    }}>
                      {isSelected ? "✓" : ""}
                    </span>
                    <div>
                      <b style={{ color: "#fff", display: "block" }}>{res.fileName}</b>
                      <span style={{ color: "#ccc3d8", fontSize: "12px" }}>
                        {res.analysis?.skills?.length || 0} Skills · {res.analysis?.projects?.length || 0} Projects
                      </span>
                    </div>
                  </div>
                  <span style={{ color: "#958da1", fontSize: "11px" }}>
                    Uploaded {new Date(res.uploadedAt).toLocaleDateString()}
                  </span>
                </button>
              );
            })}
            {resumes.length === 0 && (
              <p style={{ color: "#ef4444", margin: "8px 0", fontSize: "14px" }}>
                No resumes found. Please upload a resume first before starting an interview.
              </p>
            )}
          </div>
        </section>

        <div className="setup-settings">
          <OptionGroup
            title="Difficulty Level"
            setting="difficulty"
            values={choices.difficulty}
            value={settings.difficulty}
            onSelect={select}
          />
          <OptionGroup
            title="Interviewer Style"
            setting="style"
            values={choices.style}
            value={settings.style}
            onSelect={select}
          />
          <OptionGroup
            wide
            title="Duration"
            setting="duration"
            values={choices.duration}
            value={settings.duration}
            onSelect={select}
          />
        </div>
        {error && (
  <p
    style={{
      color: "#ef4444",
      textAlign: "center",
      marginTop: "16px",
    }}
  >
    {error}
  </p>
)}
        {/* =========================
            INTERVIEW PREVIEW
        ========================= */}
        <div className="interview-preview-box" style={{
          margin: "32px auto 16px",
          padding: "20px",
          borderRadius: "12px",
          background: "#0d0d18",
          border: "1px solid rgba(255, 255, 255, 0.05)",
          maxWidth: "500px",
          textAlign: "center"
        }}>
          <h3 style={{ margin: "0 0 12px", color: "#d2bbff", fontSize: "16px" }}>AI Interview Preview</h3>
          <div style={{ display: "flex", justifyContent: "center", gap: "10px", flexWrap: "wrap", marginBottom: "12px" }}>
            {resumes.find(r => r.id === selectedResumeId) && (
              <span style={{ background: "rgba(124, 58, 237, 0.2)", border: "1px solid #7c3aed", color: "#d2bbff", padding: "4px 10px", borderRadius: "6px", fontSize: "13px" }}>
                📄 {resumes.find(r => r.id === selectedResumeId).fileName}
              </span>
            )}
            <span style={{ background: "#122131", color: "#4cd7f6", padding: "4px 10px", borderRadius: "6px", fontSize: "13px" }}>{category}</span>
            <span style={{ background: "#122131", color: "#4cd7f6", padding: "4px 10px", borderRadius: "6px", fontSize: "13px" }}>{settings.difficulty}</span>
            <span style={{ background: "#122131", color: "#4cd7f6", padding: "4px 10px", borderRadius: "6px", fontSize: "13px" }}>{settings.style}</span>
            <span style={{ background: "#122131", color: "#4cd7f6", padding: "4px 10px", borderRadius: "6px", fontSize: "13px" }}>{settings.duration}</span>
          </div>
          <p style={{ margin: "0 0 8px", color: "#fff", fontWeight: "600" }}>
            {settings.duration === "15 min" ? "5 questions" : settings.duration === "30 min" ? "8 questions" : "12 questions"}
          </p>
          <p style={{ margin: 0, color: "#ccc3d8", fontSize: "12px" }}>
            Questions will adapt based on your answers.
          </p>
        </div>

        <div className="setup-action">
         <button
  onClick={startInterview}
  disabled={starting}
>
  {starting ? (
    <>
      Starting Interview...
    </>
  ) : (
    <>
      Start AI Interview
      <ArrowRight size={19} />
    </>
  )}
</button>
        </div>
      </section>
    </DashboardLayout>
  );
}
function OptionGroup({ title, setting, values, value, onSelect, wide }) {
  return (
    <section className={`option-group dashboard-card ${wide ? "wide" : ""}`}>
      <h3>{title}</h3>
      <div>
        {values.map((option) => (
          <button
            key={option}
            className={value === option ? "selected" : ""}
            onClick={() => onSelect(setting, option)}
          >
            {option}
          </button>
        ))}
      </div>
    </section>
  );
}
