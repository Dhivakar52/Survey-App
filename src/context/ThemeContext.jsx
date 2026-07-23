import React, { createContext, useContext, useState, useMemo, useCallback } from 'react';
import { THEMES, getTheme, getThemeNames } from '../constants/themes';

const ThemeContext = createContext(null);

export const ThemeProvider = ({ children, initialTheme = 'light' }) => {
  const [currentTheme, setCurrentTheme] = useState(initialTheme);

  const toggleTheme = useCallback(() => {
    const themeNames = getThemeNames();
    const currentIndex = themeNames.indexOf(currentTheme);
    const nextIndex = (currentIndex + 1) % themeNames.length;
    setCurrentTheme(themeNames[nextIndex]);
  }, [currentTheme]);

  const theme = useMemo(() => getTheme(currentTheme), [currentTheme]);

  const value = useMemo(() => ({
    theme: currentTheme,
    themeConfig: theme,
    toggleTheme,
    setTheme: setCurrentTheme,
  }), [currentTheme, theme, toggleTheme]);

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};