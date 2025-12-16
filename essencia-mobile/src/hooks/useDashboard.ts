import { dashboardService } from "@/services/dashboard.service";
import { useQuery } from "@tanstack/react-query";
import { useNetworkStatus } from "./useNetworkStatus";

export function useDashboard() {
  const { isOffline } = useNetworkStatus();

  return useQuery({
    queryKey: ["dashboard"],
    queryFn: () => dashboardService.getDashboardData(),
    staleTime: 1000 * 60 * 5, // 5 minutos
    gcTime: 1000 * 60 * 60 * 24, // 24 horas
    enabled: !isOffline, // Não tenta buscar se offline
    retry: isOffline ? 0 : 2, // Não tenta retry se offline
  });
}
