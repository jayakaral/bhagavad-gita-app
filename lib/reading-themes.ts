export type ReadingTheme = "dharma" | "sunrise" | "forest" | "ocean" | "midnight";

export interface ReadingThemeDefinition {
  id: ReadingTheme;
  name: string;
  feeling: string;
  primary: string;
  background: string;
  surface: string;
  foreground: string;
  muted: string;
  border: string;
  success: string;
  warning: string;
  error: string;
}

export const READING_THEMES: Record<ReadingTheme, ReadingThemeDefinition> = {
  dharma: {
    id: "dharma", name: "Dharma", feeling: "Warm and devotional", primary: "#C56A16", background: "#FBF7EE", surface: "#FFFFFF", foreground: "#17243C", muted: "#777168", border: "#E9DED0", success: "#6B7D3D", warning: "#E6A22D", error: "#B14C4C",
  },
  sunrise: {
    id: "sunrise", name: "Sunrise", feeling: "Motivated and optimistic", primary: "#D75A3F", background: "#FFF6EA", surface: "#FFFDFC", foreground: "#3D201C", muted: "#855E56", border: "#F0D6C5", success: "#5D7A47", warning: "#E89532", error: "#B54B43",
  },
  forest: {
    id: "forest", name: "Forest", feeling: "Steady and grounded", primary: "#53764C", background: "#F3F8F0", surface: "#FEFFF9", foreground: "#1F3625", muted: "#637663", border: "#D7E4D1", success: "#53764C", warning: "#C6953E", error: "#A9504E",
  },
  ocean: {
    id: "ocean", name: "Ocean", feeling: "Focused and clear", primary: "#236D94", background: "#F1F8FC", surface: "#FCFEFF", foreground: "#15364A", muted: "#607988", border: "#D1E4ED", success: "#4A7A69", warning: "#D58A31", error: "#AD4D54",
  },
  midnight: {
    id: "midnight", name: "Midnight", feeling: "Deep and contemplative", primary: "#E6AF43", background: "#141A2C", surface: "#20283F", foreground: "#F8F1E2", muted: "#B7B9C7", border: "#38445F", success: "#9EB87A", warning: "#E6AF43", error: "#DE7F7F",
  },
};

export const READING_THEME_OPTIONS = Object.values(READING_THEMES);

export function isReadingTheme(value: unknown): value is ReadingTheme {
  return typeof value === "string" && value in READING_THEMES;
}
