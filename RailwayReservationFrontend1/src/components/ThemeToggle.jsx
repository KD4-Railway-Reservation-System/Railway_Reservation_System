import React from "react";

export default function ThemeToggle({ theme, toggleTheme }) {
  return (
    <button onClick={toggleTheme} className="px-2 py-1 bg-slate-700 rounded text-xs text-white">
      {theme === "dark" ? "🌙 Dark" : "☀️ Light"}
    </button>
  );
}