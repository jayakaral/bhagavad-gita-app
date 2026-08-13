import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { router, Stack, useLocalSearchParams } from "expo-router";
import { useMemo } from "react";
import { FlatList, Text, TouchableOpacity, View } from "react-native";

import { getChapter, getVerses } from "@/data/gita-index";
import { ScreenContainer } from "@/components/screen-container";
import { VerseCard } from "@/components/verse-card";
import { useGita } from "@/lib/gita-provider";

export default function ChapterDetailScreen() {
  const params = useLocalSearchParams<{ chapter?: string }>();
  const chapterNumber = Math.min(18, Math.max(1, Number(params.chapter) || 1));
  const { language, readingScale, setLastReading, toggleBookmark, isBookmarked } = useGita();
  const chapter = getChapter(chapterNumber);
  const verses = useMemo(() => getVerses(chapterNumber, language), [chapterNumber, language]);

  if (!chapter) return null;

  const openVerse = (verseNumber: number) => {
    setLastReading({ chapter: chapterNumber, verse: verseNumber });
    router.push({ pathname: "/chapters/[chapter]/[verse]", params: { chapter: String(chapterNumber), verse: String(verseNumber) } });
  };

  return (
    <ScreenContainer className="bg-background" edges={["top", "left", "right", "bottom"]}>
      <Stack.Screen options={{ headerShown: false }} />
      <FlatList
        data={verses}
        keyExtractor={(verse) => verse.verseNumber}
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 28 }}
        ListHeaderComponent={
          <View className="pb-5 pt-1">
            <View className="mb-5 flex-row items-center justify-between">
              <TouchableOpacity accessibilityRole="button" accessibilityLabel="Back to chapters" onPress={() => router.back()} className="h-11 w-11 items-center justify-center rounded-full bg-[#F3E5CA] dark:bg-[#312718]">
                <MaterialIcons name="arrow-back" size={22} color="#A95812" />
              </TouchableOpacity>
              <View className="items-center">
                <Text className="text-xs font-semibold tracking-[1.4px] text-[#C56A16]">CHAPTER {chapterNumber}</Text>
                <Text className="mt-0.5 text-xs text-[#777168] dark:text-[#A9A79F]">{chapter.verseCount} VERSES</Text>
              </View>
              <View className="h-11 w-11 items-center justify-center rounded-full bg-[#F3E5CA] dark:bg-[#312718]">
                <Text className="text-base">ॐ</Text>
              </View>
            </View>
            <View className="rounded-[28px] border border-[#E9DED0] bg-surface px-5 py-5 dark:border-[#30384B]">
              <Text className="text-sm font-semibold text-[#C56A16]">{chapter.sanskritName}</Text>
              <Text className="mt-2 text-2xl font-bold leading-8 text-[#17243C] dark:text-[#F7F0E1]">{chapter.title}</Text>
              <Text className="mt-1 text-sm font-medium text-[#A95812]">{chapter.englishName}</Text>
              <Text className="mt-4 text-sm leading-6 text-[#596171] dark:text-[#CBC7BD]">{chapter.description}</Text>
            </View>
            <View className="mt-6 flex-row items-center justify-between">
              <Text className="text-xl font-bold text-[#17243C] dark:text-[#F7F0E1]">All verses</Text>
              <Text className="text-sm font-medium text-[#C56A16]">Tap a verse to focus</Text>
            </View>
          </View>
        }
        renderItem={({ item }) => (
          <VerseCard
            verse={item}
            readingScale={readingScale}
            isBookmarked={isBookmarked(chapterNumber, item.verse)}
            onBookmark={() => toggleBookmark(chapterNumber, item.verse)}
            onSelect={() => openVerse(item.verse)}
          />
        )}
        showsVerticalScrollIndicator={false}
      />
    </ScreenContainer>
  );
}
