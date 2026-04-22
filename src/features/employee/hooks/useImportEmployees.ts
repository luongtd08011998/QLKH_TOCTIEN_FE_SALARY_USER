import { useMutation, useQueryClient } from "@tanstack/react-query";
import { employeeApi } from "../api";

interface ImportPayload {
    file: File;
}

export function useImportEmployees() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ file }: ImportPayload) => employeeApi.importExcel(file).then((res) => res.data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["employees"] });
        },
    });
}

