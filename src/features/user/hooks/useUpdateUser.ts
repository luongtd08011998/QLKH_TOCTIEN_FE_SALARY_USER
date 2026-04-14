import { useMutation, useQueryClient } from "@tanstack/react-query";
import { userApi } from "../api";
import type { UpdateUserRequest } from "../types";

export function useUpdateUser() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: UpdateUserRequest) =>
            userApi.update(data).then((res) => res.data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["users"] });
        },
    });
}
