import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { router } from "expo-router";
import { useMemo, useState } from "react";
import { FlatList, Text, TextInput, TouchableOpacity, View } from "react-native";

import { chapters, getVerses } from "@/data/gita-index";
import type { GitaChapter } from "@/data/gita-types";
import { ScreenContainer } from "@/components/screen-container";
import { useGita } from "@/lib/gita-provider";

export default function ChaptersScreen() {
  const [query, setQuery] = useState("");
  const { language, setLastReading } = useGita();
  const filteredChapters = useMemo(() => {
    const normalized = query.trim().toLocaleLowerCase();
    if (!normalized) return chapters;
    return chapters.filter((chapter) => [chapter.chapter, chapter.sanskritName, chapter.englishName, chapter.title].join(" ").toLocaleLowerCase().includes(normalized));
  }, [query]);

  const openChapter = (chapter: GitaChapter) => {
    const firstVerse = getVerses(chapter.chapter, language)[0];
    setLastReading({ chapter: chapter.chapter, verse: firstVerse?.verse ?? 1 });
    router.push({ pathname: "/reader/[chapter]", params: { chapter: String(chapter.chapter), verse: String(firstVerse?.verse ?? 1) } });
  };

  return (
    <ScreenContainer className="bg-[#FBF7EE] dark:bg-[#131A2B]">
      <FlatList
        data={filteredChapters}
        keyExtractor={(chapter) => String(chapter.chapter)}
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 28 }}
        ListHeaderComponent={
          <View className="pb-5 pt-4">
            <Text className="text-sm font-semibold tracking-[1.5px] text-[#C56A16]">THE COMPLETE DIALOGUE</Text>
            <Text className="mt-1 text-3xl font-bold text-[#17243C] dark:text-[#F7F0E1]">Chapters</Text>
            <View className="mt-5 flex-row items-center rounded-2xl border border-[#E4D8C8] bg-surface px-4 dark:border-[#30384B]">
              <MaterialIcons name="search" size={21} color="#8A8378" />
              <TextInput
                value={query}
                onChangeText={setQuery}
                placeholder="Search a chapter"
                placeholderTextColor="#8A8378"
                className="ml-3 flex-1 py-4 text-base text-[#17243C] dark:text-[#F7F0E1]"
                returnKeyType="done"
                accessibilityLabel="Search chapters"
              />
            </View>
          </View>
        }
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => openChapter(item)} activeOpacity={0.72} className="mb-3 flex-row items-center rounded-3xl border border-[#E9DED0] bg-surface px-4 py-4 dark:border-[#30384B]">
            <View className="mr-4 h-12 w-12 items-center justify-center rounded-2xl bg-[#F3E5CA] dark:bg-[#312718]">
              <Text className="text-lg font-bold text-[#A95812]">{item.chapter}</Text>
            </View>
            <View className="min-w-0 flex-1 pr-2">
              <Text className="text-xs font-semibold text-[#C56A16]">{item.sanskritName}</Text>
              <Text className="mt-1 text-base font-bold text-[#17243C] dark:text-[#F7F0E1]" numberOfLines={1}>{item.title}</Text>
              <Text className="mt-1 text-xs text-[#777168] dark:text-[#A9A79F]">{item.verseCount} verses · {item.englishName}</Text>
            </View>
            <MaterialIcons name="chevron-right" size={24} color="#A95812" />
          </TouchableOpacity>
        )}
        ListEmptyComponent={<Text className="py-12 text-center text-base text-[#777168]">No chapter matches your search.</Text>}
        showsVerticalScrollIndicator={false}
      />
    </ScreenContainer>
  );
}
