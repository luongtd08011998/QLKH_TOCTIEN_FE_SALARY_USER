import { useMutation, useQueryClient } from "@tanstack/react-query";
import { userApi } from "../api";
import type { CreateUserRequest } from "../types";

export function useCreateUser() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: CreateUserRequest) =>
            userApi.create(data).then((res) => res.data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["users"] });
        },
    });
}
