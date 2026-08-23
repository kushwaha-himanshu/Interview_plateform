import { useState } from "react";
import DashboardLayout from "../components/DashboardLayout";
import Topbar from "../components/Topbar";
import "./Settings.css";

const mockSettings = {
  adaptiveDifficulty: true,
  voiceMode: false,
  weeklyReport: true,
  emailTips: true,
};

export default function Settings() {
  const [settings, setSettings] = useState(mockSettings);

  const toggle = (key) => {
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <DashboardLayout>
      <Topbar placeholder="Search settings..." avatarText="NG" />

      <section className="settings-page">
        <header className="settings-heading">
          <h1>Settings</h1>
          <p>Manage your interview experience and notification preferences.</p>
        </header>

        <div className="settings-grid">
          <article className="dashboard-card settings-card">
            <h2>Interview Experience</h2>
            <div className="setting-row">
              <div>
                <strong>Adaptive Difficulty</strong>
                <p>Adjust question complexity based on your performance.</p>
              </div>
              <button
                type="button"
                className={`toggle-btn ${settings.adaptiveDifficulty ? "on" : "off"}`}
                onClick={() => toggle("adaptiveDifficulty")}
              >
                {settings.adaptiveDifficulty ? "On" : "Off"}
              </button>
            </div>
            <div className="setting-row">
              <div>
                <strong>Voice Mode</strong>
                <p>Enable voice interactions for interview answers.</p>
              </div>
              <button
                type="button"
                className={`toggle-btn ${settings.voiceMode ? "on" : "off"}`}
                onClick={() => toggle("voiceMode")}
              >
                {settings.voiceMode ? "On" : "Off"}
              </button>
            </div>
          </article>

          <article className="dashboard-card settings-card">
            <h2>Notifications</h2>
            <div className="setting-row">
              <div>
                <strong>Weekly Progress Report</strong>
                <p>Receive a weekly summary of your interview growth.</p>
              </div>
              <button
                type="button"
                className={`toggle-btn ${settings.weeklyReport ? "on" : "off"}`}
                onClick={() => toggle("weeklyReport")}
              >
                {settings.weeklyReport ? "On" : "Off"}
              </button>
            </div>
            <div className="setting-row">
              <div>
                <strong>Email Tips</strong>
                <p>Get targeted AI tips based on your weak areas.</p>
              </div>
              <button
                type="button"
                className={`toggle-btn ${settings.emailTips ? "on" : "off"}`}
                onClick={() => toggle("emailTips")}
              >
                {settings.emailTips ? "On" : "Off"}
              </button>
            </div>
          </article>
        </div>
      </section>
    </DashboardLayout>
  );
}