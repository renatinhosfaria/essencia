import { DashboardData } from "@/types/dashboard";
import api from "./api";

export const dashboardService = {
  async getDashboardData(): Promise<DashboardData> {
    const { data } = await api.get<{ data: DashboardData }>("/dashboard");
    return data.data;
  },
};
