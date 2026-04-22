import { useQuery } from "@tanstack/react-query";
import { salaryApi } from "../api";
import type { SalarySendStatus } from "../types";

export function useSalaries(params?: {
    page?: number;
    size?: number;
    sort?: string;
    sendStatus?: SalarySendStatus;
}) {
    return useQuery({
        queryKey: ["salaries", params],
        queryFn: () => salaryApi.getAll(params).then((res) => res.data),
    });
}
