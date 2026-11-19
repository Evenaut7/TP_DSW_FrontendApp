import { useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { ThemeContext } from './themeContextValue';
import type { Theme } from './themeContextValue';

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>(() => {
    // Leer tema desde localStorage o usar 'light' por defecto
    const saved = localStorage.getItem('theme') as Theme;
    return saved || 'light';
  });

  useEffect(() => {
    // Aplicar clase al html
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    
    // Guardar en localStorage
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
