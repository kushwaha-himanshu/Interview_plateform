import { useEffect, useState } from "react";

const THEME_KEY = "mindflare-theme";
const THEME_CHANGE_EVENT = "mindflare-theme-change";

export function getTheme() {
  return localStorage.getItem(THEME_KEY) || "dark";
}

export function setTheme(theme) {
  localStorage.setItem(THEME_KEY, theme);
  if (theme === "light") {
    document.documentElement.setAttribute("data-theme", "light");
  } else {
    document.documentElement.removeAttribute("data-theme");
  }
  window.dispatchEvent(new CustomEvent(THEME_CHANGE_EVENT, { detail: theme }));
}

export default function useTheme() {
  const [theme, setInternalTheme] = useState(getTheme());

  useEffect(() => {
    // Initialize theme on mount
    const current = getTheme();
    if (current === "light") {
      document.documentElement.setAttribute("data-theme", "light");
    } else {
      document.documentElement.removeAttribute("data-theme");
    }

    const handler = (event) => {
      setInternalTheme(event.detail);
    };

    window.addEventListener(THEME_CHANGE_EVENT, handler);
    return () => {
      window.removeEventListener(THEME_CHANGE_EVENT, handler);
    };
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
  };

  return { theme, toggleTheme, isDark: theme === "dark" };
}
