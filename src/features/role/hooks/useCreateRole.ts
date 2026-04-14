import { useMutation, useQueryClient } from "@tanstack/react-query";
import { roleApi } from "../api";
import type { CreateRoleRequest } from "../types";

export function useCreateRole() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: CreateRoleRequest) =>
            roleApi.create(data).then((res) => res.data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["roles"] });
        },
    });
}
