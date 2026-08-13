import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Text, TouchableOpacity, View } from "react-native";

import type { GitaVerse } from "@/data/gita-types";
import { haptic } from "@/lib/haptics";

interface VerseCardProps {
  verse: GitaVerse;
  isBookmarked: boolean;
  readingScale: number;
  onBookmark: () => void;
  onSelect: () => void;
}

export function VerseCard({ verse, isBookmarked, readingScale, onBookmark, onSelect }: VerseCardProps) {
  return (
    <TouchableOpacity
      accessibilityRole="button"
      accessibilityLabel={`Verse ${verse.verseNumber}`}
      activeOpacity={0.9}
      onPress={onSelect}
      className="mb-3 rounded-3xl border border-[#E9DED0] bg-surface px-5 py-5 dark:border-[#30384B]"
    >
      <View className="mb-3 flex-row items-center justify-between">
        <View className="rounded-full bg-[#F6E7CD] px-3 py-1 dark:bg-[#3A2D1B]">
          <Text className="text-xs font-bold tracking-[1.2px] text-[#A95812]">VERSE {verse.verseNumber}</Text>
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
          <MaterialIcons name={isBookmarked ? "bookmark" : "bookmark-border"} size={23} color={isBookmarked ? "#C56A16" : "#777168"} />
        </TouchableOpacity>
      </View>
      <Text style={{ fontSize: 18 * readingScale, lineHeight: 29 * readingScale }} className="mb-4 font-medium text-[#1E2A3F] dark:text-[#F7F0E1]">
        {verse.sanskrit}
      </Text>
      <View className="mb-4 h-px bg-[#E9DED0] dark:bg-[#30384B]" />
      <Text style={{ fontSize: 15 * readingScale, lineHeight: 23 * readingScale }} className="text-[#4D5665] dark:text-[#D4D0C6]">
        {verse.translation}
      </Text>
      <Text style={{ fontSize: 13 * readingScale, lineHeight: 20 * readingScale }} className="mt-4 text-[#777168] dark:text-[#A9A79F]">
        {verse.interpretation}
      </Text>
    </TouchableOpacity>
  );
}
