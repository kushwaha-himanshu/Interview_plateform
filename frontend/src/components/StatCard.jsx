import { motion } from "framer-motion";

export default function StatCard({
  label,
  value,
  detail,
  progress,
  accent = false,
}) {
  return (
    <motion.article className="stat-card dashboard-card" whileHover={{ y: -3 }}>
      <span>{label}</span>
      <div className={accent ? "stat-value accent" : "stat-value"}>{value}</div>
      {detail && (
        <small className={detail.includes("↑") ? "positive" : ""}>
          {detail}
        </small>
      )}
      {progress && (
        <div className="stat-progress">
          <i style={{ width: progress }} />
        </div>
      )}
    </motion.article>
  );
}
