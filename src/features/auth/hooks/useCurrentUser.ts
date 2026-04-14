import { useQuery } from "@tanstack/react-query";
import { authApi } from "../api";

export function useCurrentUser() {
    return useQuery({
        queryKey: ["auth", "me"],
        queryFn: () => authApi.getMe().then((res) => res.data),
    });
}
