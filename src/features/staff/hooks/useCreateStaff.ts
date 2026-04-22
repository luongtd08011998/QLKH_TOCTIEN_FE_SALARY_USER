import { useMutation, useQueryClient } from "@tanstack/react-query";
import { staffApi } from "../api";
import type { CreateStaffRequest } from "../types";

export function useCreateStaff() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: CreateStaffRequest) =>
            staffApi.create(data).then((res) => res.data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["staff"] });
        },
    });
}

