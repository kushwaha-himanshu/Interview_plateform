import {
  ArrowLeft,
  ArrowRight,
  Award,
  BriefcaseBusiness,
  ChevronRight,
  Code2,
  FileBadge,
  Hammer,
  Sparkles,
  Trash2,
} from "lucide-react";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import DashboardLayout from "../components/DashboardLayout";
import Topbar from "../components/Topbar";
import ResumeUploader from "../components/ResumeUploader";
import api from "../services/api";
import "./Resume.css";

export default function Resume() {
  const [resumeData, setResumeData] = useState(null);
  const [resumesList, setResumesList] = useState([]);
  const [loadingResume, setLoadingResume] = useState(true);
  const [resumeError, setResumeError] = useState("");
  const [expandedCategory, setExpandedCategory] = useState(null);
  const [resumeToDelete, setResumeToDelete] = useState(null);

  useEffect(() => {
    const fetchResumes = async () => {
      try {
        setLoadingResume(true);
        const response = await api.get("/resume");
        if (response.data?.resumes) {
          setResumesList(response.data.resumes);
          if (response.data.resumes.length > 0) {
            setResumeData(response.data.resumes[0]);
          }
        }
      } catch (error) {
        console.error("Failed to fetch resumes:", error);
        setResumeError(
          error.response?.data?.message || "Failed to load resumes."
        );
      } finally {
        setLoadingResume(false);
      }
    };
    fetchResumes();
  }, []);

  const handleUploadSuccess = (newResume) => {
    setResumeData(newResume);
    setResumesList((prevList) => {
      const exists = prevList.some((r) => r.id === newResume.id);
      if (exists) return prevList;
      return [newResume, ...prevList];
    });
  };

  const handleDeleteResume = async () => {
    if (!resumeToDelete) return;
    try {
      const response = await api.delete(`/resume/${resumeToDelete.id}`);
      if (response.data?.success) {
        const deletedId = response.data.resumeId;
        setResumesList((prev) => prev.filter((r) => r.id !== deletedId));
        if (resumeData?.id === deletedId) {
          setResumeData(null);
          setExpandedCategory(null);
        }
      }
    } catch (err) {
      console.error("Delete resume failed:", err);
      setResumeError(
        err.response?.data?.message || "Failed to delete resume."
      );
    } finally {
      setResumeToDelete(null);
    }
  };

  const analysis = resumeData?.analysis || {};

  const stats = [
    [Hammer, "Skills Found", analysis.skills?.length || 0, "blue"],
    [Code2, "Projects Found", analysis.projects?.length || 0, "purple"],
    [Award, "Achievements", analysis.achievements?.length || 0, "cyan"],
    [BriefcaseBusiness, "Experience Entries", analysis.experience?.length || 0, "red"],
    [FileBadge, "Certifications", analysis.certifications?.length || 0, "gray"],
  ];

  const toggleCategory = (label) => {
    if (!resumeData) return;
    setExpandedCategory(expandedCategory === label ? null : label);
  };

  const renderSkills = (skills) => {
    if (!skills || skills.length === 0) {
      return <p style={{ color: "#ccc3d8", fontSize: "13px", margin: 0 }}>No skills found.</p>;
    }
    return (
      <div className="skill-tags" style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
        {skills.map((skill, index) => {
          const skillName = typeof skill === "string" ? skill : (skill.name || skill.title || "");
          return <span key={index}>{skillName}</span>;
        })}
      </div>
    );
  };

  const renderProject = (project, index) => {
    if (typeof project === "string") {
      return (
        <div key={index} style={{ color: "#ccc3d8", fontSize: "13px", marginBottom: "8px" }}>
          • {project}
        </div>
      );
    }
    const title = project.name || project.title || "Project";
    const description = project.description || project.desc || "";
    const technologies = project.technologies || project.techStack || project.tech || "";
    return (
      <div key={index} style={{ marginBottom: "12px", borderBottom: "1px solid rgba(255, 255, 255, 0.05)", paddingBottom: "8px" }}>
        <b style={{ color: "#fff", display: "block", fontSize: "14px" }}>{title}</b>
        {description && <p style={{ margin: "4px 0", color: "#ccc3d8", fontSize: "13px" }}>{description}</p>}
        {technologies && (
          <p style={{ margin: "4px 0", color: "#d2bbff", fontSize: "12px" }}>
            <strong>Technologies:</strong> {Array.isArray(technologies) ? technologies.join(", ") : technologies}
          </p>
        )}
      </div>
    );
  };

  const renderAchievement = (ach, index) => {
    const text = typeof ach === "string" ? ach : (ach.title || ach.name || ach.description || "Achievement");
    return (
      <p key={index} style={{ color: "#ccc3d8", fontSize: "13px", margin: "0 0 6px" }}>
        • {text}
      </p>
    );
  };

  const renderExperience = (exp, index) => {
    if (typeof exp === "string") {
      return (
        <p key={index} style={{ color: "#ccc3d8", fontSize: "13px", margin: "0 0 8px" }}>
          • {exp}
        </p>
      );
    }
    const role = exp.role || exp.position || exp.title || "Experience";
    const company = exp.company || exp.organization || "";
    const startYear = exp.startYear || exp.startDate || "";
    const endYear = exp.endYear || exp.endDate || "";
    const description = exp.description || exp.desc || "";
    return (
      <div key={index} style={{ marginBottom: "12px", borderBottom: "1px solid rgba(255, 255, 255, 0.05)", paddingBottom: "8px" }}>
        <b style={{ color: "#fff", display: "block", fontSize: "14px" }}>{role}</b>
        {company && <span style={{ color: "#d2bbff", fontSize: "13px" }}>{company}</span>}
        {(startYear || endYear) && (
          <span style={{ color: "#ccc3d8", fontSize: "12px", marginLeft: company ? "8px" : "0" }}>
            · {startYear}{endYear ? ` - ${endYear}` : ""}
          </span>
        )}
        {description && <p style={{ margin: "4px 0 0", color: "#ccc3d8", fontSize: "13px" }}>{description}</p>}
      </div>
    );
  };

  const renderCertification = (cert, index) => {
    if (typeof cert === "string") {
      return (
        <p key={index} style={{ color: "#ccc3d8", fontSize: "13px", margin: "0 0 6px" }}>
          • {cert}
        </p>
      );
    }
    const name = cert.name || cert.title || "Certification";
    const issuer = cert.issuer || cert.authority || "";
    const date = cert.date || cert.year || "";
    return (
      <div key={index} style={{ marginBottom: "8px" }}>
        <b style={{ color: "#fff", display: "block", fontSize: "13px" }}>• {name}</b>
        {(issuer || date) && (
          <span style={{ color: "#ccc3d8", fontSize: "12px" }}>
            {issuer}{date ? ` · ${date}` : ""}
          </span>
        )}
      </div>
    );
  };

  const renderDetails = (label) => {
    switch (label) {
      case "Skills Found":
        return renderSkills(analysis.skills);
      case "Projects Found":
        if (!analysis.projects || analysis.projects.length === 0) {
          return <p style={{ color: "#ccc3d8", fontSize: "13px", margin: 0 }}>No projects found.</p>;
        }
        return analysis.projects.map((proj, idx) => renderProject(proj, idx));
      case "Achievements":
        if (!analysis.achievements || analysis.achievements.length === 0) {
          return <p style={{ color: "#ccc3d8", fontSize: "13px", margin: 0 }}>No achievements found.</p>;
        }
        return analysis.achievements.map((ach, idx) => renderAchievement(ach, idx));
      case "Experience Entries":
        if (!analysis.experience || analysis.experience.length === 0) {
          return <p style={{ color: "#ccc3d8", fontSize: "13px", margin: 0 }}>No experience entries found.</p>;
        }
        return analysis.experience.map((exp, idx) => renderExperience(exp, idx));
      case "Certifications":
        if (!analysis.certifications || analysis.certifications.length === 0) {
          return <p style={{ color: "#ccc3d8", fontSize: "13px", margin: 0 }}>No certifications found.</p>;
        }
        return analysis.certifications.map((cert, idx) => renderCertification(cert, idx));
      default:
        return null;
    }
  };

  if (loadingResume) {
    return (
      <DashboardLayout>
        <Topbar avatarText="NG" />
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "calc(100vh - 100px)", color: "#fff" }}>
          <p>Loading resume analysis...</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <Topbar avatarText="NG" />
      <div className="resume-page">
        <header className="resume-heading">
          <Link to="/dashboard">
            <ArrowLeft size={19} />
          </Link>
          <div>
            <h1>Resume</h1>
            <p>Upload your resume and let AI understand your experience.</p>
          </div>
        </header>
        {resumeError && (
          <div style={{ color: "#ef4444", marginBottom: "16px", padding: "12px", background: "rgba(239, 68, 68, 0.1)", borderRadius: "8px" }}>
            {resumeError}
          </div>
        )}
        <div className="resume-grid">
          <div>
            <ResumeUploader onUploadSuccess={handleUploadSuccess} activeResume={resumeData} />
            
            {/* =========================
                YOUR RESUMES
            ========================= */}
            <section className="dashboard-card" style={{ marginTop: "24px", padding: "24px" }}>
              <h3 style={{ margin: "0 0 16px", fontSize: "18px", color: "#fff" }}>Your Resumes</h3>
              {resumesList.length === 0 ? (
                <div style={{ textAlign: "center", padding: "20px", color: "#ccc3d8" }}>
                  <p>No resumes uploaded yet.</p>
                  <p style={{ fontSize: "12px", opacity: 0.8 }}>Upload your resume above to get started.</p>
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  {resumesList.map((res) => {
                    const isSelected = resumeData?.id === res.id;
                    return (
                      <div
                        key={res.id}
                        onClick={() => {
                          setResumeData(res);
                          setExpandedCategory(null);
                        }}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          padding: "16px",
                          borderRadius: "8px",
                          background: isSelected ? "rgba(124, 58, 237, 0.08)" : "rgba(28, 43, 60, 0.45)",
                          border: isSelected ? "1px solid #7c3aed" : "1px solid rgba(255, 255, 255, 0.05)",
                          cursor: "pointer",
                          transition: "all 0.2s ease"
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
                            <b style={{ color: "#fff", display: "block", fontSize: "14px" }}>{res.fileName}</b>
                            <span style={{ color: "#ccc3d8", fontSize: "12px" }}>
                              {res.analysis?.skills?.length || 0} Skills · {res.analysis?.projects?.length || 0} Projects
                            </span>
                          </div>
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                          <span style={{ color: "#958da1", fontSize: "11px" }}>
                            {new Date(res.uploadedAt).toLocaleDateString()}
                          </span>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setResumeToDelete(res);
                            }}
                            style={{
                              background: "none",
                              border: "none",
                              color: "#ef4444",
                              cursor: "pointer",
                              padding: "4px",
                              display: "grid",
                              placeItems: "center",
                              borderRadius: "4px",
                              transition: "background 0.2s"
                            }}
                            title="Delete resume"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </section>
            
            {resumeData && (
              <section className="analysis-ready dashboard-card" style={{ marginTop: "24px" }}>
                <div>
                  <p>Your resume has been successfully analyzed</p>
                  <strong>
                    You can now start your personalized interview.
                  </strong>
                </div>
                <Link to="/interview/setup">
                  Start Interview <ArrowRight size={17} />
                </Link>
              </section>
            )}
          </div>
          <aside className="resume-side">
            <section className="dashboard-card analysis-card">
              <div className="resume-card-title">
                <h3>Resume Analysis</h3>
                <span>
                  {resumeData ? "Analysis Complete" : "Pending Upload"} <Sparkles size={13} />
                </span>
              </div>
              {stats.map(([Icon, label, value, tone]) => {
                const isExpanded = expandedCategory === label;
                return (
                  <div key={label} style={{ width: "100%" }}>
                    <button 
                      type="button"
                      className={`analysis-stat ${isExpanded ? "selected-stat" : ""}`}
                      onClick={() => toggleCategory(label)}
                      style={{ 
                        cursor: resumeData ? "pointer" : "default",
                      }}
                      disabled={!resumeData}
                    >
                      <span className={`analysis-icon ${tone}`}>
                        <Icon size={16} />
                      </span>
                      <p>{label}</p>
                      <strong>{value}</strong>
                      <ChevronRight 
                        size={16} 
                        style={{ 
                          transform: isExpanded ? "rotate(90deg)" : "rotate(0deg)", 
                          transition: "transform 0.2s ease" 
                        }} 
                      />
                    </button>
                    
                    <AnimatePresence initial={false}>
                      {isExpanded && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.2, ease: "easeInOut" }}
                          style={{
                            overflow: "hidden"
                          }}
                        >
                          <div style={{
                            padding: "16px",
                            background: "rgba(255, 255, 255, 0.02)",
                            border: "1px solid rgba(255, 255, 255, 0.05)",
                            borderRadius: "8px",
                            marginTop: "8px",
                            textAlign: "left"
                          }}>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
                              <h4 style={{ color: "#d2bbff", margin: 0, fontSize: "14px" }}>{label}</h4>
                              <button 
                                type="button"
                                onClick={(e) => { e.stopPropagation(); setExpandedCategory(null); }}
                                style={{ background: "none", border: "none", color: "#ccc3d8", cursor: "pointer", fontSize: "14px" }}
                              >
                                ✕
                              </button>
                            </div>
                            {renderDetails(label)}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </section>
            <section className="dashboard-card highlights-card">
              <h3>Extracted Highlights</h3>
              <p className="eyebrow">Top Technical Skills</p>
              <div className="skill-tags">
                {analysis.top_technical_skills && analysis.top_technical_skills.length > 0 ? (
                  analysis.top_technical_skills.slice(0, 5).map((skill) => (
                    <span key={skill}>{skill}</span>
                  ))
                ) : analysis.skills && analysis.skills.length > 0 ? (
                  analysis.skills.slice(0, 5).map((skill) => (
                    <span key={skill}>{skill}</span>
                  ))
                ) : (
                  <span style={{ opacity: 0.6, fontSize: "13px" }}>No skills detected</span>
                )}
              </div>
              <p className="eyebrow">Recent Role</p>
              <div className="recent-role">
                {analysis.recent_role ? (
                  <>
                    <b>{analysis.recent_role.title || "Unknown Title"}</b>
                    <span>
                      {analysis.recent_role.company || "Unknown Company"}
                      {analysis.recent_role.startYear ? ` · ${analysis.recent_role.startYear}` : ""}
                      {analysis.recent_role.endYear ? ` - ${analysis.recent_role.endYear}` : ""}
                    </span>
                  </>
                ) : (
                  <span style={{ opacity: 0.6, fontSize: "13px" }}>No recent role detected</span>
                )}
              </div>
            </section>
          </aside>
        </div>
      </div>

      {/* =========================
          DELETE CONFIRMATION MODAL
      ========================= */}
      {resumeToDelete && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          background: "rgba(0, 0, 0, 0.7)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          zIndex: 1000
        }}>
          <div style={{
            background: "#0d0d18",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            borderRadius: "12px",
            padding: "24px",
            maxWidth: "400px",
            width: "90%",
            textAlign: "center",
            boxShadow: "0 8px 32px rgba(0, 0, 0, 0.5)"
          }}>
            <h3 style={{ color: "#fff", margin: "0 0 12px", fontSize: "18px" }}>Delete Resume?</h3>
            <p style={{ color: "#ccc3d8", fontSize: "14px", margin: "0 0 20px" }}>
              Are you sure you want to delete: <strong>{resumeToDelete.fileName}</strong>?
              <br />
              This will remove the resume and its extracted analysis. Past interview reports using this resume will NOT be deleted.
            </p>
            <div style={{ display: "flex", justifyContent: "center", gap: "12px" }}>
              <button
                type="button"
                onClick={() => setResumeToDelete(null)}
                style={{
                  background: "rgba(255, 255, 255, 0.05)",
                  border: "1px solid rgba(255, 255, 255, 0.1)",
                  color: "#fff",
                  padding: "10px 20px",
                  borderRadius: "8px",
                  cursor: "pointer",
                  fontWeight: "600"
                }}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteResume}
                style={{
                  background: "#ef4444",
                  border: "none",
                  color: "#fff",
                  padding: "10px 20px",
                  borderRadius: "8px",
                  cursor: "pointer",
                  fontWeight: "600"
                }}
              >
                Delete Resume
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
