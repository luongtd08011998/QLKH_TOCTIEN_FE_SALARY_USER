import type { PermissionResponse } from "@/features/permission/types";

export interface RoleResponse {
    id: number;
    name: string;
    description: string | null;
    permissions: PermissionResponse[];
    createdAt: string;
    updatedAt: string | null;
}

export interface CreateRoleRequest {
    name: string;
    description?: string;
    permissionIds: number[];
}

export interface UpdateRoleRequest {
    id: number;
    name: string;
    description?: string;
    permissionIds: number[];
}
