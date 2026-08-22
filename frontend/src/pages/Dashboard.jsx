import { Trophy, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";
import DashboardLayout from "../components/DashboardLayout";
import Topbar from "../components/Topbar";
import StatCard from "../components/StatCard";
import ChartCard from "../components/ChartCard";
import SkillCard from "../components/SkillCard";
import { strengths, improvement, mockScores as scores } from "../data/dashboardData";

export default function Dashboard() {
  return (
    <DashboardLayout>
      <Topbar avatarSrc="https://lh3.googleusercontent.com/aida-public/AB6AXuAlcdkvLowBbvFlNiJVsUp-yo7xiuRNaHOxKjbzbA2Plk8AA137PIKbaVhUWcHWxXtNk1iajrfvm_DzSBdiWHjrmvaAU7m3M5PBlzYaeHb8QlfvuLBtei04_alPdnhlOkOWTw1F2CsggzCm5OpOn1KsEGAz7PdHBkaagEvT7NVn3vsgEGimKl97OXs_owGbsgvHBobimQN9dGtKMDIDLHZGkik1HAtWpzv3yL3fE3H4isYEH3l6VQ5-pA" />
      
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
    </DashboardLayout>
  );
}
