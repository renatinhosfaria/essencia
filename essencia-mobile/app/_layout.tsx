import { NetworkMonitor } from "@/components/NetworkMonitor";
import { OfflineIndicator } from "@/components/OfflineIndicator";
import {
  AccessibilityProvider,
  useAccessibility,
} from "@/contexts/AccessibilityContext";
import { AuthProvider } from "@/contexts/AuthContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createAsyncStoragePersister } from "@tanstack/query-async-storage-persister";
import { QueryClient } from "@tanstack/react-query";
import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client";
import { Stack } from "expo-router";
import { TamaguiProvider } from "tamagui";
import tamaguiConfig from "../tamagui.config";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      gcTime: 1000 * 60 * 60 * 24, // 24 horas
    },
  },
});

const persister = createAsyncStoragePersister({
  storage: AsyncStorage,
  throttleTime: 1000,
});

export default function RootLayout() {
  return (
    <TamaguiProvider config={tamaguiConfig}>
      <PersistQueryClientProvider
        client={queryClient}
        persistOptions={{
          persister,
          maxAge: 1000 * 60 * 60 * 24, // 24 horas
        }}
      >
        <AuthProvider>
          <AccessibilityProvider>
            <ThemeWrapper>
              <NetworkMonitor />
              <OfflineIndicator />
              <Stack screenOptions={{ headerShown: false }}>
                <Stack.Screen name="(auth)" />
                <Stack.Screen name="(tabs)" />
              </Stack>
            </ThemeWrapper>
          </AccessibilityProvider>
        </AuthProvider>
      </PersistQueryClientProvider>
    </TamaguiProvider>
  );
}

// Component to apply theme dynamically based on accessibility settings
function ThemeWrapper({ children }: { children: React.ReactNode }) {
  const { themeName } = useAccessibility();

  return (
    <TamaguiProvider config={tamaguiConfig} defaultTheme={themeName}>
      {children}
    </TamaguiProvider>
  );
}
