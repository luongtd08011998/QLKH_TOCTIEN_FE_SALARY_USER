import { useMutation, useQueryClient } from "@tanstack/react-query";
import { salaryApi } from "../api";

export function useDeleteSalary() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: number) => salaryApi.delete(id).then((res) => res.data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["salaries"] });
        },
    });
}
