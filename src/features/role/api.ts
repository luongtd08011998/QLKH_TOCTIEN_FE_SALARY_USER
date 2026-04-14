import { api } from "@/config/api";
import type { ApiResponse, PaginatedResponse } from "@/types/api";
import type { RoleResponse, CreateRoleRequest, UpdateRoleRequest } from "./types";

export const roleApi = {
    getAll(params?: { page?: number; size?: number; sort?: string }) {
        return api.get<ApiResponse<PaginatedResponse<RoleResponse>>>("/roles", {
            params,
        });
    },

    getById(id: number) {
        return api.get<ApiResponse<RoleResponse>>(`/roles/${id}`);
    },

    create(data: CreateRoleRequest) {
        return api.post<ApiResponse<RoleResponse>>("/roles", data);
    },

    update(data: UpdateRoleRequest) {
        return api.put<ApiResponse<RoleResponse>>("/roles", data);
    },

    delete(id: number) {
        return api.delete<ApiResponse<null>>(`/roles/${id}`);
    },
};
