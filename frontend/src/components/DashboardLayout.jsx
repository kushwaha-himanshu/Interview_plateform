import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

export default function DashboardLayout({ children, className = "", customTopbarActions }) {
  return (
    <div className="dashboard-shell">
      <Sidebar />
      <main className={`dashboard-main ${className}`}>
        <Topbar customActions={customTopbarActions} />
        {children}
      </main>
    </div>
  );
}
