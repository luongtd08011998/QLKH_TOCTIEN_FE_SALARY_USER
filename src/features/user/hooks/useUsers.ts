import { useQuery } from "@tanstack/react-query";
import { userApi } from "../api";

export function useUsers(params?: {
    page?: number;
    size?: number;
    sort?: string;
}) {
    return useQuery({
        queryKey: ["users", params],
        queryFn: () => userApi.getAll(params).then((res) => res.data),
    });
}
