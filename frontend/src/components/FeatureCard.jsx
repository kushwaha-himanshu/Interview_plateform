import { motion } from 'framer-motion'

export default function FeatureCard({ icon: Icon, title, children, tone }) {
  return <motion.article className="feature-card" whileHover={{ y: -5 }} transition={{ duration: .2 }}>
    <span className={`feature-icon ${tone}`}><Icon size={23} /></span>
    <h3>{title}</h3><p>{children}</p>
  </motion.article>
}
