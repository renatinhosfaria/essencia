/// <reference path="../types/expo-modules.d.ts" />

import api from "@/services/api";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";

async function getOrCreateDeviceId(): Promise<string> {
  const existing = await SecureStore.getItemAsync("deviceId");
  if (existing) return existing;

  const created = `device-${Date.now()}-${Math.random().toString(16).slice(2)}`;
  await SecureStore.setItemAsync("deviceId", created);
  return created;
}

async function getExpoPushToken(): Promise<string | null> {
  const settings = await Notifications.getPermissionsAsync();
  let status = settings.status;

  if (status !== "granted") {
    const request = await Notifications.requestPermissionsAsync();
    status = request.status;
  }

  if (status !== "granted") {
    return null;
  }

  // For EAS builds, Expo can infer projectId; keep defensive fallback.
  const token = await Notifications.getExpoPushTokenAsync();
  return token.data;
}

export const pushService = {
  async tryRegisterDeviceToken(): Promise<void> {
    if (!Device.isDevice) {
      // Push tokens only work on a physical device.
      return;
    }

    const token = await getExpoPushToken();
    if (!token) return;

    const deviceId = await getOrCreateDeviceId();
    const platform =
      Platform.OS === "ios"
        ? "ios"
        : Platform.OS === "android"
        ? "android"
        : "web";

    await api.post("/notifications/device-token", {
      token,
      platform,
      deviceId,
      deviceName: Device.modelName ?? undefined,
    });
  },

  async tryRemoveDeviceToken(): Promise<void> {
    if (!Device.isDevice) {
      return;
    }

    try {
      const deviceId = await SecureStore.getItemAsync("deviceId");
      if (!deviceId) return;

      await api.delete(`/notifications/device-token/${deviceId}`);
    } catch (error) {
      // Silent fail - não bloquear logout se falhar
      console.warn("Failed to remove device token:", error);
    }
  },
};
