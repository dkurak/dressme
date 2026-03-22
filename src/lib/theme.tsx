'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type ThemeName = 'rose-gold' | 'midnight' | 'fresh';

export interface ThemeColors {
  name: string;
  description: string;
  primary: string;
  primaryHover: string;
  accent: string;
  headerBg: string;
  headerText: string;
}

export const themes: Record<ThemeName, ThemeColors> = {
  'rose-gold': {
    name: 'Rose Gold',
    description: 'Warm and elegant',
    primary: '#be185d',
    primaryHover: '#9d174d',
    accent: '#f59e0b',
    headerBg: '#1f2937',
    headerText: '#f9fafb',
  },
  'midnight': {
    name: 'Midnight',
    description: 'Dark and sophisticated',
    primary: '#6366f1',
    primaryHover: '#4f46e5',
    accent: '#ec4899',
    headerBg: '#111827',
    headerText: '#f9fafb',
  },
  'fresh': {
    name: 'Fresh',
    description: 'Light and modern',
    primary: '#0d9488',
    primaryHover: '#0f766e',
    accent: '#f97316',
    headerBg: '#1e293b',
    headerText: '#f8fafc',
  },
};

interface ThemeContextType {
  theme: ThemeName;
  colors: ThemeColors;
  setTheme: (theme: ThemeName) => void;
}

const ThemeContext = createContext<ThemeContextType | null>(null);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<ThemeName>('rose-gold');

  useEffect(() => {
    const saved = localStorage.getItem('dressme-theme') as ThemeName;
    if (saved && themes[saved]) setThemeState(saved);
  }, []);

  const setTheme = (newTheme: ThemeName) => {
    setThemeState(newTheme);
    localStorage.setItem('dressme-theme', newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, colors: themes[theme], setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within a ThemeProvider');
  return context;
}
