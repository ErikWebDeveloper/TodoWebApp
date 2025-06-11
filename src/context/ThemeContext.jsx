import { createContext, useContext, useEffect, useState } from "react";

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState("system"); // 'light', 'dark', 'system'
  const [isDark, setIsDark] = useState(false);

  // Efecto para detectar el tema del sistema y aplicar cambios
  useEffect(() => {
    const systemThemeHandler = (e) => {
      if (theme === "system") {
        setIsDark(e.matches);
        applyTheme(e.matches ? "dark" : "light");
      }
    };

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    mediaQuery.addEventListener("change", systemThemeHandler);

    // Cargar tema guardado o usar el sistema
    const savedTheme = localStorage.getItem("theme") || "system";
    setTheme(savedTheme);

    if (savedTheme === "system") {
      setIsDark(mediaQuery.matches);
      applyTheme(mediaQuery.matches ? "dark" : "light");
    } else {
      setIsDark(savedTheme === "dark");
      applyTheme(savedTheme);
    }

    return () => mediaQuery.removeEventListener("change", systemThemeHandler);
  }, [theme]);

  // Aplicar el tema al documento HTML
  const applyTheme = (themeToApply) => {
    document.body.setAttribute("data-bs-theme", themeToApply);
  };

  // Cambiar tema manualmente
  const changeTheme = (newTheme) => {
    localStorage.setItem("theme", newTheme);
    setTheme(newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, isDark, changeTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
