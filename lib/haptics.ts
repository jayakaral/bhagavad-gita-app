import * as Haptics from "expo-haptics";
import { Platform } from "react-native";

export const haptic = {
  light: () => Platform.OS !== "web" && Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light),
  selection: () => Platform.OS !== "web" && Haptics.selectionAsync(),
};
