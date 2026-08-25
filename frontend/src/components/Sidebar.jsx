import {
  BrainCircuit,
  Sparkles,
  Trophy,
  X,
   LogOut,
  Check,
} from "lucide-react";
import { NavLink, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { sidebarLinks } from "../data/navigationData";
import {
  useNavigate
} from "react-router-dom";

import api from "../services/api";
import { useSubscription } from "../context/SubscriptionContext";
import { useAuth } from "../context/AuthContext";

export default function Sidebar({ isMobileMenuOpen, setIsMobileMenuOpen }) {
  const { isPro, loading: subLoading } = useSubscription();
  const { logoutUser } = useAuth();
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleUpgrade = async () => {
    setLoading(true);
    try {
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        alert("Failed to load Razorpay SDK. Please check your internet connection.");
        setLoading(false);
        return;
      }

      // Create payment order
      const amountValue = Number(import.meta.env.VITE_PRO_PLAN_AMOUNT || 499);
      const orderRes = await api.post("/payment/create-order", {
        amount: amountValue,
        currency: "INR"
      });

      const orderData = orderRes.data;

      const options = {
        key: orderData.keyId,
        amount: orderData.amount,
        currency: orderData.currency || "INR",
        name: "MindFlare AI",
        description: "Pro Monthly Subscription Plan",
        order_id: orderData.id,
        handler: async function (response) {
          try {
            setLoading(true);
            const verifyRes = await api.post("/payment/verify-payment", {
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              signature: response.razorpay_signature,
              amount: amountValue,
              currency: orderData.currency || "INR"
            });

            if (verifyRes.data?.success) {
              setSuccess(true);
              window.dispatchEvent(new Event("mindflare-pro-change"));
            } else {
              alert("Payment verification failed.");
            }
          } catch (verifyErr) {
            console.error("Verification failed:", verifyErr);
            alert("An error occurred during verification. Please try again.");
          } finally {
            setLoading(false);
          }
        },
        theme: {
          color: "#7c3aed"
        },
        modal: {
          ondismiss: function () {
            setLoading(false);
          }
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error("Payment order creation failed:", err);
      alert("Failed to initiate upgrade order. Please try again later.");
      setLoading(false);
    }
  };

  const navigate = useNavigate();
  
  const closeMenu = () => {
    if (setIsMobileMenuOpen) {
      setIsMobileMenuOpen(false);
    }
  };

  const handleLogout = async () => {
    await logoutUser();
    closeMenu();
    navigate("/");
  };

  const mainLinks = sidebarLinks.filter((link) => link.text !== "Settings");
  const settingsLink = sidebarLinks.find((link) => link.text === "Settings");

  return (
    <aside className={`sidebar ${isMobileMenuOpen ? "mobile-open" : ""}`}>
      <div className="sidebar-header">
        <Link 
          to="/" 
          className="sidebar-brand" 
          onClick={closeMenu}
          style={{ transition: "opacity 0.2s" }}
          onMouseEnter={(e) => e.currentTarget.style.opacity = 0.85} 
          onMouseLeave={(e) => e.currentTarget.style.opacity = 1}
        >
          <span className="brand-icon">
            <BrainCircuit size={22} />
          </span>
          <div>
            <strong>MindFlare</strong>
            <small>AI Career Engine</small>
          </div>
        </Link>
        {/* <button
          type="button"
          className="mobile-close-btn"
          onClick={closeMenu}
          aria-label="Close menu"
        >
          <X size={24} />
        </button> */}
      </div>
      <nav>
        {mainLinks.map(({ icon: Icon, text, to }) => (
          <NavLink
            key={text}
            className={({ isActive }) =>
              `side-link ${isActive ? "active" : ""}`
            }
            to={to}
            onClick={closeMenu}
          >
            <Icon size={19} />
            {text}
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-bottom-actions">
        {settingsLink && (
          <NavLink
            key={settingsLink.text}
            className={({ isActive }) =>
              `side-link ${isActive ? "active" : ""}`
            }
            to={settingsLink.to}
            onClick={closeMenu}
          >
            <settingsLink.icon size={19} />
            {settingsLink.text}
          </NavLink>
        )}

        <button
          type="button"
          onClick={handleLogout}
          className="side-logout-btn"
        >
          <LogOut size={19} />
          Logout
        </button>

        {subLoading ? (
          <div className="premium-loading-indicator">
            <span style={{ color: "#958da1", fontSize: "12px" }}>Loading status...</span>
          </div>
        ) : isPro ? (
          <div className="premium-status-indicator">
            <Trophy size={14} />
            <span>PRO MEMBER</span>
          </div>
        ) : (
          <button className="upgrade-button" onClick={() => { setShowModal(true); setSuccess(false); closeMenu(); }}>
            <Trophy size={18} />
            Upgrade to Pro
          </button>
        )}
      </div>

   

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
                      499 Rs<span>/mo</span>
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

