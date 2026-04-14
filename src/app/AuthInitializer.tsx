import { useEffect, useState } from "react";
import axios from "axios";
import { useAuthStore } from "@/features/auth/store";
import { authApi } from "@/features/auth/api";
import { API_BASE_URL } from "@/config/constants";
import { Spinner } from "@/components/ui/Spinner";

/**
 * Runs once on app mount: tries to refresh the access token
 * from the HTTP-only refresh-token cookie.
 * While resolving, shows a full-screen spinner.
 */
export function AuthInitializer({ children }: { children: React.ReactNode }) {
    const [ready, setReady] = useState(false);
    const setAccessToken = useAuthStore((s) => s.setAccessToken);
    const setUser = useAuthStore((s) => s.setUser);

    useEffect(() => {
        let cancelled = false;

        async function init() {
            try {
                // Try refreshing – the browser will send the httpOnly cookie automatically
                const res = await axios.post(
                    `${API_BASE_URL}/auth/refresh`,
                    {},
                    { withCredentials: true },
                );
                const newToken: string = res.data.data.accessToken;

                if (!cancelled) {
                    setAccessToken(newToken);

                    // Fetch user info with the new token
                    const meRes = await authApi.getMe();
                    if (!cancelled) {
                        setUser(meRes.data.data);
                    }
                }
            } catch {
                // No valid refresh token – user is simply not logged in
            } finally {
                if (!cancelled) {
                    setReady(true);
                }
            }
        }

        init();
        return () => {
            cancelled = true;
        };
    }, [setAccessToken, setUser]);

    if (!ready) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <Spinner size="lg" />
            </div>
        );
    }

    return <>{children}</>;
}
