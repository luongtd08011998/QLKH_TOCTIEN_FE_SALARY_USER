import { useMutation, useQueryClient } from "@tanstack/react-query";
import { salaryApi } from "../api";
import type { UpdateSalaryRequest } from "../types";

export function useUpdateSalary() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: UpdateSalaryRequest) =>
            salaryApi.update(data).then((res) => res.data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["salaries"] });
        },
    });
}
