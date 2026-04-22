export interface CompanyResponse {
    id: number;
    name: string;
    address: string | null;
    logo: string | null;
    phone: string | null;
    fax: string | null;
    email: string | null;
    website: string | null;
    preferences: string | null;
    directorName: string | null;
    bankAccount: string | null;
    taxCode: string | null;
    locationName: string | null;
}

export interface CreateCompanyRequest {
    name: string;
    address?: string;
    logo?: string;
    phone?: string;
    fax?: string;
    email?: string;
    website?: string;
    preferences?: string;
    directorName?: string;
    bankAccount?: string;
    taxCode?: string;
    locationName?: string;
}

export interface UpdateCompanyRequest {
    id: number;
    name: string;
    address?: string;
    logo?: string;
    phone?: string;
    fax?: string;
    email?: string;
    website?: string;
    preferences?: string;
    directorName?: string;
    bankAccount?: string;
    taxCode?: string;
    locationName?: string;
}
