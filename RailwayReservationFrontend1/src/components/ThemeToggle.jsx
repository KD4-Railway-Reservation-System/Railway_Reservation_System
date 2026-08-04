import React from "react";
import { useTheme } from "../context/ThemeContext";
import { Sun, Moon } from "lucide-react";

export default function ThemeToggle() {
  const { theme, changeTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <div className="flex items-center bg-slate-900/60 border border-white/20 p-1 rounded-xl text-xs shadow-inner">
      <button
        type="button"
        onClick={() => changeTheme("light")}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all font-bold cursor-pointer ${
          !isDark
            ? "bg-amber-400 text-slate-950 shadow-md"
            : "text-slate-300 hover:text-white hover:bg-white/10"
        }`}
        title="Switch to Light Theme"
      >
        <Sun className="w-3.5 h-3.5 text-amber-950" />
        <span className="text-xs">Light</span>
      </button>

      <button
        type="button"
        onClick={() => changeTheme("dark")}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all font-bold cursor-pointer ${
          isDark
            ? "bg-indigo-600 text-white shadow-md"
            : "text-slate-300 hover:text-white hover:bg-white/10"
        }`}
        title="Switch to Dark Theme"
      >
        <Moon className="w-3.5 h-3.5 text-indigo-200" />
        <span className="text-xs">Dark</span>
      </button>
    </div>
  );
}