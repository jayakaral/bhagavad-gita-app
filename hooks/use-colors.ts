import type { ThemeColorPalette } from "@/lib/theme-types";
import { useThemeContext } from "@/lib/theme-provider";

/**
 * Returns the current theme's color palette.
 * Usage: const colors = useColors(); then colors.text, colors.background, etc.
 */
export function useColors(): ThemeColorPalette {
  return useThemeContext().palette;
}
