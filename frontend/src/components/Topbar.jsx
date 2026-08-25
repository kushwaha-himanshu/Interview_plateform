import { LogOut, BrainCircuit } from "lucide-react";
import { Link } from "react-router-dom";
import NotificationsBell from "./NotificationsBell";
import ThemeToggle from "./ThemeToggle";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Topbar({ customActions = null, isMobileMenuOpen, setIsMobileMenuOpen }) {
  const navigate = useNavigate();
  const { user, logoutUser } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);

  const getInitials = (name) => {
    if (!name) return "US";
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return name.trim().substring(0, 2).toUpperCase();
  };

  const handleLogout = async () => {
    await logoutUser();
    navigate("/");
  };

  return (
    <header className="dashboard-topbar" style={{ justifyContent: "space-between", display: "flex", alignItems: "center" }}>
      {/* Mobile Brand / Menu Toggle (visible only on mobile via CSS) */}
      <div className="topbar-mobile-brand" style={{ display: "none", alignItems: "center", gap: "12px" }}>
        <button
          type="button"
          className="mobile-menu-toggle"
          onClick={() => setIsMobileMenuOpen && setIsMobileMenuOpen(true)}
          style={{
            background: "none",
            border: "none",
            color: "#ccc3d8",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "8px",
          }}
          aria-label="Open menu"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="3" y1="12" x2="21" y2="12"></line>
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <line x1="3" y1="18" x2="21" y2="18"></line>
          </svg>
        </button>
        <Link to="/" className="topbar-logo" style={{ display: "flex", alignItems: "center", gap: "8px", textDecoration: "none" }}>
          <span className="brand-icon" style={{ width: "30px", height: "30px", borderRadius: "8px", display: "grid", placeItems: "center", background: "#7c3aed", color: "#ede0ff" }}>
            <BrainCircuit size={16} />
          </span>
          <span style={{ color: "#d2bbff", fontSize: "18px", fontWeight: "700", letterSpacing: "-0.03em" }}>MindFlare</span>
        </Link>
      </div>

      {/* Desktop spacer to push actions to the right */}
      <div className="topbar-desktop-spacer" style={{ flex: 1 }}></div>

      <div className="topbar-actions" style={{ position: "relative", display: "flex", alignItems: "center", gap: "12px" }}>
        {customActions}
        <NotificationsBell size={20} />
        <ThemeToggle size={20} />
        
        <div style={{ position: "relative" }}>
          <button
            type="button"
            onClick={() => setShowDropdown(!showDropdown)}
            style={{
              width: "42px",
              height: "42px",
              borderRadius: "50%",
              background: "#7c3aed",
              color: "#fff",
              border: "none",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "16px",
              fontWeight: "700",
              cursor: "pointer",
              outline: "none"
            }}
          >
            {getInitials(user?.fullname)}
          </button>

          {showDropdown && (
            <div className="profile-dropdown" style={{
              position: "absolute",
              top: "50px",
              right: "0",
              background: "#0d0d18",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              borderRadius: "8px",
              padding: "16px",
              minWidth: "220px",
              boxShadow: "0 8px 32px rgba(0, 0, 0, 0.5)",
              zIndex: 100,
              textAlign: "left"
            }}>
              <div style={{ borderBottom: "1px solid rgba(255, 255, 255, 0.08)", paddingBottom: "10px", marginBottom: "10px" }}>
                <div style={{ color: "#fff", fontWeight: "600", fontSize: "14px" }}>{user?.fullname || "Candidate"}</div>
                <div style={{ color: "#958da1", fontSize: "12px", marginTop: "2px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{user?.email || ""}</div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                <button
                  type="button"
                  onClick={() => { setShowDropdown(false); navigate("/settings"); }}
                  style={{
                    background: "none",
                    border: "none",
                    color: "#ccc3d8",
                    textAlign: "left",
                    cursor: "pointer",
                    fontSize: "13px",
                    padding: "6px 0",
                    width: "100%",
                    transition: "color 0.2s"
                  }}
                  onMouseEnter={(e) => e.target.style.color = "#d2bbff"}
                  onMouseLeave={(e) => e.target.style.color = "#ccc3d8"}
                >
                  ⚙️ Settings
                </button>
                <button
                  type="button"
                  onClick={handleLogout}
                  style={{
                    background: "none",
                    border: "none",
                    color: "#fca5a5",
                    textAlign: "left",
                    cursor: "pointer",
                    fontSize: "13px",
                    padding: "6px 0",
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    transition: "color 0.2s"
                  }}
                  onMouseEnter={(e) => e.target.style.color = "#ef4444"}
                  onMouseLeave={(e) => e.target.style.color = "#fca5a5"}
                >
                  <LogOut size={13} /> Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
