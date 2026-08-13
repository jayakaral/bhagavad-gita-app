import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { router, Stack, useLocalSearchParams } from "expo-router";
import { useEffect, useMemo } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";

import { getChapter, getVerses } from "@/data/gita-index";
import { ScreenContainer } from "@/components/screen-container";
import { VerseCard } from "@/components/verse-card";
import { useGita } from "@/lib/gita-provider";
import { haptic } from "@/lib/haptics";
import { getNextLocation, getPreviousLocation } from "@/lib/reader-navigation";

export default function VerseReaderScreen() {
  const params = useLocalSearchParams<{ chapter?: string; verse?: string }>();
  const chapterNumber = Math.min(18, Math.max(1, Number(params.chapter) || 1));
  const { language, readingScale, setLastReading, toggleBookmark, isBookmarked } = useGita();
  const chapter = getChapter(chapterNumber);
  const verses = useMemo(() => getVerses(chapterNumber, language), [chapterNumber, language]);
  const requestedVerse = Number(params.verse) || 1;
  const currentIndex = Math.max(0, verses.findIndex((item) => item.verse === requestedVerse));
  const verse = verses[currentIndex];

  useEffect(() => {
    if (verse) setLastReading({ chapter: chapterNumber, verse: verse.verse });
  }, [chapterNumber, setLastReading, verse]);

  if (!chapter || !verse) return null;

  const openLocation = (nextChapter: number, nextVerse: number) => {
    haptic.light();
    if (nextChapter !== chapterNumber) {
      router.replace({ pathname: "/chapters/[chapter]", params: { chapter: String(nextChapter) } });
      return;
    }
    router.replace({ pathname: "/chapters/[chapter]/[verse]", params: { chapter: String(nextChapter), verse: String(nextVerse) } });
  };

  const previousBase = getPreviousLocation({ chapter: chapterNumber, verse: verse.verse }, language);
  const nextBase = getNextLocation({ chapter: chapterNumber, verse: verse.verse }, language);
  const previousLocation = previousBase && {
    ...previousBase,
    label: previousBase.chapter === chapterNumber ? "Previous verse" : "Previous chapter",
    icon: previousBase.chapter === chapterNumber ? "arrow-back" as const : "west" as const,
  };
  const nextLocation = nextBase && {
    ...nextBase,
    label: nextBase.chapter === chapterNumber ? "Next verse" : "Next chapter",
    icon: nextBase.chapter === chapterNumber ? "arrow-forward" as const : "auto-stories" as const,
  };

  return (
    <ScreenContainer className="bg-background" edges={["top", "left", "right", "bottom"]}>
      <Stack.Screen options={{ headerShown: false }} />
      <View className="flex-1">
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 18 }}>
          <View className="pb-5 pt-1">
            <View className="mb-5 flex-row items-center justify-between">
              <TouchableOpacity accessibilityRole="button" accessibilityLabel="Back to chapter" onPress={() => router.back()} className="h-11 w-11 items-center justify-center rounded-full bg-[#F3E5CA] dark:bg-[#312718]">
                <MaterialIcons name="arrow-back" size={22} color="#A95812" />
              </TouchableOpacity>
              <View className="items-center">
                <Text className="text-xs font-semibold tracking-[1.4px] text-[#C56A16]">CHAPTER {chapterNumber}</Text>
                <Text className="mt-0.5 text-xs text-[#777168] dark:text-[#A9A79F]">VERSE {verse.verse} OF {chapter.verseCount}</Text>
              </View>
              <View className="h-11 w-11 items-center justify-center rounded-full bg-[#F3E5CA] dark:bg-[#312718]">
                <Text className="text-base">ॐ</Text>
              </View>
            </View>
            <Text className="text-2xl font-bold leading-8 text-[#17243C] dark:text-[#F7F0E1]">{chapter.title}</Text>
            <Text className="mt-1 text-sm font-medium text-[#A95812]">{chapter.sanskritName} · {chapter.englishName}</Text>
          </View>
          <VerseCard
            verse={verse}
            readingScale={readingScale}
            isBookmarked={isBookmarked(chapterNumber, verse.verse)}
            onBookmark={() => toggleBookmark(chapterNumber, verse.verse)}
            onSelect={() => setLastReading({ chapter: chapterNumber, verse: verse.verse })}
          />
        </ScrollView>

        <View className="border-t border-[#E9DED0] bg-[#FFFDF8] px-5 pb-2 pt-3 dark:border-[#30384B] dark:bg-[#161F31]">
          <View className="flex-row gap-3">
            {previousLocation ? (
              <TouchableOpacity accessibilityRole="button" accessibilityLabel={previousLocation.label} onPress={() => openLocation(previousLocation.chapter, previousLocation.verse)} activeOpacity={0.75} className="flex-1 flex-row items-center justify-center rounded-2xl border border-[#DED3C4] py-3 dark:border-[#424C61]">
                <MaterialIcons name={previousLocation.icon} size={19} color="#A95812" />
                <Text className="ml-2 text-sm font-bold text-[#6E3A0C] dark:text-[#F6CCA2]">{previousLocation.label}</Text>
              </TouchableOpacity>
            ) : (
              <View className="flex-1 items-center justify-center rounded-2xl bg-[#F5EFE5] py-3 dark:bg-[#20293B]">
                <Text className="text-sm font-semibold text-[#958B7E]">First verse</Text>
              </View>
            )}
            {nextLocation ? (
              <TouchableOpacity accessibilityRole="button" accessibilityLabel={nextLocation.label} onPress={() => openLocation(nextLocation.chapter, nextLocation.verse)} activeOpacity={0.8} className="flex-1 flex-row items-center justify-center rounded-2xl bg-[#C56A16] py-3">
                <Text className="mr-2 text-sm font-bold text-white">{nextLocation.label}</Text>
                <MaterialIcons name={nextLocation.icon} size={19} color="#FFFFFF" />
              </TouchableOpacity>
            ) : (
              <View className="flex-1 items-center justify-center rounded-2xl bg-[#17243C] py-3">
                <Text className="text-sm font-bold text-white">End of the Gita</Text>
              </View>
            )}
          </View>
        </View>
      </View>
    </ScreenContainer>
  );
}
