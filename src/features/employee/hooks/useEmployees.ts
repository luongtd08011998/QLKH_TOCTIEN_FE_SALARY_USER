import { useQuery } from "@tanstack/react-query";
import { employeeApi } from "../api";

export function useEmployees(params?: {
    page?: number;
    size?: number;
    sort?: string;
}) {
    return useQuery({
        queryKey: ["employees", params],
        queryFn: () => employeeApi.getAll(params).then((res) => res.data),
    });
}
