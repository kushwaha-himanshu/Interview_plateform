import { ArrowLeft, BrainCircuit, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

export default function AuthLayout({ children }) {
  return (
    <main className="auth-page">
      <div className="auth-flow" aria-hidden="true">
        <svg preserveAspectRatio="none" viewBox="0 0 100 100">
          <path d="M0,50 Q25,30 50,50 T100,50" />
          <path d="M0,60 Q30,80 60,60 T100,60" />
        </svg>
      </div>
      <motion.section
        className="auth-card"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <header className="auth-header">
          <Link className="auth-brand" to="/">
            <BrainCircuit />
            <span>
              <b>Mind</b>Flare
            </span>
          </Link>
          <Link className="back-home" to="/">
            <ArrowLeft size={15} />
            Back to Home
          </Link>
        </header>
        {children}
      </motion.section>
      <p className="auth-footer">
        <ShieldCheck size={16} /> AI-powered interview preparation
      </p>
    </main>
  );
}
