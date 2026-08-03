import React, { createContext, useContext, useState, useEffect } from "react";

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  // Available themes: "bright" | "dark" | "night"
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("railreserve_theme") || "bright";
  });

  useEffect(() => {
    localStorage.setItem("railreserve_theme", theme);
    document.documentElement.setAttribute("data-theme", theme);
    
    // Apply body theme class
    document.body.classList.remove("theme-dark", "theme-night", "theme-cream");
    document.body.classList.add(`theme-${theme}`);
  }, [theme]);

  const changeTheme = (newTheme) => {
    if (["dark", "night", "cream"].includes(newTheme)) {
      setTheme(newTheme);
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, changeTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
