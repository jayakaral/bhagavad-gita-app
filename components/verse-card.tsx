import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Text, TouchableOpacity, View } from "react-native";

import type { GitaVerse } from "@/data/gita-types";
import { VerseAudioButton } from "@/components/verse-audio-button";
import { useColors } from "@/hooks/use-colors";
import { useGita } from "@/lib/gita-provider";
import { haptic } from "@/lib/haptics";

interface VerseCardProps {
  verse: GitaVerse;
  isBookmarked: boolean;
  readingScale: number;
  onBookmark: () => void;
  onSelect: () => void;
  showInterpretation?: boolean;
  showAudioControls?: boolean;
}

export function VerseCard({ verse, isBookmarked, readingScale, onBookmark, onSelect, showInterpretation = true, showAudioControls = false }: VerseCardProps) {
  const colors = useColors();
  const { language, narrationVoice } = useGita();
  const [chapterNumber] = verse.verseNumber.split(".").map(Number);
  const translationAudioLanguage = language === "hi" ? "hindi" : "english";
  return (
    <TouchableOpacity
      accessibilityRole="button"
      accessibilityLabel={`Verse ${verse.verseNumber}`}
      activeOpacity={0.9}
      onPress={onSelect}
      className="mb-3 rounded-3xl border px-5 py-5"
      style={{ backgroundColor: colors.surface, borderColor: colors.border }}
    >
      <View className="mb-3 flex-row items-center justify-between">
        <View className="rounded-full px-3 py-1" style={{ backgroundColor: `${colors.primary}20` }}>
          <Text className="text-xs font-bold tracking-[1.2px]" style={{ color: colors.primary }}>VERSE {verse.verseNumber}</Text>
        </View>
        <TouchableOpacity
          accessibilityRole="button"
          accessibilityLabel={isBookmarked ? "Remove bookmark" : "Save verse"}
          hitSlop={10}
          onPress={() => {
            haptic.light();
            onBookmark();
          }}
          activeOpacity={0.58}
          style={{ padding: 3 }}
        >
          <MaterialIcons name={isBookmarked ? "bookmark" : "bookmark-border"} size={23} color={isBookmarked ? colors.primary : colors.muted} />
        </TouchableOpacity>
      </View>
      <View className="mb-4 flex-row">
        {showAudioControls && <VerseAudioButton chapter={chapterNumber} verse={verse.verse} language="sanskrit" voice={narrationVoice} />}
        <Text className="flex-1 font-medium" style={{ fontSize: 18 * readingScale, lineHeight: 29 * readingScale, color: colors.foreground }}>
          {verse.sanskrit}
        </Text>
      </View>
      <View className="-mt-1 mb-3 h-px" style={{ backgroundColor: colors.border }} />
      <Text style={{ fontSize: 13 * readingScale, lineHeight: 20 * readingScale, color: colors.muted }} className="mb-4 italic">
        {verse.transliteration}
      </Text>
      <View className="mb-4 h-px" style={{ backgroundColor: colors.border }} />
      <View className="flex-row">
        {showAudioControls && <VerseAudioButton chapter={chapterNumber} verse={verse.verse} language={translationAudioLanguage} voice={narrationVoice} />}
        <Text className="flex-1" style={{ fontSize: 15 * readingScale, lineHeight: 23 * readingScale, color: colors.foreground }}>
          {verse.translation}
        </Text>
      </View>
      {showInterpretation && (
        <Text style={{ fontSize: 13 * readingScale, lineHeight: 20 * readingScale, color: colors.muted }} className="mt-4">
          {verse.interpretation}
        </Text>
      )}
    </TouchableOpacity>
  );
}
