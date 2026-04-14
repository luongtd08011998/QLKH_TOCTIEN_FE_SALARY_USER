import { useMutation, useQueryClient } from "@tanstack/react-query";
import { permissionApi } from "../api";
import type { UpdatePermissionRequest } from "../types";

export function useUpdatePermission() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: UpdatePermissionRequest) =>
            permissionApi.update(data).then((res) => res.data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["permissions"] });
        },
    });
}
