import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

export default function DashboardLayout({ children, className = "", topbarPlaceholder, customTopbarActions }) {
  return (
    <div className="dashboard-shell">
      <Sidebar />
      <main className={`dashboard-main ${className}`}>
        <Topbar placeholder={topbarPlaceholder} customActions={customTopbarActions} />
        {children}
      </main>
    </div>
  );
}
