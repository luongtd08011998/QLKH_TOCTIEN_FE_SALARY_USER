import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { authApi } from "../api";
import { useAuthStore } from "../store";

export function useLogout() {
    const navigate = useNavigate();
    const logout = useAuthStore((s) => s.logout);

    return useMutation({
        mutationFn: () => authApi.logout(),
        onSettled: () => {
            logout();
            navigate("/login");
        },
    });
}
