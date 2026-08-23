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
} from "lucide-react";
import { Link } from "react-router-dom";
import DashboardLayout from "../components/DashboardLayout";
import Topbar from "../components/Topbar";
import ResumeUploader from "../components/ResumeUploader";
import "./Resume.css";

const stats = [
  [Hammer, "Skills Found", "14", "blue"],
  [Code2, "Projects Found", "3", "purple"],
  [Award, "Achievements", "5", "cyan"],
  [BriefcaseBusiness, "Experience Entries", "2", "red"],
  [FileBadge, "Certifications", "4", "gray"],
];
export default function Resume() {
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
        <div className="resume-grid">
          <div>
            <ResumeUploader />
            <section className="analysis-ready dashboard-card">
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
          </div>
          <aside className="resume-side">
            <section className="dashboard-card analysis-card">
              <div className="resume-card-title">
                <h3>Resume Analysis</h3>
                <span>
                  Analysis Complete <Sparkles size={13} />
                </span>
              </div>
              {stats.map(([Icon, label, value, tone]) => (
                <button className="analysis-stat" key={label}>
                  <span className={`analysis-icon ${tone}`}>
                    <Icon size={16} />
                  </span>
                  <p>{label}</p>
                  <strong>{value}</strong>
                  <ChevronRight size={16} />
                </button>
              ))}
            </section>
            <section className="dashboard-card highlights-card">
              <h3>Extracted Highlights</h3>
              <p className="eyebrow">Top Technical Skills</p>
              <div className="skill-tags">
                <span>React.js</span>
                <span>Node.js</span>
                <span>Python</span>
              </div>
              <p className="eyebrow">Recent Role</p>
              <div className="recent-role">
                <b>Senior Frontend Engineer</b>
                <span>TechNova Inc. · 2021 - Present</span>
              </div>
            </section>
          </aside>
        </div>
      </div>
    </DashboardLayout>
  );
}
