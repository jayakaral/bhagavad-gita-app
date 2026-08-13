import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Text, View } from "react-native";

import { SegmentedControl } from "@/components/segmented-control";
import { ScreenContainer } from "@/components/screen-container";
import type { ReadingScale } from "@/lib/gita-preferences";
import { useGita } from "@/lib/gita-provider";

export default function SettingsScreen() {
  const { language, setLanguage, readingScale, setReadingScale, bookmarks } = useGita();

  return (
    <ScreenContainer className="bg-[#FBF7EE] px-5 dark:bg-[#131A2B]">
      <View className="pt-4">
        <Text className="text-sm font-semibold tracking-[1.5px] text-[#C56A16]">YOUR READING SPACE</Text>
        <Text className="mt-1 text-3xl font-bold text-[#17243C] dark:text-[#F7F0E1]">Settings</Text>
      </View>
      <View className="mt-7 rounded-3xl border border-[#E9DED0] bg-surface px-5 py-5 dark:border-[#30384B]">
        <View className="mb-4 flex-row items-center gap-3">
          <View className="h-9 w-9 items-center justify-center rounded-xl bg-[#F3E5CA] dark:bg-[#312718]">
            <MaterialIcons name="translate" size={20} color="#A95812" />
          </View>
          <View>
            <Text className="font-bold text-[#17243C] dark:text-[#F7F0E1]">Reading language</Text>
            <Text className="mt-0.5 text-xs text-[#777168] dark:text-[#A9A79F]">Choose your translation language</Text>
          </View>
        </View>
        <SegmentedControl value={language} options={[{ label: "English", value: "en" }, { label: "हिंदी", value: "hi" }]} onChange={setLanguage} />
      </View>
      <View className="mt-4 rounded-3xl border border-[#E9DED0] bg-surface px-5 py-5 dark:border-[#30384B]">
        <View className="mb-4 flex-row items-center gap-3">
          <View className="h-9 w-9 items-center justify-center rounded-xl bg-[#F3E5CA] dark:bg-[#312718]">
            <MaterialIcons name="format-size" size={20} color="#A95812" />
          </View>
          <View>
            <Text className="font-bold text-[#17243C] dark:text-[#F7F0E1]">Reading size</Text>
            <Text className="mt-0.5 text-xs text-[#777168] dark:text-[#A9A79F]">Adjust verse text for comfort</Text>
          </View>
        </View>
        <SegmentedControl<ReadingScale>
          value={readingScale}
          options={[{ label: "Small", value: 0.94 }, { label: "Default", value: 1 }, { label: "Large", value: 1.08 }]}
          onChange={setReadingScale}
        />
      </View>
      <View className="mt-4 flex-row items-center rounded-3xl border border-[#E9DED0] bg-surface px-5 py-5 dark:border-[#30384B]">
        <View className="h-10 w-10 items-center justify-center rounded-xl bg-[#F6EDEF] dark:bg-[#2A2231]">
          <MaterialIcons name="bookmark" size={20} color="#8D4563" />
        </View>
        <View className="ml-3 flex-1">
          <Text className="font-bold text-[#17243C] dark:text-[#F7F0E1]">On this device</Text>
          <Text className="mt-0.5 text-xs text-[#777168] dark:text-[#A9A79F]">Your reading position and saved verses stay private.</Text>
        </View>
        <Text className="text-lg font-bold text-[#C56A16]">{bookmarks.length}</Text>
      </View>
    </ScreenContainer>
  );
}
