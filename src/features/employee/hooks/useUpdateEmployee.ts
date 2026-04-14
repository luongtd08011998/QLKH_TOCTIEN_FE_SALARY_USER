import { useMutation, useQueryClient } from "@tanstack/react-query";
import { employeeApi } from "../api";
import type { UpdateEmployeeRequest } from "../types";

export function useUpdateEmployee() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: UpdateEmployeeRequest) =>
            employeeApi.update(data).then((res) => res.data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["employees"] });
        },
    });
}
