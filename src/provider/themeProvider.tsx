import React, { createContext, useContext, useEffect, useState } from "react";

// Define the types for the theme context state
type ThemeMode = "light" | "dark";
export type ThemeColor =
  | "blue"
  | "green"
  | "yellow"
  | "amber"
  | "teal"
  | "cyan"
  | "purple"
  | "sky"
  | "red"
  | "orange"
  | "indigo"
  | "lime"
  | "violet"
  | "fuchsia"
  | "emerald"
  | "rose";

interface ThemeContextProps {
  mode: ThemeMode;
  color: ThemeColor;
  toggleMode: () => void;
  setColorTheme: (color: ThemeColor) => void;
}

// Create the context with default values (this will be overridden by the provider)
const ThemeContext = createContext<ThemeContextProps>({
  mode: "dark",
  color: "amber",
  toggleMode: () => {},
  setColorTheme: () => {},
});

// Custom hook for consuming theme context
export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  // Retrieve stored theme from localStorage or default to light and blue
  const storedMode =
    (localStorage.getItem("theme-mode") as ThemeMode) || "dark";
  const storedColor =
    (localStorage.getItem("theme-color") as ThemeColor) || "indigo";

  // State for theme mode and color
  const [mode, setMode] = useState<ThemeMode>(storedMode);
  const [color, setColor] = useState<ThemeColor>(storedColor);

  // Toggles between light and dark mode
  const toggleMode = () =>
    setMode((prevMode) => (prevMode === "light" ? "dark" : "light"));

  // Sets the color theme
  const setColorTheme = (newColor: ThemeColor) => setColor(newColor);

  // Apply the theme classes to the body and persist changes to localStorage
  useEffect(() => {
    // Remove existing theme classes
    document.body.classList.remove(
      "theme-light",
      "theme-dark",
      "theme-blue",
      "theme-green",
      "theme-yellow",
      "theme-amber",
      "theme-teal",
      "theme-cyan",
      "theme-purple",
      "theme-sky",
      "theme-red",
      "theme-orange",
      "theme-indigo",
      "theme-lime",
      "theme-violet",
      "theme-fuchsia",
      "theme-emerald",
      "theme-rose",
    );

    // Add the current theme classes
    document.body.classList.add(`theme-${mode}`, `theme-${color}`);

    // Persist the selected theme in localStorage
    localStorage.setItem("theme-mode", mode);
    localStorage.setItem("theme-color", color);
  }, [mode, color]);

  // Provide the context values
  return (
    <ThemeContext.Provider value={{ mode, color, toggleMode, setColorTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
