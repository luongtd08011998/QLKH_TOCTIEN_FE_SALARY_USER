import { useState } from "react";
import { Outlet, Navigate } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";
import { useAuthStore } from "@/features/auth/store";

export function AdminLayout() {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const accessToken = useAuthStore((s) => s.accessToken);

    // Redirect to login if not authenticated
    if (!accessToken) {
        return <Navigate to="/login" replace />;
    }

    return (
        <div className="min-h-screen bg-slate-50">
            <Sidebar
                isCollapsed={isCollapsed}
                onToggle={() => setIsCollapsed(!isCollapsed)}
            />

            <div
                className={`transition-all duration-300 ${isCollapsed ? "lg:ml-[68px]" : "lg:ml-60"
                    }`}
            >
                <Header onMenuToggle={() => setIsCollapsed(!isCollapsed)} />
                <main className="p-6">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}
