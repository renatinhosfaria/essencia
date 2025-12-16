import api from "@/services/api";
import { useQuery } from "@tanstack/react-query";

export function useUnreadCount() {
  return useQuery({
    queryKey: ["unread-count"],
    queryFn: async () => {
      try {
        const { data } = await api.get("/messages/unread-count");
        return data.count || 0;
      } catch (error) {
        console.error("Error fetching unread count:", error);
        return 0;
      }
    },
    refetchInterval: 30000, // Atualiza a cada 30s
    enabled: true,
  });
}
