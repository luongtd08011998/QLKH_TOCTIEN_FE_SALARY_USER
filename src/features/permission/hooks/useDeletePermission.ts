import { useMutation, useQueryClient } from "@tanstack/react-query";
import { permissionApi } from "../api";

export function useDeletePermission() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: number) =>
            permissionApi.delete(id).then((res) => res.data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["permissions"] });
        },
    });
}
