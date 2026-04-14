import { Navigate } from "react-router-dom";
import { useAuthStore } from "@/features/auth/store";

/** `/` — no public marketing page; send guests to login, sessions to admin. */
export function RootRedirect() {
    const accessToken = useAuthStore((s) => s.accessToken);
    return <Navigate to={accessToken ? "/admin" : "/login"} replace />;
}
