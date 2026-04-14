import { useMutation, useQueryClient } from "@tanstack/react-query";
import { salaryApi } from "../api";
import type { CreateSalaryRequest } from "../types";

export function useCreateSalary() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: CreateSalaryRequest) =>
            salaryApi.create(data).then((res) => res.data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["salaries"] });
        },
    });
}
