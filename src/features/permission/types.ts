export interface PermissionResponse {
    id: number;
    name: string;
    apiPath: string;
    method: "GET" | "POST" | "PUT" | "DELETE";
    module: string;
    createdAt: string;
    updatedAt: string | null;
}

export interface CreatePermissionRequest {
    name: string;
    apiPath: string;
    method: "GET" | "POST" | "PUT" | "DELETE";
    module: string;
}

export interface UpdatePermissionRequest {
    id: number;
    name: string;
    apiPath: string;
    method: "GET" | "POST" | "PUT" | "DELETE";
    module: string;
}
