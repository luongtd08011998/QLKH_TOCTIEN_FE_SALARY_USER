import { api } from "@/config/api";
import type { ApiResponse } from "@/types/api";
import type {
    LoginRequest,
    LoginResponse,
    RegisterRequest,
    RegisterResponse,
    AuthUser,
} from "./types";

export const authApi = {
    login(data: LoginRequest) {
        return api.post<ApiResponse<LoginResponse>>("/auth/login", data);
    },

    register(data: RegisterRequest) {
        return api.post<ApiResponse<RegisterResponse>>("/auth/register", data);
    },

    refresh() {
        return api.post<ApiResponse<LoginResponse>>("/auth/refresh");
    },

    logout() {
        return api.post<ApiResponse<null>>("/auth/logout");
    },

    getMe() {
        return api.get<ApiResponse<AuthUser>>("/auth/me");
    },
};
