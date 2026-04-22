import { useMutation, useQueryClient } from "@tanstack/react-query";
import { staffApi } from "../api";

interface ImportPayload {
    file: File;
}

export function useImportStaff() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ file }: ImportPayload) => staffApi.importExcel(file).then((res) => res.data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["staff"] });
        },
    });
}

