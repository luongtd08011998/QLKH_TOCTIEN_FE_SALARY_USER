/** Khớp enum JSON từ BE (Jackson: tên hằng). */
export type StaffActiveStatus = "HOAT_DONG" | "KHONG_HOAT_DONG";
export type StaffSex = "NAM" | "NU";

/** Khớp JSON từ BE (LocalDateTime → chuỗi ISO). */
export interface StaffResponse {
    id: number;
    fullName: string;
    firstName: string | null;
    middleName: string | null;
    lastName: string | null;
    birthday: string | null;
    sex: StaffSex | null;
    email: string | null;
    userId: number | null;
    isActive: StaffActiveStatus | null;
    description: string | null;
    preferences: string | null;
    userType: number | null;
}

export interface CreateStaffRequest {
    fullName: string;
    firstName?: string;
    middleName?: string;
    lastName?: string;
    birthday?: string;
    sex?: StaffSex;
    email?: string;
    userId?: number;
    isActive?: StaffActiveStatus;
    description?: string;
    preferences?: string;
    userType?: number;
}

export interface UpdateStaffRequest extends CreateStaffRequest {
    id: number;
}

