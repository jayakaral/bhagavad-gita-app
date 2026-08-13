import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { router, Stack, useLocalSearchParams } from "expo-router";
import { useEffect, useMemo } from "react";
import { FlatList, Text, TouchableOpacity, View } from "react-native";

import { getChapter, getVerses } from "@/data/gita-index";
import { SegmentedControl } from "@/components/segmented-control";
import { ScreenContainer } from "@/components/screen-container";
import { VerseCard } from "@/components/verse-card";
import { useGita } from "@/lib/gita-provider";
import { haptic } from "@/lib/haptics";

export default function ReaderScreen() {
  const params = useLocalSearchParams<{ chapter?: string; verse?: string }>();
  const chapterNumber = Math.min(18, Math.max(1, Number(params.chapter) || 1));
  const focusVerse = Number(params.verse) || 1;
  const { language, setLanguage, readingScale, setLastReading, toggleBookmark, isBookmarked } = useGita();
  const chapter = getChapter(chapterNumber);
  const verses = useMemo(() => getVerses(chapterNumber, language), [chapterNumber, language]);

  useEffect(() => {
    setLastReading({ chapter: chapterNumber, verse: focusVerse });
  }, [chapterNumber, focusVerse, setLastReading]);

  if (!chapter) return null;

  return (
    <ScreenContainer className="bg-[#FBF7EE] dark:bg-[#131A2B]" edges={["top", "left", "right", "bottom"]}>
      <Stack.Screen options={{ headerShown: false }} />
      <FlatList
        data={verses}
        keyExtractor={(verse) => verse.verseNumber}
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 28 }}
        ListHeaderComponent={
          <View className="pb-5 pt-1">
            <View className="mb-5 flex-row items-center justify-between">
              <TouchableOpacity accessibilityRole="button" accessibilityLabel="Back" onPress={() => router.back()} className="h-11 w-11 items-center justify-center rounded-full bg-[#F3E5CA] dark:bg-[#312718]">
                <MaterialIcons name="arrow-back" size={22} color="#A95812" />
              </TouchableOpacity>
              <View className="items-center">
                <Text className="text-xs font-semibold tracking-[1.4px] text-[#C56A16]">CHAPTER {chapterNumber}</Text>
                <Text className="mt-0.5 text-xs text-[#777168] dark:text-[#A9A79F]">{chapter.verseCount} verses</Text>
              </View>
              <View className="h-11 w-11 items-center justify-center rounded-full bg-[#F3E5CA] dark:bg-[#312718]">
                <Text className="text-base">ॐ</Text>
              </View>
            </View>
            <Text className="text-2xl font-bold leading-8 text-[#17243C] dark:text-[#F7F0E1]">{chapter.title}</Text>
            <Text className="mt-1 text-sm font-medium text-[#A95812]">{chapter.sanskritName} · {chapter.englishName}</Text>
            <Text className="mt-3 text-sm leading-5 text-[#777168] dark:text-[#A9A79F]" numberOfLines={3}>{chapter.description}</Text>
            <View className="mt-5"><SegmentedControl value={language} options={[{ label: "English", value: "en" }, { label: "हिंदी", value: "hi" }]} onChange={(nextLanguage) => { haptic.selection(); setLanguage(nextLanguage); }} /></View>
            <View className="mt-5 flex-row items-center">
              <View className="mr-2 h-2 w-2 rounded-full bg-[#C56A16]" />
              <Text className="text-xs font-semibold text-[#777168] dark:text-[#A9A79F]">Tap a verse to mark your place. Save any verse for later.</Text>
            </View>
          </View>
        }
        renderItem={({ item }) => (
          <VerseCard
            verse={item}
            readingScale={readingScale}
            isBookmarked={isBookmarked(chapterNumber, item.verse)}
            onBookmark={() => toggleBookmark(chapterNumber, item.verse)}
            onSelect={() => setLastReading({ chapter: chapterNumber, verse: item.verse })}
          />
        )}
        showsVerticalScrollIndicator={false}
      />
    </ScreenContainer>
  );
}
