import { useState, useEffect } from "react";
import { FaMoon, FaSun } from "react-icons/fa";
import styles from "./ThemeToggle.module.css";

const ThemeToggle = () => {
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem("theme");
    if (saved) return saved === "dark";
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  });

  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.setAttribute("data-theme", "dark");
      localStorage.setItem("theme", "dark");
    } else {
      root.setAttribute("data-theme", "light");
      localStorage.setItem("theme", "light");
    }
  }, [isDark]);

  return (
    <button 
      className={styles.floatingThemeToggle} 
      onClick={() => setIsDark(!isDark)}
      aria-label="Cambiar tema"
    >
      {isDark ? <FaSun className="text-warning" /> : <FaMoon className="text-primary" />}
    </button>
  );
};

export default ThemeToggle;