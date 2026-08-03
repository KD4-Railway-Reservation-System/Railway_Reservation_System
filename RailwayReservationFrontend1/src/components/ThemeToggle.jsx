import React, { useState, useRef, useEffect } from "react";
import { useTheme } from "../context/ThemeContext";
import { Sun, Moon, Sparkles } from "lucide-react";

export default function ThemeToggle() {
  const { theme, changeTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const themes = [
    {
      id: "bright",
      label: "Bright Railway",
      desc: "Vibrant & High Contrast",
      icon: <Sun className="w-4 h-4 text-amber-400" />,
      badgeBg: "bg-amber-100 border-amber-300 text-amber-900",
    },
    {
      id: "dark",
      label: "Dark Slate",
      desc: "Midnight Modern",
      icon: <Moon className="w-4 h-4 text-indigo-400" />,
      badgeBg: "bg-indigo-950/60 border-indigo-700/50 text-indigo-300",
    },
    {
      id: "night",
      label: "Night OLED",
      desc: "Warm OLED Amber",
      icon: <Sparkles className="w-4 h-4 text-amber-500" />,
      badgeBg: "bg-amber-950/60 border-amber-700/50 text-amber-300",
    },
  ];

  const activeTheme = themes.find((t) => t.id === theme) || themes[0];

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-3 py-1.5 rounded-xl border border-blue-200/80 bg-white/90 hover:bg-blue-50 transition-all text-xs font-semibold text-slate-800 shadow-sm cursor-pointer"
        title="Change Visual Color Theme"
      >
        {activeTheme.icon}
        <span className="hidden sm:inline font-bold">{activeTheme.label}</span>
        <span className="text-[10px] opacity-60 text-slate-500">▼</span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-52 rounded-2xl bg-white border border-slate-200 shadow-2xl p-2 z-50 space-y-1 backdrop-blur-2xl text-slate-900">
          <div className="px-2 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            Color Themes
          </div>
          {themes.map((t) => (
            <button
              key={t.id}
              onClick={() => {
                changeTheme(t.id);
                setIsOpen(false);
              }}
              className={`w-full text-left px-3 py-2 rounded-xl text-xs flex items-center justify-between transition-all ${
                theme === t.id
                  ? "bg-blue-600 text-white font-bold shadow-md shadow-blue-500/20"
                  : "hover:bg-slate-100 text-slate-700"
              }`}
            >
              <div className="flex items-center space-x-2.5">
                {t.icon}
                <div>
                  <div className="font-bold">{t.label}</div>
                  <div className={`text-[10px] ${theme === t.id ? "text-blue-100" : "text-slate-500"}`}>{t.desc}</div>
                </div>
              </div>
              {theme === t.id && (
                <span className="text-white font-black text-xs">✓</span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}