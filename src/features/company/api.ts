import { api } from "@/config/api";
import type { ApiResponse, PaginatedResponse } from "@/types/api";
import type {
    CompanyResponse,
    CreateCompanyRequest,
    UpdateCompanyRequest,
} from "./types";

export const companyApi = {
    getAll(params?: { page?: number; size?: number; sort?: string }) {
        return api.get<ApiResponse<PaginatedResponse<CompanyResponse>>>(
            "/companies",
            { params },
        );
    },

    getById(id: number) {
        return api.get<ApiResponse<CompanyResponse>>(`/companies/${id}`);
    },

    create(data: CreateCompanyRequest) {
        return api.post<ApiResponse<CompanyResponse>>("/companies", data);
    },

    update(data: UpdateCompanyRequest) {
        return api.put<ApiResponse<CompanyResponse>>("/companies", data);
    },

    delete(id: number) {
        return api.delete<ApiResponse<null>>(`/companies/${id}`);
    },
};
