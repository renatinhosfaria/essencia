import { SimplifiedScreenWrapper } from "@/components/SimplifiedScreenWrapper";
import { useAuth } from "@/contexts/AuthContext";
import { useScaledFont } from "@/hooks/useScaledFont";
import { ChevronRight, LogOut, Settings } from "@tamagui/lucide-icons";
import { useRouter } from "expo-router";
import { Pressable } from "react-native";
import { Avatar, Button, Text, XStack, YStack } from "tamagui";

export default function ProfileScreen() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const nameSize = useScaledFont(7);
  const emailSize = useScaledFont(4);
  const roleSize = useScaledFont(3);
  const menuSize = useScaledFont(4);

  return (
    <SimplifiedScreenWrapper>
      <YStack f={1} p="$4" bg="$background" gap="$4" mt="$8">
        <YStack ai="center" gap="$3">
          <Avatar circular size="$10" bg="$primary">
            <Avatar.Image src={user?.avatarUrl} />
            <Avatar.Fallback bg="$primary">
              <Text color="white" fontSize="$8" fontWeight="bold">
                {user?.name?.charAt(0).toUpperCase() || "U"}
              </Text>
            </Avatar.Fallback>
          </Avatar>

          <Text fontSize={nameSize} fontWeight="bold" color="$color">
            {user?.name || "Usuário"}
          </Text>
          <Text fontSize={emailSize} color="$color" opacity={0.7}>
            {user?.email || ""}
          </Text>
          <Text fontSize={roleSize} color="$color" opacity={0.5}>
            {user?.role || ""}
          </Text>
        </YStack>

        {/* Menu Items */}
        <YStack gap="$3" mt="$4">
          <Pressable onPress={() => router.push("/accessibility")}>
            <XStack
              ai="center"
              jc="space-between"
              p="$4"
              bg="white"
              borderRadius="$4"
              borderWidth={1}
              borderColor="$borderColor"
              minHeight={56}
            >
              <XStack ai="center" gap="$3">
                <Settings size={24} color="$primary" />
                <Text fontSize={menuSize} color="$color">
                  Acessibilidade
                </Text>
              </XStack>
              <XStack w={48} h={48} ai="center" jc="center">
                <ChevronRight size={24} color="$placeholder" />
              </XStack>
            </XStack>
          </Pressable>
        </YStack>

        <Button
          bg="$error"
          color="white"
          onPress={logout}
          mt="$6"
          height={56}
          icon={<LogOut size={20} color="white" />}
        >
          Sair
        </Button>
      </YStack>
    </SimplifiedScreenWrapper>
  );
}
