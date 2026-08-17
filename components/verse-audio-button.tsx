import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { setAudioModeAsync, useAudioPlayer, useAudioPlayerStatus } from "expo-audio";
import { useEffect, useState } from "react";
import { Text, TouchableOpacity } from "react-native";

import { useColors } from "@/hooks/use-colors";
import { getVerseAudioUrl, type GitaAudioLanguage } from "@/lib/gita-audio";
import type { NarrationVoice } from "@/lib/gita-preferences";
import { haptic } from "@/lib/haptics";
import { activateVerseAudio, releaseVerseAudio, shouldRestartVerseAudio, stopVerseAudio } from "@/lib/verse-audio-session";

export function VerseAudioButton({
  chapter,
  verse,
  language,
  voice,
  presentation = "icon",
}: {
  chapter: number;
  verse: number;
  language: GitaAudioLanguage;
  voice: NarrationVoice;
  presentation?: "icon" | "pill";
}) {
  const colors = useColors();
  const player = useAudioPlayer(null, { updateInterval: 250 });
  const status = useAudioPlayerStatus(player);
  const audioUrl = getVerseAudioUrl(chapter, verse, language, voice);
  const [isManuallyPaused, setIsManuallyPaused] = useState(false);

  useEffect(() => {
    stopVerseAudio(player);
    setIsManuallyPaused(false);
    player.replace(audioUrl);
  }, [audioUrl, player]);

  useEffect(() => () => releaseVerseAudio(player), [player]);

  const togglePlayback = async () => {
    haptic.light();

    if (status.playing) {
      stopVerseAudio(player);
      setIsManuallyPaused(true);
      return;
    }

    await setAudioModeAsync({
      playsInSilentMode: true,
      interruptionMode: "mixWithOthers",
      interruptionModeAndroid: "duckOthers",
    });

    if (shouldRestartVerseAudio(player) || (status.duration > 0 && (status.didJustFinish || status.currentTime >= status.duration - 0.1))) {
      await player.seekTo(0);
    }

    activateVerseAudio(player);
    player.play();
    setIsManuallyPaused(false);
  };

  const label = language === "sanskrit" ? "Sanskrit" : language === "english" ? "English" : "Hindi";
  const isPill = presentation === "pill";
  const iconName = status.playing ? "pause" : isManuallyPaused ? "play-arrow" : "volume-up";

  return (
    <TouchableOpacity
      accessibilityRole="button"
      accessibilityLabel={status.playing ? `Pause ${label} verse audio` : isManuallyPaused ? `Resume ${label} verse audio` : `Play ${label} verse audio`}
      accessibilityHint={`${voice === "male" ? "Male" : "Female"} narration`}
      activeOpacity={0.7}
      onPress={() => void togglePlayback()}
      className={isPill ? "min-w-[112px] flex-1 flex-row items-center justify-center px-3 py-2.5" : "mr-3 mt-0.5 h-8 w-8 items-center justify-center rounded-full"}
      style={{ backgroundColor: isPill ? (status.playing ? colors.primary : "transparent") : `${colors.primary}18` }}
    >
      <MaterialIcons name={iconName} size={isPill ? 17 : 18} color={isPill && status.playing ? colors.background : colors.primary} />
      {isPill ? (
        <Text className="ml-1.5 text-sm font-bold" style={{ color: status.playing ? colors.background : colors.primary }}>
          {label}
        </Text>
      ) : null}
    </TouchableOpacity>
  );
}
