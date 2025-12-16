import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle, RefreshCw } from "lucide-react";
import React from "react";

interface AsyncBoundaryProps {
  isLoading: boolean;
  isError?: boolean;
  error?: Error | null;
  onRetry?: () => void;
  loadingFallback?: React.ReactNode;
  children: React.ReactNode;
}

export function AsyncBoundary({
  isLoading,
  isError,
  error,
  onRetry,
  loadingFallback,
  children,
}: AsyncBoundaryProps) {
  if (isLoading) {
    return (
      loadingFallback || (
        <div className="space-y-4 w-full">
          <Skeleton className="h-32 w-full rounded-lg" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-[250px]" />
            <Skeleton className="h-4 w-[200px]" />
          </div>
        </div>
      )
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center border rounded-lg bg-red-50/50 border-red-100 dark:bg-red-900/10 dark:border-red-900/50">
        <div className="flex items-center justify-center w-12 h-12 mb-4 rounded-full bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400">
          <AlertCircle className="w-6 h-6" />
        </div>
        <h3 className="mb-2 text-lg font-semibold text-red-900 dark:text-red-200">
          Ops! Algo deu errado
        </h3>
        <p className="max-w-sm mb-6 text-sm text-red-700 dark:text-red-300">
          {error?.message ||
            "Não foi possível carregar os dados. Por favor, tente novamente."}
        </p>
        {onRetry && (
          <Button
            variant="outline"
            onClick={onRetry}
            className="border-red-200 text-red-700 hover:bg-red-50 hover:text-red-800 dark:border-red-800 dark:text-red-300 dark:hover:bg-red-900/50"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Tentar Novamente
          </Button>
        )}
      </div>
    );
  }

  return <>{children}</>;
}
