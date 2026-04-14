import { useMutation, useQueryClient } from "@tanstack/react-query";
import { employeeApi } from "../api";
import type { CreateEmployeeRequest } from "../types";

export function useCreateEmployee() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: CreateEmployeeRequest) =>
            employeeApi.create(data).then((res) => res.data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["employees"] });
        },
    });
}
