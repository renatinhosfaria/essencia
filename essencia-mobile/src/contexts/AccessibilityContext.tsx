import AsyncStorage from "@react-native-async-storage/async-storage";
import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { useColorScheme } from "react-native";

interface AccessibilitySettings {
  largeFontMode: boolean;
  highContrastMode: boolean;
  simplifiedNav: boolean;
}

interface AccessibilityContextType {
  settings: AccessibilitySettings;
  toggleLargeFontMode: () => Promise<void>;
  toggleHighContrastMode: () => Promise<void>;
  toggleSimplifiedNav: () => Promise<void>;
  fontScale: number;
  themeName: string;
  isLoading: boolean;
}

const AccessibilityContext = createContext<
  AccessibilityContextType | undefined
>(undefined);

const STORAGE_KEY = "@essencia:accessibility";

export function AccessibilityProvider({ children }: { children: ReactNode }) {
  const systemColorScheme = useColorScheme();
  const [settings, setSettings] = useState<AccessibilitySettings>({
    largeFontMode: false,
    highContrastMode: false,
    simplifiedNav: false,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored) {
        setSettings(JSON.parse(stored));
      }
    } catch (error) {
      console.error("Erro ao carregar configurações de acessibilidade:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveSettings = async (newSettings: AccessibilitySettings) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newSettings));
      setSettings(newSettings);
    } catch (error) {
      console.error("Erro ao salvar configurações de acessibilidade:", error);
    }
  };

  const toggleLargeFontMode = async () => {
    await saveSettings({ ...settings, largeFontMode: !settings.largeFontMode });
  };

  const toggleHighContrastMode = async () => {
    await saveSettings({
      ...settings,
      highContrastMode: !settings.highContrastMode,
    });
  };

  const toggleSimplifiedNav = async () => {
    await saveSettings({ ...settings, simplifiedNav: !settings.simplifiedNav });
  };

  const fontScale = settings.largeFontMode ? 1.5 : 1.0;

  // Determine theme name based on system color scheme and high contrast setting
  const baseTheme = systemColorScheme === "dark" ? "dark" : "light";
  const themeName = settings.highContrastMode
    ? `${baseTheme}_highcontrast`
    : baseTheme;

  return (
    <AccessibilityContext.Provider
      value={{
        settings,
        toggleLargeFontMode,
        toggleHighContrastMode,
        toggleSimplifiedNav,
        fontScale,
        themeName,
        isLoading,
      }}
    >
      {children}
    </AccessibilityContext.Provider>
  );
}

export function useAccessibility() {
  const context = useContext(AccessibilityContext);
  if (!context) {
    throw new Error(
      "useAccessibility deve ser usado dentro de AccessibilityProvider"
    );
  }
  return context;
}
