import {
  BrainCircuit,
  Sparkles,
  Trophy,
  X,
  Check,
} from "lucide-react";
import { NavLink } from "react-router-dom";
import { useState, useEffect } from "react";
import { sidebarLinks } from "../data/navigationData";

const PRO_KEY = "mindflare-pro";

export default function Sidebar() {
  const [isPro, setIsPro] = useState(() => {
    return localStorage.getItem(PRO_KEY) === "true";
  });
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleUpgrade = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      setIsPro(true);
      localStorage.setItem(PRO_KEY, "true");
      // Dispatch custom event to notify other parts of the app
      window.dispatchEvent(new Event("mindflare-pro-change"));
    }, 1500);
  };

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
        {sidebarLinks.map(({ icon: Icon, text, to }) => (
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
      {isPro ? (
        <div className="premium-status-indicator" style={{ margin: "20px auto 10px" }}>
          <Trophy size={14} />
          <span>PRO MEMBER</span>
        </div>
      ) : (
        <button className="upgrade-button" onClick={() => { setShowModal(true); setSuccess(false); }}>
          <Trophy size={18} />
          Upgrade to Pro
        </button>
      )}

      {/* Upgrade pricing modal */}
      {showModal && (
        <div className="modal-backdrop" onClick={() => setShowModal(false)}>
          <div className="modal-card upgrade-modal" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              className="modal-close-btn"
              onClick={() => setShowModal(false)}
              aria-label="Close"
              disabled={loading}
            >
              <X size={18} />
            </button>
            {!success ? (
              <>
                <div className="upgrade-header">
                  <h2>
                    <Sparkles size={24} /> Upgrade to Pro
                  </h2>
                  <p>Accelerate your career preparation with our premium features</p>
                </div>
                <div className="upgrade-grid">
                  <div className="upgrade-features">
                    <h3>What is included:</h3>
                    <div className="upgrade-features-list">
                      <div className="upgrade-feature-item">
                        <Check size={16} />
                        <span><strong>Unlimited Mock Interviews</strong>: Practice as many times as you need without constraints.</span>
                      </div>
                      <div className="upgrade-feature-item">
                        <Check size={16} />
                        <span><strong>Detailed Analytics Reports</strong>: View progress breakdowns, skills radars, and trend trackers.</span>
                      </div>
                      <div className="upgrade-feature-item">
                        <Check size={16} />
                        <span><strong>Direct PDF Downloads</strong>: Save and print professional interview evaluations instantly.</span>
                      </div>
                      <div className="upgrade-feature-item">
                        <Check size={16} />
                        <span><strong>Pro AI Behavioral Coach</strong>: Tailored salary negotiation tips and resume enhancement feedback.</span>
                      </div>
                    </div>
                  </div>
                  <div className="upgrade-pricing-card">
                    <span className="upgrade-price-title">Pro Plan</span>
                    <div className="upgrade-price">
                      $15<span>/mo</span>
                    </div>
                    <span className="upgrade-period">Cancel anytime</span>
                    <button
                      className="upgrade-action-btn"
                      onClick={handleUpgrade}
                      disabled={loading}
                    >
                      {loading ? "Processing..." : "Unlock Pro Now"}
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="upgrade-success-view">
                <div className="forgot-success-icon" style={{ background: "rgba(251, 191, 36, 0.1)", color: "#fbbf24", boxShadow: "0 0 20px rgba(251, 191, 36, 0.2)" }}>
                  <Trophy size={28} />
                </div>
                <h2>You are now Pro! 🎉</h2>
                <p style={{ color: "#958da1", marginBottom: 24, fontSize: 14 }}>
                  Thank you for subscribing. All premium features, unlimited AI sessions,
                  and in-depth analytics evaluations are now fully unlocked for your account.
                </p>
                <button
                  type="button"
                  className="upgrade-action-btn"
                  onClick={() => setShowModal(false)}
                >
                  Get Started
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </aside>
  );
}

