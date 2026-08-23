import { Search } from "lucide-react";
import NotificationsBell from "./NotificationsBell";
import ThemeToggle from "./ThemeToggle";

export default function Topbar({
  placeholder = "Search...",
  avatarSrc = "",
  avatarText = "NG",
}) {
  return (
    <header className="dashboard-topbar">
      <label className="dashboard-search">
        <Search size={19} />
        <input placeholder={placeholder} />
      </label>
      <div className="topbar-actions">
        <NotificationsBell size={20} />
        <ThemeToggle size={20} />
        {avatarSrc ? (
          <img src={avatarSrc} alt="Current user avatar" />
        ) : (
          <span className="small-avatar">{avatarText}</span>
        )}
      </div>
    </header>
  );
}
