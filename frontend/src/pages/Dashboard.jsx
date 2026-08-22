import {
  Bell,
  Code2,
  Database,
  Moon,
  Search,
  Trophy,
  TrendingUp,
  Cpu,
  Braces,
  Network,
  Boxes,
} from "lucide-react";
import { motion } from "framer-motion";
import Sidebar from "../components/Sidebar";
import StatCard from "../components/StatCard";
import ChartCard from "../components/ChartCard";
import SkillCard from "../components/SkillCard";

const scores = [51, 57, 49, 64, 72, 66, 78, 74, 82, 76, 84, 92].map(
  (score, index) => ({ session: index + 1, score }),
);
const strengths = [
  { name: "React Framework", value: 92, icon: Code2 },
  { name: "JavaScript Fundamentals", value: 84, icon: Braces },
  { name: "Project Architecture", value: 87, icon: Network },
];
const improvement = [
  { name: "Data Structures & Algos", value: 61, icon: Boxes },
  { name: "System Design", value: 54, icon: Cpu },
  { name: "Database Optimization", value: 68, icon: Database },
];

export default function Dashboard() {
  return (
    <div className="dashboard-shell">
      <Sidebar />
      <main className="dashboard-main">
        <header className="dashboard-topbar">
          <label className="dashboard-search">
            <Search size={19} />
            <input placeholder="Search..." />
          </label>
          <div className="topbar-actions">
            <button>
              <Bell size={20} />
            </button>
            <button>
              <Moon size={20} />
            </button>
            <img
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuAlcdkvLowBbvFlNiJVsUp-yo7xiuRNaHOxKjbzbA2Plk8AA137PIKbaVhUWcHWxXtNk1iajrfvm_DzSBdiWHjrmvaAU7m3M5PBlzYaeHb8QlfvuLBtei04_alPdnhlOkOWTw1F2CsggzCm5OpOn1KsEGAz7PdHBkaagEvT7NVn3vsgEGimKl97OXs_owGbsgvHBobimQN9dGtKMDIDLHZGkik1HAtWpzv3yL3fE3H4isYEH3l6VQ5-pA"
              alt="Nandni Gupta"
            />
          </div>
        </header>
        <div className="dashboard-content">
          <motion.header
            className="welcome"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1>
              Good morning, Nandni <span>👋</span>
            </h1>
            <p>Ready for your next interview?</p>
          </motion.header>
          <section className="stat-grid">
            <StatCard
              label="Overall Score"
              value="78%"
              detail="↑ 12% this week"
            />
            <StatCard
              label="Total Sessions"
              value="12"
              detail="Interviews Completed"
            />
            <StatCard
              label="Avg. Improvement"
              value="+14%"
              accent
              detail="In last 7 sessions"
            />
            <StatCard label="Interview Readiness" value="82%" progress="82%" />
          </section>
          <ChartCard data={scores} />
          <section className="skills-grid">
            <SkillCard title="Top Strengths" icon={Trophy} items={strengths} />
            <SkillCard
              title="Areas to Improve"
              icon={TrendingUp}
              items={improvement}
              danger
            />
          </section>
        </div>
      </main>
    </div>
  );
}
