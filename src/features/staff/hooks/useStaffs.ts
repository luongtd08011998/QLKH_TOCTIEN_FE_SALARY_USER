import { useQuery } from "@tanstack/react-query";
import { staffApi } from "../api";

export function useStaffs(params?: { page?: number; size?: number; sort?: string }) {
    return useQuery({
        queryKey: ["staff", params],
        queryFn: () => staffApi.getAll(params).then((res) => res.data),
    });
}

