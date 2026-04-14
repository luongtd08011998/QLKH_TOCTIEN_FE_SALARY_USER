import { useQuery } from "@tanstack/react-query";
import { salaryApi } from "../api";

export function useSalaries(params?: {
    page?: number;
    size?: number;
    sort?: string;
}) {
    return useQuery({
        queryKey: ["salaries", params],
        queryFn: () => salaryApi.getAll(params).then((res) => res.data),
    });
}
