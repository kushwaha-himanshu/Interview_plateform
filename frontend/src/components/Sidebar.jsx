import {
  BrainCircuit,
  Sparkles,
  Trophy,
  X,
   LogOut,
  Check,
} from "lucide-react";
import { NavLink } from "react-router-dom";
import { useState, useEffect } from "react";
import { sidebarLinks } from "../data/navigationData";
import {
  useNavigate
} from "react-router-dom";

import api from "../services/api";

import { useSubscription } from "../context/SubscriptionContext";

export default function Sidebar() {
  const { isPro, loading: subLoading } = useSubscription();
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

const handleLogout = async () => {
  try {
    await api.post("/auth/logout");
    navigate("/login");
  } catch (error) {
    console.error("Logout failed:", error);
  }
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

  <button
  type="button"
  onClick={handleLogout}
  style={{
    width: "100%",
    display: "flex",
    alignItems: "center",
    gap: "14px",
    padding: "12px 18px",
    marginTop: "6px",
    border: "none",
    borderRadius: "10px",
    background: "transparent",
    color: "#c8c3d8",
    fontSize: "16px",
    fontWeight: 500,
    cursor: "pointer",
    textAlign: "left",
  }}
>
  <LogOut size={19} />
  Logout
</button>

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

