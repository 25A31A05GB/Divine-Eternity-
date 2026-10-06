import React, { createContext, useContext, useState, useEffect } from 'react';

export type ThemeMode = 'light' | 'dark';
export type ThemePaletteId = 'rose-gold' | 'midnight-gold' | 'matcha-sage' | 'cherry-glaze';

export interface ThemePaletteConfig {
  id: ThemePaletteId;
  name: string;
  tagline: string;
  swatch: {
    primary: string;
    secondary: string;
    bg: string;
    accent: string;
  };
  colors: {
    primary: string;
    primaryDark: string;
    secondary: string;
    bgLight: string;
    bgDark: string;
    cardLight: string;
    cardDark: string;
    borderLight: string;
    borderDark: string;
    textLight: string;
    textDark: string;
    accent: string;
  };
}

export const THEME_PALETTES: Record<ThemePaletteId, ThemePaletteConfig> = {
  'rose-gold': {
    id: 'rose-gold',
    name: 'Gadgets Destiny Hot Pink & Cream',
    tagline: 'Warm cream with bright hot pink & sunny yellow',
    swatch: {
      primary: '#FF2E93',
      secondary: '#FFD94A',
      bg: '#FFFDF8',
      accent: '#FF2E93',
    },
    colors: {
      primary: '#FF2E93',
      primaryDark: '#e02680',
      secondary: '#FFD94A',
      bgLight: '#FFFDF8',
      bgDark: '#211D1C',
      cardLight: '#FFFFFF',
      cardDark: '#1E1A1A',
      borderLight: '#F3E8E2',
      borderDark: '#3A3232',
      textLight: '#211D1C',
      textDark: '#FFFDF8',
      accent: '#FF2E93',
    },
  },
  'midnight-gold': {
    id: 'midnight-gold',
    name: 'Celestial Midnight & Rose Gold',
    tagline: 'Deep obsidian velvet with luminous rose gold & starlight',
    swatch: {
      primary: '#E0A899',
      secondary: '#FFD94A',
      bg: '#0A090D',
      accent: '#C57A88',
    },
    colors: {
      primary: '#E0A899',
      primaryDark: '#C57A88',
      secondary: '#FFD94A',
      bgLight: '#F7F4F6',
      bgDark: '#0A090D',
      cardLight: '#FFFFFF',
      cardDark: '#141219',
      borderLight: '#EADBDF',
      borderDark: '#282333',
      textLight: '#18151D',
      textDark: '#FAF8FC',
      accent: '#E0A899',
    },
  },
  'matcha-sage': {
    id: 'matcha-sage',
    name: 'Matcha Sage & Warm Amber',
    tagline: 'Calm botanical sage on oat milk linen with golden sand',
    swatch: {
      primary: '#556B4F',
      secondary: '#E5A952',
      bg: '#F8F6F0',
      accent: '#42543D',
    },
    colors: {
      primary: '#556B4F',
      primaryDark: '#42543D',
      secondary: '#E5A952',
      bgLight: '#F8F6F0',
      bgDark: '#0E120E',
      cardLight: '#FFFFFF',
      cardDark: '#161C16',
      borderLight: '#E5E2D8',
      borderDark: '#242D24',
      textLight: '#1E241D',
      textDark: '#F4F8F4',
      accent: '#556B4F',
    },
  },
  'cherry-glaze': {
    id: 'cherry-glaze',
    name: 'Cherry Glaze & Lavender Haze',
    tagline: 'Glazed vanilla with vibrant cherry gloss & lilac mist',
    swatch: {
      primary: '#FF2E7E',
      secondary: '#D8B4F8',
      bg: '#FDF8FA',
      accent: '#D81B60',
    },
    colors: {
      primary: '#FF2E7E',
      primaryDark: '#D81B60',
      secondary: '#D8B4F8',
      bgLight: '#FDF8FA',
      bgDark: '#130D16',
      cardLight: '#FFFFFF',
      cardDark: '#1D1422',
      borderLight: '#F5E1EC',
      borderDark: '#302038',
      textLight: '#1C1322',
      textDark: '#FCF6FD',
      accent: '#FF2E7E',
    },
  },
};

interface ThemeContextType {
  theme: ThemeMode;
  palette: ThemePaletteConfig;
  paletteId: ThemePaletteId;
  toggleTheme: () => void;
  setTheme: (theme: ThemeMode) => void;
  setPalette: (paletteId: ThemePaletteId) => void;
  allPalettes: ThemePaletteConfig[];
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<ThemeMode>(() => {
    try {
      const saved = localStorage.getItem('divines_theme_v1');
      if (saved === 'dark' || saved === 'light') return saved;
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'light' : 'light';
    } catch {
      return 'light';
    }
  });

  const [paletteId, setPaletteIdState] = useState<ThemePaletteId>(() => {
    try {
      const saved = localStorage.getItem('divines_palette_v1');
      if (saved && (saved in THEME_PALETTES)) return saved as ThemePaletteId;
      return 'rose-gold';
    } catch {
      return 'rose-gold';
    }
  });

  const activePalette = THEME_PALETTES[paletteId] || THEME_PALETTES['rose-gold'];

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }

    // Apply active palette CSS variables dynamically
    root.style.setProperty('--brand-primary', activePalette.colors.primary);
    root.style.setProperty('--brand-primary-dark', activePalette.colors.primaryDark);
    root.style.setProperty('--brand-secondary', activePalette.colors.secondary);
    root.style.setProperty('--brand-accent', activePalette.colors.accent);
    root.style.setProperty('--bg-main', theme === 'dark' ? activePalette.colors.bgDark : activePalette.colors.bgLight);
    root.style.setProperty('--brand-card', theme === 'dark' ? activePalette.colors.cardDark : activePalette.colors.cardLight);
    root.style.setProperty('--border-subtle', theme === 'dark' ? activePalette.colors.borderDark : activePalette.colors.borderLight);
    root.style.setProperty('--text-main', theme === 'dark' ? activePalette.colors.textDark : activePalette.colors.textLight);

    try {
      localStorage.setItem('divines_theme_v1', theme);
      localStorage.setItem('divines_palette_v1', paletteId);
    } catch (e) {
      console.error(e);
    }
  }, [theme, paletteId, activePalette]);

  const toggleTheme = () => {
    setThemeState((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  const setTheme = (t: ThemeMode) => setThemeState(t);

  const setPalette = (p: ThemePaletteId) => {
    if (p in THEME_PALETTES) {
      setPaletteIdState(p);
    }
  };

  return (
    <ThemeContext.Provider
      value={{
        theme,
        palette: activePalette,
        paletteId,
        toggleTheme,
        setTheme,
        setPalette,
        allPalettes: Object.values(THEME_PALETTES),
      }}
    >
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
