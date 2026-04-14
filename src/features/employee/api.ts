import { api } from "@/config/api";
import type { ApiResponse, PaginatedResponse } from "@/types/api";
import type {
    CreateEmployeeRequest,
    EmployeeResponse,
    UpdateEmployeeRequest,
} from "./types";

export const employeeApi = {
    getAll(params?: { page?: number; size?: number; sort?: string }) {
        return api.get<ApiResponse<PaginatedResponse<EmployeeResponse>>>(
            "/employees",
            { params },
        );
    },

    getById(id: number) {
        return api.get<ApiResponse<EmployeeResponse>>(`/employees/${id}`);
    },

    create(data: CreateEmployeeRequest) {
        return api.post<ApiResponse<EmployeeResponse>>("/employees", data);
    },

    update(data: UpdateEmployeeRequest) {
        return api.put<ApiResponse<EmployeeResponse>>("/employees", data);
    },

    delete(id: number) {
        return api.delete<ApiResponse<null>>(`/employees/${id}`);
    },
};
