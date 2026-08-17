import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { setAudioModeAsync, useAudioPlayer, useAudioPlayerStatus } from "expo-audio";
import { useEffect } from "react";
import { TouchableOpacity } from "react-native";

import { useColors } from "@/hooks/use-colors";
import { getVerseAudioUrl, type GitaAudioLanguage } from "@/lib/gita-audio";
import type { NarrationVoice } from "@/lib/gita-preferences";
import { haptic } from "@/lib/haptics";
import { activateVerseAudio, releaseVerseAudio, stopVerseAudio } from "@/lib/verse-audio-session";

export function VerseAudioButton({
  chapter,
  verse,
  language,
  voice,
}: {
  chapter: number;
  verse: number;
  language: GitaAudioLanguage;
  voice: NarrationVoice;
}) {
  const colors = useColors();
  const player = useAudioPlayer(null, { updateInterval: 250 });
  const status = useAudioPlayerStatus(player);
  const audioUrl = getVerseAudioUrl(chapter, verse, language, voice);

  useEffect(() => {
    stopVerseAudio(player);
    player.replace(audioUrl);
  }, [audioUrl, player]);

  useEffect(() => () => releaseVerseAudio(player), [player]);

  const togglePlayback = async () => {
    haptic.light();

    if (status.playing) {
      stopVerseAudio(player);
      return;
    }

    await setAudioModeAsync({
      playsInSilentMode: true,
      interruptionMode: "mixWithOthers",
      interruptionModeAndroid: "duckOthers",
    });

    if (status.duration > 0 && (status.didJustFinish || status.currentTime >= status.duration - 0.1)) {
      await player.seekTo(0);
    }

    activateVerseAudio(player);
    player.play();
  };

  const label = language === "sanskrit" ? "Sanskrit" : language === "english" ? "English" : "Hindi";

  return (
    <TouchableOpacity
      accessibilityRole="button"
      accessibilityLabel={status.playing ? `Pause ${label} verse audio` : `Play ${label} verse audio`}
      accessibilityHint={`${voice === "male" ? "Male" : "Female"} narration`}
      activeOpacity={0.7}
      onPress={() => void togglePlayback()}
      className="mr-3 mt-0.5 h-8 w-8 items-center justify-center rounded-full"
      style={{ backgroundColor: `${colors.primary}18` }}
    >
      <MaterialIcons name={status.playing ? "pause" : "volume-up"} size={18} color={colors.primary} />
    </TouchableOpacity>
  );
}
