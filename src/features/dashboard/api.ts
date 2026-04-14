import { api } from "@/config/api";
import type { ApiResponse } from "@/types/api";
import type { DashboardStatsResponse } from "./types";

export const dashboardApi = {
    getStats() {
        return api.get<ApiResponse<DashboardStatsResponse>>("/dashboard");
    },
};
