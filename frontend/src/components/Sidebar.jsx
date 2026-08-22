import {
  BarChart3,
  BrainCircuit,
  FileText,
  History,
  LayoutDashboard,
  PlayCircle,
  Settings,
  Sparkles,
  Trophy,
} from "lucide-react";
import { NavLink } from "react-router-dom";

const links = [
  [LayoutDashboard, "Dashboard", "/dashboard"],
  [PlayCircle, "Start Interview", "/interview/setup"],
  [FileText, "Resume", "/resume"],
  [BrainCircuit, "AI Coach", "/coach"],
  [BarChart3, "Analytics", "/analytics"],
  [History, "History", "/history"],
  [Settings, "Settings", "/settings"],
];

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <span className="brand-icon">
          <BrainCircuit size={22} />
        </span>
        <div>
          <strong>MindFlare</strong>
          <small>AI Career Engine</small>
        </div>
      </div>
      <nav>
        {links.map(([Icon, text, to]) => (
          <NavLink
            key={text}
            className={({ isActive }) =>
              `side-link ${isActive ? "active" : ""}`
            }
            to={to}
          >
            <Icon size={19} />
            {text}
          </NavLink>
        ))}
      </nav>
      <button className="upgrade-button">
        <Trophy size={18} />
        Upgrade to Pro
      </button>
    </aside>
  );
}
