import { Search } from "lucide-react";
import NotificationsBell from "./NotificationsBell";
import ThemeToggle from "./ThemeToggle";
import { useState } from "react";

export default function Topbar({
  placeholder = "Search...",
  avatarSrc = "",

}) {

  const userEmail = localStorage.getItem("userEmail");

  console.log("Topbar userEmail:", userEmail);

  const avatarText =
    userEmail?.trim()?.charAt(0)?.toUpperCase() || "U";

  console.log("Topbar avatar:", avatarText);
  return (
    <header className="dashboard-topbar">
      <label className="dashboard-search">
        <Search size={19} />
        <input placeholder={placeholder} />
      </label>
      <div className="topbar-actions">
        <NotificationsBell size={20} />
        <ThemeToggle size={20} />
         <span
          style={{
            width: "42px",
            height: "42px",
            minWidth: "42px",
            borderRadius: "50%",
            background: "#7c3aed",
            color: "#fff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "16px",
            fontWeight: "700",
            lineHeight: "1",
            flexShrink: 0,
          }}
        >
          {avatarText}
        </span>
        



      </div>
    </header>
  );
}
