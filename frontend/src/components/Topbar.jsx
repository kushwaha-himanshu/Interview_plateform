import { Search, LogOut } from "lucide-react";
import NotificationsBell from "./NotificationsBell";
import ThemeToggle from "./ThemeToggle";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

export default function Topbar({ placeholder = "Search...", customActions = null }) {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await api.get("/auth/me");
        if (res.data?.success) {
          setUser(res.data.user);
        }
      } catch (err) {
        console.error("Topbar user load error:", err);
      }
    };
    fetchUser();

    const handleProfileChange = () => {
      fetchUser();
    };
    window.addEventListener("mindflare-profile-change", handleProfileChange);
    window.addEventListener("mindflare-pro-change", handleProfileChange);
    return () => {
      window.removeEventListener("mindflare-profile-change", handleProfileChange);
      window.removeEventListener("mindflare-pro-change", handleProfileChange);
    };
  }, []);

  const getInitials = (name) => {
    if (!name) return "US";
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return name.trim().substring(0, 2).toUpperCase();
  };

  const handleLogout = async () => {
    try {
      await api.post("/auth/logout");
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <header className="dashboard-topbar">
      {placeholder ? (
        <label className="dashboard-search">
          <Search size={19} />
          <input placeholder={placeholder} readOnly style={{ cursor: "default" }} />
        </label>
      ) : (
        <div style={{ flex: 1 }} />
      )}
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
