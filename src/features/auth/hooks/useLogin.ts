import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { authApi } from "../api";
import { useAuthStore } from "../store";
import type { LoginRequest } from "../types";

export function useLogin() {
    const navigate = useNavigate();
    const setAccessToken = useAuthStore((s) => s.setAccessToken);
    const setUser = useAuthStore((s) => s.setUser);

    return useMutation({
        mutationFn: (data: LoginRequest) =>
            authApi.login(data).then((res) => res.data),
        onSuccess: async (response) => {
            setAccessToken(response.data.accessToken);

            // Fetch user info after login
            const meRes = await authApi.getMe();
            setUser(meRes.data.data);

            navigate("/admin");
        },
    });
}
