import React, { createContext, ReactNode, useState } from 'react';

export type ThemeMode = 'light' | 'dark' | 'auto';

interface ThemeColors {
  primary: string;
  primaryDark: string;
  primaryLight: string;
  secondary: string;
  accent: string;
  text: string;
  textLight: string;
  textLighter: string;
  background: string;
  cardBackground: string;
  white: string;
  border: string;
  error: string;
  success: string;
  warning: string;
  info: string;
}

interface ThemeContextType {
  mode: ThemeMode;
  isDark: boolean;
  colors: ThemeColors;
  setMode: (mode: ThemeMode) => void;
  toggleTheme: () => void;
}

const lightColors: ThemeColors = {
  primary: '#E23744',
  primaryDark: '#C02E3A',
  primaryLight: '#FF6B7A',
  secondary: '#FFB800',
  accent: '#2D5016',
  text: '#2C2C2C',
  textLight: '#666666',
  textLighter: '#999999',
  background: '#F8F8F8',
  cardBackground: '#FFFFFF',
  white: '#FFFFFF',
  border: '#EEEEEE',
  error: '#E23744',
  success: '#4CAF50',
  warning: '#FF9800',
  info: '#2196F3',
};

const darkColors: ThemeColors = {
  primary: '#FF6B7A',
  primaryDark: '#E23744',
  primaryLight: '#FF8A95',
  secondary: '#FFD54F',
  accent: '#81C784',
  text: '#FFFFFF',
  textLight: '#B0B0B0',
  textLighter: '#808080',
  background: '#121212',
  cardBackground: '#1E1E1E',
  white: '#FFFFFF',
  border: '#333333',
  error: '#FF5252',
  success: '#69F0AE',
  warning: '#FFB74D',
  info: '#64B5F6',
};

export const ThemeContext = createContext<ThemeContextType | undefined>(undefined);
export type { ThemeContextType };

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [mode, setModeState] = useState<ThemeMode>('light');
  const isDark = mode === 'dark';
  const colors = isDark ? darkColors : lightColors;

  const setMode = (newMode: ThemeMode) => {
    setModeState(newMode === 'dark' ? 'dark' : 'light');
  };

  const toggleTheme = () => {
    setModeState((currentMode) => (currentMode === 'dark' ? 'light' : 'dark'));
  };

  return (
    <ThemeContext.Provider value={{ mode, isDark, colors, setMode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
