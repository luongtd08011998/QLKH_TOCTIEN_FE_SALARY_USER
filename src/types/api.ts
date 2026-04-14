export interface ApiResponse<T> {
    statusCode: number;
    data: T;
    message: string;
    timestamp: string;
}

export interface PaginationMeta {
    page: number;
    pageSize: number;
    pages: number;
    total: number;
}

export interface PaginatedResponse<T> {
    meta: PaginationMeta;
    result: T[];
}
