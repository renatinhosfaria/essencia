"use client";

import { Loader2 } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect } from "react";

function AuthCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const accessToken = searchParams.get("accessToken");
    const refreshToken = searchParams.get("refreshToken");
    const userData = searchParams.get("user");

    if (accessToken && refreshToken && userData) {
      try {
        // Decode and parse user data
        const user = JSON.parse(decodeURIComponent(userData));

        // Store tokens and user in localStorage
        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("refreshToken", refreshToken);
        localStorage.setItem("user", JSON.stringify(user));

        // Redirect to dashboard
        router.replace("/dashboard");
      } catch (error) {
        console.error("Error processing auth callback:", error);
        router.replace("/login?error=invalid_token");
      }
    } else {
      // No tokens provided, redirect to login
      router.replace("/login");
    }
  }, [searchParams, router]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-[#CEDE6C]/10 via-white to-[#F29131]/10">
      <Loader2 className="h-12 w-12 animate-spin text-[#CEDE6C]" />
      <p className="mt-4 text-lg text-muted-foreground">
        Autenticando, aguarde...
      </p>
    </div>
  );
}

export default function AuthCallbackPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-[#CEDE6C]/10 via-white to-[#F29131]/10">
          <Loader2 className="h-12 w-12 animate-spin text-[#CEDE6C]" />
          <p className="mt-4 text-lg text-muted-foreground">Carregando...</p>
        </div>
      }
    >
      <AuthCallbackContent />
    </Suspense>
  );
}
