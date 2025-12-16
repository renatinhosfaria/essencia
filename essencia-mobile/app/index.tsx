import { useAuth } from "@/contexts/AuthContext";
import { Redirect } from "expo-router";
import { Spinner, YStack } from "tamagui";

export default function Index() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <YStack f={1} jc="center" ai="center" bg="$background">
        <Spinner size="large" color="$primary" />
      </YStack>
    );
  }

  if (isAuthenticated) {
    return <Redirect href="/(tabs)" />;
  }

  return <Redirect href="/(auth)/login" />;
}
