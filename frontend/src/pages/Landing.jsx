import {
  ArrowRight,
  BrainCircuit,
  CheckCircle2,
  FileText,
  PlayCircle,
  Sparkles,
  Target,
  WandSparkles,
  Zap,
} from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import FeatureCard from "../components/FeatureCard";
import brainImage from "../assets/mindflare-neural-brain.png";

const badges = [
  [Sparkles, "AI Powered", "purple"],
  [FileText, "Resume Aware", "blue"],
  [Target, "Adaptive", "cyan"],
  [Zap, "Instant Feedback", "neutral"],
];

export default function Landing() {
  return (
    <div className="app-shell">
      <Navbar />
      <main className="landing-main">
        <section className="hero">
          <motion.div
            className="hero-copy"
            initial={{ opacity: 0, x: -24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.55 }}
          >
            <div className="badges">
              {badges.map(([Icon, label, tone]) => (
                <span className={`badge ${tone}`} key={label}>
                  <Icon size={13} />
                  {label}
                </span>
              ))}
            </div>
            <h1>
              Your AI Interviewer.
              <br />
              Built <span>Around You.</span>
            </h1>
            <p>
              Upload your resume, practice smarter, get evaluated instantly, and
              improve with every interview session. Master your next tech
              interview with our hyper-personalized AI coach.
            </p>
            <div className="hero-actions">
              <Link className="primary-button" to="/signup">
                Start Free Interview <ArrowRight size={19} />
              </Link>
              <a className="secondary-button" href="#features">
                Explore Demo <PlayCircle size={19} />
              </a>
            </div>
          </motion.div>
          <motion.div
            className="brain-stage"
            initial={{ opacity: 0, scale: 0.93 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.1 }}
          >
            <div className="ambient-orb orb-one" />
            <div className="ambient-orb orb-two" />
            <div className="neural-card">
              <img src={brainImage} alt="Glowing neural intelligence core" />
              <div className="scanline" />
              <div className="brain-label">
                <BrainCircuit size={14} /> Neural engine active
              </div>
            </div>
          </motion.div>
        </section>
        <section className="feature-grid" id="features">
          <FeatureCard
            icon={BrainCircuit}
            title="Personalized Questions"
            tone="purple"
          >
            Tailored entirely to your uploaded resume and target role.
          </FeatureCard>
          <FeatureCard icon={Target} title="Adaptive Interviews" tone="blue">
            Difficulty adjusts in real-time based on your previous answers.
          </FeatureCard>
          <FeatureCard
            icon={CheckCircle2}
            title="AI Answer Evaluation"
            tone="cyan"
          >
            Instant, deep feedback on clarity, technical accuracy, and tone.
          </FeatureCard>
          <FeatureCard icon={WandSparkles} title="Progress Tracking" tone="sky">
            Visualize your improvement over time with detailed analytics.
          </FeatureCard>
        </section>

        <section className="landing-info" id="how-it-works">
          <h2>How It Works</h2>
          <div className="landing-info-grid">
            <article>
              <b>1. Upload Resume</b>
              <p>
                MindFlare reads your projects, skills, and experience to build a
                personalized interview baseline.
              </p>
            </article>
            <article>
              <b>2. Practice with AI</b>
              <p>
                Adaptive questions simulate real interviews across technical,
                behavioral, and system design rounds.
              </p>
            </article>
            <article>
              <b>3. Improve Fast</b>
              <p>
                Get instant feedback, targeted recommendations, and measurable
                progress after every session.
              </p>
            </article>
          </div>
        </section>

        <section className="landing-info" id="ai-interview">
          <h2>AI Interview</h2>
          <div className="landing-info-grid two-col">
            <article>
              <b>Context-Aware Questions</b>
              <p>
                Questions are tuned to your resume and target role so practice
                mirrors real interview expectations.
              </p>
            </article>
            <article>
              <b>Real-time Guidance</b>
              <p>
                AI coach suggestions help you structure stronger answers using
                frameworks like STAR and PAR.
              </p>
            </article>
          </div>
        </section>

        <section className="landing-info" id="analytics">
          <h2>Analytics</h2>
          <div className="landing-info-grid two-col">
            <article>
              <b>Performance Trends</b>
              <p>
                Track score changes across sessions and spot areas that need
                focused practice.
              </p>
            </article>
            <article>
              <b>Skill Breakdown</b>
              <p>
                Compare technical, communication, and problem-solving metrics in
                one dashboard.
              </p>
            </article>
          </div>
        </section>

        <section className="landing-info" id="pricing">
          <h2>Pricing</h2>
          <div className="landing-info-grid two-col">
            <article>
              <b>Free</b>
              <p>
                Start with core interview practice, resume analysis, and limited
                evaluation reports.
              </p>
            </article>
            <article>
              <b>Pro</b>
              <p>
                Unlock advanced analytics, deeper AI coaching, and unlimited
                mock interview sessions.
              </p>
            </article>
          </div>
        </section>
      </main>
    </div>
  );
}
