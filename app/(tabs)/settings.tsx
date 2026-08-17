import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";

import { ScreenContainer } from "@/components/screen-container";
import { SegmentedControl } from "@/components/segmented-control";
import { useColors } from "@/hooks/use-colors";
import type { NarrationVoice, ReadingScale } from "@/lib/gita-preferences";
import { useGita } from "@/lib/gita-provider";
import { haptic } from "@/lib/haptics";
import { READING_THEME_OPTIONS } from "@/lib/reading-themes";

const LANGUAGE_LABELS = { en: "English", hi: "हिंदी" } as const;

export default function SettingsScreen() {
  const { language, setLanguage, readingScale, setReadingScale, readingTheme, setReadingTheme, narrationVoice, setNarrationVoice, bookmarks } = useGita();
  const colors = useColors();
  const [languageOpen, setLanguageOpen] = useState(false);

  const selectLanguage = (nextLanguage: "en" | "hi") => {
    haptic.selection();
    setLanguage(nextLanguage);
    setLanguageOpen(false);
  };

  return (
    <ScreenContainer className="bg-background">
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 32 }}>
        <View className="pt-4">
          <Text className="text-sm font-semibold tracking-[1.5px]" style={{ color: colors.primary }}>YOUR READING SPACE</Text>
          <Text className="mt-1 text-3xl font-bold" style={{ color: colors.foreground }}>Settings</Text>
          <Text className="mt-2 text-sm leading-5" style={{ color: colors.muted }}>Shape a reading space that helps you return with focus and energy.</Text>
        </View>

        <View className="mt-7 rounded-3xl border px-5 py-5" style={{ backgroundColor: colors.surface, borderColor: colors.border }}>
          <View className="mb-4 flex-row items-center gap-3">
            <View className="h-9 w-9 items-center justify-center rounded-xl" style={{ backgroundColor: `${colors.primary}20` }}>
              <MaterialIcons name="translate" size={20} color={colors.primary} />
            </View>
            <View>
              <Text className="font-bold" style={{ color: colors.foreground }}>Reading language</Text>
              <Text className="mt-0.5 text-xs" style={{ color: colors.muted }}>Choose the translation shown throughout the app</Text>
            </View>
          </View>
          <TouchableOpacity
            accessibilityRole="button"
            accessibilityLabel="Change reading language"
            accessibilityState={{ expanded: languageOpen }}
            onPress={() => setLanguageOpen((open) => !open)}
            activeOpacity={0.75}
            className="flex-row items-center justify-between rounded-2xl border px-4 py-3"
            style={{ borderColor: colors.border, backgroundColor: colors.background }}
          >
            <Text className="font-semibold" style={{ color: colors.foreground }}>{LANGUAGE_LABELS[language]}</Text>
            <MaterialIcons name={languageOpen ? "keyboard-arrow-up" : "keyboard-arrow-down"} size={22} color={colors.primary} />
          </TouchableOpacity>
          {languageOpen && (
            <View className="mt-2 overflow-hidden rounded-2xl border" style={{ borderColor: colors.border }}>
              {(["en", "hi"] as const).map((option) => (
                <TouchableOpacity
                  key={option}
                  accessibilityRole="button"
                  accessibilityState={{ selected: language === option }}
                  onPress={() => selectLanguage(option)}
                  activeOpacity={0.7}
                  className="flex-row items-center justify-between px-4 py-3"
                  style={{ backgroundColor: language === option ? `${colors.primary}16` : colors.surface }}
                >
                  <Text className="font-medium" style={{ color: colors.foreground }}>{LANGUAGE_LABELS[option]}</Text>
                  {language === option && <MaterialIcons name="check" size={19} color={colors.primary} />}
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        <View className="mt-4 rounded-3xl border px-5 py-5" style={{ backgroundColor: colors.surface, borderColor: colors.border }}>
          <View className="mb-4 flex-row items-center gap-3">
            <View className="h-9 w-9 items-center justify-center rounded-xl" style={{ backgroundColor: `${colors.primary}20` }}>
              <MaterialIcons name="record-voice-over" size={20} color={colors.primary} />
            </View>
            <View>
              <Text className="font-bold" style={{ color: colors.foreground }}>Narration voice</Text>
              <Text className="mt-0.5 text-xs" style={{ color: colors.muted }}>Used for Sanskrit and translation speaker controls</Text>
            </View>
          </View>
          <SegmentedControl<NarrationVoice>
            value={narrationVoice}
            options={[{ label: "Male", value: "male" }, { label: "Female", value: "female" }]}
            onChange={(voice) => { haptic.selection(); setNarrationVoice(voice); }}
          />
        </View>

        <View className="mt-4 rounded-3xl border px-5 py-5" style={{ backgroundColor: colors.surface, borderColor: colors.border }}>
          <View className="mb-4 flex-row items-center gap-3">
            <View className="h-9 w-9 items-center justify-center rounded-xl" style={{ backgroundColor: `${colors.primary}20` }}>
              <MaterialIcons name="format-size" size={20} color={colors.primary} />
            </View>
            <View>
              <Text className="font-bold" style={{ color: colors.foreground }}>Reading size</Text>
              <Text className="mt-0.5 text-xs" style={{ color: colors.muted }}>Adjust verse text for comfortable study</Text>
            </View>
          </View>
          <SegmentedControl<ReadingScale>
            value={readingScale}
            options={[{ label: "Small", value: 0.94 }, { label: "Default", value: 1 }, { label: "Large", value: 1.08 }]}
            onChange={(scale) => { haptic.selection(); setReadingScale(scale); }}
          />
        </View>

        <View className="mt-4 rounded-3xl border px-5 py-5" style={{ backgroundColor: colors.surface, borderColor: colors.border }}>
          <View className="mb-1 flex-row items-center gap-3">
            <View className="h-9 w-9 items-center justify-center rounded-xl" style={{ backgroundColor: `${colors.primary}20` }}>
              <MaterialIcons name="palette" size={20} color={colors.primary} />
            </View>
            <View>
              <Text className="font-bold" style={{ color: colors.foreground }}>Reading theme</Text>
              <Text className="mt-0.5 text-xs" style={{ color: colors.muted }}>Five palettes for your spiritual reading rhythm</Text>
            </View>
          </View>
          <View className="mt-4 gap-2">
            {READING_THEME_OPTIONS.map((theme) => {
              const selected = readingTheme === theme.id;
              return (
                <TouchableOpacity
                  key={theme.id}
                  accessibilityRole="button"
                  accessibilityState={{ selected }}
                  accessibilityLabel={`Select ${theme.name} theme`}
                  onPress={() => { haptic.selection(); setReadingTheme(theme.id); }}
                  activeOpacity={0.76}
                  className="flex-row items-center rounded-2xl border p-3"
                  style={{ borderColor: selected ? theme.primary : colors.border, backgroundColor: selected ? `${theme.primary}12` : colors.background }}
                >
                  <View className="mr-3 h-10 w-10 overflow-hidden rounded-xl border" style={{ borderColor: theme.border, backgroundColor: theme.background }}>
                    <View className="h-5 w-full" style={{ backgroundColor: theme.primary }} />
                    <View className="h-5 w-full" style={{ backgroundColor: theme.surface }} />
                  </View>
                  <View className="flex-1">
                    <Text className="font-bold" style={{ color: colors.foreground }}>{theme.name}</Text>
                    <Text className="mt-0.5 text-xs" style={{ color: colors.muted }}>{theme.feeling}</Text>
                  </View>
                  {selected && <MaterialIcons name="check-circle" size={21} color={theme.primary} />}
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        <View className="mt-4 flex-row items-center rounded-3xl border px-5 py-5" style={{ backgroundColor: colors.surface, borderColor: colors.border }}>
          <View className="h-10 w-10 items-center justify-center rounded-xl" style={{ backgroundColor: `${colors.primary}20` }}>
            <MaterialIcons name="bookmark" size={20} color={colors.primary} />
          </View>
          <View className="ml-3 flex-1">
            <Text className="font-bold" style={{ color: colors.foreground }}>On this device</Text>
            <Text className="mt-0.5 text-xs" style={{ color: colors.muted }}>Your reading position, themes, and saved verses stay private.</Text>
          </View>
          <Text className="text-lg font-bold" style={{ color: colors.primary }}>{bookmarks.length}</Text>
        </View>
        <View className="mt-8 items-center pb-2">
          <View className="mb-4 h-px w-16" style={{ backgroundColor: colors.border }} />
          <Text className="text-xs font-medium" style={{ color: colors.muted }}>Public domain translations</Text>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
