import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type Theme = 'light' | 'dark' | 'system';
export type Density = 'compact' | 'comfortable' | 'spacious';

export interface DashboardWidget {
  id: string;
  visible: boolean;
  order: number;
}

export const defaultWidgets: DashboardWidget[] = [
  { id: 'kpi', visible: true, order: 0 },
  { id: 'tasks', visible: true, order: 1 },
  { id: 'notes', visible: true, order: 2 },
  { id: 'assistant', visible: true, order: 3 },
  { id: 'timeline', visible: true, order: 4 },
];

interface PreferencesContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  density: Density;
  setDensity: (density: Density) => void;
  widgets: DashboardWidget[];
  setWidgets: (widgets: DashboardWidget[]) => void;
}

const PreferencesContext = createContext<PreferencesContextType | undefined>(undefined);

export function PreferencesProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>(() => {
    const saved = localStorage.getItem('adaptive_theme');
    return (saved as Theme) || 'dark';
  });

  const [density, setDensity] = useState<Density>(() => {
    const saved = localStorage.getItem('adaptive_density');
    return (saved as Density) || 'comfortable';
  });

  const [widgets, setWidgets] = useState<DashboardWidget[]>(() => {
    const saved = localStorage.getItem('adaptive_widgets');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return defaultWidgets;
      }
    }
    return defaultWidgets;
  });

  useEffect(() => {
    localStorage.setItem('adaptive_theme', theme);
    if (theme === 'dark' || (theme === 'system' && window.matchMedia?.('(prefers-color-scheme: dark)').matches)) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('adaptive_density', density);
    document.body.setAttribute('data-density', density);
  }, [density]);

  useEffect(() => {
    localStorage.setItem('adaptive_widgets', JSON.stringify(widgets));
  }, [widgets]);

  return (
    <PreferencesContext.Provider value={{ theme, setTheme, density, setDensity, widgets, setWidgets }}>
      {children}
    </PreferencesContext.Provider>
  );
}

export function usePreferences() {
  const context = useContext(PreferencesContext);
  if (context === undefined) {
    throw new Error('usePreferences must be used within a PreferencesProvider');
  }
  return context;
}
