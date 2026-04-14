import { useMutation, useQueryClient } from "@tanstack/react-query";
import { companyApi } from "../api";
import type { CreateCompanyRequest } from "../types";

export function useCreateCompany() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: CreateCompanyRequest) =>
            companyApi.create(data).then((res) => res.data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["companies"] });
        },
    });
}
