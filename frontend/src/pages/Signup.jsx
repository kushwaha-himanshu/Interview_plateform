import { ArrowRight, LockKeyhole, Mail, UserRound, X } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useState,useEffect } from "react";
import AuthInput from "../components/AuthInput";
import AuthLayout from "../components/AuthLayout";
import GoogleIcon from "../components/GoogleIcon";
import api from "../services/api";

import {
  signInWithPopup,
} from "firebase/auth";

import {
  auth,
  googleProvider,
} from "../firebase";



export default function Signup() {
  const navigate = useNavigate();


const [fullname, setFullname] = useState("");
const [email, setEmail] = useState("");
const [password, setPassword] = useState("");
const [confirmPassword, setConfirmPassword] = useState("");
const [error, setError] = useState("");
const [loading, setLoading] = useState(false);
  
  // Google Auth modal state
 

  // const submit = (event) => {
  //   event.preventDefault();
  //   navigate("/dashboard");
  // };

  // const handleGoogleAccountClick = (name) => {
  //   setSelectedGoogleAccount(name);
  //   setGoogleLoading(true);
  //   setTimeout(() => {
  //     setGoogleLoading(false);
  //     setShowGoogle(false);
  //     navigate("/dashboard");
  //   }, 1500);
  // };

const handleGoogleSignIn = async () => {

  try {

    const result =
      await signInWithPopup(
        auth,
        googleProvider
      );

    const user =
      result.user;

    console.log(
      "Firebase Google user:",
      user
    );


  




    const idToken =
      await user.getIdToken();


    const response =
      await api.post(
        "/auth/google",
        {
          idToken,
        }
      );


      localStorage.setItem(
  "userName",
  response.data.user?.fullname || "User"
);

      localStorage.setItem(
  "userEmail",
  response.data.user.email
);


    console.log(
      "Backend Google login:",
      response.data
    );


    navigate("/dashboard");

  } catch (error) {

    console.error(
      "Google authentication failed:",
      error
    );

    setError(
      error.response?.data?.message ||
      "Google authentication failed"
    );

  }
};

const handleSubmit = async (e) => {
  e.preventDefault();

  setError("");

  if (password !== confirmPassword) {
    setError("Passwords do not match.");
    return;
  }

  setLoading(true);

  try {
    const response = await api.post(
      "/auth/register",
      {
        fullname,
        email,
        password,
      }
    );

    console.log(
      "Signup successful:",
      response.data
    );

    navigate("/dashboard");

  } catch (error) {

    console.error(
      "Signup failed:",
      error
    );

    setError(
      error.response?.data?.message ||
      "Signup failed. Please try again."
    );

  } finally {
    setLoading(false);
  }
};
  return (
    <AuthLayout>
      <div className="auth-title">
        <h1>Create your account</h1>
        <p>Start preparing for smarter interviews</p>
      </div>
      <form className="auth-form" onSubmit={handleSubmit}>
        <AuthInput
  label="Full Name"
  icon={UserRound}
  placeholder="Enter your full name"
  value={fullname}
  onChange={(e) => setFullname(e.target.value)}
  required
/>
      <AuthInput
  label="Email"
  icon={Mail}
  type="email"
  placeholder="Enter your email"
  value={email}
  onChange={(e) => setEmail(e.target.value)}
  required
/>
       <AuthInput
  label="Password"
  icon={LockKeyhole}
  type="password"
  placeholder="Create a password"
  value={password}
  onChange={(e) => setPassword(e.target.value)}
  required
/>
        <AuthInput
  label="Confirm Password"
  icon={LockKeyhole}
  type="password"
  placeholder="Confirm your password"
  value={confirmPassword}
  onChange={(e) => setConfirmPassword(e.target.value)}
  required
/>
{error && (
  <p className="auth-error">
    {error}
  </p>
)}

        <label className="terms">
          <input required type="checkbox" />{" "}
          <span>
            I agree to the <a href="#terms">Terms of Service</a> and{" "}
            <a href="#privacy">Privacy Policy</a>
          </span>
        </label>
       <button
  className="auth-submit"
  type="submit"
  disabled={loading}
>
  {loading ? (
    "Creating Account..."
  ) : (
    <>
      Create Account <ArrowRight size={18} />
    </>
  )}
</button>
        <div className="auth-divider">
          <span />
          or
          <span />
        </div>
        <button
  className="google-button"
  type="button"
  onClick={handleGoogleSignIn}
>
  <GoogleIcon />
  Continue with Google
</button>
      </form>
      <p className="auth-switch">
        Already have an account? <Link to="/login">Sign in</Link>
      </p>

      
    </AuthLayout>
  );
}

