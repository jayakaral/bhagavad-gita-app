import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { Appearance, View } from "react-native";
import { colorScheme as nativewindColorScheme, vars } from "nativewind";

import type { ColorScheme, ThemeColorPalette } from "@/constants/theme";
import { useGita } from "@/lib/gita-provider";
import { READING_THEMES, type ReadingTheme } from "@/lib/reading-themes";

type ThemeContextValue = {
  colorScheme: ColorScheme;
  setColorScheme: (scheme: ColorScheme) => void;
  readingTheme: ReadingTheme;
  palette: ThemeColorPalette;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const { readingTheme } = useGita();
  const [colorScheme, setColorSchemeState] = useState<ColorScheme>("light");
  const activeTheme = READING_THEMES[readingTheme];

  useEffect(() => {
    setColorSchemeState(readingTheme === "midnight" ? "dark" : "light");
  }, [readingTheme]);

  const palette = useMemo<ThemeColorPalette>(() => ({
    ...activeTheme,
    text: activeTheme.foreground,
    tint: activeTheme.primary,
    icon: activeTheme.muted,
    tabIconDefault: activeTheme.muted,
    tabIconSelected: activeTheme.primary,
  }), [activeTheme]);

  const applyScheme = useCallback((scheme: ColorScheme) => {
    nativewindColorScheme.set(scheme);
    Appearance.setColorScheme?.(scheme);
    if (typeof document !== "undefined") {
      const root = document.documentElement;
      root.dataset.theme = readingTheme;
      root.classList.toggle("dark", scheme === "dark");
      Object.entries(activeTheme).forEach(([token, value]) => {
        if (typeof value !== "string") return;
        root.style.setProperty(`--color-${token}`, value);
      });
    }
  }, [activeTheme, readingTheme]);

  const setColorScheme = useCallback((scheme: ColorScheme) => {
    setColorSchemeState(scheme);
    applyScheme(scheme);
  }, [applyScheme]);

  useEffect(() => {
    applyScheme(colorScheme);
  }, [applyScheme, colorScheme]);

  const themeVariables = useMemo(() => vars({
    "color-primary": activeTheme.primary,
    "color-background": activeTheme.background,
    "color-surface": activeTheme.surface,
    "color-foreground": activeTheme.foreground,
    "color-muted": activeTheme.muted,
    "color-border": activeTheme.border,
    "color-success": activeTheme.success,
    "color-warning": activeTheme.warning,
    "color-error": activeTheme.error,
  }), [activeTheme]);

  const value = useMemo(
    () => ({
      colorScheme,
      setColorScheme,
      readingTheme,
      palette,
    }),
    [colorScheme, palette, readingTheme, setColorScheme],
  );

  return (
    <ThemeContext.Provider value={value}>
      <View style={[{ flex: 1 }, themeVariables]}>{children}</View>
    </ThemeContext.Provider>
  );
}

export function useThemeContext(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error("useThemeContext must be used within ThemeProvider");
  }
  return ctx;
}
