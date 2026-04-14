export interface UserResponse {
    id: number;
    name: string;
    email: string;
    age: number | null;
    gender: "MALE" | "FEMALE" | "OTHER" | null;
    address: string | null;
    avatar: string | null;
    company: { id: number; name: string } | null;
    roles: { id: number; name: string }[];
    createdAt: string;
    updatedAt: string | null;
}

export interface CreateUserRequest {
    name: string;
    email: string;
    password: string;
    age?: number;
    gender?: "MALE" | "FEMALE" | "OTHER";
    address?: string;
    avatar?: string;
    companyId?: number;
    roleIds?: number[];
}

export interface UpdateUserRequest {
    id: number;
    name?: string;
    age?: number;
    gender?: "MALE" | "FEMALE" | "OTHER";
    address?: string;
    avatar?: string;
    companyId?: number;
    roleIds?: number[];
}
