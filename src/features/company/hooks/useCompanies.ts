import { useQuery } from "@tanstack/react-query";
import { companyApi } from "../api";

export function useCompanies(params?: {
    page?: number;
    size?: number;
    sort?: string;
}) {
    return useQuery({
        queryKey: ["companies", params],
        queryFn: () => companyApi.getAll(params).then((res) => res.data),
    });
}
