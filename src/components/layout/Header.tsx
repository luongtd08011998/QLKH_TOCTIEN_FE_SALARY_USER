import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { LogOut, Menu, User, Home, ChevronDown } from "lucide-react";
import { useAuthStore } from "@/features/auth/store";
import { useLogout } from "@/features/auth/hooks/useLogout";

interface HeaderProps {
    onMenuToggle: () => void;
}

export function Header({ onMenuToggle }: HeaderProps) {
    const user = useAuthStore((s) => s.user);
    const logout = useLogout();
    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClick(e: MouseEvent) {
            if (ref.current && !ref.current.contains(e.target as Node)) {
                setOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClick);
        return () => document.removeEventListener("mousedown", handleClick);
    }, []);


    return (
        <header className="sticky top-0 z-30 flex items-center justify-between h-16 px-6 bg-white/80 backdrop-blur-md border-b border-slate-200">
            {/* Left: menu toggle (mobile) */}
            <button
                onClick={onMenuToggle}
                className="p-2 -ml-2 rounded-lg hover:bg-slate-100 lg:hidden transition-colors"
            >
                <Menu className="w-5 h-5 text-slate-600" />
            </button>

            {/* Spacer */}
            <div className="flex-1" />

            {/* Right: user dropdown */}
            <div ref={ref} className="relative">
                <button
                    onClick={() => setOpen((v) => !v)}
                    className="flex items-center gap-3 rounded-xl px-3 py-2 hover:bg-slate-100 transition-colors"
                >
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary-100 text-primary-600">
                        <User className="w-4 h-4" />
                    </div>
                    <div className="hidden sm:block text-left">
                        <p className="text-sm font-medium text-slate-900 leading-tight">
                            {user?.name ?? "User"}
                        </p>
                        <p className="text-xs text-slate-500">
                            {user?.email ?? ""}
                        </p>
                    </div>
                    <ChevronDown
                        className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${open ? "rotate-180" : ""
                            }`}
                    />
                </button>

                {open && (
                    <div className="absolute right-0 mt-1 w-52 rounded-xl border border-slate-200 bg-white shadow-xl shadow-slate-200/50 py-1 z-50">
                        <div className="py-1">
                            <Link
                                to="/admin"
                                onClick={() => setOpen(false)}
                                className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                            >
                                <Home className="w-4 h-4 text-slate-400" />
                                Dashboard
                            </Link>
                            <button
                                onClick={() => {
                                    setOpen(false);
                                    logout.mutate();
                                }}
                                className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                            >
                                <LogOut className="w-4 h-4" />
                                Sign out
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </header>
    );
}
