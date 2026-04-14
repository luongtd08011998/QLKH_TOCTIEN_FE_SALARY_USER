import { useMutation, useQueryClient } from "@tanstack/react-query";
import { employeeApi } from "../api";

export function useDeleteEmployee() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: number) => employeeApi.delete(id).then((res) => res.data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["employees"] });
        },
    });
}
