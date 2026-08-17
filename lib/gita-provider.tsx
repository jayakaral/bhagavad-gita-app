import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

import type { ScriptureLanguage } from "@/data/gita-types";
import {
  bookmarkKey,
  DEFAULT_GITA_PREFERENCES,
  normalizePreferences,
  type GitaPreferences,
  type NarrationVoice,
  type ReadingLocation,
  type ReadingScale,
} from "@/lib/gita-preferences";
import type { ReadingTheme } from "@/lib/reading-themes";

const STORAGE_KEY = "bhagavad-gita.preferences.v1";

interface GitaContextValue extends GitaPreferences {
  isReady: boolean;
  setLanguage: (language: ScriptureLanguage) => void;
  setReadingScale: (scale: ReadingScale) => void;
  setReadingTheme: (theme: ReadingTheme) => void;
  setNarrationVoice: (voice: NarrationVoice) => void;
  setLastReading: (location: ReadingLocation) => void;
  toggleBookmark: (chapter: number, verse: number) => void;
  isBookmarked: (chapter: number, verse: number) => boolean;
}

const GitaContext = createContext<GitaContextValue | null>(null);

export function GitaProvider({ children }: { children: ReactNode }) {
  const [preferences, setPreferences] = useState<GitaPreferences>(DEFAULT_GITA_PREFERENCES);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY)
      .then((stored) => stored && setPreferences(normalizePreferences(JSON.parse(stored))))
      .catch(() => undefined)
      .finally(() => setIsReady(true));
  }, []);

  useEffect(() => {
    if (isReady) {
      AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(preferences)).catch(() => undefined);
    }
  }, [isReady, preferences]);

  const setLanguage = useCallback((language: ScriptureLanguage) => {
    setPreferences((current) => ({ ...current, language }));
  }, []);

  const setReadingScale = useCallback((readingScale: ReadingScale) => {
    setPreferences((current) => ({ ...current, readingScale }));
  }, []);

  const setReadingTheme = useCallback((readingTheme: ReadingTheme) => {
    setPreferences((current) => ({ ...current, readingTheme }));
  }, []);

  const setNarrationVoice = useCallback((narrationVoice: NarrationVoice) => {
    setPreferences((current) => ({ ...current, narrationVoice }));
  }, []);

  const setLastReading = useCallback((lastReading: ReadingLocation) => {
    setPreferences((current) => ({ ...current, lastReading }));
  }, []);

  const toggleBookmark = useCallback((chapter: number, verse: number) => {
    const key = bookmarkKey(chapter, verse);
    setPreferences((current) => ({
      ...current,
      bookmarks: current.bookmarks.includes(key)
        ? current.bookmarks.filter((bookmark) => bookmark !== key)
        : [key, ...current.bookmarks],
    }));
  }, []);

  const value = useMemo<GitaContextValue>(() => ({
    ...preferences,
    isReady,
    setLanguage,
    setReadingScale,
    setReadingTheme,
    setNarrationVoice,
    setLastReading,
    toggleBookmark,
    isBookmarked: (chapter, verse) => preferences.bookmarks.includes(bookmarkKey(chapter, verse)),
  }), [isReady, preferences, setLanguage, setReadingScale, setReadingTheme, setNarrationVoice, setLastReading, toggleBookmark]);

  return <GitaContext.Provider value={value}>{children}</GitaContext.Provider>;
}

export function useGita(): GitaContextValue {
  const context = useContext(GitaContext);
  if (!context) throw new Error("useGita must be used within GitaProvider.");
  return context;
}
