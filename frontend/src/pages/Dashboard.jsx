import { Trophy, TrendingUp, Code2, Braces, Network, Boxes, Cpu, Database, FileText } from "lucide-react";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import DashboardLayout from "../components/DashboardLayout";
import Topbar from "../components/Topbar";
import StatCard from "../components/StatCard";
import ChartCard from "../components/ChartCard";
import SkillCard from "../components/SkillCard";
import api from "../services/api";

const skillIcons = {
  "React": Code2,
  "JavaScript": Braces,
  "System Design": Cpu,
  "MongoDB": Database,
  "DBMS": Database,
  "DSA": Boxes,
  "Projects": Network,
  "General": FileText
};

const getSkillIcon = (skill) => {
  return skillIcons[skill] || Code2;
};

export default function Dashboard() {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.get(
          "/interview/analytics"
        );

        console.log(
          "Dashboard analytics:",
          response.data
        );

        setAnalytics(
          response.data.analytics
        );

      } catch (error) {
        console.error(
          "Dashboard analytics error:",
          error
        );

        setError(
          error.response?.data?.message ||
          "Failed to load dashboard data."
        );

      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <DashboardLayout>
        <Topbar avatarSrc="https://lh3.googleusercontent.com/aida-public/AB6AXuAlcdkvLowBbvFlNiJVsUp-yo7xiuRNaHOxKjbzbA2Plk8AA137PIKbaVhUWcHWxXtNk1iajrfvm_DzSBdiWHjrmvaAU7m3M5PBlzYaeHb8QlfvuLBtei04_alPdnhlOkOWTw1F2CsggzCm5OpOn1KsEGAz7PdHBkaagEvT7NVn3vsgEGimKl97OXs_owGbsgvHBobimQN9dGtKMDIDLHZGkik1HAtWpzv3yL3fE3H4isYEH3l6VQ5-pA" />
        <div className="dashboard-content" style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "300px" }}>
          <p>Loading your dashboard details...</p>
        </div>
      </DashboardLayout>
    );
  }

  if (error || !analytics) {
    return (
      <DashboardLayout>
        <Topbar avatarSrc="https://lh3.googleusercontent.com/aida-public/AB6AXuAlcdkvLowBbvFlNiJVsUp-yo7xiuRNaHOxKjbzbA2Plk8AA137PIKbaVhUWcHWxXtNk1iajrfvm_DzSBdiWHjrmvaAU7m3M5PBlzYaeHb8QlfvuLBtei04_alPdnhlOkOWTw1F2CsggzCm5OpOn1KsEGAz7PdHBkaagEvT7NVn3vsgEGimKl97OXs_owGbsgvHBobimQN9dGtKMDIDLHZGkik1HAtWpzv3yL3fE3H4isYEH3l6VQ5-pA" />
        <div className="dashboard-content" style={{ padding: "20px", color: "#ef4444" }}>
          <h3>Error loading dashboard</h3>
          <p>{error || "Please complete an interview first."}</p>
        </div>
      </DashboardLayout>
    );
  }

  const overview = analytics.overview || {
    overallScore: 0,
    bestScore: 0,
    totalSessions: 0,
    totalQuestions: 0,
    averageImprovement: 0
  };

  const skills = analytics.skills || [];
  const weakSkills = analytics.weakSkills || [];
  const trend = analytics.trend || [];

  // Overall Score percent
  const overallScorePercent = Math.round((overview.overallScore || 0) * 10);
  const bestScorePercent = Math.round((overview.bestScore || 0) * 10);

  // Average Improvement percent
  const improvementValue = Math.round((overview.averageImprovement || 0) * 10);
  const improvementText = `${improvementValue >= 0 ? "+" : ""}${improvementValue}%`;

  // Interview Readiness
  const readiness = Math.min(
    100,
    Math.max(
      0,
      overallScorePercent
    )
  );

  // Top strengths (top 3, sorted descending)
  const topStrengths = [...skills]
    .sort((a, b) => b.value - a.value)
    .slice(0, 3)
    .map(item => ({
      name: item.skill,
      value: item.value,
      icon: getSkillIcon(item.skill)
    }));

  // Areas to improve (bottom 3, sorted ascending)
  const derivedWeakSkills = weakSkills.length > 0 ? weakSkills : [...skills].sort((a, b) => a.value - b.value);
  const areasToImprove = [...derivedWeakSkills]
    .sort((a, b) => a.value - b.value)
    .slice(0, 3)
    .map(item => ({
      name: item.skill,
      value: item.value,
      icon: getSkillIcon(item.skill)
    }));

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
            WELCOME Buddy <span>👋</span>
          </h1>
          <p>Ready for your next interview?</p>
        </motion.header>
        
        <section className="stat-grid">
          <StatCard
            label="Overall Score"
            value={`${overallScorePercent}%`}
            detail={`Best Score: ${bestScorePercent}%`}
          />
          <StatCard
            label="Total Sessions"
            value={overview.totalSessions}
            detail={`${overview.totalQuestions} Questions Answered`}
          />
          <StatCard
            label="Avg. Improvement"
            value={improvementText}
            accent
            detail="Across recent sessions"
          />
          <StatCard
            label="Interview Readiness"
            value={`${readiness}%`}
            progress={`${readiness}%`}
          />
        </section>
        
        <ChartCard data={trend} />
        
        <section className="skills-grid">
          <SkillCard title="Top Strengths" icon={Trophy} items={topStrengths} />
          <SkillCard
            title="Areas to Improve"
            icon={TrendingUp}
            items={areasToImprove}
            danger
          />
        </section>
      </div>
    </DashboardLayout>
  );
}
