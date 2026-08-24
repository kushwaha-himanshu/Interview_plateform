import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        background: "#050509",
        color: "#ccc3d8",
        fontFamily: "Geist, Arial, sans-serif"
      }}>
        <div className="listening-visualizer" style={{ marginBottom: "16px" }}>
          <span style={{ background: "#7c3aed" }} />
          <span style={{ background: "#7c3aed" }} />
          <span style={{ background: "#7c3aed" }} />
        </div>
        <div style={{ fontSize: "14px", fontWeight: "500", letterSpacing: "0.05em" }}>
          Checking your session...
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return children;
}
