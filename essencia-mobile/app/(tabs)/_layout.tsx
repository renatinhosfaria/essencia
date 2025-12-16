import { useAccessibility } from "@/contexts/AccessibilityContext";
import { useAuth } from "@/contexts/AuthContext";
import {
  BookOpen,
  Home,
  Image,
  MessageCircle,
  User,
} from "@tamagui/lucide-icons";
import { Tabs, useRouter } from "expo-router";
import { useEffect } from "react";
import { Spinner, YStack } from "tamagui";

// Brand Colors - Colégio Essência Feliz
const BRAND_COLORS = {
  primary: "#CEDE6C", // Verde Lima
  secondary: "#F29131", // Laranja
  inactive: "#9FA1A4", // Cinza
  background: "#FFFFFF",
  text: "#333333",
};

export default function TabsLayout() {
  const { isAuthenticated, isLoading } = useAuth();
  const { settings } = useAccessibility();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace("/(auth)/login");
    }
  }, [isAuthenticated, isLoading]);

  if (isLoading) {
    return (
      <YStack f={1} jc="center" ai="center" bg="$background">
        <Spinner size="large" color="$primary" />
      </YStack>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: BRAND_COLORS.secondary, // Laranja #F29131
        tabBarInactiveTintColor: BRAND_COLORS.inactive, // Cinza #9FA1A4
        tabBarStyle: {
          backgroundColor: BRAND_COLORS.background,
          borderTopColor: "#E5E7EB",
          borderTopWidth: 1,
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "600",
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Início",
          href: "/",
          tabBarIcon: ({ color, size }) => (
            <Home size={size} color={color} accessibilityLabel="Ícone Início" />
          ),
        }}
      />
      <Tabs.Screen
        name="diary"
        options={{
          title: "Diário",
          href: "/diary",
          tabBarIcon: ({ color, size }) => (
            <BookOpen
              size={size}
              color={color}
              accessibilityLabel="Ícone Diário"
            />
          ),
        }}
      />
      <Tabs.Screen
        name="gallery"
        options={{
          title: "Galeria",
          href: "/gallery",
          tabBarIcon: ({ color, size }) => (
            <Image
              size={size}
              color={color}
              accessibilityLabel="Ícone Galeria"
            />
          ),
        }}
      />
      <Tabs.Screen
        name="chat"
        options={{
          title: "Chat",
          href: "/chat",
          tabBarIcon: ({ color, size }) => (
            <MessageCircle
              size={size}
              color={color}
              accessibilityLabel="Ícone Chat"
            />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Perfil",
          href: "/profile",
          tabBarIcon: ({ color, size }) => (
            <User size={size} color={color} accessibilityLabel="Ícone Perfil" />
          ),
        }}
      />
      <Tabs.Screen
        name="accessibility"
        options={{
          href: null, // Hidden from tabs
        }}
      />
    </Tabs>
  );
}
