import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";

import "../global.css";

import { GitaProvider } from "@/lib/gita-provider";
import { ThemeProvider } from "@/lib/theme-provider";

export default function RootLayout() {
  return (
    <GitaProvider>
      <ThemeProvider>
        <StatusBar style="dark" />
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="reader/[chapter]" />
        </Stack>
      </ThemeProvider>
    </GitaProvider>
  );
}
