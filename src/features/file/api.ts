import { api } from "@/config/api";
import type { ApiResponse } from "@/types/api";
import type { FileUploadResponse } from "./types";

export const fileApi = {
    upload(file: File, folder: "avatars" | "logos") {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("folder", folder);

        return api.post<ApiResponse<FileUploadResponse>>("/files", formData, {
            headers: { "Content-Type": "multipart/form-data" },
        });
    },
};
