// Environment configuration for Admin Dashboard
export const env = {
  apiUrl: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api/v1",
  appName: "Essencia Admin",
  tenantSlug: process.env.NEXT_PUBLIC_TENANT_SLUG || "essencia-feliz",
};
