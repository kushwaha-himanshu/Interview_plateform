import { ArrowRight, LockKeyhole, Mail } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import AuthInput from "../components/AuthInput";
import AuthLayout from "../components/AuthLayout";
import GoogleIcon from "../components/GoogleIcon";

export default function Login() {
  const navigate = useNavigate();
  const submit = (event) => {
    event.preventDefault();
    navigate("/dashboard");
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
        <Link className="forgot-link" to="/login">
          Forgot password?
        </Link>
        <button className="auth-submit" type="submit">
          Sign In <ArrowRight size={18} />
        </button>
        <div className="auth-divider">
          <span />
          or
          <span />
        </div>
        <button className="google-button" type="button">
          <GoogleIcon />
          Continue with Google
        </button>
      </form>
      <p className="auth-switch">
        New to MindFlare? <Link to="/signup">Create account</Link>
      </p>
    </AuthLayout>
  );
}
