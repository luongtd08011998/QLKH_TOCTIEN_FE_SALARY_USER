import { useMutation, useQueryClient } from "@tanstack/react-query";
import { roleApi } from "../api";

export function useDeleteRole() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: number) => roleApi.delete(id).then((res) => res.data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["roles"] });
        },
    });
}
