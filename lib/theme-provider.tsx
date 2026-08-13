import { createContext, useContext, useEffect, useMemo } from "react";
import { Appearance, View } from "react-native";
import { colorScheme as nativewindColorScheme, vars } from "nativewind";

import type { ColorScheme, ThemeColorPalette } from "@/lib/theme-types";
import { useGita } from "@/lib/gita-provider";
import { READING_THEMES, type ReadingTheme } from "@/lib/reading-themes";

type ThemeContextValue = {
  readingTheme: ReadingTheme;
  palette: ThemeColorPalette;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const { readingTheme } = useGita();
  const activeTheme = READING_THEMES[readingTheme];
  const colorScheme: ColorScheme = readingTheme === "midnight" ? "dark" : "light";

  const palette = useMemo<ThemeColorPalette>(() => ({
    ...activeTheme,
    text: activeTheme.foreground,
    tint: activeTheme.primary,
    icon: activeTheme.muted,
    tabIconDefault: activeTheme.muted,
    tabIconSelected: activeTheme.primary,
  }), [activeTheme]);

  useEffect(() => {
    nativewindColorScheme.set(colorScheme);
    Appearance.setColorScheme?.(colorScheme);
    if (typeof document !== "undefined") {
      const root = document.documentElement;
      root.dataset.theme = readingTheme;
      root.classList.toggle("dark", colorScheme === "dark");
      Object.entries(activeTheme).forEach(([token, value]) => {
        if (typeof value === "string") root.style.setProperty(`--color-${token}`, value);
      });
    }
  }, [activeTheme, colorScheme, readingTheme]);

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

  const value = useMemo(() => ({ readingTheme, palette }), [palette, readingTheme]);

  return (
    <ThemeContext.Provider value={value}>
      <View style={[{ flex: 1 }, themeVariables]}>{children}</View>
    </ThemeContext.Provider>
  );
}

export function useThemeContext(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useThemeContext must be used within ThemeProvider");
  return ctx;
}
