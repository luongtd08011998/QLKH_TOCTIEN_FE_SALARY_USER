import { useMutation, useQueryClient } from "@tanstack/react-query";
import { roleApi } from "../api";
import type { UpdateRoleRequest } from "../types";

export function useUpdateRole() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: UpdateRoleRequest) =>
            roleApi.update(data).then((res) => res.data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["roles"] });
        },
    });
}
