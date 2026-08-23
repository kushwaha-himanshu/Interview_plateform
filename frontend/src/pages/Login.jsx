import { ArrowRight, LockKeyhole, Mail, X } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import AuthInput from "../components/AuthInput";
import AuthLayout from "../components/AuthLayout";
import GoogleIcon from "../components/GoogleIcon";

export default function Login() {
  const navigate = useNavigate();
  
  // Modals state
  const [showForgot, setShowForgot] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotSubmitted, setForgotSubmitted] = useState(false);
  const [forgotLoading, setForgotLoading] = useState(false);

  const [showGoogle, setShowGoogle] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [selectedGoogleAccount, setSelectedGoogleAccount] = useState("");

  const submit = (event) => {
    event.preventDefault();
    navigate("/dashboard");
  };

  const handleForgotSubmit = (e) => {
    e.preventDefault();
    setForgotLoading(true);
    setTimeout(() => {
      setForgotLoading(false);
      setForgotSubmitted(true);
    }, 1200);
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
        <h1>Welcome back</h1>
        <p>Continue your interview journey</p>
      </div>
      <form className="auth-form" onSubmit={submit}>
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
          placeholder="Enter your password"
          required
        />
        <button
          type="button"
          className="forgot-link"
          style={{ background: "none", border: "none", cursor: "pointer", padding: 0, textAlign: "left" }}
          onClick={() => {
            setForgotSubmitted(false);
            setForgotEmail("");
            setShowForgot(true);
          }}
        >
          Forgot password?
        </button>
        <button className="auth-submit" type="submit">
          Sign In <ArrowRight size={18} />
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
        New to MindFlare? <Link to="/signup">Create account</Link>
      </p>

      {/* Forgot Password Modal */}
      {showForgot && (
        <div className="modal-backdrop" onClick={() => setShowForgot(false)}>
          <div className="modal-card forgot-modal" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              className="modal-close-btn"
              onClick={() => setShowForgot(false)}
              aria-label="Close"
            >
              <X size={18} />
            </button>
            {!forgotSubmitted ? (
              <form onSubmit={handleForgotSubmit}>
                <h2>Reset Password</h2>
                <p>Enter your account email address and we'll send you a password recovery link.</p>
                <div style={{ marginBottom: 20 }}>
                  <AuthInput
                    label="Account Email"
                    icon={Mail}
                    type="email"
                    placeholder="name@example.com"
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    required
                  />
                </div>
                <button className="auth-submit" type="submit" disabled={forgotLoading}>
                  {forgotLoading ? "Sending link..." : "Send Reset Link"}
                  {!forgotLoading && <ArrowRight size={18} />}
                </button>
              </form>
            ) : (
              <div className="forgot-success">
                <div className="forgot-success-icon">
                  <Mail size={24} />
                </div>
                <h3>Check your email</h3>
                <p>
                  We have sent a password reset link to <strong>{forgotEmail}</strong>.
                  It should arrive in a few minutes.
                </p>
                <button
                  type="button"
                  className="auth-submit"
                  onClick={() => setShowForgot(false)}
                >
                  Close
                </button>
              </div>
            )}
          </div>
        </div>
      )}

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

