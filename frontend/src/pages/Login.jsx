import { ArrowRight, LockKeyhole, Mail, X } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import AuthInput from "../components/AuthInput";
import AuthLayout from "../components/AuthLayout";
import GoogleIcon from "../components/GoogleIcon";
import api from "../services/api";
import { signInWithPopup } from "firebase/auth";

import {
  auth,
  googleProvider,
} from "../firebase";

export default function Login() {
  const navigate = useNavigate();
  
  // Modals state
  const [showForgot, setShowForgot] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotSubmitted, setForgotSubmitted] = useState(false);
  const [forgotLoading, setForgotLoading] = useState(false);
  const [error, setError] = useState("");

  // const [showGoogle, setShowGoogle] = useState(false);
  // const [googleLoading, setGoogleLoading] = useState(false);
  // const [selectedGoogleAccount, setSelectedGoogleAccount] = useState("");

  const submit = async (event) => {

  event.preventDefault();

  try {

    const formData =
      new FormData(event.currentTarget);

    const email =
      formData.get("email");

    const password =
      formData.get("password");


    await api.post(
      "/auth/login",
      {
        email,
        password,
      }
    );


    navigate("/dashboard");


  } catch (error) {

    console.error(
      "Login failed:",
      error
    );

    alert(
      error.response?.data?.message ||
      "Login failed"
    );

  }
};

  const handleForgotSubmit = (e) => {
    e.preventDefault();
    setForgotLoading(true);
    setTimeout(() => {
      setForgotLoading(false);
      setForgotSubmitted(true);
    }, 1200);
  };

 const handleGoogleLogin = async () => {
  try {
    const result = await signInWithPopup(
      auth,
      googleProvider
    );

    const firebaseUser = result.user;

    console.log(
      "Google Firebase user:",
      firebaseUser
    );

    // Get Firebase ID token
    const idToken =
      await firebaseUser.getIdToken();

    // Send token to your backend
    const response = await api.post(
      "/auth/google",
      {
        idToken,
      }
    );

    console.log(
      "Google login successful:",
      response.data
    );

    // Login successful
    navigate("/dashboard");

  } catch (error) {
    console.error(
      "Google login failed:",
      error
    );

    setError(
      error.response?.data?.message ||
      "Google login failed"
    );
  }
};

  return (
    <AuthLayout>
      <div className="auth-title">
        <h1>Welcome back</h1>
        <p>Continue your interview journey</p>
      </div>
      <form className="auth-form" onSubmit={submit}>
        <AuthInput
         name="email"
          label="Email"
          icon={Mail}
          type="email"
          placeholder="Enter your email"
          required
        />
        <AuthInput
        name="password"
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
  onClick={handleGoogleLogin}
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

     
    </AuthLayout>
  );
}

