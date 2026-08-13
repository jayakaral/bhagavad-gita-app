import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { router, Stack, useLocalSearchParams } from "expo-router";
import { useMemo } from "react";
import { FlatList, Text, TouchableOpacity, View } from "react-native";

import { getChapter, getVerses } from "@/data/gita-index";
import { ScreenContainer } from "@/components/screen-container";
import { VerseCard } from "@/components/verse-card";
import { useColors } from "@/hooks/use-colors";
import { useGita } from "@/lib/gita-provider";

export default function ChapterDetailScreen() {
  const params = useLocalSearchParams<{ chapter?: string }>();
  const chapterNumber = Math.min(18, Math.max(1, Number(params.chapter) || 1));
  const { language, readingScale, setLastReading, toggleBookmark, isBookmarked } = useGita();
  const colors = useColors();
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
            <View className="-mx-5 px-5 pb-8 pt-2" style={{ backgroundColor: colors.surface }}>
              <TouchableOpacity
                accessibilityRole="button"
                accessibilityLabel="Back to chapters"
                onPress={() => router.back()}
                activeOpacity={0.72}
                className="mb-7 h-10 w-10 items-center justify-center rounded-full"
                style={{ backgroundColor: `${colors.primary}20` }}
              >
                <MaterialIcons name="arrow-back" size={20} color={colors.primary} />
              </TouchableOpacity>
              <Text className="text-xs font-semibold tracking-[1.7px]" style={{ color: colors.primary }}>CHAPTER {chapterNumber}</Text>
              <Text className="mt-4 text-3xl font-bold leading-10" style={{ color: colors.foreground }}>{chapter.sanskritName}</Text>
              <Text className="mt-5 text-base italic" style={{ color: colors.muted }}>{chapter.englishName}</Text>
              <Text className="mt-3 text-lg font-semibold leading-7" style={{ color: colors.foreground }}>{chapter.title}</Text>
              <Text className="mt-5 text-[15px] leading-6" style={{ color: colors.muted }}>{chapter.description}</Text>
              <Text className="mt-5 text-sm font-medium" style={{ color: colors.muted }}>{chapter.verseCount} Verses</Text>
            </View>

            <View className="-mx-5 mt-0 px-5" style={{ backgroundColor: colors.background }}>
              <View className="h-px" style={{ backgroundColor: colors.border }} />
              <View className="flex-row items-center justify-between py-4">
                <TouchableOpacity accessibilityRole="button" onPress={() => router.push("/chapters")} activeOpacity={0.72}>
                  <Text className="text-sm font-medium" style={{ color: colors.muted }}>All chapters</Text>
                </TouchableOpacity>
                {nextChapter ? (
                  <TouchableOpacity
                    accessibilityRole="button"
                    accessibilityLabel={`Open chapter ${nextChapter.chapter}`}
                    onPress={() => router.push({ pathname: "/chapters/[chapter]", params: { chapter: String(nextChapter.chapter) } })}
                    activeOpacity={0.72}
                    className="flex-row items-center"
                  >
                    <Text className="text-sm font-semibold" style={{ color: colors.muted }}>Ch. {nextChapter.chapter}</Text>
                    <MaterialIcons name="arrow-forward" size={17} color={colors.muted} style={{ marginLeft: 5 }} />
                  </TouchableOpacity>
                ) : (
                  <Text className="text-sm font-medium" style={{ color: colors.muted }}>Final chapter</Text>
                )}
              </View>
              <View className="h-px" style={{ backgroundColor: colors.border }} />
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
