import { BrainCircuit, Menu, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { navbarLinks as links } from "../data/navigationData";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  return (
    <nav className="navbar">
      <Link className="brand" to="/" aria-label="MindFlare home">
        <BrainCircuit />
        <span>MindFlare</span>
      </Link>
      <div className="nav-links">
        {links.map((link) => (
          <a href={`#${link.toLowerCase().replaceAll(" ", "-")}`} key={link}>
            {link}
          </a>
        ))}
      </div>
      <div className="nav-actions">
        <NavLink className="login-link" to="/login">
          Login
        </NavLink>
        <NavLink className="get-started" to="/signup">
          Get Started
        </NavLink>
      </div>
      <button
        className="menu-button"
        onClick={() => setOpen(!open)}
        aria-label="Toggle navigation"
      >
        {open ? <X /> : <Menu />}
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            className="mobile-menu"
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
          >
            {links.map((link) => (
              <a
                onClick={() => setOpen(false)}
                href={`#${link.toLowerCase().replaceAll(" ", "-")}`}
                key={link}
              >
                {link}
              </a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
