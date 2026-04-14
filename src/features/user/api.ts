import { api } from "@/config/api";
import type { ApiResponse, PaginatedResponse } from "@/types/api";
import type { UserResponse, CreateUserRequest, UpdateUserRequest } from "./types";

export const userApi = {
    getAll(params?: { page?: number; size?: number; sort?: string }) {
        return api.get<ApiResponse<PaginatedResponse<UserResponse>>>("/users", {
            params,
        });
    },

    getById(id: number) {
        return api.get<ApiResponse<UserResponse>>(`/users/${id}`);
    },

    create(data: CreateUserRequest) {
        return api.post<ApiResponse<UserResponse>>("/users", data);
    },

    update(data: UpdateUserRequest) {
        return api.put<ApiResponse<UserResponse>>("/users", data);
    },

    delete(id: number) {
        return api.delete<ApiResponse<null>>(`/users/${id}`);
    },
};
