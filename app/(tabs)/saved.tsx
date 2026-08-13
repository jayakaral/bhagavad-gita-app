import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { router } from "expo-router";
import { FlatList, Text, TouchableOpacity, View } from "react-native";

import { getChapter, getVerse } from "@/data/gita-index";
import { ScreenContainer } from "@/components/screen-container";
import { parseBookmarkKey } from "@/lib/gita-preferences";
import { useGita } from "@/lib/gita-provider";

export default function SavedScreen() {
  const { bookmarks, language, toggleBookmark } = useGita();
  const savedLocations = bookmarks.map(parseBookmarkKey).filter((item): item is NonNullable<typeof item> => item !== null);

  return (
    <ScreenContainer className="bg-[#FBF7EE] dark:bg-[#131A2B]">
      <FlatList
        data={savedLocations}
        keyExtractor={(item) => `${item.chapter}:${item.verse}`}
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 28, flexGrow: 1 }}
        ListHeaderComponent={
          <View className="pb-5 pt-4">
            <Text className="text-sm font-semibold tracking-[1.5px] text-[#C56A16]">YOUR COLLECTION</Text>
            <Text className="mt-1 text-3xl font-bold text-[#17243C] dark:text-[#F7F0E1]">Saved verses</Text>
            <Text className="mt-2 text-sm leading-5 text-[#777168] dark:text-[#A9A79F]">Return to the teachings that matter most to you.</Text>
          </View>
        }
        renderItem={({ item }) => {
          const verse = getVerse(item.chapter, item.verse, language);
          const chapter = getChapter(item.chapter);
          if (!verse || !chapter) return null;
          return (
            <TouchableOpacity
              activeOpacity={0.82}
              onPress={() => router.push({ pathname: "/reader/[chapter]", params: { chapter: String(item.chapter), verse: String(item.verse) } })}
              className="mb-3 rounded-3xl border border-[#E9DED0] bg-surface px-5 py-5 dark:border-[#30384B]"
            >
              <View className="flex-row items-center justify-between">
                <Text className="text-xs font-semibold tracking-[1.1px] text-[#A95812]">CHAPTER {item.chapter} · VERSE {item.verse}</Text>
                <TouchableOpacity accessibilityLabel="Remove saved verse" onPress={() => toggleBookmark(item.chapter, item.verse)} hitSlop={10}>
                  <MaterialIcons name="bookmark" size={22} color="#C56A16" />
                </TouchableOpacity>
              </View>
              <Text className="mt-3 text-base font-semibold leading-6 text-[#17243C] dark:text-[#F7F0E1]" numberOfLines={3}>{verse.translation}</Text>
              <Text className="mt-3 text-xs text-[#777168] dark:text-[#A9A79F]" numberOfLines={1}>{chapter.englishName}</Text>
            </TouchableOpacity>
          );
        }}
        ListEmptyComponent={
          <View className="flex-1 items-center justify-center px-8 pb-24">
            <View className="h-16 w-16 items-center justify-center rounded-full bg-[#F3E5CA] dark:bg-[#312718]">
              <MaterialIcons name="bookmark-border" size={30} color="#A95812" />
            </View>
            <Text className="mt-5 text-xl font-bold text-[#17243C] dark:text-[#F7F0E1]">Nothing saved yet</Text>
            <Text className="mt-2 text-center text-sm leading-5 text-[#777168] dark:text-[#A9A79F]">When a verse speaks to you, tap its bookmark to keep it here.</Text>
            <TouchableOpacity onPress={() => router.push("/chapters")} className="mt-6 rounded-full bg-[#C56A16] px-5 py-3">
              <Text className="font-semibold text-white">Explore chapters</Text>
            </TouchableOpacity>
          </View>
        }
        showsVerticalScrollIndicator={false}
      />
    </ScreenContainer>
  );
}
