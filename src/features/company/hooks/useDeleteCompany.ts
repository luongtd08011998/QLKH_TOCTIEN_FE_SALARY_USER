import { useMutation, useQueryClient } from "@tanstack/react-query";
import { companyApi } from "../api";

export function useDeleteCompany() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: number) => companyApi.delete(id).then((res) => res.data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["companies"] });
        },
    });
}
