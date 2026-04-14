import { useQuery } from "@tanstack/react-query";
import { permissionApi } from "../api";

export function usePermissions(params?: {
    page?: number;
    size?: number;
    sort?: string;
}) {
    return useQuery({
        queryKey: ["permissions", params],
        queryFn: () => permissionApi.getAll(params).then((res) => res.data),
    });
}
