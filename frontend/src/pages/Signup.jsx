import { ArrowRight, LockKeyhole, Mail, UserRound, X } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import AuthInput from "../components/AuthInput";
import AuthLayout from "../components/AuthLayout";
import GoogleIcon from "../components/GoogleIcon";

export default function Signup() {
  const navigate = useNavigate();
  
  // Google Auth modal state
  const [showGoogle, setShowGoogle] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [selectedGoogleAccount, setSelectedGoogleAccount] = useState("");

  const submit = (event) => {
    event.preventDefault();
    navigate("/dashboard");
  };

  const handleGoogleAccountClick = (name) => {
    setSelectedGoogleAccount(name);
    setGoogleLoading(true);
    setTimeout(() => {
      setGoogleLoading(false);
      setShowGoogle(false);
      navigate("/dashboard");
    }, 1500);
  };

  return (
    <AuthLayout>
      <div className="auth-title">
        <h1>Create your account</h1>
        <p>Start preparing for smarter interviews</p>
      </div>
      <form className="auth-form" onSubmit={submit}>
        <AuthInput
          label="Full Name"
          icon={UserRound}
          placeholder="Enter your full name"
          required
        />
        <AuthInput
          label="Email"
          icon={Mail}
          type="email"
          placeholder="Enter your email"
          required
        />
        <AuthInput
          label="Password"
          icon={LockKeyhole}
          type="password"
          placeholder="Create a password"
          required
        />
        <AuthInput
          label="Confirm Password"
          icon={LockKeyhole}
          type="password"
          placeholder="Confirm your password"
          required
        />
        <label className="terms">
          <input required type="checkbox" />{" "}
          <span>
            I agree to the <a href="#terms">Terms of Service</a> and{" "}
            <a href="#privacy">Privacy Policy</a>
          </span>
        </label>
        <button className="auth-submit" type="submit">
          Create Account <ArrowRight size={18} />
        </button>
        <div className="auth-divider">
          <span />
          or
          <span />
        </div>
        <button
          className="google-button"
          type="button"
          onClick={() => {
            setSelectedGoogleAccount("");
            setGoogleLoading(false);
            setShowGoogle(true);
          }}
        >
          <GoogleIcon />
          Continue with Google
        </button>
      </form>
      <p className="auth-switch">
        Already have an account? <Link to="/login">Sign in</Link>
      </p>

      {/* Google Auth Modal */}
      {showGoogle && (
        <div className="modal-backdrop" onClick={() => setShowGoogle(false)}>
          <div className="modal-card google-auth-modal" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              className="modal-close-btn"
              onClick={() => setShowGoogle(false)}
              aria-label="Close"
              disabled={googleLoading}
            >
              <X size={18} />
            </button>
            {!googleLoading ? (
              <>
                <div className="google-modal-logo">
                  <GoogleIcon size={32} style={{ width: 42, height: 42 }} />
                </div>
                <div className="google-modal-title">
                  <h2>Sign in with Google</h2>
                  <p>to continue to MindFlare</p>
                </div>
                <div className="google-account-list">
                  <div
                    className="google-account-item"
                    onClick={() => handleGoogleAccountClick("Nandni Gupta")}
                  >
                    <img
                      className="google-account-avatar"
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuAlcdkvLowBbvFlNiJVsUp-yo7xiuRNaHOxKjbzbA2Plk8AA137PIKbaVhUWcHWxXtNk1iajrfvm_DzSBdiWHjrmvaAU7m3M5PBlzYaeHb8QlfvuLBtei04_alPdnhlOkOWTw1F2CsggzCm5OpOn1KsEGAz7PdHBkaagEvT7NVn3vsgEGimKl97OXs_owGbsgvHBobimQN9dGtKMDIDLHZGkik1HAtWpzv3yL3fE3H4isYEH3l6VQ5-pA"
                      alt="Nandni Gupta"
                    />
                    <div className="google-account-info">
                      <span className="google-account-name">Nandni Gupta</span>
                      <span className="google-account-email">nandni.gupta@gmail.com</span>
                    </div>
                  </div>
                  <div
                    className="google-account-item"
                    onClick={() => handleGoogleAccountClick("Guest User")}
                  >
                    <img
                      className="google-account-avatar"
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuAF1q1LLlhe9hbKkrKrNfm9HWhEHKpqLpUl3VjwMd6TuoZ31T5P2185FodE1ac6I4YRF6pWn-A0BbFkCBIp2t91t2cCRAiXI31wjkaIXPlPBhSXgADeZfmc2cxOLQ6y8TKOohvpOV67zuI0MIHa_qKEt37LCC4hOigUUKrgwd-cMejLZK_f0hEtxdTrZsmfxCjffyiCOGCL2CmlVacubGJ1vZP8m_mKOQLTp8_t2FqT3g0IO2TC20YMJA"
                      alt="Guest User"
                    />
                    <div className="google-account-info">
                      <span className="google-account-name">Guest User</span>
                      <span className="google-account-email">guest.user@mindflare.ai</span>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="google-loading-container">
                <div className="google-spinner" />
                <p>Signing in as <strong>{selectedGoogleAccount}</strong>...</p>
              </div>
            )}
          </div>
        </div>
      )}
    </AuthLayout>
  );
}

