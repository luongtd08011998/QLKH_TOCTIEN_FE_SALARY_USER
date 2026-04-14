export interface LoginRequest {
    email: string;
    password: string;
}

export interface LoginResponse {
    accessToken: string;
    refreshToken: string;
}

export interface RegisterRequest {
    name: string;
    email: string;
    password: string;
    age?: number;
    gender?: "MALE" | "FEMALE" | "OTHER";
    address?: string;
}

export interface RegisterResponse {
    id: number;
    name: string;
    email: string;
    age: number | null;
    gender: "MALE" | "FEMALE" | "OTHER" | null;
    address: string | null;
    createdAt: string;
}

export interface AuthUser {
    id: number;
    name: string;
    email: string;
    age: number | null;
    gender: "MALE" | "FEMALE" | "OTHER" | null;
    address: string | null;
    avatar: string | null;
    company: { id: number; name: string } | null;
    roles: { id: number; name: string }[];
}
