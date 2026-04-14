import { AxiosError } from "axios";
import type { ApiResponse } from "@/types/api";

export function getErrorMessage(error: unknown, defaultMessage = "S\u1ef1 c\u1ed1 kh\u00f4ng x\u00e1c \u0111\u1ecbnh"): string {
    if (!error) return defaultMessage;

    const axiosError = error as AxiosError<ApiResponse<any> & { details?: string[] }>;
    const responseData = axiosError.response?.data;

    if (responseData) {
        // If there is a details array, use the first detail or join them
        if (Array.isArray(responseData.details) && responseData.details.length > 0) {
            return responseData.details[0]; // You can also use .join("\n") if preferred
        }

        // Otherwise fallback to message
        if (responseData.message) {
            return responseData.message;
        }
    }

    // Fallback to error message
    if (error instanceof Error) return error.message;

    return defaultMessage;
}
