import { api } from "@/config/api";
import type { ApiResponse, PaginatedResponse } from "@/types/api";
import type {
    PermissionResponse,
    CreatePermissionRequest,
    UpdatePermissionRequest,
} from "./types";

export const permissionApi = {
    getAll(params?: { page?: number; size?: number; sort?: string }) {
        return api.get<ApiResponse<PaginatedResponse<PermissionResponse>>>(
            "/permissions",
            { params },
        );
    },

    getById(id: number) {
        return api.get<ApiResponse<PermissionResponse>>(`/permissions/${id}`);
    },

    create(data: CreatePermissionRequest) {
        return api.post<ApiResponse<PermissionResponse>>("/permissions", data);
    },

    update(data: UpdatePermissionRequest) {
        return api.put<ApiResponse<PermissionResponse>>("/permissions", data);
    },

    delete(id: number) {
        return api.delete<ApiResponse<null>>(`/permissions/${id}`);
    },
};
