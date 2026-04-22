import { api } from "@/config/api";
import type { ApiResponse, PaginatedResponse } from "@/types/api";
import type { CreateStaffRequest, StaffResponse, UpdateStaffRequest } from "./types";

export const staffApi = {
    getAll(params?: { page?: number; size?: number; sort?: string }) {
        return api.get<ApiResponse<PaginatedResponse<StaffResponse>>>("/staff", {
            params,
        });
    },

    getById(id: number) {
        return api.get<ApiResponse<StaffResponse>>(`/staff/${id}`);
    },

    create(data: CreateStaffRequest) {
        return api.post<ApiResponse<StaffResponse>>("/staff", data);
    },

    update(data: UpdateStaffRequest) {
        return api.put<ApiResponse<StaffResponse>>("/staff", data);
    },

    delete(id: number) {
        return api.delete<ApiResponse<null>>(`/staff/${id}`);
    },

    importExcel(file: File) {
        const form = new FormData();
        form.append("file", file);
        return api.post<ApiResponse<{ totalRows: number; importedCount: number }>>(
            "/staff/import",
            form,
        );
    },

    downloadTemplate() {
        return api.get("/staff/import/template", {
            responseType: "blob",
        });
    },
};

