import { api } from "@/config/api";
import type { ApiResponse, PaginatedResponse } from "@/types/api";
import type {
    CreateSalaryRequest,
    SalaryEmailBatchResult,
    SalaryResponse,
    UpdateSalaryRequest,
} from "./types";

export const salaryApi = {
    getAll(params?: { page?: number; size?: number; sort?: string }) {
        return api.get<ApiResponse<PaginatedResponse<SalaryResponse>>>(
            "/salaries",
            { params },
        );
    },

    getById(id: number) {
        return api.get<ApiResponse<SalaryResponse>>(`/salaries/${id}`);
    },

    create(data: CreateSalaryRequest) {
        return api.post<ApiResponse<SalaryResponse>>("/salaries", data);
    },

    update(data: UpdateSalaryRequest) {
        return api.put<ApiResponse<SalaryResponse>>("/salaries", data);
    },

    delete(id: number) {
        return api.delete<ApiResponse<null>>(`/salaries/${id}`);
    },

    importExcel(yearMonth: string, file: File) {
        const form = new FormData();
        form.append("yearMonth", yearMonth);
        form.append("file", file);
        return api.post<ApiResponse<{ totalRows: number; importedCount: number }>>(
            "/salaries/import",
            form,
        );
    },

    downloadTemplate() {
        return api.get("/salaries/import/template", {
            responseType: "blob",
        });
    },

    sendEmail(id: number) {
        return api.post<ApiResponse<null>>(`/salaries/${id}/send-email`);
    },

    sendAll(yearMonth: string) {
        return api.post<ApiResponse<SalaryEmailBatchResult>>(
            `/salaries/send-all?yearMonth=${yearMonth}`,
        );
    },
};
