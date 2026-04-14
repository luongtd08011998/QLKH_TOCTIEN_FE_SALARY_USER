/** Khớp enum JSON từ BE (Jackson: tên hằng). */
export type EmployeeActiveStatus = "HOAT_DONG" | "KHONG_HOAT_DONG";
export type EmployeeSex = "NAM" | "NU";

/** Khớp JSON từ BE (LocalDateTime → chuỗi ISO). */
export interface EmployeeResponse {
    id: number;
    fullName: string;
    firstName: string | null;
    middleName: string | null;
    lastName: string | null;
    entryDate: string | null;
    exitDate: string | null;
    description: string | null;
    phone: string | null;
    address: string | null;
    email: string | null;
    isActive: EmployeeActiveStatus | null;
    modifiedDate: string | null;
    birthday: string | null;
    sex: EmployeeSex | null;
    department: string | null;
    modifiedById: number | null;
    workType: number | null;
    salaryCode: string | null;
    salaryCategory: string | null;
    salaryRank: string | null;
    reserve1: string | null;
    reserve2: string | null;
    code: string | null;
    userId: number | null;
}

export interface CreateEmployeeRequest {
    fullName: string;
    firstName?: string;
    middleName?: string;
    lastName?: string;
    entryDate?: string;
    exitDate?: string;
    description?: string;
    phone?: string;
    address?: string;
    email?: string;
    isActive?: EmployeeActiveStatus;
    birthday?: string;
    sex?: EmployeeSex;
    department?: string;
    modifiedById?: number;
    workType?: number;
    salaryCode?: string;
    salaryCategory?: string;
    salaryRank?: string;
    reserve1?: string;
    reserve2?: string;
    code?: string;
    userId?: number;
}

export interface UpdateEmployeeRequest extends CreateEmployeeRequest {
    id: number;
}
