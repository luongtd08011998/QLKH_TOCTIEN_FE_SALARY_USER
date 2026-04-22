/** Khớp JSON từ BE (LocalDateTime → chuỗi ISO). */
export interface SalaryResponse {
    id: number;
    yearMonth: string;
    employeeId: string | null;
    employeeName: string | null;
    salaryCategory: string | null;
    salaryRank: string | null;
    income: string | null;
    coefficient: string | null;
    responsibility: string | null;
    seniority: string | null;
    toxic: string | null;
    other: string | null;
    workingDay: number | null;
    overtime: string | null;
    shift: string | null;
    meal: string | null;
    phoneOther: string | null;
    rewardSupport: string | null;
    deductions: string | null;
    advance: string | null;
    collection: string | null;
    insurance: string | null;
    tax: string | null;
    unionFee: string | null;
    company: string | null;
    fatherCompany: string | null;
    netAmount: string | null;
    smsDate: string | null;
    reserve1: string | null;
    reserve2: string | null;
    reserve3: string | null;
    reserve4: string | null;
    modifiedById: string | null;
    modifiedDate: string | null;
}

export type SalarySendStatus = "SENT" | "FAILED" | "UNSENT";

export interface CreateSalaryRequest {
    yearMonth: string;
    employeeId?: string;
    income?: string;
    coefficient?: string;
    responsibility?: string;
    seniority?: string;
    toxic?: string;
    other?: string;
    workingDay?: number;
    overtime?: string;
    shift?: string;
    meal?: string;
    phoneOther?: string;
    rewardSupport?: string;
    deductions?: string;
    advance?: string;
    collection?: string;
    insurance?: string;
    tax?: string;
    unionFee?: string;
    company?: string;
    fatherCompany?: string;
    netAmount?: string;
    smsDate?: string;
    reserve1?: string;
    reserve2?: string;
    reserve3?: string;
    reserve4?: string;
    modifiedById?: string;
}

export interface UpdateSalaryRequest extends CreateSalaryRequest {
    id: number;
}

/** Kết quả gửi phiếu lương hàng loạt (POST /salaries/send-all). */
export interface SalaryEmailBatchResult {
    successCount: number;
    failCount: number;
    successes: string[];
    errors: string[];
}
