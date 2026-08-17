import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { setAudioModeAsync, useAudioPlayer, useAudioPlayerStatus } from "expo-audio";
import { useEffect, useMemo, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";

import { useColors } from "@/hooks/use-colors";
import {
  getDefaultAudioLanguage,
  getVerseAudioUrl,
  type GitaAudioLanguage,
  type GitaAudioVoice,
} from "@/lib/gita-audio";
import { haptic } from "@/lib/haptics";

type ReaderLanguage = "en" | "hi";

const languageOptions: Array<{ value: GitaAudioLanguage; label: string }> = [
  { value: "sanskrit", label: "Sanskrit" },
  { value: "english", label: "English" },
  { value: "hindi", label: "Hindi" },
];

const voiceOptions: Array<{ value: GitaAudioVoice; label: string; icon: "record-voice-over" | "person" }> = [
  { value: "male", label: "Male", icon: "record-voice-over" },
  { value: "female", label: "Female", icon: "person" },
];

function formatTime(seconds: number) {
  const safeSeconds = Number.isFinite(seconds) ? Math.max(0, Math.floor(seconds)) : 0;
  return `${Math.floor(safeSeconds / 60)}:${String(safeSeconds % 60).padStart(2, "0")}`;
}

export function VerseAudioPlayer({
  chapter,
  verse,
  readerLanguage,
}: {
  chapter: number;
  verse: number;
  readerLanguage: ReaderLanguage;
}) {
  const colors = useColors();
  const [selectedLanguage, setSelectedLanguage] = useState<GitaAudioLanguage>(() =>
    getDefaultAudioLanguage(readerLanguage),
  );
  const [selectedVoice, setSelectedVoice] = useState<GitaAudioVoice>("male");
  const player = useAudioPlayer(null, { updateInterval: 250 });
  const status = useAudioPlayerStatus(player);

  const audioUrl = useMemo(
    () => getVerseAudioUrl(chapter, verse, selectedLanguage, selectedVoice),
    [chapter, selectedLanguage, selectedVoice, verse],
  );
  const progress = status.duration > 0 ? Math.min(100, (status.currentTime / status.duration) * 100) : 0;

  useEffect(() => {
    void setAudioModeAsync({
      playsInSilentMode: true,
      interruptionMode: "mixWithOthers",
      interruptionModeAndroid: "duckOthers",
    });
  }, []);

  useEffect(() => {
    player.pause();
    player.replace(audioUrl);
  }, [audioUrl, player]);

  useEffect(() => {
    setSelectedLanguage(getDefaultAudioLanguage(readerLanguage));
  }, [readerLanguage]);

  const selectLanguage = (value: GitaAudioLanguage) => {
    haptic.light();
    setSelectedLanguage(value);
  };

  const selectVoice = (value: GitaAudioVoice) => {
    haptic.light();
    setSelectedVoice(value);
  };

  const togglePlayback = async () => {
    haptic.light();

    if (status.playing) {
      player.pause();
      return;
    }

    if (status.duration > 0 && (status.didJustFinish || status.currentTime >= status.duration - 0.1)) {
      await player.seekTo(0);
    }

    player.play();
  };

  return (
    <View
      className="mb-3 rounded-3xl border px-5 py-5"
      style={{ backgroundColor: colors.surface, borderColor: colors.border }}
    >
      <View className="mb-4 flex-row items-center justify-between">
        <View>
          <Text className="text-xs font-bold tracking-[1.2px]" style={{ color: colors.primary }}>
            LISTEN TO THIS VERSE
          </Text>
          <Text className="mt-1 text-sm" style={{ color: colors.muted }}>
            Select language and voice
          </Text>
        </View>
        <View className="h-9 w-9 items-center justify-center rounded-full" style={{ backgroundColor: `${colors.primary}1A` }}>
          <MaterialIcons name="headphones" size={20} color={colors.primary} />
        </View>
      </View>

      <View className="mb-3 flex-row rounded-2xl p-1" style={{ backgroundColor: `${colors.primary}12` }}>
        {languageOptions.map((option) => {
          const selected = option.value === selectedLanguage;
          return (
            <TouchableOpacity
              key={option.value}
              accessibilityRole="button"
              accessibilityLabel={`Play ${option.label} narration`}
              accessibilityState={{ selected }}
              activeOpacity={0.74}
              onPress={() => selectLanguage(option.value)}
              className="flex-1 items-center rounded-xl px-2 py-2"
              style={selected ? { backgroundColor: colors.surface } : undefined}
            >
              <Text className="text-xs font-bold" style={{ color: selected ? colors.primary : colors.muted }}>
                {option.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <View className="mb-4 flex-row gap-2">
        {voiceOptions.map((option) => {
          const selected = option.value === selectedVoice;
          return (
            <TouchableOpacity
              key={option.value}
              accessibilityRole="button"
              accessibilityLabel={`${option.label} voice`}
              accessibilityState={{ selected }}
              activeOpacity={0.74}
              onPress={() => selectVoice(option.value)}
              className="flex-1 flex-row items-center justify-center rounded-2xl border py-2.5"
              style={{
                borderColor: selected ? colors.primary : colors.border,
                backgroundColor: selected ? `${colors.primary}14` : "transparent",
              }}
            >
              <MaterialIcons name={option.icon} size={18} color={selected ? colors.primary : colors.muted} />
              <Text className="ml-2 text-sm font-bold" style={{ color: selected ? colors.primary : colors.muted }}>
                {option.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <TouchableOpacity
        accessibilityRole="button"
        accessibilityLabel={status.playing ? "Pause verse audio" : "Play verse audio"}
        activeOpacity={0.82}
        onPress={() => void togglePlayback()}
        className="flex-row items-center justify-center rounded-2xl py-3.5"
        style={{ backgroundColor: colors.primary }}
      >
        <MaterialIcons name={status.playing ? "pause" : "play-arrow"} size={23} color="#FFFFFF" />
        <Text className="ml-2 text-sm font-bold text-white">
          {status.playing ? "Pause narration" : "Play narration"}
        </Text>
      </TouchableOpacity>

      <View className="mt-4">
        <View className="h-1.5 overflow-hidden rounded-full" style={{ backgroundColor: `${colors.primary}22` }}>
          <View className="h-full rounded-full" style={{ width: `${progress}%`, backgroundColor: colors.primary }} />
        </View>
        <View className="mt-2 flex-row justify-between">
          <Text className="text-xs" style={{ color: colors.muted }}>
            {formatTime(status.currentTime)}
          </Text>
          <Text className="text-xs" style={{ color: colors.muted }}>
            {status.isBuffering ? "Loading audio…" : formatTime(status.duration)}
          </Text>
        </View>
      </View>
    </View>
  );
}
