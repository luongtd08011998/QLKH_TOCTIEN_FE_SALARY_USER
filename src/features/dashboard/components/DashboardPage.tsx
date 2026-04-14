import { BarChart3, Users, Building2, Shield } from "lucide-react";
import { useDashboardStats } from "../hooks/useDashboardStats";
import { Loader2 } from "lucide-react";

export function DashboardPage() {
    const { data: statsData, isLoading } = useDashboardStats();

    // We use the same structure for easy mapping, extracting values from API
    const stats = [
        {
            label: "Total Users",
            value: statsData?.data.totalUsers ?? "\u2014",
            icon: Users,
            color: "bg-blue-500",
            bgLight: "bg-blue-50",
        },
        {
            label: "Companies",
            value: statsData?.data.totalCompanies ?? "\u2014",
            icon: Building2,
            color: "bg-emerald-500",
            bgLight: "bg-emerald-50",
        },
        {
            label: "Roles",
            value: statsData?.data.totalRoles ?? "\u2014",
            icon: Shield,
            color: "bg-amber-500",
            bgLight: "bg-amber-50",
        },
        {
            label: "Permissions",
            value: statsData?.data.totalPermissions ?? "\u2014",
            icon: BarChart3,
            color: "bg-purple-500",
            bgLight: "bg-purple-50",
        },
    ];

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
                <p className="text-slate-500 mt-1">
                    Welcome to HR Management System
                </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {stats.map((stat) => {
                    const Icon = stat.icon;
                    return (
                        <div
                            key={stat.label}
                            className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-shadow"
                        >
                            <div className="flex items-center gap-4">
                                <div
                                    className={`flex items-center justify-center w-12 h-12 rounded-xl ${stat.bgLight}`}
                                >
                                    <Icon
                                        className={`w-6 h-6 text-${stat.color.replace("bg-", "")}`}
                                        style={{
                                            color:
                                                stat.color === "bg-blue-500"
                                                    ? "#3b82f6"
                                                    : stat.color === "bg-emerald-500"
                                                        ? "#10b981"
                                                        : stat.color === "bg-amber-500"
                                                            ? "#f59e0b"
                                                            : "#a855f7",
                                        }}
                                    />
                                </div>
                                <div>
                                    <p className="text-sm text-slate-500">{stat.label}</p>
                                    <p className="text-2xl font-bold text-slate-900 mt-0.5">
                                        {isLoading ? (
                                            <Loader2 className="w-5 h-5 animate-spin text-slate-400 mt-1" />
                                        ) : (
                                            stat.value
                                        )}
                                    </p>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export const Component = DashboardPage;
