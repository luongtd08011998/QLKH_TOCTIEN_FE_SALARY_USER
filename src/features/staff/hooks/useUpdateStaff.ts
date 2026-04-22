import { useMutation, useQueryClient } from "@tanstack/react-query";
import { staffApi } from "../api";
import type { UpdateStaffRequest } from "../types";

export function useUpdateStaff() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: UpdateStaffRequest) =>
            staffApi.update(data).then((res) => res.data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["staff"] });
        },
    });
}

