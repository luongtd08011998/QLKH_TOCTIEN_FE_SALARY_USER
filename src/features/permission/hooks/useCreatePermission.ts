import { useMutation, useQueryClient } from "@tanstack/react-query";
import { permissionApi } from "../api";
import type { CreatePermissionRequest } from "../types";

export function useCreatePermission() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: CreatePermissionRequest) =>
            permissionApi.create(data).then((res) => res.data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["permissions"] });
        },
    });
}
