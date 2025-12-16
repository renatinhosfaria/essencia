import { useNetworkStatus } from "@/hooks/useNetworkStatus";
import { WifiOff } from "@tamagui/lucide-icons";
import Animated, { FadeInDown, FadeOutUp } from "react-native-reanimated";
import { Text, XStack } from "tamagui";

export function OfflineIndicator() {
  const { isOffline } = useNetworkStatus();

  if (!isOffline) return null;

  return (
    <Animated.View entering={FadeInDown} exiting={FadeOutUp}>
      <XStack bg="#EF4444" py="$2" px="$4" ai="center" jc="center" gap="$2">
        <WifiOff size={16} color="white" />
        <Text color="white" fontSize="$3" fontWeight="600">
          Sem conexão - Exibindo dados salvos
        </Text>
      </XStack>
    </Animated.View>
  );
}
