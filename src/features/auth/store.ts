import { create } from "zustand";

interface AuthUser {
    id: number;
    name: string;
    email: string;
    avatar: string | null;
    company: { id: number; name: string } | null;
    roles: { id: number; name: string }[];
}

interface AuthState {
    accessToken: string | null;
    user: AuthUser | null;
    setAccessToken: (token: string) => void;
    setUser: (user: AuthUser) => void;
    logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
    accessToken: null,
    user: null,
    setAccessToken: (token) => set({ accessToken: token }),
    setUser: (user) => set({ user }),
    logout: () => set({ accessToken: null, user: null }),
}));
