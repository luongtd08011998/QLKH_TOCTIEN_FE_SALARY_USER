import { useMutation, useQueryClient } from "@tanstack/react-query";
import { salaryApi } from "../api";

interface ImportPayload {
    yearMonth: string;
    file: File;
}

export function useImportSalaries() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ yearMonth, file }: ImportPayload) =>
            salaryApi.importExcel(yearMonth, file).then((res) => res.data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["salaries"] });
        },
    });
}
