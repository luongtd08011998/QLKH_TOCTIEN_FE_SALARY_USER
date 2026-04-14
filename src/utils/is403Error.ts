import type { AxiosError } from "axios";

/**
 * Check if a TanStack Query error is a 403 Forbidden response.
 */
export function is403Error(error: Error | null): boolean {
    if (!error) return false;
    return (error as AxiosError)?.response?.status === 403;
}
