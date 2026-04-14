import { useQuery } from "@tanstack/react-query";
import { roleApi } from "../api";

export function useRoles(params?: {
    page?: number;
    size?: number;
    sort?: string;
}) {
    return useQuery({
        queryKey: ["roles", params],
        queryFn: () => roleApi.getAll(params).then((res) => res.data),
    });
}
