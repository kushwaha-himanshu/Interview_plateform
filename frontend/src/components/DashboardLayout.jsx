import Sidebar from "./Sidebar";

export default function DashboardLayout({ children, className = "" }) {
  return (
    <div className="dashboard-shell">
      <Sidebar />
      <main className={`dashboard-main ${className}`}>
        {children}
      </main>
    </div>
  );
}
