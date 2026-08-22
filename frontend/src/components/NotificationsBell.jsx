import { Bell, Check, Trash2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const NOTIFS_KEY = "mindflare-notifications";
const NOTIFS_CHANGE_EVENT = "mindflare-notifs-change";

const defaultNotifs = [
  { id: 1, text: "Your resume score improved by 14%!", time: "2 hours ago", unread: true },
  { id: 2, text: "New feedback available for System Design mock", time: "1 day ago", unread: true },
  { id: 3, text: "Mock interview scheduled with Nexus AI coach", time: "2 days ago", unread: false }
];

export default function NotificationsBell({ size = 20 }) {
  const [open, setOpen] = useState(false);
  const [notifs, setNotifs] = useState(() => {
    const saved = localStorage.getItem(NOTIFS_KEY);
    return saved ? JSON.parse(saved) : defaultNotifs;
  });
  const containerRef = useRef(null);

  // Sync state between instances via custom events
  useEffect(() => {
    const handleNotifsChange = (event) => {
      setNotifs(event.detail);
    };
    window.addEventListener(NOTIFS_CHANGE_EVENT, handleNotifsChange);
    return () => {
      window.removeEventListener(NOTIFS_CHANGE_EVENT, handleNotifsChange);
    };
  }, []);

  const saveAndBroadcast = (updated) => {
    setNotifs(updated);
    localStorage.setItem(NOTIFS_KEY, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent(NOTIFS_CHANGE_EVENT, { detail: updated }));
  };

  useEffect(() => {
    function handleClickOutside(event) {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const unreadCount = notifs.filter((n) => n.unread).length;

  const markAllRead = () => {
    const updated = notifs.map((n) => ({ ...n, unread: false }));
    saveAndBroadcast(updated);
  };

  const clearAll = () => {
    saveAndBroadcast([]);
  };

  const toggleRead = (id) => {
    const updated = notifs.map((n) =>
      n.id === id ? { ...n, unread: !n.unread } : n
    );
    saveAndBroadcast(updated);
  };

  return (
    <div className="notifications-bell-container" ref={containerRef}>
      <button
        type="button"
        className={`bell-toggle-btn ${unreadCount > 0 ? "has-unread" : ""}`}
        onClick={() => setOpen(!open)}
        aria-label="Notifications"
        title="Notifications"
      >
        <Bell size={size} />
        {unreadCount > 0 && <span className="unread-badge">{unreadCount}</span>}
      </button>

      {open && (
        <div className="notifications-dropdown">
          <header className="notifs-header">
            <h4>Notifications</h4>
            <div className="notifs-header-actions">
              {unreadCount > 0 && (
                <button type="button" onClick={markAllRead} className="action-link text-btn">
                  Mark all read
                </button>
              )}
              {notifs.length > 0 && (
                <button type="button" onClick={clearAll} className="action-link text-btn danger-text-btn">
                  Clear all
                </button>
              )}
            </div>
          </header>

          <div className="notifs-list">
            {notifs.length === 0 ? (
              <div className="empty-notifs">
                <p>All caught up! 🎉</p>
              </div>
            ) : (
              notifs.map((n) => (
                <div
                  key={n.id}
                  className={`notif-item ${n.unread ? "unread" : ""}`}
                  onClick={() => toggleRead(n.id)}
                >
                  <div className="notif-content">
                    <p className="notif-text">{n.text}</p>
                    <span className="notif-time">{n.time}</span>
                  </div>
                  <div className="notif-actions">
                    {n.unread ? (
                      <span className="unread-dot" title="Mark as read" />
                    ) : (
                      <Check size={14} className="read-check" />
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
