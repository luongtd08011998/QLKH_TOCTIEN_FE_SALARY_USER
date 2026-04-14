export const API_BASE_URL =
    import.meta.env.VITE_API_URL || "http://localhost:8080/api/v1";

export const PAGE_SIZE = 10;

export const UPLOAD_MAX_SIZE = 5 * 1024 * 1024; // 5 MB

export const ALLOWED_IMAGE_TYPES = [
    "image/jpeg",
    "image/png",
    "image/gif",
    "image/webp",
];

export const GENDER_OPTIONS = [
    { label: "Male", value: "MALE" },
    { label: "Female", value: "FEMALE" },
    { label: "Other", value: "OTHER" },
] as const;

export const HTTP_METHODS = ["GET", "POST", "PUT", "DELETE"] as const;

export const MODULES = [
    "USER",
    "COMPANY",
    "ROLE",
    "PERMISSION",
    "FILE",
] as const;
