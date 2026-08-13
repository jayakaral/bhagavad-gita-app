import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { router } from "expo-router";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";

import { getChapter, getVerse } from "@/data/gita-index";
import { ScreenContainer } from "@/components/screen-container";
import { useGita } from "@/lib/gita-provider";
import { haptic } from "@/lib/haptics";

export default function HomeScreen() {
  const { language, lastReading, bookmarks } = useGita();
  const chapter = getChapter(lastReading.chapter);
  const verse = getVerse(lastReading.chapter, lastReading.verse, language);

  const openReader = () => {
    haptic.light();
    router.push({ pathname: "/reader/[chapter]", params: { chapter: String(lastReading.chapter), verse: String(lastReading.verse) } });
  };

  return (
    <ScreenContainer className="px-5" containerClassName="bg-background">
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 28 }}>
        <View className="mb-7 mt-3 flex-row items-start justify-between">
          <View>
            <Text className="text-sm font-semibold tracking-[1.5px] text-[#C56A16]">BHAGAVAD GITA</Text>
            <Text className="mt-1 text-3xl font-bold text-[#17243C] dark:text-[#F7F0E1]">A moment for wisdom</Text>
          </View>
          <View className="mt-1 h-11 w-11 items-center justify-center rounded-full bg-[#F3E5CA] dark:bg-[#312718]">
            <Text className="text-lg">ॐ</Text>
          </View>
        </View>

        <TouchableOpacity onPress={openReader} activeOpacity={0.92} className="mb-6 overflow-hidden rounded-[28px] bg-[#17243C] px-6 py-6">
          <View className="absolute -right-4 -top-8 h-36 w-36 rounded-full border border-[#E6A22D]/30" />
          <View className="absolute -right-14 -top-16 h-56 w-56 rounded-full border border-[#E6A22D]/20" />
          <Text className="text-xs font-semibold tracking-[1.7px] text-[#E6A22D]">CONTINUE READING</Text>
          <Text className="mt-3 text-2xl font-bold leading-8 text-white">Chapter {chapter?.chapter}: {chapter?.title}</Text>
          <Text className="mt-2 text-sm leading-5 text-[#D8D7D4]">Verse {lastReading.verse} · {chapter?.englishName}</Text>
          <View className="mt-6 flex-row items-center">
            <View className="mr-3 h-10 w-10 items-center justify-center rounded-full bg-[#C56A16]">
              <MaterialIcons name="menu-book" size={20} color="#FFF9F0" />
            </View>
            <Text className="font-semibold text-[#FFF9F0]">Resume your reading</Text>
            <MaterialIcons name="arrow-forward" size={20} color="#FFF9F0" style={{ marginLeft: "auto" }} />
          </View>
        </TouchableOpacity>

        <View className="mb-5 flex-row items-center justify-between">
          <Text className="text-xl font-bold text-[#17243C] dark:text-[#F7F0E1]">Reflect</Text>
          <Text className="text-sm font-medium text-[#C56A16]">Chapter {lastReading.chapter}</Text>
        </View>
        <TouchableOpacity onPress={openReader} activeOpacity={0.92} className="mb-6 rounded-3xl border border-[#E9DED0] bg-surface px-5 py-5 dark:border-[#30384B]">
          <Text className="mb-3 text-sm font-semibold text-[#A95812]">VERSE {verse?.verseNumber}</Text>
          <Text className="text-lg font-medium leading-7 text-[#1E2A3F] dark:text-[#F7F0E1]" numberOfLines={3}>{verse?.translation}</Text>
          <Text className="mt-4 text-sm font-semibold text-[#C56A16]">Read the teaching →</Text>
        </TouchableOpacity>

        <View className="flex-row gap-3">
          <TouchableOpacity onPress={() => router.push("/chapters")} activeOpacity={0.8} className="flex-1 rounded-3xl bg-[#F3E5CA] px-4 py-5 dark:bg-[#312718]">
            <MaterialIcons name="format-list-bulleted" size={22} color="#A95812" />
            <Text className="mt-3 text-base font-bold text-[#17243C] dark:text-[#F7F0E1]">18 chapters</Text>
            <Text className="mt-1 text-xs leading-4 text-[#777168] dark:text-[#A9A79F]">Browse the complete dialogue</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.push("/saved")} activeOpacity={0.8} className="flex-1 rounded-3xl bg-[#F6EDEF] px-4 py-5 dark:bg-[#2A2231]">
            <MaterialIcons name="bookmark-border" size={22} color="#8D4563" />
            <Text className="mt-3 text-base font-bold text-[#17243C] dark:text-[#F7F0E1]">{bookmarks.length} saved</Text>
            <Text className="mt-1 text-xs leading-4 text-[#777168] dark:text-[#A9A79F]">Keep wisdom close</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
