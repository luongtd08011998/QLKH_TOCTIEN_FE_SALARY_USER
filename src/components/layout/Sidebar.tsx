import { NavLink, useLocation } from "react-router-dom";
import {
    Users,
    Building2,
    IdCard,
    Banknote,
    Shield,
    KeyRound,
    LayoutDashboard,
    ChevronLeft,
} from "lucide-react";

interface SidebarProps {
    isCollapsed: boolean;
    onToggle: () => void;
}

const navItems = [
    { to: "/admin", label: "Dashboard", icon: LayoutDashboard },
    { to: "/admin/users", label: "Users", icon: Users },
    { to: "/admin/companies", label: "Companies", icon: Building2 },
    { to: "/admin/employees", label: "Employees", icon: IdCard },
    { to: "/admin/salaries", label: "Bảng lương", icon: Banknote },
    { to: "/admin/roles", label: "Roles", icon: Shield },
    { to: "/admin/permissions", label: "Permissions", icon: KeyRound },
];

export function Sidebar({ isCollapsed, onToggle }: SidebarProps) {
    const location = useLocation();

    return (
        <aside
            className={`fixed left-0 top-0 h-screen bg-sidebar text-white flex flex-col transition-all duration-300 z-40 ${isCollapsed ? "w-[68px]" : "w-60"
                }`}
        >
            {/* Logo */}
            <div className="flex items-center gap-3 px-4 h-16 border-b border-white/10">
                <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-gradient-to-br from-primary-500 to-primary-700 font-bold text-sm shrink-0">
                    HR
                </div>
                {!isCollapsed && (
                    <span className="text-lg font-semibold tracking-tight whitespace-nowrap">
                        HR Admin
                    </span>
                )}
            </div>

            {/* Navigation */}
            <nav className="flex-1 py-4 space-y-1 px-3 overflow-y-auto">
                {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive =
                        item.to === "/admin"
                            ? location.pathname === "/admin"
                            : location.pathname.startsWith(item.to);

                    return (
                        <NavLink
                            key={item.to}
                            to={item.to}
                            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 group ${isActive
                                ? "bg-sidebar-active text-white shadow-sm"
                                : "text-slate-400 hover:bg-sidebar-hover hover:text-white"
                                }`}
                            title={isCollapsed ? item.label : undefined}
                        >
                            <Icon className="w-5 h-5 shrink-0" />
                            {!isCollapsed && <span>{item.label}</span>}
                        </NavLink>
                    );
                })}
            </nav>

            {/* Collapse toggle */}
            <div className="p-3 border-t border-white/10">
                <button
                    onClick={onToggle}
                    className="flex items-center justify-center w-full p-2 rounded-lg text-slate-400 hover:bg-sidebar-hover hover:text-white transition-colors"
                    title={isCollapsed ? "Expand" : "Collapse"}
                >
                    <ChevronLeft
                        className={`w-5 h-5 transition-transform duration-300 ${isCollapsed ? "rotate-180" : ""
                            }`}
                    />
                </button>
            </div>
        </aside>
    );
}
