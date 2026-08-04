import React, { createContext, useContext, useState, useEffect } from "react";

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  // 2 Themes: "light" | "dark"
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem("railreserve_theme");
    return saved === "dark" ? "dark" : "light";
  });

  useEffect(() => {
    localStorage.setItem("railreserve_theme", theme);
    document.documentElement.setAttribute("data-theme", theme);
    
    // Apply body theme class
    document.body.classList.remove("theme-dark", "theme-light", "theme-bright", "theme-night");
    document.body.classList.add(`theme-${theme}`);
  }, [theme]);

  const changeTheme = (newTheme) => {
    if (newTheme === "dark" || newTheme === "light") {
      setTheme(newTheme);
    }
  };

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  return (
    <ThemeContext.Provider value={{ theme, changeTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
