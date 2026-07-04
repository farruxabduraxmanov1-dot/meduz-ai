import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { LogBox, StatusBar } from "react-native";
import { KeyboardProvider } from "react-native-keyboard-controller";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { useIconFonts } from "@/src/hooks/use-icon-fonts";
import { AppStateProvider } from "@/src/store/app-state";
import { ChatProvider } from "@/src/store/chat";

LogBox.ignoreAllLogs(true);

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useIconFonts();

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  if (!loaded && !error) return null;

  return (
    <KeyboardProvider>
      <SafeAreaProvider>
        <StatusBar barStyle="dark-content" />
        <AppStateProvider>
          <ChatProvider>
            <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: "#F5F7FF" } }} />
          </ChatProvider>
        </AppStateProvider>
      </SafeAreaProvider>
    </KeyboardProvider>
  );
}
