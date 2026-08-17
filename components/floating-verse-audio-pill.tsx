import { View } from "react-native";

import { VerseAudioButton } from "@/components/verse-audio-button";
import { useColors } from "@/hooks/use-colors";
import { useGita } from "@/lib/gita-provider";

export function FloatingVerseAudioPill({ chapter, verse }: { chapter: number; verse: number }) {
  const colors = useColors();
  const { language, narrationVoice } = useGita();
  const translationLanguage = language === "hi" ? "hindi" : "english";

  return (
    <View
      accessibilityRole="toolbar"
      accessibilityLabel="Verse narration controls"
      className="absolute bottom-[82px] left-3 right-3 flex-row overflow-hidden rounded-full border shadow-lg"
      style={{ backgroundColor: colors.surface, borderColor: colors.border, elevation: 8 }}
    >
      <VerseAudioButton chapter={chapter} verse={verse} language="sanskrit" voice={narrationVoice} presentation="pill" />
      <View className="w-px self-stretch" style={{ backgroundColor: colors.border }} />
      <VerseAudioButton chapter={chapter} verse={verse} language={translationLanguage} voice={narrationVoice} presentation="pill" />
    </View>
  );
}
