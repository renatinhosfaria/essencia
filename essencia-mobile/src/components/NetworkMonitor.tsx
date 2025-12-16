import { useNetworkStatus } from "@/hooks/useNetworkStatus";
import { offlineQueueService } from "@/services/offline-queue.service";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";

export function NetworkMonitor() {
  const { isConnected } = useNetworkStatus();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (isConnected) {
      // Quando voltar online, processa fila e invalida queries
      const processOfflineActions = async () => {
        try {
          await offlineQueueService.processQueue();
          await queryClient.invalidateQueries();
        } catch (error) {
          console.error("Error processing offline queue:", error);
        }
      };

      processOfflineActions();
    }
  }, [isConnected, queryClient]);

  return null;
}
