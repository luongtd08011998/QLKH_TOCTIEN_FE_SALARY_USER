import { useMutation, useQueryClient } from "@tanstack/react-query";
import { companyApi } from "../api";
import type { UpdateCompanyRequest } from "../types";

export function useUpdateCompany() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: UpdateCompanyRequest) =>
            companyApi.update(data).then((res) => res.data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["companies"] });
        },
    });
}
