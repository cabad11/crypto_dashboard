import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

export enum Theme {
  LIGHT = 'light',
  DARK = 'dark',
}

type ThemeContextValue = {
  toggleTheme: () => void
  theme: Theme
};

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);
let isDark = false;
if (typeof window !== 'undefined') {
  isDark = localStorage.theme === Theme.DARK.toString()
    || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches);
}

const ThemeContextProvider = ({ children}: Readonly<{
  children: React.ReactNode
}>) => {
  const [theme, setTheme] = useState<Theme>(isDark ? Theme.DARK : Theme.LIGHT);
  const toggleTheme = useCallback(() => {
    const newTheme = document.documentElement.classList.contains('dark') ? Theme.LIGHT : Theme.DARK;
    localStorage.setItem('theme', newTheme.toString());
    setTheme(newTheme);
    document.documentElement.classList.toggle(
      'dark',
    );
  }, []);

  const value = useMemo<ThemeContextValue>(() => ({ toggleTheme, theme }), [toggleTheme, theme]);
  useEffect(() => {
    document.documentElement.classList.toggle(
      'dark',
      isDark,
    );
  }, []);
  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeContext');
  return ctx;
}

export default ThemeContextProvider;
