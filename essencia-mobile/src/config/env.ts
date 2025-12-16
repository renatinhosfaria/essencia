function deriveWsUrlFromApiUrl(apiUrl: string): string {
  return apiUrl.replace(/\/api\/v1\/?$/, "");
}

const apiUrl =
  process.env.EXPO_PUBLIC_API_URL || "http://localhost:3000/api/v1";

export const env = {
  apiUrl,
  wsUrl: process.env.EXPO_PUBLIC_WS_URL || deriveWsUrlFromApiUrl(apiUrl),
  tenantSlug: process.env.EXPO_PUBLIC_TENANT_SLUG || "essencia-feliz",
};
