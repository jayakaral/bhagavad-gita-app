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
  const nextChapter = chapterNumber < 18 ? getChapter(chapterNumber + 1) : undefined;

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
          <View className="pb-6">
            <View className="-mx-5 bg-[#171611] px-5 pb-8 pt-2">
              <TouchableOpacity
                accessibilityRole="button"
                accessibilityLabel="Back to chapters"
                onPress={() => router.back()}
                activeOpacity={0.72}
                className="mb-7 h-10 w-10 items-center justify-center rounded-full bg-[#292720]"
              >
                <MaterialIcons name="arrow-back" size={20} color="#D9D2C5" />
              </TouchableOpacity>
              <Text className="text-xs font-semibold tracking-[1.7px] text-[#948D82]">CHAPTER {chapterNumber}</Text>
              <Text className="mt-4 text-3xl font-bold leading-10 text-[#F8F3E9]">{chapter.sanskritName}</Text>
              <Text className="mt-5 text-base italic text-[#B9B0A3]">{chapter.englishName}</Text>
              <Text className="mt-3 text-lg font-semibold leading-7 text-[#F0E8DB]">{chapter.title}</Text>
              <Text className="mt-5 text-[15px] leading-6 text-[#BEB6AA]">{chapter.description}</Text>
              <Text className="mt-5 text-sm font-medium text-[#948D82]">{chapter.verseCount} Verses</Text>
            </View>

            <View className="-mx-5 mt-0 px-5">
              <View className="h-px bg-[#D9D0C2] dark:bg-[#3C4250]" />
              <View className="flex-row items-center justify-between py-4">
                <TouchableOpacity accessibilityRole="button" onPress={() => router.push("/chapters")} activeOpacity={0.72}>
                  <Text className="text-sm font-medium text-[#777168] dark:text-[#A9A79F]">All chapters</Text>
                </TouchableOpacity>
                {nextChapter ? (
                  <TouchableOpacity
                    accessibilityRole="button"
                    accessibilityLabel={`Open chapter ${nextChapter.chapter}`}
                    onPress={() => router.push({ pathname: "/chapters/[chapter]", params: { chapter: String(nextChapter.chapter) } })}
                    activeOpacity={0.72}
                    className="flex-row items-center"
                  >
                    <Text className="text-sm font-semibold text-[#777168] dark:text-[#A9A79F]">Ch. {nextChapter.chapter}</Text>
                    <MaterialIcons name="arrow-forward" size={17} color="#777168" style={{ marginLeft: 5 }} />
                  </TouchableOpacity>
                ) : (
                  <Text className="text-sm font-medium text-[#777168] dark:text-[#A9A79F]">Final chapter</Text>
                )}
              </View>
              <View className="h-px bg-[#D9D0C2] dark:bg-[#3C4250]" />
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
            showInterpretation={false}
          />
        )}
        showsVerticalScrollIndicator={false}
      />
    </ScreenContainer>
  );
}
