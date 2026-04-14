import { useMutation } from "@tanstack/react-query";
import { fileApi } from "../api";

export function useUploadFile() {
    return useMutation({
        mutationFn: ({ file, folder }: { file: File; folder: "avatars" | "logos" }) =>
            fileApi.upload(file, folder).then((res) => res.data),
    });
}
